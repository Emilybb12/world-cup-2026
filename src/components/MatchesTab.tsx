import { TEAM_FLAGS } from '../data/tournament';
import type { ScoreMatch } from '../hooks/useScores';

interface Props {
  matches: ScoreMatch[];
  hasCreds: boolean;
  loading: boolean;
}

function formatKickoff(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatStage(stage: string, group: string | null): string {
  if (group) return `Group ${group.replace('GROUP_', '')}`;
  const map: Record<string, string> = {
    ROUND_OF_32: 'Round of 32',
    ROUND_OF_16: 'Round of 16',
    QUARTER_FINALS: 'Quarter-Finals',
    SEMI_FINALS: 'Semi-Finals',
    THIRD_PLACE: 'Third Place',
    FINAL: 'Final',
  };
  return map[stage] ?? stage;
}

function StatusBadge({ m }: { m: ScoreMatch }) {
  const { status, minute } = m;
  if (status === 'IN_PLAY') {
    return (
      <div className="flex items-center gap-1.5 bg-star-500 px-2.5 py-1 rounded-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-xs font-display font-800 text-white tracking-wider">
          {minute ? `${minute}'` : 'LIVE'}
        </span>
      </div>
    );
  }
  if (status === 'PAUSED') {
    return (
      <div className="flex items-center gap-1.5 bg-gold-500 px-2.5 py-1 rounded-sm">
        <span className="text-xs font-display font-800 text-navy-900 tracking-wider">HT</span>
      </div>
    );
  }
  if (status === 'FINISHED') {
    return (
      <span className="text-xs font-display font-700 text-navy-400 tracking-wider uppercase">FT</span>
    );
  }
  // Upcoming
  return (
    <span className="text-sm font-display font-700 text-navy-200">
      {formatKickoff(m.utcDate)}
    </span>
  );
}

function MatchCard({ m }: { m: ScoreMatch }) {
  const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED';
  const isDone = m.status === 'FINISHED';
  const hasScore = isLive || isDone;
  const homeFlag = TEAM_FLAGS[m.homeTeam.name] ?? '🏳';
  const awayFlag = TEAM_FLAGS[m.awayTeam.name] ?? '🏳';

  return (
    <div className={[
      'border px-5 py-4 transition-all',
      isLive ? 'border-star-500/50 bg-star-500/5' : 'border-navy-600 bg-navy-800',
    ].join(' ')}>
      <div className="flex items-center gap-4">

        {/* Home team */}
        <div className="flex items-center gap-2.5 flex-1 justify-end">
          <span className={`font-display font-800 text-sm tracking-wide text-right ${
            isDone && m.score.home !== null && m.score.away !== null
              ? m.score.home > m.score.away ? 'text-white' : 'text-navy-400'
              : 'text-white'
          }`}>
            {m.homeTeam.shortName || m.homeTeam.name}
          </span>
          <span className="text-2xl">{homeFlag}</span>
        </div>

        {/* Score / time */}
        <div className="flex flex-col items-center gap-1 w-28 shrink-0">
          <StatusBadge m={m} />
          {hasScore && (
            <div className="flex items-center gap-2">
              <span className="font-display font-900 text-2xl text-white tabular-nums">
                {m.score.home ?? 0}
              </span>
              <span className="text-navy-500 font-700">–</span>
              <span className="font-display font-900 text-2xl text-white tabular-nums">
                {m.score.away ?? 0}
              </span>
            </div>
          )}
          {isDone && m.score.halfHome !== null && (
            <span className="text-[10px] text-navy-500 font-display tracking-wider">
              HT {m.score.halfHome}–{m.score.halfAway}
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2.5 flex-1 justify-start">
          <span className="text-2xl">{awayFlag}</span>
          <span className={`font-display font-800 text-sm tracking-wide ${
            isDone && m.score.home !== null && m.score.away !== null
              ? m.score.away > m.score.home ? 'text-white' : 'text-navy-400'
              : 'text-white'
          }`}>
            {m.awayTeam.shortName || m.awayTeam.name}
          </span>
        </div>

      </div>
    </div>
  );
}

function DaySection({ label, matches }: { label: string; matches: ScoreMatch[] }) {
  if (matches.length === 0) return null;
  return (
    <div className="mb-8">
      <p className="text-xs font-display font-700 tracking-widest uppercase text-navy-400 mb-3">{label}</p>
      <div className="flex flex-col gap-1.5">
        {matches.map((m) => (
          <div key={m.id}>
            <p className="text-[10px] font-display font-600 tracking-widest uppercase text-navy-500 mb-1 px-1">
              {formatStage(m.stage, m.group)}
            </p>
            <MatchCard m={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatchesTab({ matches, hasCreds, loading }: Props) {
  if (!hasCreds) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <span className="text-4xl">🔑</span>
        <p className="font-display font-800 text-xl text-white uppercase tracking-wide">API key not set</p>
        <p className="text-sm text-navy-300 max-w-sm">
          Add your <span className="text-gold-400 font-700">VITE_FD_TOKEN</span> from{' '}
          <span className="text-gold-400">football-data.org</span> to your Cloudflare environment variables to enable live scores.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-display font-700 text-navy-400 tracking-widest uppercase animate-pulse">
          Loading matches…
        </p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <span className="text-4xl">📅</span>
        <p className="font-display font-800 text-xl text-white uppercase tracking-wide">No matches found</p>
        <p className="text-sm text-navy-400">Check back once the tournament begins in June 2026.</p>
      </div>
    );
  }

  // Group matches by local date
  const grouped = new Map<string, ScoreMatch[]>();
  for (const m of matches) {
    const local = new Date(m.utcDate).toLocaleDateString('en-CA');
    if (!grouped.has(local)) grouped.set(local, []);
    grouped.get(local)!.push(m);
  }

  const todayStr = new Date().toLocaleDateString('en-CA');

  const liveMatches = matches.filter((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED');

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-800 text-4xl tracking-wide text-white uppercase mb-1">Matches</h2>
        <p className="text-sm text-navy-200 tracking-wider">Live scores · Kickoff times · Results</p>
      </div>

      {/* Live now banner */}
      {liveMatches.length > 0 && (
        <div className="mb-8 border border-star-500/50 bg-star-500/10 px-5 py-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-star-400 animate-pulse shrink-0" />
          <p className="text-sm font-display font-700 text-star-300 tracking-wide">
            {liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''} live right now
          </p>
        </div>
      )}

      {/* Matches by day */}
      {Array.from(grouped.entries()).map(([dateStr, dayMatches]) => {
        const isToday = dateStr === todayStr;
        const isYesterday = dateStr === new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
        const label = isToday
          ? '⚽ Today'
          : isYesterday
          ? 'Yesterday'
          : formatDate(dayMatches[0].utcDate);

        return <DaySection key={dateStr} label={label} matches={dayMatches} />;
      })}
    </div>
  );
}
