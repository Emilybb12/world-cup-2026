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
    <div className="mb-10 border border-navy-600 bg-navy-800 p-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="font-display font-800 text-2xl tracking-wide text-white uppercase mb-1">
            🃏 Wildcard Selection
          </h3>
          <p className="text-xs text-white/40 tracking-wider">
            Choose 8 of the 12 third-place teams to advance
          </p>
        </div>
        <p className={`font-display font-700 text-3xl ${isComplete ? 'text-gold-400' : 'text-white/30'}`}>
          {wildcardPicks.length}<span className="text-white/20">/8</span>
        </p>
      </div>

      {!isComplete && needed > 0 && (
        <p className="text-xs text-gold-400/60 tracking-wider mb-4 font-display">
          {needed} more selection{needed !== 1 ? 's' : ''} needed
        </p>
      )}

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
                'flex items-center gap-2 px-3 py-2.5 text-xs border transition-all duration-150',
                selected
                  ? 'border-gold-400 bg-gold-400/15 text-gold-300'
                  : disabled
                  ? 'border-navy-700 text-white/15 cursor-not-allowed'
                  : 'border-navy-600 text-white/60 hover:border-navy-500 hover:text-white cursor-pointer',
              ].join(' ')}
            >
              <span>{TEAM_FLAGS[team] ?? '🏳'}</span>
              <span className="truncate">{team}</span>
              {selected && <span className="ml-auto text-gold-400 text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
