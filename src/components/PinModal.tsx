import { useState } from 'react';
import type { Player } from '../types';

const DISPLAY_NAMES: Record<Player, string> = { em: 'Em', ro: 'Ro' };

interface Props {
  player: Player;
  hasPin: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onSetPin: (pin: string) => Promise<void>;
  onCheckPin: (pin: string) => boolean;
}

export function PinModal({ player, hasPin, onSuccess, onCancel, onSetPin, onCheckPin }: Props) {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (pin.length !== 4) { setError('PIN must be 4 digits'); return; }
    if (!hasPin) {
      if (pin !== confirm) { setError("PINs don't match"); return; }
      setLoading(true);
      await onSetPin(pin);
      setLoading(false);
      onSuccess();
    } else {
      if (onCheckPin(pin)) { onSuccess(); }
      else { setError('Wrong PIN, try again'); setPin(''); }
    }
  }

  return (
    <div className="fixed inset-0 bg-field-950/85 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-field-800 border border-field-600 w-full max-w-sm p-8">
        <p className="text-xs font-display tracking-widest uppercase text-field-300 mb-1">
          {hasPin ? 'Enter your PIN' : 'Create your PIN'}
        </p>
        <h2 className="font-display font-800 text-4xl tracking-wide text-white uppercase mb-6">
          {DISPLAY_NAMES[player]}
        </h2>

        <div className="mb-4">
          <label className="text-xs font-display tracking-widest uppercase text-field-300 mb-2 block">
            4-digit PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-field-900 border border-field-600 text-white text-center text-2xl font-display tracking-[0.5em] py-3 focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="••••"
            autoFocus
          />
        </div>

        {!hasPin && (
          <div className="mb-4">
            <label className="text-xs font-display tracking-widest uppercase text-field-300 mb-2 block">
              Confirm PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full bg-field-900 border border-field-600 text-white text-center text-2xl font-display tracking-[0.5em] py-3 focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="••••"
            />
          </div>
        )}

        {error && <p className="text-xs text-red-400 font-display tracking-wider mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-gold-500 text-field-900 font-display font-800 tracking-widest uppercase text-sm hover:bg-gold-400 transition-colors disabled:opacity-50 mb-3"
        >
          {loading ? 'Saving…' : hasPin ? 'Unlock' : 'Set PIN & Enter'}
        </button>

        <button
          onClick={onCancel}
          className="w-full py-2 text-xs font-display tracking-widest uppercase text-field-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
