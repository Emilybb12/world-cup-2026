import type { Player } from '../types';

interface Props {
  current: Player;
  onChange: (p: Player) => void;
}

export function PlayerSelector({ current, onChange }: Props) {
  return (
    <div className="flex items-center border border-warm-200 rounded-none overflow-hidden">
      {(['em', 'ro'] as Player[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={[
            'px-6 py-2 text-xs tracking-widest2 uppercase font-normal transition-all duration-200',
            current === p
              ? 'bg-warm-900 text-cream-100'
              : 'bg-transparent text-warm-400 hover:text-warm-700',
          ].join(' ')}
        >
          {p === 'em' ? 'Em' : 'Ro'}
        </button>
      ))}
    </div>
  );
}
