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

  return (
    <div>
      {/* Progress */}
      <div className="mb-10 flex items-end justify-between border-b border-warm-100 pb-6">
        <div>
          <h2 className="font-serif text-3xl font-light text-warm-900 mb-1">
            Group Stage
          </h2>
          <p className="text-xs tracking-widest uppercase text-warm-400">
            Pick 1st, 2nd &amp; 3rd place for each group
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif text-3xl font-light text-warm-900">
            {completed}<span className="text-warm-300">/{GROUPS.length}</span>
          </p>
          <p className="text-xs tracking-widest uppercase text-warm-400">Groups done</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-warm-100 mb-10 relative">
        <div
          className="absolute top-0 left-0 h-px bg-pitch-500 transition-all duration-700"
          style={{ width: `${(completed / GROUPS.length) * 100}%` }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-warm-100">
        {GROUPS.map((group) => (
          <div key={group.id} className="bg-cream-100">
            <GroupCard
              group={group}
              pick={groupPicks[group.id] ?? { first: null, second: null, third: null }}
              onPick={(pos, team) => onPick(group.id, pos, team)}
            />
          </div>
        ))}
      </div>

      {completed < GROUPS.length && (
        <p className="mt-10 text-center text-xs tracking-widest uppercase text-warm-300">
          Complete all groups to unlock the bracket
        </p>
      )}
    </div>
  );
}
