import { TEAM_FLAGS } from '../data/tournament';
import type { ScoreMatch } from '../hooks/useScores';

interface Props {
  matches: ScoreMatch[];
}

function statusLabel(m: ScoreMatch): { text: string; live: boolean } {
  switch (m.status) {
    case 'IN_PLAY':
      return { text: m.minute ? `${m.minute}'` : 'LIVE', live: true };
    case 'PAUSED':
      return { text: 'HT', live: true };
    case 'FINISHED':
      return { text: 'FT', live: false };
    case 'SCHEDULED':
    case 'TIMED': {
      const d = new Date(m.utcDate);
      return {
        text: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        live: false,
      };
    }
    default:
      return { text: m.status, live: false };
  }
}

function teamName(team: { name: string; shortName: string }) {
  return team.shortName || team.name;
}

function MatchChip({ m }: { m: ScoreMatch }) {
  const { text, live } = statusLabel(m);
  const isPlaying = m.status === 'IN_PLAY' || m.status === 'PAUSED';
  const isDone = m.status === 'FINISHED';
  const homeFlag = TEAM_FLAGS[m.homeTeam.name] ?? '🏳';
  const awayFlag = TEAM_FLAGS[m.awayTeam.name] ?? '🏳';

  return (
    <div className={[
      'flex items-center gap-2 px-4 py-2 border shrink-0 text-sm',
      isPlaying
        ? 'border-star-500/60 bg-star-500/10'
        : isDone
        ? 'border-navy-600 bg-navy-800'
        : 'border-navy-600 bg-navy-800',
    ].join(' ')}>
      {/* Home */}
      <span className="text-base">{homeFlag}</span>
      <span className={`font-display font-700 ${isDone || isPlaying ? 'text-white' : 'text-navy-200'}`}>
        {teamName(m.homeTeam)}
      </span>

      {/* Score / time */}
      <div className="flex items-center gap-1.5 mx-1">
        {isPlaying || isDone ? (
          <>
            <span className="font-display font-900 text-white tabular-nums">
              {m.score.home ?? 0}
            </span>
            <span className={`text-xs font-700 px-1.5 py-0.5 rounded-sm ${
              isPlaying ? 'bg-star-500 text-white' : 'bg-navy-600 text-navy-200'
            }`}>
              {text}
            </span>
            <span className="font-display font-900 text-white tabular-nums">
              {m.score.away ?? 0}
            </span>
          </>
        ) : (
          <span className="text-xs font-display font-600 text-navy-300 px-1">{text}</span>
        )}
        {live && (
          <span className="w-1.5 h-1.5 rounded-full bg-star-400 animate-pulse ml-0.5" />
        )}
      </div>

      {/* Away */}
      <span className={`font-display font-700 ${isDone || isPlaying ? 'text-white' : 'text-navy-200'}`}>
        {teamName(m.awayTeam)}
      </span>
      <span className="text-base">{awayFlag}</span>
    </div>
  );
}

export function ScoreTicker({ matches }: Props) {
  if (matches.length === 0) return null;

  return (
    <div className="border-b border-navy-700 bg-navy-900">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 py-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-display font-700 tracking-widest uppercase text-navy-400 shrink-0">
            Today
          </span>
          <div className="w-px h-4 bg-navy-700 shrink-0" />
          <div className="flex gap-2">
            {matches.map((m) => (
              <MatchChip key={m.id} m={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
