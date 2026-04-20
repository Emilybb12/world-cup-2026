import { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { signIn, signUp } from '../hooks/useAuth';
import { PlayerSilhouettesBackground } from '../components/PlayerSilhouettes';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

type Mode = 'signin' | 'signup';

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === 'signup' && TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the bot check.');
      return;
    }

    setBusy(true);
    if (mode === 'signup') {
      // Store invite code so LeaguesPage can auto-join after sign-up
      if (inviteCode.trim()) {
        localStorage.setItem('pending_invite', inviteCode.trim().toUpperCase());
      }
      const { error: err } = await signUp(email, password, username, turnstileToken ?? '');
      if (err) {
        setError(err);
        localStorage.removeItem('pending_invite');
        turnstileRef.current?.reset();
        setTurnstileToken(null);
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
    }
    setBusy(false);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setInfo(null);
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Gold top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

      {/* Player silhouettes */}
      <PlayerSilhouettesBackground />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="border-2 border-gold-500 px-4 py-2 flex flex-col items-center">
          <span className="font-display font-800 text-gold-400 text-2xl leading-none tracking-widest">FIFA</span>
          <div className="h-px w-full bg-gold-500/50 my-1" />
          <span className="font-display font-600 text-gold-500 text-xs leading-none tracking-widest">2026</span>
        </div>
        <h1 className="font-display font-800 text-3xl tracking-wide text-white uppercase text-center">
          World Cup Bracket Predictions
        </h1>
        <p className="text-sm text-navy-300 tracking-wide text-center">
          Create a league, invite your friends, pick your brackets.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm border border-navy-600 bg-navy-800">

        {/* Tabs */}
        <div className="flex border-b border-navy-600">
          {(['signin', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={[
                'flex-1 py-3 font-display font-700 text-xs tracking-widest uppercase transition-colors',
                mode === m
                  ? 'text-gold-400 border-b-2 border-gold-500 bg-navy-750'
                  : 'text-navy-300 hover:text-white',
              ].join(' ')}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-700 tracking-widest uppercase text-navy-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={2}
                maxLength={20}
                placeholder="johndoe"
                className="bg-navy-900 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder-navy-500 font-display focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display font-700 tracking-widest uppercase text-navy-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bg-navy-900 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder-navy-500 font-display focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display font-700 tracking-widest uppercase text-navy-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="••••••••"
              className="bg-navy-900 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder-navy-500 font-display focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>

          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-700 tracking-widest uppercase text-navy-300">
                Invite Code <span className="text-navy-500 normal-case font-400">(optional)</span>
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                maxLength={10}
                placeholder="e.g. BCF887"
                className="bg-navy-900 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder-navy-500 font-display tracking-widest uppercase focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          )}

          {/* Turnstile — only on sign-up */}
          {mode === 'signup' && TURNSTILE_SITE_KEY && (
            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
                options={{ theme: 'dark' }}
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 border border-red-900/50 bg-red-950/30 px-3 py-2">
              {error}
            </p>
          )}
          {info && (
            <p className="text-xs text-gold-400 border border-gold-600/50 bg-gold-950/20 px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 font-display font-800 text-xs tracking-widest uppercase text-navy-900 transition-colors"
          >
            {busy ? '…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-navy-500 text-center">
        World Cup 2026 · June–July 2026
      </p>
    </div>
  );
}
