import type { Player } from '../types';
import { ALL_PLAYERS } from '../hooks/usePicks';

const DISPLAY_NAMES: Record<Player, string> = {
  em:       'Em',
  allie:    'Allie',
  brian:    'Brian',
  kathleen: 'Kathleen',
  jaivon:   'Jaivon',
  zay:      'Zay',
};

interface Props {
  current: Player;
  onChange: (p: Player) => void;
}

export function PlayerSelector({ current, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-px border border-warm-200 overflow-hidden">
      {ALL_PLAYERS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={[
            'px-4 py-2 text-xs tracking-widest uppercase font-normal transition-all duration-150 whitespace-nowrap',
            current === p
              ? 'bg-warm-900 text-cream-100'
              : 'bg-transparent text-warm-400 hover:text-warm-700',
          ].join(' ')}
        >
          {DISPLAY_NAMES[p]}
        </button>
      ))}
    </div>
  );
}
