import type { GroupPicks } from '../types';
import { TEAM_FLAGS } from '../data/tournament';

interface Props {
  groupPicks: GroupPicks;
  wildcardPicks: string[];
  onChange: (picks: string[]) => void;
}

export function WildcardPicker({ groupPicks, wildcardPicks, onChange }: Props) {
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
    <div className="mb-12 border border-warm-200 p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="font-serif text-2xl font-light text-warm-900 mb-1">
            Wildcard Selection
          </h3>
          <p className="text-xs tracking-widest uppercase text-warm-400">
            Choose 8 of the 12 third-place teams to advance
          </p>
        </div>
        <p className={`font-serif text-2xl font-light ${isComplete ? 'text-warm-900' : 'text-warm-300'}`}>
          {wildcardPicks.length}<span className="text-warm-300">/8</span>
        </p>
      </div>

      {!isComplete && needed > 0 && (
        <p className="text-xs text-warm-400 tracking-wider mb-4">
          {needed} more selection{needed !== 1 ? 's' : ''} needed
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-warm-100">
        {thirdPlaceTeams.map((team) => {
          const selected = wildcardPicks.includes(team);
          const disabled = !selected && wildcardPicks.length >= 8;
          return (
            <button
              key={team}
              onClick={() => !disabled && toggle(team)}
              disabled={disabled}
              className={[
                'flex items-center gap-2 px-4 py-3 text-xs transition-all duration-150 bg-cream-100',
                selected
                  ? 'bg-warm-900 text-cream-100'
                  : disabled
                  ? 'text-warm-200 cursor-not-allowed'
                  : 'text-warm-600 hover:bg-cream-200 cursor-pointer',
              ].join(' ')}
            >
              <span>{TEAM_FLAGS[team] ?? '🏳'}</span>
              <span className="truncate">{team}</span>
              {selected && <span className="ml-auto text-warm-300 text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
