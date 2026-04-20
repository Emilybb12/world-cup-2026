import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Profile, UserPicks, KnockoutPicks } from '../types';
import { useLeague } from '../hooks/useLeague';
import { useLeaguePicks } from '../hooks/usePicks';
import { useScores } from '../hooks/useScores';
import { GroupStage } from '../components/GroupStage';
import { KnockoutBracket } from '../components/KnockoutBracket';
import { LeagueLeaderboard } from '../components/LeagueLeaderboard';
import { MatchesTab } from '../components/MatchesTab';
import { ScoreTicker } from '../components/ScoreTicker';
import { signOut } from '../hooks/useAuth';

type Tab = 'leaderboard' | 'matches' | 'groups' | 'bracket';

const TABS: { id: Tab; label: string }[] = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'matches',     label: 'Matches'     },
  { id: 'groups',      label: 'Group Stage' },
  { id: 'bracket',     label: 'Bracket'     },
];

interface Props {
  profile: Profile;
}

export function LeaguePage({ profile }: Props) {
  const { id: leagueId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('leaderboard');
  const [viewUserId, setViewUserId] = useState<string>(profile.id);
  const [copied, setCopied] = useState(false);

  const { league, members, loading: leagueLoading } = useLeague(leagueId ?? null, profile.id);
  const { picks, loading: picksLoading, error, updateGroupPick, updateWildcardPicks, updateKnockoutPick } =
    useLeaguePicks(leagueId ?? null, profile.id, members);
  const { matches, todayMatches, hasCreds, loading: scoresLoading } = useScores();

  const copyInvite = useCallback(() => {
    navigator.clipboard?.writeText(league?.invite_code ?? '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [league]);

  const loading = leagueLoading || picksLoading;
  const isOwnPicks = viewUserId === profile.id;
  const currentPicks: UserPicks | undefined = picks[viewUserId];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display font-800 text-2xl tracking-widest text-gold-400 uppercase animate-pulse">
          Loading…
        </p>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-display font-700 text-white text-lg">League not found.</p>
        <button
          onClick={() => navigate('/leagues')}
          className="text-xs font-display tracking-widest uppercase text-gold-400 hover:text-gold-300"
        >
          ← Back to leagues
        </button>
      </div>
    );
  }

  const defaultPicks: UserPicks = {
    user_id: viewUserId,
    league_id: leagueId ?? '',
    username: members.find((m) => m.user_id === viewUserId)?.username ?? '',
    group_picks: {},
    wildcard_picks: [],
    knockout_picks: { r32: {}, r16: {}, qf: {}, sf: {}, final: null },
  };
  const safePicks = currentPicks ?? defaultPicks;

  return (
    <div className="min-h-screen text-navy-50">

      {/* Gold top bar */}
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-navy-900/95 backdrop-blur border-b border-navy-600">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/leagues')}
                className="text-navy-400 hover:text-white transition-colors text-sm font-display tracking-widest"
                title="All leagues"
              >
                Back
              </button>
              <div className="border-2 border-gold-500 px-2 py-1 flex flex-col items-center">
                <span className="font-display font-800 text-gold-400 text-lg leading-none tracking-widest">FIFA</span>
                <div className="h-px w-full bg-gold-500/50 my-0.5" />
                <span className="font-display font-600 text-gold-500 text-[8px] leading-none tracking-widest">2026</span>
              </div>
              <div>
                <p className="font-display text-xs font-600 tracking-widest text-gold-500 uppercase">
                  {league.name}
                </p>
                <h1 className="font-display text-2xl font-800 tracking-wide text-white uppercase leading-none">
                  World Cup 2026
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Member switcher */}
              {members.length > 1 && (
                <select
                  value={viewUserId}
                  onChange={(e) => setViewUserId(e.target.value)}
                  className="bg-navy-800 border border-navy-600 text-white text-xs font-display tracking-widest uppercase px-3 py-2 focus:outline-none focus:border-gold-500"
                >
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.username}{m.user_id === profile.id ? ' (you)' : ''}
                    </option>
                  ))}
                </select>
              )}

              {/* Invite code */}
              <button
                className="hidden sm:flex items-center gap-2 border border-navy-600 px-3 py-2 cursor-pointer hover:border-gold-500 transition-colors group"
                title="Click to copy invite code"
                onClick={copyInvite}
              >
                <span className="text-xs font-display tracking-widest uppercase text-navy-400 group-hover:text-gold-400 transition-colors">
                  {copied ? '✓ Copied!' : 'Invite code:'}
                </span>
                <span className="text-xs font-display font-800 tracking-widest text-gold-400">{league.invite_code}</span>
              </button>

              <button
                onClick={signOut}
                className="text-xs font-display tracking-widest uppercase text-navy-200 hover:text-white transition-colors border border-navy-600 px-3 py-2 hover:border-navy-400"
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          </div>

          {!isOwnPicks && (
            <div className="mb-3 px-4 py-2 bg-navy-700 border border-navy-500 text-navy-100 text-xs font-display tracking-widest uppercase text-center">
              Viewing {members.find((m) => m.user_id === viewUserId)?.username ?? 'another player'}'s picks — read only
            </div>
          )}

          {/* Mobile tabs */}
          <div className="flex md:hidden overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'shrink-0 px-4 py-3 font-display font-700 text-xs tracking-widest uppercase border-b-2 transition-all duration-150',
                  tab === t.id
                    ? 'border-gold-500 text-gold-400'
                    : 'border-transparent text-navy-300 hover:text-white',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Score ticker */}
      <ScoreTicker matches={todayMatches} />

      {error && (
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-6">
          <p className="text-xs text-red-400 border border-red-900/50 bg-red-950/30 px-4 py-3">
            Error: {error}
          </p>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8 flex gap-8">

        {/* Sidebar nav (desktop) */}
        <aside className="hidden md:flex flex-col w-48 shrink-0">
          <nav className="sticky top-28 flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'flex items-center gap-3 px-4 py-3 font-display font-700 text-sm tracking-wide text-left border-l-2 transition-all duration-150',
                  tab === t.id
                    ? 'border-l-gold-500 bg-gold-500/10 text-gold-400'
                    : 'border-l-transparent text-navy-300 hover:text-white hover:bg-navy-800',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}

            {/* League info in sidebar */}
            <div className="mt-6 border border-navy-700 p-3">
              <p className="text-[10px] font-display font-700 tracking-widest uppercase text-navy-400 mb-2">
                Invite Code
              </p>
              <p
                className="font-display font-800 text-gold-400 tracking-widest text-sm cursor-pointer hover:text-gold-300"
                title="Click to copy"
                onClick={copyInvite}
              >
                {copied ? '✓ Copied!' : league.invite_code}
              </p>
              <p className="text-[10px] text-navy-500 mt-1">{members.length} member{members.length !== 1 ? 's' : ''}</p>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className={isOwnPicks ? '' : 'pointer-events-none opacity-50'}>
            {tab === 'groups' && (
              <GroupStage
                groupPicks={safePicks.group_picks}
                onPick={(groupId, pos, team) => updateGroupPick(groupId, pos, team)}
              />
            )}
            {tab === 'bracket' && (
              <KnockoutBracket
                groupPicks={safePicks.group_picks}
                wildcardPicks={safePicks.wildcard_picks}
                knockoutPicks={safePicks.knockout_picks}
                onWildcardChange={(wc) => updateWildcardPicks(wc)}
                onKnockoutPick={(round, mi, winner) =>
                  updateKnockoutPick(round as keyof KnockoutPicks, mi, winner)
                }
              />
            )}
          </div>
          {tab === 'leaderboard' && (
            <LeagueLeaderboard
              allPicks={picks}
              members={members}
              currentUserId={profile.id}
            />
          )}
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
