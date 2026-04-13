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
    <div className="mb-10 border border-ink-200 bg-white p-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="font-display font-800 text-2xl tracking-wide text-ink-900 uppercase mb-1">
            Wildcard Selection
          </h3>
          <p className="text-xs text-ink-400 tracking-wider">
            Choose 8 of the 12 third-place teams to advance
          </p>
        </div>
        <p className={`font-display font-700 text-3xl ${isComplete ? 'text-ink-900' : 'text-ink-200'}`}>
          {wildcardPicks.length}<span className="text-ink-200">/8</span>
        </p>
      </div>

      {!isComplete && needed > 0 && (
        <p className="text-xs text-ink-400 tracking-wider mb-4 font-display uppercase">
          {needed} more selection{needed !== 1 ? 's' : ''} needed
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
        {thirdPlaceTeams.map((team) => {
          const selected = wildcardPicks.includes(team);
          const disabled = !selected && wildcardPicks.length >= 8;
          return (
            <button
              key={team}
              onClick={() => !disabled && toggle(team)}
              disabled={disabled}
              className={[
                'flex items-center gap-2 px-3 py-2.5 text-xs border transition-all duration-150',
                selected
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : disabled
                  ? 'border-ink-100 text-ink-200 cursor-not-allowed'
                  : 'border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900 cursor-pointer',
              ].join(' ')}
            >
              <span>{TEAM_FLAGS[team] ?? '🏳'}</span>
              <span className="truncate">{team}</span>
              {selected && <span className="ml-auto text-white/60 text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
