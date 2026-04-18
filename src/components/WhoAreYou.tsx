import type { Player } from '../types';

interface Props {
  onSelect: (p: Player) => void;
}

export function WhoAreYou({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">

      <div className="flex flex-col items-center relative">
        {/* Decorative corner lines */}
        <div className="absolute -top-4 -left-8 w-8 h-8 border-l-2 border-t-2 border-gold-500/30" />
        <div className="absolute -top-4 -right-8 w-8 h-8 border-r-2 border-t-2 border-gold-500/30" />

        <div className="text-4xl mb-4 select-none">⚽</div>

        {/* FIFA badge */}
        <div className="border-2 border-gold-500 px-4 py-2 flex flex-col items-center mb-6">
          <span className="font-display font-900 text-gold-400 text-xl leading-none tracking-widest">FIFA</span>
          <div className="h-px w-full bg-gold-500/50 my-1" />
          <span className="font-display font-700 text-gold-500 text-[10px] leading-none tracking-widest">2026</span>
        </div>

        <p className="text-xs font-display font-700 tracking-widest uppercase text-navy-300 mb-1">
          World Cup Predictions
        </p>
        <h1 className="font-display font-900 text-5xl tracking-wide text-white uppercase mb-1">
          Ro & Em
        </h1>
        <p className="text-sm text-navy-300 tracking-wider mb-8">Who are you?</p>

        <div className="flex gap-3 w-full max-w-xs">
          {(['ro', 'em'] as Player[]).map((p) => (
            <button
              key={p}
              onClick={() => onSelect(p)}
              className="flex-1 py-5 border border-navy-600 bg-navy-800 hover:border-gold-500 hover:bg-gold-500 transition-all duration-200 group"
            >
              <span className="font-display font-900 text-3xl tracking-widest text-white uppercase group-hover:text-navy-900 transition-colors">
                {p === 'em' ? 'Em' : 'Ro'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-8">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-gold-500/50 text-xs">★</span>
          ))}
        </div>
      </div>
    </div>
  );
}
