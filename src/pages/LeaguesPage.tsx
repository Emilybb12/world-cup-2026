import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Profile, League } from '../types';
import { useUserLeagues, createLeague, joinLeague } from '../hooks/useLeague';
import { signOut } from '../hooks/useAuth';

interface Props {
  profile: Profile;
}

export function LeaguesPage({ profile }: Props) {
  const navigate = useNavigate();
  const { leagues, loading, refetch } = useUserLeagues(profile.id);

  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createName.trim()) return;
    setBusy(true);
    setError(null);
    const { league, error: err } = await createLeague(createName.trim(), profile.id);
    setBusy(false);
    if (err) { setError(err); return; }
    await refetch();
    if (league) navigate(`/league/${league.id}`);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setBusy(true);
    setError(null);
    const { league, error: err } = await joinLeague(joinCode.trim(), profile.id);
    setBusy(false);
    if (err === 'already_member' && league) {
      navigate(`/league/${league.id}`);
      return;
    }
    if (err) { setError(err); return; }
    await refetch();
    if (league) navigate(`/league/${league.id}`);
  }

  return (
    <div className="min-h-screen text-navy-50">

      {/* Gold top bar */}
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

      {/* Background watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-display font-900 text-white/[0.018] leading-none tracking-widest"
          style={{ fontSize: 'clamp(100px, 25vw, 280px)' }}>
          FIFA
        </span>
      </div>

      <header className="sticky top-0 z-10 bg-navy-900/95 backdrop-blur border-b border-navy-600">
        <div className="max-w-screen-sm mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="border-2 border-gold-500 px-2 py-1 flex flex-col items-center">
              <span className="font-display font-800 text-gold-400 text-sm leading-none tracking-widest">FIFA</span>
              <div className="h-px w-full bg-gold-500/50 my-0.5" />
              <span className="font-display font-600 text-gold-500 text-[7px] leading-none tracking-widest">2026</span>
            </div>
            <h1 className="font-display font-800 text-xl tracking-wide text-white uppercase leading-none">
              My Leagues
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-navy-400 font-display tracking-widest uppercase">{profile.username}</span>
            <button
              onClick={signOut}
              className="text-xs font-display tracking-widest uppercase text-navy-200 hover:text-white transition-colors border border-navy-600 px-3 py-2 hover:border-navy-400"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-sm mx-auto px-6 py-10">

        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => { setShowCreate(true); setShowJoin(false); setError(null); }}
            className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 font-display font-800 text-xs tracking-widest uppercase text-navy-900 transition-colors"
          >
            + Create League
          </button>
          <button
            onClick={() => { setShowJoin(true); setShowCreate(false); setError(null); }}
            className="flex-1 py-3 border border-navy-500 hover:border-navy-400 font-display font-800 text-xs tracking-widest uppercase text-navy-100 hover:text-white transition-colors"
          >
            Join by Code
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="mb-6 border border-navy-600 bg-navy-800 p-5 flex flex-col gap-3">
            <p className="font-display font-700 text-sm tracking-widest uppercase text-gold-400">New League</p>
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="League name"
              required
              maxLength={50}
              className="bg-navy-900 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder-navy-500 font-display focus:outline-none focus:border-gold-500 transition-colors"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 font-display font-800 text-xs tracking-widest uppercase text-navy-900 transition-colors"
              >
                {busy ? '…' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2.5 border border-navy-600 text-navy-300 hover:text-white font-display text-xs tracking-widest uppercase transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Join form */}
        {showJoin && (
          <form onSubmit={handleJoin} className="mb-6 border border-navy-600 bg-navy-800 p-5 flex flex-col gap-3">
            <p className="font-display font-700 text-sm tracking-widest uppercase text-gold-400">Join League</p>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Invite code (e.g. AB12CD)"
              required
              maxLength={10}
              className="bg-navy-900 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder-navy-500 font-display focus:outline-none focus:border-gold-500 transition-colors tracking-widest uppercase"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 font-display font-800 text-xs tracking-widest uppercase text-navy-900 transition-colors"
              >
                {busy ? '…' : 'Join'}
              </button>
              <button
                type="button"
                onClick={() => setShowJoin(false)}
                className="px-4 py-2.5 border border-navy-600 text-navy-300 hover:text-white font-display text-xs tracking-widest uppercase transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && (
          <p className="mb-6 text-xs text-red-400 border border-red-900/50 bg-red-950/30 px-4 py-3">
            {error}
          </p>
        )}

        {/* Leagues list */}
        {loading ? (
          <p className="font-display text-navy-400 tracking-widest uppercase animate-pulse text-sm">Loading…</p>
        ) : leagues.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display font-700 text-white uppercase tracking-wide text-lg mb-2">No leagues yet</p>
            <p className="text-sm text-navy-400">Create a league or join one with an invite code.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-display font-700 tracking-widest uppercase text-navy-400 mb-2">
              Your Leagues
            </p>
            {leagues.map((league: League) => (
              <button
                key={league.id}
                onClick={() => navigate(`/league/${league.id}`)}
                className="corner-brackets border border-navy-600 bg-navy-800 hover:border-gold-500/50 hover:bg-navy-750 px-5 py-4 text-left transition-all flex items-center justify-between group"
              style={{ boxShadow: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,50,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div>
                  <p className="font-display font-700 text-white tracking-wide">{league.name}</p>
                  <p className="text-xs text-navy-400 font-display tracking-widest mt-0.5">
                    Code: <span className="text-gold-500">{league.invite_code}</span>
                  </p>
                </div>
                <span className="text-navy-500 group-hover:text-white transition-colors text-lg">→</span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
