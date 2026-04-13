import { useState } from 'react';
import type { Player, KnockoutPicks } from './types';
import { usePicks } from './hooks/usePicks';
import { PlayerSelector } from './components/PlayerSelector';
import { GroupStage } from './components/GroupStage';
import { KnockoutBracket } from './components/KnockoutBracket';
import { Leaderboard } from './components/Leaderboard';

type Tab = 'groups' | 'bracket' | 'leaderboard';

const TABS: { id: Tab; label: string }[] = [
  { id: 'groups',      label: 'Group Stage' },
  { id: 'bracket',     label: 'Bracket'     },
  { id: 'leaderboard', label: 'Leaderboard' },
];

export function App() {
  const [player, setPlayer] = useState<Player>('em');
  const [tab, setTab] = useState<Tab>('groups');
  const { picks, loading, error, updateGroupPick, updateWildcardPicks, updateKnockoutPick } = usePicks();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <p className="font-display text-3xl font-bold tracking-widest text-gold-400 animate-pulse">
          LOADING…
        </p>
      </div>
    );
  }

  const currentPicks = picks[player];

  return (
    <div className="min-h-screen bg-navy-900 text-white">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-navy-900/95 backdrop-blur border-b border-navy-600">

        {/* Gold top line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {/* FIFA-style badge */}
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
            <PlayerSelector current={player} onChange={setPlayer} />
          </div>

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

      {/* Error */}
      {error && (
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-6">
          <p className="text-xs text-red-400 border border-red-800 bg-red-950/50 px-4 py-3 rounded">
            Supabase error: {error}
          </p>
        </div>
      )}

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">
        {tab === 'groups' && (
          <GroupStage
            groupPicks={currentPicks.group_picks}
            onPick={(groupId, pos, team) => updateGroupPick(player, groupId, pos, team)}
          />
        )}
        {tab === 'bracket' && (
          <KnockoutBracket
            groupPicks={currentPicks.group_picks}
            wildcardPicks={currentPicks.wildcard_picks}
            knockoutPicks={currentPicks.knockout_picks}
            onWildcardChange={(wc) => updateWildcardPicks(player, wc)}
            onKnockoutPick={(round, mi, winner) =>
              updateKnockoutPick(player, round as keyof KnockoutPicks, mi, winner)
            }
          />
        )}
        {tab === 'leaderboard' && (
          <Leaderboard allPicks={picks} />
        )}
      </main>

      {/* Live indicator */}
      <div className="fixed bottom-5 right-5 flex items-center gap-2 bg-navy-800 border border-navy-600 rounded-full px-4 py-2 text-xs font-display tracking-widest uppercase text-white/40">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
        Live
      </div>
    </div>
  );
}
