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
  const [authPlayer, setAuthPlayer] = useState<Player | null>(() => {
    return (sessionStorage.getItem(SESSION_KEY) as Player | null);
  });
  const [viewPlayer, setViewPlayer] = useState<Player | null>(authPlayer);
  const [pinTarget, setPinTarget] = useState<Player | null>(null);
  const [tab, setTab] = useState<Tab>('groups');

  const { picks, pins, loading, error, savePin, updateGroupPick, updateWildcardPicks, updateKnockoutPick } = usePicks();

  useEffect(() => {
    if (authPlayer && !viewPlayer) setViewPlayer(authPlayer);
  }, [authPlayer, viewPlayer]);

  function handleWhoAreYou(p: Player) { setPinTarget(p); }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <p className="font-display font-800 text-2xl tracking-widest text-ink-400 uppercase animate-pulse">
          Loading…
        </p>
      </div>
    );
  }

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

  const currentViewPlayer = viewPlayer ?? authPlayer;
  const currentPicks = picks[currentViewPlayer];
  const isOwnProfile = currentViewPlayer === authPlayer;

  return (
    <div className="min-h-screen bg-off-white text-ink-900">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-off-white/95 backdrop-blur border-b border-ink-100">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">

            {/* Logo area */}
            <div className="flex items-center gap-4">
              <div className="border-2 border-ink-900 px-2 py-1 flex flex-col items-center">
                <span className="font-display font-800 text-ink-900 text-lg leading-none tracking-widest">FIFA</span>
                <div className="h-px w-full bg-ink-900 my-0.5" />
                <span className="font-display font-600 text-ink-900 text-[8px] leading-none tracking-widest">2026</span>
              </div>
              <div>
                <p className="font-display text-xs font-600 tracking-widest text-ink-400 uppercase">World Cup</p>
                <h1 className="font-display text-2xl font-800 tracking-wide text-ink-900 uppercase leading-none">
                  Ro & Em Predictions
                </h1>
              </div>
            </div>

            {/* Player selector + logout */}
            <div className="flex items-center gap-2">
              <PlayerSelector
                current={currentViewPlayer}
                authPlayer={authPlayer}
                onChange={setViewPlayer}
              />
              <button
                onClick={handleLogout}
                className="text-xs font-display tracking-widest uppercase text-ink-300 hover:text-ink-700 transition-colors border border-ink-200 px-3 py-2 hover:border-ink-400"
                title="Switch user"
              >
                ⇄
              </button>
            </div>
          </div>

          {/* Read-only banner */}
          {!isOwnProfile && (
            <div className="mb-3 px-4 py-2 bg-ink-900 text-off-white text-xs font-display tracking-widest uppercase text-center">
              Viewing {currentViewPlayer === 'em' ? 'Em' : 'Ro'}'s picks — read only
            </div>
          )}

          {/* Tabs */}
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'px-6 py-3 font-display font-700 text-sm tracking-widest uppercase border-b-2 transition-all duration-150',
                  tab === t.id
                    ? 'border-ink-900 text-ink-900'
                    : 'border-transparent text-ink-300 hover:text-ink-600',
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
          <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-4 py-3">
            Supabase error: {error}
          </p>
        </div>
      )}

      <main className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">
        <div className={isOwnProfile ? '' : 'pointer-events-none opacity-60'}>
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
        {tab === 'leaderboard' && <Leaderboard allPicks={picks} />}
      </main>

      <div className="fixed bottom-5 right-5 flex items-center gap-2 bg-white border border-ink-100 rounded-full px-4 py-2 text-xs font-display tracking-widest uppercase text-ink-300">
        <span className="w-1.5 h-1.5 rounded-full bg-ink-900 animate-pulse" />
        Live
      </div>
    </div>
  );
}
