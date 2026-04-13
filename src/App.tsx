import { useState, useEffect } from 'react';
import type { Player, KnockoutPicks } from './types';
import { usePicks } from './hooks/usePicks';
import { PlayerSelector } from './components/PlayerSelector';
import { GroupStage } from './components/GroupStage';
import { KnockoutBracket } from './components/KnockoutBracket';
import { Leaderboard } from './components/Leaderboard';
import { WhoAreYou } from './components/WhoAreYou';
import { PinModal } from './components/PinModal';

type Tab = 'groups' | 'bracket' | 'leaderboard';

const TABS: { id: Tab; label: string }[] = [
  { id: 'groups',      label: 'Group Stage' },
  { id: 'bracket',     label: 'Bracket'     },
  { id: 'leaderboard', label: 'Leaderboard' },
];

const SESSION_KEY = 'wc2026_auth';

export function App() {
  // Who is authenticated this session
  const [authPlayer, setAuthPlayer] = useState<Player | null>(() => {
    return (sessionStorage.getItem(SESSION_KEY) as Player | null);
  });
  // Which player's picks we're currently viewing
  const [viewPlayer, setViewPlayer] = useState<Player | null>(authPlayer);
  // PIN modal state
  const [pinTarget, setPinTarget] = useState<Player | null>(null);
  const [tab, setTab] = useState<Tab>('groups');

  const { picks, pins, loading, error, savePin, updateGroupPick, updateWildcardPicks, updateKnockoutPick } = usePicks();

  // Once auth is set, default the view to that player
  useEffect(() => {
    if (authPlayer && !viewPlayer) setViewPlayer(authPlayer);
  }, [authPlayer, viewPlayer]);

  // ── Auth handlers ──────────────────────────────────────────────
  function handleWhoAreYou(p: Player) {
    setPinTarget(p);
  }

  function handlePinSuccess() {
    const p = pinTarget!;
    sessionStorage.setItem(SESSION_KEY, p);
    setAuthPlayer(p);
    setViewPlayer(p);
    setPinTarget(null);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthPlayer(null);
    setViewPlayer(null);
  }

  // ── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <p className="font-display text-3xl font-800 tracking-widest text-gold-400 animate-pulse uppercase">
          Loading…
        </p>
      </div>
    );
  }

  // ── Who are you screen ──────────────────────────────────────────
  if (!authPlayer) {
    return (
      <>
        <WhoAreYou onSelect={handleWhoAreYou} />
        {pinTarget && (
          <PinModal
            player={pinTarget}
            hasPin={!!pins[pinTarget]}
            onSuccess={handlePinSuccess}
            onCancel={() => setPinTarget(null)}
            onSetPin={(pin) => savePin(pinTarget, pin)}
            onCheckPin={(pin) => pins[pinTarget] === pin}
          />
        )}
      </>
    );
  }

  // ── Main app ────────────────────────────────────────────────────
  const currentViewPlayer = viewPlayer ?? authPlayer;
  const currentPicks = picks[currentViewPlayer];
  const isOwnProfile = currentViewPlayer === authPlayer;

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-navy-900/95 backdrop-blur border-b border-navy-600">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {/* FIFA badge */}
              <div className="flex flex-col items-center justify-center border-2 border-gold-400 px-2 py-1 min-w-[48px]">
                <span className="font-display font-800 text-gold-400 text-lg leading-none tracking-widest">FIFA</span>
                <div className="h-px w-full bg-gold-400 my-0.5" />
                <span className="font-display font-600 text-gold-400 text-[8px] leading-none tracking-widest">2026</span>
              </div>
              <div>
                <p className="font-display text-xs font-600 tracking-widest text-gold-400 uppercase">
                  World Cup
                </p>
                <h1 className="font-display text-2xl font-800 tracking-wide text-white uppercase">
                  Ro & Em Predictions
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PlayerSelector
                current={currentViewPlayer}
                authPlayer={authPlayer}
                onChange={setViewPlayer}
              />
              <button
                onClick={handleLogout}
                className="text-xs font-display tracking-widest uppercase text-white/20 hover:text-white/60 transition-colors border border-navy-600 px-3 py-2"
                title="Switch user"
              >
                ⇄
              </button>
            </div>
          </div>

          {/* Read-only banner */}
          {!isOwnProfile && (
            <div className="mb-3 px-4 py-2 bg-navy-700 border border-navy-500 text-xs font-display tracking-widest uppercase text-white/50 text-center">
              Viewing {currentViewPlayer === 'em' ? 'Em' : 'Ro'}'s picks — read only
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'px-6 py-3 font-display font-700 text-sm tracking-widest uppercase border-b-2 transition-all duration-150',
                  tab === t.id
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-white/40 hover:text-white/70',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-6">
          <p className="text-xs text-red-400 border border-red-800 bg-red-950/50 px-4 py-3">
            Supabase error: {error}
          </p>
        </div>
      )}

      <main className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">
        {/* Overlay to block edits when viewing other player */}
        <div className={isOwnProfile ? '' : 'pointer-events-none opacity-70'}>
          {tab === 'groups' && (
            <GroupStage
              groupPicks={currentPicks.group_picks}
              onPick={(groupId, pos, team) => updateGroupPick(currentViewPlayer, groupId, pos, team)}
            />
          )}
          {tab === 'bracket' && (
            <KnockoutBracket
              groupPicks={currentPicks.group_picks}
              wildcardPicks={currentPicks.wildcard_picks}
              knockoutPicks={currentPicks.knockout_picks}
              onWildcardChange={(wc) => updateWildcardPicks(currentViewPlayer, wc)}
              onKnockoutPick={(round, mi, winner) =>
                updateKnockoutPick(currentViewPlayer, round as keyof KnockoutPicks, mi, winner)
              }
            />
          )}
        </div>
        {tab === 'leaderboard' && (
          <Leaderboard allPicks={picks} />
        )}
      </main>

      <div className="fixed bottom-5 right-5 flex items-center gap-2 bg-navy-800 border border-navy-600 rounded-full px-4 py-2 text-xs font-display tracking-widest uppercase text-white/40">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
        Live
      </div>
    </div>
  );
}
