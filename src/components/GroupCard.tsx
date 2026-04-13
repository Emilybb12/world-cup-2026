import type { Group, GroupPick } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

interface Props {
  group: Group;
  pick: GroupPick;
  onPick: (position: 'first' | 'second' | 'third', team: string | null) => void;
}

const POSITIONS: Array<{ key: 'first' | 'second' | 'third'; label: string }> = [
  { key: 'first',  label: '1st Place'      },
  { key: 'second', label: '2nd Place'      },
  { key: 'third',  label: '3rd — Wildcard' },
];

export function GroupCard({ group, pick, onPick }: Props) {
  const isComplete = pick.first && pick.second && pick.third;

  return (
    <div className={[
      'border transition-all duration-300',
      isComplete ? 'border-warm-900' : 'border-warm-200',
    ].join(' ')}>

      {/* Header */}
      <div className="px-5 py-4 border-b border-warm-100 flex items-center justify-between">
        <span className="font-serif text-xl font-light text-warm-900">
          Group {group.id}
        </span>
        {isComplete && (
          <span className="text-xs tracking-widest uppercase text-warm-400">Complete</span>
        )}
      </div>

      {/* Positions */}
      <div className="divide-y divide-warm-100">
        {POSITIONS.map(({ key, label }) => {
          const selected = pick[key];
          return (
            <div key={key} className="px-5 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs tracking-widest uppercase text-warm-400">{label}</span>
                {selected && (
                  <button
                    onClick={() => onPick(key, null)}
                    className="text-xs text-warm-300 hover:text-warm-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {group.teams.map((team) => {
                  const isSelected = selected === team;
                  const isUsedElsewhere =
                    (key !== 'first'  && pick.first  === team) ||
                    (key !== 'second' && pick.second === team) ||
                    (key !== 'third'  && pick.third  === team);
                  return (
                    <button
                      key={team}
                      onClick={() => !isUsedElsewhere && onPick(key, team)}
                      disabled={isUsedElsewhere}
                      className={[
                        'text-left px-3 py-2 text-xs flex items-center gap-2 transition-all duration-150 border',
                        isSelected
                          ? 'border-warm-900 bg-warm-900 text-cream-100'
                          : isUsedElsewhere
                          ? 'border-transparent text-warm-200 cursor-not-allowed'
                          : 'border-transparent hover:border-warm-200 text-warm-600 hover:text-warm-900 cursor-pointer',
                      ].join(' ')}
                    >
                      <span>{TEAM_FLAGS[team] ?? '🏳'}</span>
                      <span className="truncate">{team}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
