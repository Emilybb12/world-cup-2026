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
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="font-serif text-2xl text-warm-400 tracking-wide">Loading…</p>
      </div>
    );
  }

  const currentPicks = picks[player];

  return (
    <div className="min-h-screen bg-cream-100 text-warm-900">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream-100/95 backdrop-blur border-b border-warm-100">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

          {/* Top bar */}
          <div className="flex items-center justify-between py-5">
            <div>
              <p className="text-xs tracking-widest2 uppercase text-warm-400 font-normal mb-0.5">
                2026 FIFA World Cup
              </p>
              <h1 className="font-serif text-2xl font-light text-warm-900 leading-none">
                Em & Ro's Predictions
              </h1>
            </div>
            <PlayerSelector current={player} onChange={setPlayer} />
          </div>

          {/* Tabs */}
          <div className="flex gap-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'pb-4 text-xs tracking-widest uppercase font-normal border-b transition-all duration-200',
                  tab === t.id
                    ? 'border-warm-900 text-warm-900'
                    : 'border-transparent text-warm-400 hover:text-warm-600',
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
          <p className="text-xs text-red-500 border border-red-200 bg-red-50 px-4 py-3 rounded">
            Supabase error: {error}
          </p>
        </div>
      )}

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-6 lg:px-12 py-10">
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
          <Leaderboard emPicks={picks.em} roPicks={picks.ro} />
        )}
      </main>

      {/* Live indicator */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 text-xs text-warm-400 tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-warm-300 animate-pulse" />
        Live
      </div>
    </div>
  );
}
