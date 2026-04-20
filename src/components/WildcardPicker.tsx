import type { GroupPicks } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

// Each wildcard slot is paired with a specific group winner in R32.
// wcIndex 0 → faces Group E winner
// wcIndex 1 → faces Group I winner
// wcIndex 2 → faces Group A winner
// wcIndex 3 → faces Group L winner
// wcIndex 4 → faces Group D winner
// wcIndex 5 → faces Group G winner
// wcIndex 6 → faces Group B winner
// wcIndex 7 → faces Group K winner
const WC_SLOTS: { wcIndex: number; opponentGroup: string }[] = [
  { wcIndex: 0, opponentGroup: 'E' },
  { wcIndex: 1, opponentGroup: 'I' },
  { wcIndex: 2, opponentGroup: 'A' },
  { wcIndex: 3, opponentGroup: 'L' },
  { wcIndex: 4, opponentGroup: 'D' },
  { wcIndex: 5, opponentGroup: 'G' },
  { wcIndex: 6, opponentGroup: 'B' },
  { wcIndex: 7, opponentGroup: 'K' },
];

interface Props {
  groupPicks: GroupPicks;
  wildcardPicks: string[];
  onChange: (picks: string[]) => void;
}

export function WildcardPicker({ groupPicks, wildcardPicks, onChange }: Props) {
  const thirdPlaceTeams = Object.values(groupPicks)
    .map((gp) => gp.third)
    .filter((t): t is string => t !== null);

  function selectForSlot(wcIndex: number, team: string | null) {
    const next = [...wildcardPicks];
    // Remove this team from any other slot it might already occupy
    if (team) {
      const existing = next.indexOf(team);
      if (existing !== -1) next[existing] = '';
    }
    next[wcIndex] = team ?? '';
    onChange(next);
  }

  const filledCount = wildcardPicks.filter((t) => t && t !== '').length;
  const isComplete = filledCount === 8;

  return (
    <div className="mb-10 border border-navy-600 bg-navy-800 p-6">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h3 className="font-display font-800 text-2xl tracking-wide text-white uppercase mb-1">
            Wildcard Matchups
          </h3>
          <p className="text-xs text-navy-200 tracking-wider">
            Pick which 3rd-place team faces each group winner in the Round of 32
          </p>
        </div>
        <p className={`font-display font-700 text-3xl shrink-0 ${isComplete ? 'text-gold-400' : 'text-navy-400'}`}>
          {filledCount}<span className="text-navy-500">/8</span>
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {WC_SLOTS.map(({ wcIndex, opponentGroup }) => {
          const groupWinner = groupPicks[opponentGroup]?.first ?? null;
          const selectedTeam = wildcardPicks[wcIndex] || null;
          const availableTeams = thirdPlaceTeams.filter(
            (t) => t === selectedTeam || !wildcardPicks.includes(t) || wildcardPicks[wcIndex] === t
          );

          return (
            <div key={wcIndex} className="flex items-center gap-3 border border-navy-700 bg-navy-850 px-4 py-3">
              {/* Group winner side */}
              <div className="flex items-center gap-2 w-36 shrink-0">
                <span className="text-[10px] font-display font-700 tracking-widest uppercase text-navy-400">
                  Group {opponentGroup}
                </span>
                {groupWinner ? (
                  <span className="font-display font-700 text-xs text-white truncate">
                    {TEAM_FLAGS[groupWinner] ?? ''} {groupWinner}
                  </span>
                ) : (
                  <span className="text-xs text-navy-600 font-display">TBD</span>
                )}
              </div>

              {/* VS */}
              <span className="text-[10px] font-display font-700 tracking-widest text-navy-500 shrink-0">VS</span>

              {/* Wildcard dropdown */}
              <select
                value={selectedTeam ?? ''}
                onChange={(e) => selectForSlot(wcIndex, e.target.value || null)}
                className="flex-1 bg-navy-900 border border-navy-600 text-white text-xs font-display px-3 py-2 focus:outline-none focus:border-gold-500 transition-colors"
              >
                <option value="">— Pick 3rd-place team —</option>
                {availableTeams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>

              {selectedTeam && (
                <span className="text-[10px] font-display font-700 tracking-widest text-gold-500 shrink-0">SET</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
