import type { Player } from '../types';

interface Props {
  current: Player;
  onChange: (p: Player) => void;
}

export function PlayerSelector({ current, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-pitch-800 rounded-xl p-1 border border-white/10">
      {(['em', 'ro'] as Player[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={[
            'px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-200',
            current === p
              ? 'bg-gold-500 text-pitch-900 shadow-lg shadow-gold-500/30'
              : 'text-white/50 hover:text-white/80',
          ].join(' ')}
        >
          {p === 'em' ? '⚽ Em' : '🏆 Ro'}
        </button>
      ))}
    </div>
  );
}
