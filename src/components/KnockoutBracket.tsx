import type { GroupPicks, KnockoutPicks, SlotSource, BracketMatch } from '../types';
import {
  R32_MATCHES, R16_MATCHES, QF_MATCHES, SF_MATCHES, FINAL_MATCH,
  ROUND_LABELS, TEAM_FLAGS,
} from '../data/tournament';
import { WildcardPicker } from './WildcardPicker';

interface Props {
  groupPicks: GroupPicks;
  wildcardPicks: string[];
  knockoutPicks: KnockoutPicks;
  onWildcardChange: (picks: string[]) => void;
  onKnockoutPick: (round: keyof KnockoutPicks, matchIndex: number, winner: string | null) => void;
}

/** Resolves what team occupies a bracket slot, given all picks. */
function resolveSlot(
  source: SlotSource,
  groupPicks: GroupPicks,
  wildcardPicks: string[],
  knockoutPicks: KnockoutPicks
): string | null {
  switch (source.type) {
    case 'group': {
      const gp = groupPicks[source.group];
      if (!gp) return null;
      return gp[source.position] ?? null;
    }
    case 'wildcard':
      return wildcardPicks[source.wcIndex] ?? null;
    case 'winner': {
      if (source.round === 'final') return knockoutPicks.final;
      const roundPicks = knockoutPicks[source.round] as Record<number, string | null>;
      return roundPicks?.[source.matchIndex] ?? null;
    }
  }
}

interface MatchCardProps {
  match: BracketMatch;
  round: keyof KnockoutPicks;
  groupPicks: GroupPicks;
  wildcardPicks: string[];
  knockoutPicks: KnockoutPicks;
  onPick: (matchIndex: number, winner: string | null) => void;
}

function MatchCard({ match, round, groupPicks, wildcardPicks, knockoutPicks, onPick }: MatchCardProps) {
  const home = resolveSlot(match.homeSource, groupPicks, wildcardPicks, knockoutPicks);
  const away = resolveSlot(match.awaySource, groupPicks, wildcardPicks, knockoutPicks);

  const currentWinner =
    round === 'final'
      ? knockoutPicks.final
      : (knockoutPicks[round] as Record<number, string | null>)?.[match.id] ?? null;

  const canPick = home !== null && away !== null;

  function handlePick(team: string) {
    if (!canPick) return;
    const newWinner = currentWinner === team ? null : team;
    onPick(match.id, newWinner);
  }

  return (
    <div
      className={[
        'rounded-xl border text-xs transition-all duration-200 overflow-hidden',
        canPick ? 'border-white/15 bg-pitch-800' : 'border-white/5 bg-pitch-800/40',
      ].join(' ')}
    >
      {[home, away].map((team, idx) => {
        const isWinner = team !== null && currentWinner === team;
        const isLoser = team !== null && currentWinner !== null && currentWinner !== team;
        return (
          <button
            key={idx}
            onClick={() => team && handlePick(team)}
            disabled={!canPick || !team}
            className={[
              'w-full flex items-center gap-2 px-3 py-2.5 transition-all duration-150',
              idx === 0 ? 'border-b border-white/10' : '',
              !team ? 'cursor-default' : 'cursor-pointer',
              isWinner
                ? 'bg-gold-500/20 text-gold-300 font-bold'
                : isLoser
                ? 'opacity-30'
                : team
                ? 'hover:bg-white/5 text-white/70 hover:text-white'
                : 'text-white/20',
            ].join(' ')}
          >
            <span className="text-sm">{team ? (TEAM_FLAGS[team] ?? '🏳') : '—'}</span>
            <span className="truncate font-medium">{team ?? 'TBD'}</span>
            {isWinner && <span className="ml-auto text-gold-400 text-sm">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

interface RoundColumnProps {
  label: string;
  matches: BracketMatch[];
  round: keyof KnockoutPicks;
  groupPicks: GroupPicks;
  wildcardPicks: string[];
  knockoutPicks: KnockoutPicks;
  onPick: (matchIndex: number, winner: string | null) => void;
}

function RoundColumn({ label, matches, round, groupPicks, wildcardPicks, knockoutPicks, onPick }: RoundColumnProps) {
  return (
    <div className="flex flex-col min-w-[160px]">
      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 text-center">
        {label}
      </h4>
      <div className="flex flex-col gap-2">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            round={round}
            groupPicks={groupPicks}
            wildcardPicks={wildcardPicks}
            knockoutPicks={knockoutPicks}
            onPick={onPick}
          />
        ))}
      </div>
    </div>
  );
}

export function KnockoutBracket({
  groupPicks,
  wildcardPicks,
  knockoutPicks,
  onWildcardChange,
  onKnockoutPick,
}: Props) {
  const allGroupsDone = Object.keys(groupPicks).length === 12 &&
    Object.values(groupPicks).every((gp) => gp.first && gp.second && gp.third);

  if (!allGroupsDone) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <span className="text-5xl mb-4">🔒</span>
        <p className="text-lg font-semibold">Complete all 12 groups first</p>
        <p className="text-sm mt-1">Head to the Group Stage tab to fill out your picks.</p>
      </div>
    );
  }

  const champion = knockoutPicks.final;

  return (
    <div>
      {/* Wildcard picker */}
      <WildcardPicker
        groupPicks={groupPicks}
        wildcardPicks={wildcardPicks}
        onChange={onWildcardChange}
      />

      {wildcardPicks.length < 8 && (
        <div className="mb-6 text-center text-white/30 text-sm">
          Select 8 wildcard teams above to unlock the bracket.
        </div>
      )}

      {/* Champion banner */}
      {champion && (
        <div className="mb-6 flex items-center justify-center gap-3 bg-gold-500/10 border border-gold-500/40 rounded-xl py-4 px-6">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="text-xs text-gold-400/70 font-semibold uppercase tracking-widest">Your Champion</p>
            <p className="text-xl font-extrabold text-gold-400">
              {TEAM_FLAGS[champion] ?? ''} {champion}
            </p>
          </div>
        </div>
      )}

      {/* Bracket — horizontally scrollable */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          <RoundColumn
            label={ROUND_LABELS.r32}
            matches={R32_MATCHES}
            round="r32"
            groupPicks={groupPicks}
            wildcardPicks={wildcardPicks}
            knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('r32', mi, w)}
          />
          <RoundColumn
            label={ROUND_LABELS.r16}
            matches={R16_MATCHES}
            round="r16"
            groupPicks={groupPicks}
            wildcardPicks={wildcardPicks}
            knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('r16', mi, w)}
          />
          <RoundColumn
            label={ROUND_LABELS.qf}
            matches={QF_MATCHES}
            round="qf"
            groupPicks={groupPicks}
            wildcardPicks={wildcardPicks}
            knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('qf', mi, w)}
          />
          <RoundColumn
            label={ROUND_LABELS.sf}
            matches={SF_MATCHES}
            round="sf"
            groupPicks={groupPicks}
            wildcardPicks={wildcardPicks}
            knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('sf', mi, w)}
          />
          {/* Final */}
          <div className="flex flex-col min-w-[160px]">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 text-center">
              {ROUND_LABELS.final}
            </h4>
            <MatchCard
              match={FINAL_MATCH}
              round="final"
              groupPicks={groupPicks}
              wildcardPicks={wildcardPicks}
              knockoutPicks={knockoutPicks}
              onPick={(_, w) => onKnockoutPick('final', 0, w)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
