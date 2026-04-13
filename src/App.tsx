import { useState } from 'react';
import type { Player, KnockoutPicks } from './types';
import { usePicks } from './hooks/usePicks';
import { PlayerSelector } from './components/PlayerSelector';
import { GroupStage } from './components/GroupStage';
import { KnockoutBracket } from './components/KnockoutBracket';
import { Leaderboard } from './components/Leaderboard';

type Tab = 'groups' | 'bracket' | 'leaderboard';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'groups',      label: 'Group Stage', icon: '🏟️' },
  { id: 'bracket',     label: 'Bracket',     icon: '🗂️' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '📊' },
];

export function App() {
  const [player, setPlayer] = useState<Player>('em');
  const [tab, setTab] = useState<Tab>('groups');
  const { picks, loading, error, updateGroupPick, updateWildcardPicks, updateKnockoutPick } = usePicks();

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⚽</div>
          <p className="text-white/60 font-semibold">Loading picks…</p>
        </div>
      </div>
    );
  }

  const currentPicks = picks[player];

  return (
    <div className="min-h-screen bg-pitch-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pitch-900/95 backdrop-blur border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <span className="text-2xl">🏆</span>
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-white leading-tight whitespace-nowrap">
                2026 FIFA World Cup
              </h1>
              <p className="text-xs text-white/40 leading-tight">Em & Ro's Predictions</p>
            </div>
          </div>
          <PlayerSelector current={player} onChange={setPlayer} />
        </div>

        {/* Tabs */}
        <div className="max-w-screen-2xl mx-auto px-4 flex gap-1 pb-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-150',
                tab === t.id
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-white/40 hover:text-white/70',
              ].join(' ')}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="max-w-screen-2xl mx-auto px-4 pt-4">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            <strong>Supabase error:</strong> {error}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-4 py-6">
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

      {/* Live sync indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-1.5 bg-pitch-800 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/40">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live sync
      </div>
    </div>
  );
}
