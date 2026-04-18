import { useState } from 'react';
import type { Group, GroupPick } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

interface Props {
  group: Group;
  pick: GroupPick;
  onPick: (position: 'first' | 'second' | 'third', team: string | null) => void;
}

const POSITIONS: Array<{ key: 'first' | 'second' | 'third'; short: string }> = [
  { key: 'first',  short: '1ST' },
  { key: 'second', short: '2ND' },
  { key: 'third',  short: 'WC'  },
];

export function GroupCard({ group, pick, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const isComplete = pick.first && pick.second && pick.third;

  return (
    <div className={[
      'border transition-all duration-200',
      isComplete ? 'border-gold-500' : open ? 'border-pitch-500' : 'border-field-600',
      'bg-field-800',
    ].join(' ')}>

      {/* Row — click to toggle */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-field-750 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Group letter */}
        <span className="font-display font-800 text-3xl tracking-wider text-white w-6 shrink-0">
          {group.id}
        </span>

        {/* Summary or team names */}
        <div className="flex-1 min-w-0">
          {isComplete ? (
            <div className="flex items-center gap-4 flex-wrap">
              {[pick.first, pick.second, pick.third].map((team, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-xs font-display tracking-widest text-gold-500">
                    {['1ST', '2ND', 'WC'][i]}
                  </span>
                  <span className="text-sm">{TEAM_FLAGS[team!] ?? '🏳'}</span>
                  <span className="text-xs text-field-100 hidden sm:block font-400">{team}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {group.teams.map((team) => (
                <span key={team} className="text-xs text-field-300 font-400">
                  {TEAM_FLAGS[team]} {team}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 shrink-0">
          {isComplete && (
            <span className="font-display text-xs tracking-widest text-gold-400">✓</span>
          )}
          <span className={`text-field-400 text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-field-600 px-5 py-4">
          <div className="flex flex-col gap-2">
            {group.teams.map((team) => {
              const assignedPos = pick.first === team ? 'first' : pick.second === team ? 'second' : pick.third === team ? 'third' : null;
              return (
                <div key={team} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-44 shrink-0">
                    <span className="text-lg">{TEAM_FLAGS[team] ?? '🏳'}</span>
                    <span className="text-sm text-field-100 font-400 truncate">{team}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {POSITIONS.map(({ key, short }) => {
                      const isSelected = assignedPos === key;
                      const isTakenByOther = !isSelected && (
                        (key === 'first'  && pick.first  !== null) ||
                        (key === 'second' && pick.second !== null) ||
                        (key === 'third'  && pick.third  !== null)
                      );
                      return (
                        <button
                          key={key}
                          onClick={() => isSelected ? onPick(key, null) : onPick(key, team)}
                          className={[
                            'px-3 py-1.5 text-xs font-display font-600 tracking-widest border transition-all duration-150',
                            isSelected
                              ? 'border-gold-500 bg-gold-500 text-field-900'
                              : isTakenByOther
                              ? 'border-field-700 text-field-500 cursor-not-allowed'
                              : 'border-field-600 text-field-200 hover:border-gold-400 hover:text-gold-300 cursor-pointer',
                          ].join(' ')}
                        >
                          {short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {isComplete && (
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 border border-gold-500 text-gold-400 text-xs font-display font-700 tracking-widest uppercase hover:bg-gold-500 hover:text-field-900 transition-all"
            >
              Done ✓
            </button>
          )}
        </div>
      )}
    </div>
  );
}
