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

function resolveSlot(source: SlotSource, groupPicks: GroupPicks, wildcardPicks: string[], knockoutPicks: KnockoutPicks): string | null {
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
  const currentWinner = round === 'final'
    ? knockoutPicks.final
    : (knockoutPicks[round] as Record<number, string | null>)?.[match.id] ?? null;
  const canPick = home !== null && away !== null;

  return (
    <div className={['border overflow-hidden', canPick ? 'border-navy-600 bg-navy-800' : 'border-navy-700 bg-navy-850'].join(' ')}>
      {[home, away].map((team, idx) => {
        const isWinner = team !== null && currentWinner === team;
        const isLoser  = team !== null && currentWinner !== null && currentWinner !== team;
        return (
          <button
            key={idx}
            onClick={() => team && canPick && onPick(match.id, currentWinner === team ? null : team)}
            disabled={!canPick || !team}
            className={[
              'w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-all duration-150',
              idx === 0 ? 'border-b border-navy-700' : '',
              isWinner ? 'bg-gold-500 text-navy-900 font-600'
                : isLoser ? 'text-navy-500'
                : team ? 'text-navy-100 hover:bg-navy-750 hover:text-white cursor-pointer'
                : 'text-navy-600 cursor-default',
            ].join(' ')}
          >
            <span>{team ? (TEAM_FLAGS[team] ?? '🏳') : ''}</span>
            <span className="truncate font-400">{team ?? '—'}</span>
            {isWinner && <span className="ml-auto text-navy-900/50 text-xs">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

function RoundColumn({ label, matches, round, groupPicks, wildcardPicks, knockoutPicks, onPick }: {
  label: string; matches: BracketMatch[]; round: keyof KnockoutPicks;
  groupPicks: GroupPicks; wildcardPicks: string[]; knockoutPicks: KnockoutPicks;
  onPick: (mi: number, w: string | null) => void;
}) {
  return (
    <div className="flex flex-col min-w-[156px]">
      <p className="text-xs font-display font-600 tracking-widest uppercase text-navy-300 mb-3 text-center">{label}</p>
      <div className="flex flex-col gap-1.5">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} round={round}
            groupPicks={groupPicks} wildcardPicks={wildcardPicks} knockoutPicks={knockoutPicks} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}

export function KnockoutBracket({ groupPicks, wildcardPicks, knockoutPicks, onWildcardChange, onKnockoutPick }: Props) {
  const allGroupsDone = Object.keys(groupPicks).length === 12 &&
    Object.values(groupPicks).every((gp) => gp.first && gp.second && gp.third);

  if (!allGroupsDone) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display font-800 text-4xl text-navy-500 uppercase mb-2">Locked</p>
        <p className="text-xs tracking-widest uppercase text-navy-500">Complete all 12 groups first</p>
      </div>
    );
  }

  const champion = knockoutPicks.final;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-800 text-4xl tracking-wide text-white uppercase mb-1">Knockout Bracket</h2>
        <p className="text-sm text-navy-200 tracking-wider">Click a team to advance them to the next round</p>
      </div>

      <WildcardPicker groupPicks={groupPicks} wildcardPicks={wildcardPicks} onChange={onWildcardChange} />

      {wildcardPicks.length < 8 && (
        <p className="mb-8 text-center text-xs tracking-widest uppercase text-navy-400 font-display">
          Select 8 wildcards to unlock the bracket
        </p>
      )}

      {champion && (
        <div className="mb-8 border-2 border-gold-500 bg-gold-500 px-8 py-5 flex items-center gap-4">
          <div>
            <p className="text-xs font-display tracking-widest uppercase text-navy-900/60 mb-0.5">Champion</p>
            <p className="font-display font-800 text-2xl tracking-wide text-navy-900 uppercase">
              {TEAM_FLAGS[champion] ?? ''} {champion}
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          <RoundColumn label={ROUND_LABELS.r32} matches={R32_MATCHES} round="r32"
            groupPicks={groupPicks} wildcardPicks={wildcardPicks} knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('r32', mi, w)} />
          <RoundColumn label={ROUND_LABELS.r16} matches={R16_MATCHES} round="r16"
            groupPicks={groupPicks} wildcardPicks={wildcardPicks} knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('r16', mi, w)} />
          <RoundColumn label={ROUND_LABELS.qf} matches={QF_MATCHES} round="qf"
            groupPicks={groupPicks} wildcardPicks={wildcardPicks} knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('qf', mi, w)} />
          <RoundColumn label={ROUND_LABELS.sf} matches={SF_MATCHES} round="sf"
            groupPicks={groupPicks} wildcardPicks={wildcardPicks} knockoutPicks={knockoutPicks}
            onPick={(mi, w) => onKnockoutPick('sf', mi, w)} />
          <div className="flex flex-col min-w-[156px]">
            <p className="text-xs font-display font-600 tracking-widest uppercase text-navy-300 mb-3 text-center">{ROUND_LABELS.final}</p>
            <MatchCard match={FINAL_MATCH} round="final"
              groupPicks={groupPicks} wildcardPicks={wildcardPicks} knockoutPicks={knockoutPicks}
              onPick={(_, w) => onKnockoutPick('final', 0, w)} />
          </div>
        </div>
      </div>
    </div>
  );
}
