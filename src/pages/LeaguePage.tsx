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

type Tab = 'leaderboard' | 'matches' | 'picks';

const TABS: { id: Tab; label: string; step?: string }[] = [
  { id: 'picks',       label: 'My Picks'    },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'matches',     label: 'Live Scores' },
];

type PicksSubTab = 'groups' | 'bracket';

interface Props {
  profile: Profile;
}

export function LeaguePage({ profile }: Props) {
  const { id: leagueId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('picks');
  const [picksSubTab, setPicksSubTab] = useState<PicksSubTab>('groups');
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

  const shareInvite = useCallback(async () => {
    const code = league?.invite_code ?? '';
    const text = `Join my World Cup 2026 bracket league! Use code ${code} at bracketpredicts.com`;
    if (navigator.share) {
      await navigator.share({ title: 'World Cup 2026 Bracket', text });
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
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
      <header className="sticky top-0 z-10 border-b border-navy-600 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080d1a 0%, #0c1228 60%, #0f1632 100%)' }}>

        {/* Diagonal accent stripe */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-64 opacity-[0.06]"
            style={{ background: 'linear-gradient(135deg, transparent 40%, #c9a832 40%, #c9a832 45%, transparent 45%)' }} />
        </div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between py-3 sm:py-4">

            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                onClick={() => navigate('/leagues')}
                className="text-navy-400 hover:text-white transition-colors text-sm font-display tracking-widest shrink-0"
              >
                ←
              </button>
              <div className="min-w-0">
                <p className="font-display text-[10px] sm:text-xs font-600 tracking-widest text-gold-500 uppercase truncate">
                  {league.name}
                </p>
                <h1 className="font-display text-base sm:text-2xl font-800 tracking-wide text-white uppercase leading-none truncate">
                  World Cup 2026
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Member switcher */}
              {members.length > 1 && (
                <select
                  value={viewUserId}
                  onChange={(e) => setViewUserId(e.target.value)}
                  className="bg-navy-800 border border-navy-600 text-white text-xs font-display tracking-widest uppercase px-2 sm:px-3 py-2 focus:outline-none focus:border-gold-500 max-w-[100px] sm:max-w-none"
                >
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.username}{m.user_id === profile.id ? ' (you)' : ''}
                    </option>
                  ))}
                </select>
              )}

              {/* Share — mobile only */}
              <button
                className="sm:hidden flex items-center gap-1.5 border border-gold-500/60 px-2.5 py-2 text-gold-400 hover:border-gold-400 transition-colors"
                onClick={shareInvite}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                <span className="text-xs font-display font-700 tracking-widest uppercase">Invite</span>
              </button>

              {/* Invite code — desktop only */}
              <button
                className="hidden sm:flex items-center gap-2 border border-navy-600 px-3 py-2 cursor-pointer hover:border-gold-500 transition-colors group"
                onClick={copyInvite}
              >
                <span className="text-xs font-display tracking-widest uppercase text-navy-400 group-hover:text-gold-400 transition-colors">
                  {copied ? '✓ Copied!' : 'Code:'}
                </span>
                <span className="text-xs font-display font-800 tracking-widest text-gold-400">{league.invite_code}</span>
              </button>

              <button
                onClick={signOut}
                className="text-xs font-display tracking-widest uppercase text-navy-200 hover:text-white transition-colors border border-navy-600 px-2 sm:px-3 py-2 hover:border-navy-400"
              >
                <span className="hidden sm:inline">Sign out</span>
                <span className="sm:hidden">Exit</span>
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
                  'shrink-0 px-4 py-3 font-display font-700 text-xs tracking-widest uppercase border-b-2 transition-all duration-150 flex items-center gap-1.5',
                  tab === t.id
                    ? 'border-gold-500 text-gold-400'
                    : 'border-transparent text-navy-300 hover:text-white',
                ].join(' ')}
              >
                {t.step && (
                  <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-800 shrink-0 ${tab === t.id ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-navy-400'}`}>
                    {t.step}
                  </span>
                )}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Score ticker */}
      <ScoreTicker matches={todayMatches} />

      {error && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6">
          <p className="text-xs text-red-400 border border-red-900/50 bg-red-950/30 px-4 py-3">
            Error: {error}
          </p>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-8 flex gap-8">

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
                {t.step && (
                  <span className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-800 shrink-0 ${tab === t.id ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-navy-400'}`}>
                    {t.step}
                  </span>
                )}
                {t.label}
              </button>
            ))}

            {/* League info in sidebar */}
            <div className="mt-6 border border-navy-700 p-3">
              <p className="text-[10px] font-display font-700 tracking-widest uppercase text-navy-400 mb-2">
                Invite Code
              </p>
              <p
                className="font-display font-800 text-gold-400 tracking-widest text-sm cursor-pointer hover:text-gold-300 mb-2"
                onClick={copyInvite}
              >
                {copied ? '✓ Copied!' : league.invite_code}
              </p>
              <button
                onClick={shareInvite}
                className="w-full text-[10px] font-display font-700 tracking-widest uppercase text-navy-300 hover:text-white border border-navy-600 hover:border-gold-500/50 py-1.5 transition-colors"
              >
                Share invite
              </button>
              <p className="text-[10px] text-navy-500 mt-2">{members.length} member{members.length !== 1 ? 's' : ''}</p>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {tab === 'picks' && (
            <div>
              {/* Sub-tabs */}
              <div className="flex border-b border-navy-700 mb-8">
                {([
                  { id: 'groups' as PicksSubTab,  label: 'Group Stage', step: '1' },
                  { id: 'bracket' as PicksSubTab, label: 'Knockout Bracket', step: '2' },
                ]).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setPicksSubTab(s.id)}
                    className={[
                      'flex items-center gap-2 px-5 py-3 font-display font-700 text-xs tracking-widest uppercase border-b-2 transition-all duration-150',
                      picksSubTab === s.id
                        ? 'border-gold-500 text-gold-400'
                        : 'border-transparent text-navy-400 hover:text-white',
                    ].join(' ')}
                  >
                    <span className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-800 ${picksSubTab === s.id ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-navy-400'}`}>
                      {s.step}
                    </span>
                    {s.label}
                  </button>
                ))}
              </div>

              <div className={isOwnPicks ? '' : 'pointer-events-none opacity-50'}>
                {picksSubTab === 'groups' && (
                  <GroupStage
                    groupPicks={safePicks.group_picks}
                    onPick={(groupId, pos, team) => updateGroupPick(groupId, pos, team)}
                  />
                )}
                {picksSubTab === 'bracket' && (
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
            </div>
          )}
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

      {/* Live indicator — clicking jumps to Matches tab */}
      <button
        onClick={() => setTab('matches')}
        className="fixed bottom-5 right-5 flex items-center gap-2 bg-navy-800 border border-navy-600 rounded-full px-4 py-2 text-xs font-display tracking-widest uppercase text-navy-200 hover:border-star-400 hover:text-white transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-star-400 animate-pulse" />
        Live Scores
      </button>
    </div>
  );
}
