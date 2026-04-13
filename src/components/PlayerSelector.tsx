import type { Player } from '../types';
import { ALL_PLAYERS } from '../hooks/usePicks';

const DISPLAY_NAMES: Record<Player, string> = {
  em: 'Em',
  ro: 'Ro',
};

interface Props {
  current: Player;
  onChange: (p: Player) => void;
}

export function PlayerSelector({ current, onChange }: Props) {
  return (
    <div className="flex border border-navy-600 overflow-hidden">
      {ALL_PLAYERS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={[
            'px-6 py-2 font-display font-700 text-sm tracking-widest uppercase transition-all duration-150',
            current === p
              ? 'bg-gold-400 text-navy-900'
              : 'text-white/40 hover:text-white',
          ].join(' ')}
        >
          {DISPLAY_NAMES[p]}
        </button>
      ))}
    </div>
  );
}
