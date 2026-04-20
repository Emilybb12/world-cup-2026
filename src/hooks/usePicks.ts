import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { UserPicks, GroupPicks, KnockoutPicks } from '../types';

const DEFAULT_KNOCKOUT: KnockoutPicks = {
  r32: {},
  r16: {},
  qf: {},
  sf: {},
  final: null,
};

function makeDefault(userId: string, leagueId: string, username: string): UserPicks {
  return {
    user_id: userId,
    league_id: leagueId,
    username,
    group_picks: {},
    wildcard_picks: [],
    knockout_picks: DEFAULT_KNOCKOUT,
  };
}

// All picks for a league, keyed by user_id
export type AllPicks = Record<string, UserPicks>;

export function useLeaguePicks(
  leagueId: string | null,
  userId: string | null,
  members: Array<{ user_id: string; username: string }>
) {
  const [picks, setPicks] = useState<AllPicks>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Load picks whenever league / members change
  useEffect(() => {
    if (!leagueId || members.length === 0) { setLoading(false); return; }

    async function load() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('picks')
        .select('*')
        .eq('league_id', leagueId);

      if (err) { setError(err.message); setLoading(false); return; }

      const next: AllPicks = {};
      for (const m of members) {
        next[m.user_id] = makeDefault(m.user_id, leagueId!, m.username);
      }
      for (const row of data ?? []) {
        const uid = row.user_id as string;
        const member = members.find((m) => m.user_id === uid);
        if (!member) continue;
        next[uid] = {
          user_id: uid,
          league_id: leagueId!,
          username: member.username,
          group_picks: (row.group_picks ?? {}) as GroupPicks,
          wildcard_picks: (row.wildcard_picks ?? []) as string[],
          knockout_picks: { ...DEFAULT_KNOCKOUT, ...((row.knockout_picks ?? {}) as Partial<KnockoutPicks>) },
          updated_at: row.updated_at as string,
        };
      }
      setPicks(next);
      setLoading(false);
    }

    load();
  }, [leagueId, members]);

  // Real-time subscription
  useEffect(() => {
    if (!leagueId) return;

    const channel = supabase
      .channel(`picks:league:${leagueId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'picks', filter: `league_id=eq.${leagueId}` },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          if (!row?.user_id) return;
          const uid = row.user_id as string;
          setPicks((prev) => {
            const existing = prev[uid];
            if (!existing) return prev;
            return {
              ...prev,
              [uid]: {
                ...existing,
                group_picks: (row.group_picks ?? {}) as GroupPicks,
                wildcard_picks: (row.wildcard_picks ?? []) as string[],
                knockout_picks: { ...DEFAULT_KNOCKOUT, ...((row.knockout_picks ?? {}) as Partial<KnockoutPicks>) },
                updated_at: row.updated_at as string,
              },
            };
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [leagueId]);

  const saveUser = useCallback(async (updated: UserPicks) => {
    const { error: err } = await supabase.from('picks').upsert(
      {
        user_id: updated.user_id,
        league_id: updated.league_id,
        group_picks: updated.group_picks,
        wildcard_picks: updated.wildcard_picks,
        knockout_picks: updated.knockout_picks,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,league_id' }
    );
    if (err) setError(err.message);
  }, []);

  const debouncedSave = useCallback(
    (updated: UserPicks) => {
      const key = `${updated.user_id}:${updated.league_id}`;
      clearTimeout(saveTimers.current[key]);
      saveTimers.current[key] = setTimeout(() => saveUser(updated), 600);
    },
    [saveUser]
  );

  const updateGroupPick = useCallback(
    (groupId: string, position: 'first' | 'second' | 'third', team: string | null) => {
      if (!userId || !leagueId) return;
      setPicks((prev) => {
        const mine = prev[userId];
        if (!mine) return prev;
        const groupPick = mine.group_picks[groupId] ?? { first: null, second: null, third: null };
        const newGroupPick = { ...groupPick };
        if (team) {
          if (newGroupPick.first === team && position !== 'first') newGroupPick.first = null;
          if (newGroupPick.second === team && position !== 'second') newGroupPick.second = null;
          if (newGroupPick.third === team && position !== 'third') newGroupPick.third = null;
        }
        newGroupPick[position] = team;
        const updated: UserPicks = {
          ...mine,
          group_picks: { ...mine.group_picks, [groupId]: newGroupPick },
          wildcard_picks: [],
          knockout_picks: DEFAULT_KNOCKOUT,
        };
        debouncedSave(updated);
        return { ...prev, [userId]: updated };
      });
    },
    [userId, leagueId, debouncedSave]
  );

  const updateWildcardPicks = useCallback(
    (wildcards: string[]) => {
      if (!userId || !leagueId) return;
      setPicks((prev) => {
        const mine = prev[userId];
        if (!mine) return prev;
        const updated: UserPicks = { ...mine, wildcard_picks: wildcards, knockout_picks: DEFAULT_KNOCKOUT };
        debouncedSave(updated);
        return { ...prev, [userId]: updated };
      });
    },
    [userId, leagueId, debouncedSave]
  );

  const updateKnockoutPick = useCallback(
    (round: keyof KnockoutPicks, matchIndex: number, winner: string | null) => {
      if (!userId || !leagueId) return;
      setPicks((prev) => {
        const mine = prev[userId];
        if (!mine) return prev;
        const kp = mine.knockout_picks;
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
          for (let i = roundIdx + 1; i < roundOrder.length; i++) {
            const laterRound = roundOrder[i];
            if (laterRound === 'final') {
              newKp.final = null;
            } else {
              const affected = getDownstreamMatches(
                round as Exclude<keyof KnockoutPicks, 'final'>,
                matchIndex,
                laterRound as Exclude<keyof KnockoutPicks, 'final'>
              );
              const existing = { ...(newKp[laterRound as Exclude<keyof KnockoutPicks, 'final'>] as Record<number, string | null>) };
              for (const mi of affected) delete existing[mi];
              newKp[laterRound as Exclude<keyof KnockoutPicks, 'final'>] = existing;
            }
          }
        }

        const updated: UserPicks = { ...mine, knockout_picks: newKp };
        debouncedSave(updated);
        return { ...prev, [userId]: updated };
      });
    },
    [userId, leagueId, debouncedSave]
  );

  return { picks, loading, error, updateGroupPick, updateWildcardPicks, updateKnockoutPick };
}

function getDownstreamMatches(
  fromRound: Exclude<keyof KnockoutPicks, 'final'>,
  fromIndex: number,
  toRound: Exclude<keyof KnockoutPicks, 'final'>
): number[] {
  const roundOrder: Array<Exclude<keyof KnockoutPicks, 'final'>> = ['r32', 'r16', 'qf', 'sf'];
  const fromIdx = roundOrder.indexOf(fromRound);
  const toIdx = roundOrder.indexOf(toRound);
  if (toIdx <= fromIdx) return [];
  let indices = [fromIndex];
  for (let r = fromIdx; r < toIdx; r++) {
    indices = indices.map((i) => Math.floor(i / 2));
  }
  return [...new Set(indices)];
}
