import type { GroupPicks } from '../types';
import { GROUPS } from '../data/tournament';
import { GroupCard } from './GroupCard';

interface Props {
  groupPicks: GroupPicks;
  onPick: (groupId: string, position: 'first' | 'second' | 'third', team: string | null) => void;
}

export function GroupStage({ groupPicks, onPick }: Props) {
  const completed = GROUPS.filter((g) => {
    const p = groupPicks[g.id];
    return p?.first && p?.second && p?.third;
  }).length;

  const pct = Math.round((completed / GROUPS.length) * 100);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display font-800 text-4xl tracking-wide text-white uppercase mb-1">
            Group Stage
          </h2>
          <p className="text-sm text-white/40 tracking-wider">
            Click a group to pick 1st, 2nd &amp; wildcard
          </p>
        </div>
        <div className="text-right">
          <p className="font-display font-700 text-4xl text-gold-400">
            {pct}<span className="text-white/20 text-2xl">%</span>
          </p>
          <p className="text-xs text-white/40 tracking-widest uppercase">{completed}/{GROUPS.length} Groups</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-navy-700 mb-8 relative">
        <div
          className="absolute top-0 left-0 h-0.5 bg-gold-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Accordion list */}
      <div className="flex flex-col gap-2">
        {GROUPS.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            pick={groupPicks[group.id] ?? { first: null, second: null, third: null }}
            onPick={(pos, team) => onPick(group.id, pos, team)}
          />
        ))}
      </div>

      {completed < GROUPS.length && (
        <p className="mt-8 text-center text-xs tracking-widest uppercase text-white/20 font-display">
          Complete all groups to unlock the bracket
        </p>
      )}
    </div>
  );
}
