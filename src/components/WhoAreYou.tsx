import type { Player } from '../types';

interface Props {
  onSelect: (p: Player) => void;
}

export function WhoAreYou({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-6">
      {/* Gold top line */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      {/* FIFA badge */}
      <div className="flex flex-col items-center justify-center border-2 border-gold-400 px-4 py-2 mb-8">
        <span className="font-display font-800 text-gold-400 text-2xl leading-none tracking-widest">FIFA</span>
        <div className="h-px w-full bg-gold-400 my-1" />
        <span className="font-display font-600 text-gold-400 text-xs leading-none tracking-widest">2026</span>
      </div>

      <p className="text-xs font-display tracking-widest uppercase text-gold-400/70 mb-2">
        World Cup Predictions
      </p>
      <h1 className="font-display font-800 text-4xl tracking-wide text-white uppercase mb-2">
        Ro & Em
      </h1>
      <p className="text-sm text-white/40 tracking-wider mb-12">Who are you?</p>

      <div className="flex gap-4 w-full max-w-xs">
        {(['ro', 'em'] as Player[]).map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="flex-1 py-6 border border-navy-600 bg-navy-800 hover:border-gold-400 hover:bg-gold-400/10 transition-all duration-200 group"
          >
            <span className="font-display font-800 text-3xl tracking-widest text-white uppercase group-hover:text-gold-400 transition-colors">
              {p === 'em' ? 'Em' : 'Ro'}
            </span>
          </button>
        ))}
      </div>

      {/* Stars */}
      <div className="flex gap-1 mt-16">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-gold-400/30 text-sm">★</span>
        ))}
      </div>
    </div>
  );
}
