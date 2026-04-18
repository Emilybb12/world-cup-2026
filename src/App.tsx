import { useState, useEffect } from 'react';
import type { Player, KnockoutPicks } from './types';
import { usePicks } from './hooks/usePicks';
import { useScores } from './hooks/useScores';
import { PlayerSelector } from './components/PlayerSelector';
import { GroupStage } from './components/GroupStage';
import { KnockoutBracket } from './components/KnockoutBracket';
import { Leaderboard } from './components/Leaderboard';
import { WhoAreYou } from './components/WhoAreYou';
import { PinModal } from './components/PinModal';
import { ScoreTicker } from './components/ScoreTicker';
import { MatchesTab } from './components/MatchesTab';

type Tab = 'groups' | 'bracket' | 'leaderboard' | 'matches';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'leaderboard', label: 'Leaderboard', icon: '📊'  },
  { id: 'matches',     label: 'Matches',     icon: '⚽'  },
  { id: 'groups',      label: 'Group Stage', icon: '🗂️'  },
  { id: 'bracket',     label: 'Bracket',     icon: '🏆'  },
];

const SESSION_KEY = 'wc2026_auth';

export function App() {
  const [authPlayer, setAuthPlayer] = useState<Player | null>(() => {
    return (sessionStorage.getItem(SESSION_KEY) as Player | null);
  });
  const [viewPlayer, setViewPlayer] = useState<Player | null>(authPlayer);
  const [pinTarget, setPinTarget] = useState<Player | null>(null);
  const [tab, setTab] = useState<Tab>('leaderboard');

  const { picks, pins, loading, error, savePin, updateGroupPick, updateWildcardPicks, updateKnockoutPick } = usePicks();
  const { matches, todayMatches, hasCreds, loading: scoresLoading } = useScores();

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display font-800 text-2xl tracking-widest text-gold-400 uppercase animate-pulse">
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
    <div className="min-h-screen text-navy-50">

      {/* Gold top bar */}
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

      {/* ── Main header ── */}
      <header className="sticky top-0 z-10 bg-navy-900/95 backdrop-blur border-b border-navy-600">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">

            <div className="flex items-center gap-4">
              <div className="border-2 border-gold-500 px-2 py-1 flex flex-col items-center">
                <span className="font-display font-800 text-gold-400 text-lg leading-none tracking-widest">FIFA</span>
                <div className="h-px w-full bg-gold-500/50 my-0.5" />
                <span className="font-display font-600 text-gold-500 text-[8px] leading-none tracking-widest">2026</span>
              </div>
              <div>
                <p className="font-display text-xs font-600 tracking-widest text-gold-500 uppercase">
                  World Cup ⚽
                </p>
                <h1 className="font-display text-2xl font-800 tracking-wide text-white uppercase leading-none">
                  Ro & Em Predictions
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PlayerSelector
                current={currentViewPlayer}
                authPlayer={authPlayer}
                onChange={setViewPlayer}
              />
              <button
                onClick={handleLogout}
                className="text-xs font-display tracking-widest uppercase text-navy-200 hover:text-white transition-colors border border-navy-600 px-3 py-2 hover:border-navy-400"
                title="Switch user"
              >
                ⇄
              </button>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="mb-3 px-4 py-2 bg-navy-700 border border-navy-500 text-navy-100 text-xs font-display tracking-widest uppercase text-center">
              Viewing {currentViewPlayer === 'em' ? 'Em' : 'Ro'}'s picks — read only
            </div>
          )}

          {/* Mobile tabs (hidden on md+) */}
          <div className="flex md:hidden">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'px-4 py-3 font-display font-700 text-xs tracking-widest uppercase border-b-2 transition-all duration-150 flex items-center gap-1.5',
                  tab === t.id
                    ? 'border-gold-500 text-gold-400'
                    : 'border-transparent text-navy-300 hover:text-white',
                ].join(' ')}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Score ticker ── */}
      <ScoreTicker matches={todayMatches} />

      {error && (
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-6">
          <p className="text-xs text-red-400 border border-red-900/50 bg-red-950/30 px-4 py-3">
            Supabase error: {error}
          </p>
        </div>
      )}

      {/* ── Body: sidebar + content ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8 flex gap-8">

        {/* Sidebar nav (desktop only) */}
        <aside className="hidden md:flex flex-col w-48 shrink-0">
          <nav className="sticky top-28 flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'flex items-center gap-3 px-4 py-3 font-display font-700 text-sm tracking-wide text-left rounded-none border-l-2 transition-all duration-150',
                  tab === t.id
                    ? 'border-l-gold-500 bg-gold-500/10 text-gold-400'
                    : 'border-l-transparent text-navy-300 hover:text-white hover:bg-navy-800',
                ].join(' ')}
              >
                <span className="text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className={isOwnProfile ? '' : 'pointer-events-none opacity-50'}>
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
          {tab === 'matches' && (
            <MatchesTab matches={matches} hasCreds={hasCreds} loading={scoresLoading} />
          )}
        </main>
      </div>

      {/* Live indicator */}
      <div className="fixed bottom-5 right-5 flex items-center gap-2 bg-navy-800 border border-navy-600 rounded-full px-4 py-2 text-xs font-display tracking-widest uppercase text-navy-200">
        <span className="w-1.5 h-1.5 rounded-full bg-star-400 animate-pulse" />
        Live
      </div>
    </div>
  );
}
