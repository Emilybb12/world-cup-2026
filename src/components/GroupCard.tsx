import type { Group, GroupPick } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

interface Props {
  group: Group;
  pick: GroupPick;
  onPick: (position: 'first' | 'second' | 'third', team: string | null) => void;
}

const POSITIONS: Array<{ key: 'first' | 'second' | 'third'; label: string; emoji: string; color: string }> = [
  { key: 'first',  label: '1st',      emoji: '🥇', color: 'border-gold-500 bg-gold-500/10 text-gold-400' },
  { key: 'second', label: '2nd',      emoji: '🥈', color: 'border-white/30 bg-white/5 text-white/80' },
  { key: 'third',  label: '3rd (WC)', emoji: '🃏', color: 'border-blue-400/40 bg-blue-400/10 text-blue-300' },
];

export function GroupCard({ group, pick, onPick }: Props) {
  const isComplete = pick.first && pick.second && pick.third;

  return (
    <div
      className={[
        'rounded-xl border p-4 transition-all duration-200',
        isComplete
          ? 'border-gold-500/40 bg-gold-500/5'
          : 'border-white/10 bg-pitch-800',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-extrabold text-white tracking-wide">
          Group {group.id}
        </span>
        {isComplete && <span className="text-xs text-gold-400 font-semibold">✓ Complete</span>}
      </div>

      {/* Position pickers */}
      <div className="space-y-2">
        {POSITIONS.map(({ key, label, emoji, color }) => {
          const selected = pick[key];
          return (
            <div key={key} className={`rounded-lg border p-2 ${color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  {emoji} {label}
                </span>
                {selected && (
                  <button
                    onClick={() => onPick(key, null)}
                    className="ml-auto text-xs opacity-40 hover:opacity-80 transition-opacity"
                    title="Clear pick"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {group.teams.map((team) => {
                  const isSelected = selected === team;
                  const isUsedElsewhere =
                    (key !== 'first' && pick.first === team) ||
                    (key !== 'second' && pick.second === team) ||
                    (key !== 'third' && pick.third === team);
                  return (
                    <button
                      key={team}
                      onClick={() => !isUsedElsewhere && onPick(key, team)}
                      disabled={isUsedElsewhere}
                      className={[
                        'text-left px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5',
                        isSelected
                          ? 'bg-white/20 text-white font-bold scale-[1.02]'
                          : isUsedElsewhere
                          ? 'opacity-20 cursor-not-allowed'
                          : 'hover:bg-white/10 text-white/70 hover:text-white cursor-pointer',
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
