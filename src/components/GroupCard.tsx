import type { Group, GroupPick } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

interface Props {
  group: Group;
  pick: GroupPick;
  onPick: (position: 'first' | 'second' | 'third', team: string | null) => void;
}

const POSITIONS: Array<{ key: 'first' | 'second' | 'third'; label: string; badge: string }> = [
  { key: 'first',  label: '1st Place',      badge: '🥇' },
  { key: 'second', label: '2nd Place',      badge: '🥈' },
  { key: 'third',  label: '3rd — Wildcard', badge: '🃏' },
];

export function GroupCard({ group, pick, onPick }: Props) {
  const isComplete = pick.first && pick.second && pick.third;

  return (
    <div className={[
      'border transition-all duration-300 bg-navy-800',
      isComplete ? 'border-gold-500' : 'border-navy-600',
    ].join(' ')}>

      {/* Header */}
      <div className={[
        'px-4 py-3 border-b flex items-center justify-between',
        isComplete ? 'border-gold-500/30 bg-gold-400/5' : 'border-navy-600',
      ].join(' ')}>
        <span className="font-display font-800 text-xl tracking-wider text-white uppercase">
          Group {group.id}
        </span>
        {isComplete && (
          <span className="text-xs font-display tracking-widest uppercase text-gold-400">✓ Done</span>
        )}
      </div>

      {/* Positions */}
      <div className="divide-y divide-navy-700">
        {POSITIONS.map(({ key, label, badge }) => {
          const selected = pick[key];
          return (
            <div key={key} className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-display tracking-widest uppercase text-white/40">
                  {badge} {label}
                </span>
                {selected && (
                  <button
                    onClick={() => onPick(key, null)}
                    className="text-xs text-white/20 hover:text-white/60 transition-colors"
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
                        'text-left px-2 py-2 text-xs flex items-center gap-1.5 border transition-all duration-150',
                        isSelected
                          ? 'border-gold-400 bg-gold-400/15 text-gold-300 font-500'
                          : isUsedElsewhere
                          ? 'border-transparent text-white/15 cursor-not-allowed'
                          : 'border-transparent hover:border-navy-500 hover:bg-navy-700 text-white/60 hover:text-white cursor-pointer',
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
