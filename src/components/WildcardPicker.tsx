import type { GroupPicks } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

interface Props {
  groupPicks: GroupPicks;
  wildcardPicks: string[];
  onChange: (picks: string[]) => void;
}

export function WildcardPicker({ groupPicks, wildcardPicks, onChange }: Props) {
  // Collect all third-place teams from group picks
  const thirdPlaceTeams = Object.values(groupPicks)
    .map((gp) => gp.third)
    .filter((t): t is string => t !== null);

  const toggle = (team: string) => {
    if (wildcardPicks.includes(team)) {
      onChange(wildcardPicks.filter((t) => t !== team));
    } else if (wildcardPicks.length < 8) {
      onChange([...wildcardPicks, team]);
    }
  };

  const needed = 8 - wildcardPicks.length;
  const isComplete = wildcardPicks.length === 8;

  return (
    <div className="bg-pitch-800 rounded-xl border border-blue-400/30 p-5 mb-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="text-blue-400">🃏</span> Wildcard Selection
        </h3>
        <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-blue-300'}`}>
          {wildcardPicks.length} / 8 selected
        </span>
      </div>
      <p className="text-xs text-white/40 mb-4">
        Choose 8 of the 12 third-place finishers to advance to the Round of 32.
        {!isComplete && needed > 0 && ` Pick ${needed} more.`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {thirdPlaceTeams.map((team) => {
          const selected = wildcardPicks.includes(team);
          const disabled = !selected && wildcardPicks.length >= 8;
          return (
            <button
              key={team}
              onClick={() => !disabled && toggle(team)}
              disabled={disabled}
              className={[
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border',
                selected
                  ? 'border-blue-400 bg-blue-400/20 text-blue-300 shadow-sm shadow-blue-400/20'
                  : disabled
                  ? 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
                  : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 cursor-pointer',
              ].join(' ')}
            >
              <span>{TEAM_FLAGS[team] ?? '🏳'}</span>
              <span className="truncate">{team}</span>
              {selected && <span className="ml-auto text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
