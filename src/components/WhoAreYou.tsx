import type { Player } from '../types';

interface Props {
  onSelect: (p: Player) => void;
}

export function WhoAreYou({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center p-6">
      <div className="border-2 border-ink-900 px-4 py-2 flex flex-col items-center mb-8">
        <span className="font-display font-800 text-ink-900 text-2xl leading-none tracking-widest">FIFA</span>
        <div className="h-px w-full bg-ink-900 my-1" />
        <span className="font-display font-600 text-ink-900 text-xs leading-none tracking-widest">2026</span>
      </div>

      <p className="text-xs font-display tracking-widest uppercase text-ink-400 mb-2">
        World Cup Predictions
      </p>
      <h1 className="font-display font-800 text-5xl tracking-wide text-ink-900 uppercase mb-2">
        Ro & Em
      </h1>
      <p className="text-sm text-ink-400 tracking-wider mb-12">Who are you?</p>

      <div className="flex gap-3 w-full max-w-xs">
        {(['ro', 'em'] as Player[]).map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="flex-1 py-6 border border-ink-200 bg-white hover:border-ink-900 hover:bg-ink-900 hover:text-white transition-all duration-200 group"
          >
            <span className="font-display font-800 text-3xl tracking-widest text-ink-900 uppercase group-hover:text-white transition-colors">
              {p === 'em' ? 'Em' : 'Ro'}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 mt-16">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-ink-200 text-xs">★</span>
        ))}
      </div>
    </div>
  );
}
