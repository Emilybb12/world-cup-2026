import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Player, PlayerPicks, GroupPicks, KnockoutPicks } from '../types';

const DEFAULT_KNOCKOUT: KnockoutPicks = {
  r32: {},
  r16: {},
  qf: {},
  sf: {},
  final: null,
};

function makeDefault(player: Player): PlayerPicks {
  return {
    player,
    group_picks: {},
    wildcard_picks: [],
    knockout_picks: DEFAULT_KNOCKOUT,
  };
}

export const ALL_PLAYERS: Player[] = ['em', 'allie', 'brian', 'kathleen', 'jaivon', 'zay'];

type AllPicks = Record<Player, PlayerPicks>;

export function usePicks() {
  const [picks, setPicks] = useState<AllPicks>(
    Object.fromEntries(ALL_PLAYERS.map((p) => [p, makeDefault(p)])) as AllPicks
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer refs per player
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Load both players on mount
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('player_picks')
        .select('*')
        .in('player', ALL_PLAYERS);

      if (error) {
        setError(error.message);
      } else {
        const next: AllPicks = Object.fromEntries(
          ALL_PLAYERS.map((p) => [p, makeDefault(p)])
        ) as AllPicks;
        for (const row of data ?? []) {
          const p = row.player as Player;
          next[p] = {
            player: p,
            group_picks: (row.group_picks ?? {}) as GroupPicks,
            wildcard_picks: (row.wildcard_picks ?? []) as string[],
            knockout_picks: {
              ...DEFAULT_KNOCKOUT,
              ...((row.knockout_picks ?? {}) as Partial<KnockoutPicks>),
            },
            updated_at: row.updated_at,
          };
        }
        setPicks(next);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('player_picks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_picks' },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          if (!row?.player) return;
          const p = row.player as Player;
          setPicks((prev) => ({
            ...prev,
            [p]: {
              player: p,
              group_picks: (row.group_picks ?? {}) as GroupPicks,
              wildcard_picks: (row.wildcard_picks ?? []) as string[],
              knockout_picks: {
                ...DEFAULT_KNOCKOUT,
                ...((row.knockout_picks ?? {}) as Partial<KnockoutPicks>),
              },
              updated_at: row.updated_at as string,
            },
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const savePlayer = useCallback(async (updated: PlayerPicks) => {
    const { error } = await supabase.from('player_picks').upsert(
      {
        player: updated.player,
        group_picks: updated.group_picks,
        wildcard_picks: updated.wildcard_picks,
        knockout_picks: updated.knockout_picks,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'player' }
    );
    if (error) setError(error.message);
  }, []);

  const debouncedSave = useCallback(
    (updated: PlayerPicks) => {
      const key = updated.player;
      clearTimeout(saveTimers.current[key]);
      saveTimers.current[key] = setTimeout(() => savePlayer(updated), 600);
    },
    [savePlayer]
  );

  const updateGroupPick = useCallback(
    (player: Player, groupId: string, position: 'first' | 'second' | 'third', team: string | null) => {
      setPicks((prev) => {
        const playerPicks = prev[player];
        const groupPick = playerPicks.group_picks[groupId] ?? { first: null, second: null, third: null };

        // If selecting a team that's already placed elsewhere in this group, clear that slot
        const newGroupPick = { ...groupPick };
        if (team) {
          if (newGroupPick.first === team && position !== 'first') newGroupPick.first = null;
          if (newGroupPick.second === team && position !== 'second') newGroupPick.second = null;
          if (newGroupPick.third === team && position !== 'third') newGroupPick.third = null;
        }
        newGroupPick[position] = team;

        const updated: PlayerPicks = {
          ...playerPicks,
          group_picks: { ...playerPicks.group_picks, [groupId]: newGroupPick },
          // Clear wildcard + knockout picks when group picks change
          wildcard_picks: [],
          knockout_picks: DEFAULT_KNOCKOUT,
        };
        debouncedSave(updated);
        return { ...prev, [player]: updated };
      });
    },
    [debouncedSave]
  );

  const updateWildcardPicks = useCallback(
    (player: Player, wildcards: string[]) => {
      setPicks((prev) => {
        const updated: PlayerPicks = {
          ...prev[player],
          wildcard_picks: wildcards,
          knockout_picks: DEFAULT_KNOCKOUT, // reset bracket when wildcards change
        };
        debouncedSave(updated);
        return { ...prev, [player]: updated };
      });
    },
    [debouncedSave]
  );

  const updateKnockoutPick = useCallback(
    (player: Player, round: keyof KnockoutPicks, matchIndex: number, winner: string | null) => {
      setPicks((prev) => {
        const kp = prev[player].knockout_picks;

        // When a pick changes, clear all downstream picks
        const roundOrder: Array<keyof KnockoutPicks> = ['r32', 'r16', 'qf', 'sf', 'final'];
        const roundIdx = roundOrder.indexOf(round);

        const newKp: KnockoutPicks = { ...kp };

        if (round === 'final') {
          newKp.final = winner;
        } else {
          newKp[round as Exclude<keyof KnockoutPicks, 'final'>] = {
            ...(kp[round as Exclude<keyof KnockoutPicks, 'final'>] as Record<number, string | null>),
            [matchIndex]: winner,
          };
          // Clear subsequent rounds
          for (let i = roundIdx + 1; i < roundOrder.length; i++) {
            const laterRound = roundOrder[i];
            if (laterRound === 'final') {
              newKp.final = null;
            } else {
              // Only clear matches that could be affected by this match's winner changing
              // For simplicity, determine affected downstream matches
              const affectedMatches = getDownstreamMatches(round as Exclude<keyof KnockoutPicks, 'final'>, matchIndex, laterRound as Exclude<keyof KnockoutPicks, 'final'>);
              const existing = { ...(newKp[laterRound as Exclude<keyof KnockoutPicks, 'final'>] as Record<number, string | null>) };
              for (const mi of affectedMatches) {
                delete existing[mi];
              }
              newKp[laterRound as Exclude<keyof KnockoutPicks, 'final'>] = existing;
            }
          }
        }

        const updated: PlayerPicks = { ...prev[player], knockout_picks: newKp };
        debouncedSave(updated);
        return { ...prev, [player]: updated };
      });
    },
    [debouncedSave]
  );

  return { picks, loading, error, updateGroupPick, updateWildcardPicks, updateKnockoutPick };
}

/**
 * Given a match in `fromRound` at `fromIndex`, returns which match indices
 * in `toRound` would be populated by its winner.
 */
function getDownstreamMatches(
  fromRound: Exclude<keyof KnockoutPicks, 'final'>,
  fromIndex: number,
  toRound: Exclude<keyof KnockoutPicks, 'final'>
): number[] {
  const roundOrder: Array<Exclude<keyof KnockoutPicks, 'final'>> = ['r32', 'r16', 'qf', 'sf'];
  const fromIdx = roundOrder.indexOf(fromRound);
  const toIdx = roundOrder.indexOf(toRound);
  if (toIdx <= fromIdx) return [];

  // Each round halves: match i in round N feeds into match floor(i/2) in round N+1
  let indices = [fromIndex];
  for (let r = fromIdx; r < toIdx; r++) {
    indices = indices.map((i) => Math.floor(i / 2));
  }
  return [...new Set(indices)];
}
