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
      {/* Progress bar */}
      <div className="mb-6 bg-pitch-800 rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white/70">Group Stage Progress</span>
          <span className="text-sm font-bold text-gold-400">
            {completed} / {GROUPS.length} groups
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${(completed / GROUPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-white/40 mt-2">
          Pick 1st, 2nd, and 3rd place for each group.
          The best 8 third-place teams advance as wildcards.
        </p>
      </div>

      {/* Group grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <p className="mt-6 text-center text-white/30 text-sm">
          Complete all groups to unlock the Knockout Bracket.
        </p>
      )}
    </div>
  );
}
