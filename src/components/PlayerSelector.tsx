import type { Player } from '../types';
import { ALL_PLAYERS } from '../hooks/usePicks';

const DISPLAY_NAMES: Record<Player, string> = { em: 'Em', ro: 'Ro' };

interface Props {
  current: Player;
  authPlayer: Player;
  onChange: (p: Player) => void;
}

export function PlayerSelector({ current, authPlayer, onChange }: Props) {
  return (
    <div className="flex border border-navy-600 overflow-hidden">
      {ALL_PLAYERS.map((p) => {
        const isViewing = current === p;
        const isMe = authPlayer === p;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={[
              'px-5 py-2 font-display font-700 text-sm tracking-widest uppercase transition-all duration-150 flex items-center gap-1.5',
              isViewing
                ? 'bg-gold-400 text-navy-900'
                : 'text-white/40 hover:text-white',
            ].join(' ')}
          >
            {DISPLAY_NAMES[p]}
            {isMe && (
              <span className={`text-xs ${isViewing ? 'text-navy-700' : 'text-gold-400/60'}`}>
                ★
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
