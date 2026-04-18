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
          <p className="text-sm text-navy-200 tracking-wider">
            Click a group to pick 1st, 2nd &amp; wildcard
          </p>
        </div>
        <div className="text-right">
          <p className="font-display font-700 text-4xl text-white">
            {pct}<span className="text-navy-400 text-2xl">%</span>
          </p>
          <p className="text-xs text-navy-300 tracking-widest uppercase">{completed}/{GROUPS.length} Groups</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-navy-600 mb-8 relative">
        <div
          className="absolute top-0 left-0 h-px bg-gold-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Accordion */}
      <div className="flex flex-col gap-1.5">
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
        <p className="mt-8 text-center text-xs tracking-widest uppercase text-navy-400 font-display">
          Complete all groups to unlock the bracket
        </p>
      )}
    </div>
  );
}
