import { useState } from 'react';
import type { Group, GroupPick } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

interface Props {
  group: Group;
  pick: GroupPick;
  onPick: (position: 'first' | 'second' | 'third', team: string | null) => void;
}

const POSITIONS: Array<{ key: 'first' | 'second' | 'third'; label: string; short: string }> = [
  { key: 'first',  label: '1st Place',      short: '1ST' },
  { key: 'second', label: '2nd Place',      short: '2ND' },
  { key: 'third',  label: '3rd — Wildcard', short: 'WC'  },
];

export function GroupCard({ group, pick, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const isComplete = pick.first && pick.second && pick.third;

  return (
    <div className={[
      'border transition-all duration-300',
      isComplete ? 'border-gold-500/60' : open ? 'border-navy-500' : 'border-navy-600',
      'bg-navy-800',
    ].join(' ')}>

      {/* Header — always visible, click to toggle */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-navy-700/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-4">
          <span className="font-display font-800 text-2xl tracking-wider text-white uppercase w-8">
            {group.id}
          </span>
          {isComplete ? (
            /* Completed summary */
            <div className="flex items-center gap-3">
              {[pick.first, pick.second, pick.third].map((team, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-xs font-display tracking-widest text-white/30">
                    {['1ST', '2ND', 'WC'][i]}
                  </span>
                  <span className="text-sm">{TEAM_FLAGS[team!] ?? '🏳'}</span>
                  <span className="text-xs text-white/70 hidden sm:block">{team}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Team pills */
            <div className="flex gap-1.5 flex-wrap">
              {group.teams.map((team) => (
                <span key={team} className="text-xs text-white/30 font-display tracking-wide">
                  {TEAM_FLAGS[team]} {team}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 ml-4 shrink-0">
          {isComplete && (
            <span className="text-xs font-display tracking-widest uppercase text-gold-400">✓</span>
          )}
          <span className={`text-white/30 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Expanded picker */}
      {open && (
        <div className="border-t border-navy-700 px-5 pb-5 pt-4">
          {/* Team grid with position buttons */}
          <div className="grid grid-cols-1 gap-2">
            {group.teams.map((team) => {
              const assignedPos = pick.first === team ? 'first' : pick.second === team ? 'second' : pick.third === team ? 'third' : null;
              return (
                <div key={team} className="flex items-center gap-3">
                  {/* Team name */}
                  <div className="flex items-center gap-2 w-44 shrink-0">
                    <span className="text-lg">{TEAM_FLAGS[team] ?? '🏳'}</span>
                    <span className="text-sm text-white/70 font-300 truncate">{team}</span>
                  </div>
                  {/* Position buttons */}
                  <div className="flex gap-1.5">
                    {POSITIONS.map(({ key, short }) => {
                      const isSelected = assignedPos === key;
                      const isTakenByOther = !isSelected && (
                        (key === 'first' && pick.first !== null) ||
                        (key === 'second' && pick.second !== null) ||
                        (key === 'third' && pick.third !== null)
                      );
                      return (
                        <button
                          key={key}
                          onClick={() => isSelected ? onPick(key, null) : onPick(key, team)}
                          className={[
                            'px-3 py-1.5 text-xs font-display font-600 tracking-widest border transition-all duration-150',
                            isSelected
                              ? 'border-gold-400 bg-gold-400/20 text-gold-300'
                              : isTakenByOther
                              ? 'border-navy-700 text-white/15 cursor-not-allowed'
                              : 'border-navy-600 text-white/40 hover:border-navy-400 hover:text-white cursor-pointer',
                          ].join(' ')}
                        >
                          {short}
                        </button>
                      );
                    })}
                  </div>
                  {assignedPos && (
                    <span className="text-xs font-display text-gold-400 tracking-widest">
                      {POSITIONS.find(p => p.key === assignedPos)?.short}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {isComplete && (
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 border border-gold-500 text-gold-400 text-xs font-display font-600 tracking-widest uppercase hover:bg-gold-400/10 transition-colors"
            >
              Done ✓
            </button>
          )}
        </div>
      )}
    </div>
  );
}
