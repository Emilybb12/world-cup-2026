import type { PlayerPicks } from '../types';
import { GROUPS, TEAM_FLAGS } from '../data/tournament';

interface Props {
  emPicks: PlayerPicks;
  roPicks: PlayerPicks;
}

function calcCompletion(picks: PlayerPicks): number {
  // Group stage: 12 groups × 3 picks = 36 picks
  let groupDone = 0;
  for (const group of GROUPS) {
    const gp = picks.group_picks[group.id];
    if (gp?.first) groupDone++;
    if (gp?.second) groupDone++;
    if (gp?.third) groupDone++;
  }

  // Wildcards: 8 picks
  const wildDone = Math.min(picks.wildcard_picks.length, 8);

  // Knockout: r32(16) + r16(8) + qf(4) + sf(2) + final(1) = 31 picks
  const kp = picks.knockout_picks;
  const r32Done = Object.values(kp.r32).filter(Boolean).length;
  const r16Done = Object.values(kp.r16).filter(Boolean).length;
  const qfDone = Object.values(kp.qf).filter(Boolean).length;
  const sfDone = Object.values(kp.sf).filter(Boolean).length;
  const finalDone = kp.final ? 1 : 0;
  const knockoutDone = r32Done + r16Done + qfDone + sfDone + finalDone;

  const total = groupDone + wildDone + knockoutDone;
  const max = 36 + 8 + 31; // 75
  return Math.round((total / max) * 100);
}

interface PlayerCardProps {
  name: string;
  picks: PlayerPicks;
  emoji: string;
}

function PlayerCard({ name, picks, emoji }: PlayerCardProps) {
  const pct = calcCompletion(picks);
  const champion = picks.knockout_picks.final;

  const groupsDone = GROUPS.filter((g) => {
    const gp = picks.group_picks[g.id];
    return gp?.first && gp?.second && gp?.third;
  }).length;

  const kp = picks.knockout_picks;
  const r32Done = Object.values(kp.r32).filter(Boolean).length;
  const r16Done = Object.values(kp.r16).filter(Boolean).length;
  const qfDone = Object.values(kp.qf).filter(Boolean).length;
  const sfDone = Object.values(kp.sf).filter(Boolean).length;

  return (
    <div className="bg-pitch-800 rounded-2xl border border-white/10 p-6 flex-1 min-w-[280px]">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-2xl">
          {emoji}
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white">{name}</h3>
          <p className="text-sm text-white/40">
            {pct === 100 ? '🎉 All picks in!' : `${pct}% complete`}
          </p>
        </div>
      </div>

      {/* Completion bar */}
      <div className="mb-5">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={[
              'h-full rounded-full transition-all duration-700',
              pct === 100 ? 'bg-green-500' : 'bg-gold-500',
            ].join(' ')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { label: 'Groups', value: `${groupsDone}/12`, done: groupsDone === 12 },
          { label: 'Wildcards', value: `${picks.wildcard_picks.length}/8`, done: picks.wildcard_picks.length === 8 },
          { label: 'R32 picks', value: `${r32Done}/16`, done: r32Done === 16 },
          { label: 'R16 picks', value: `${r16Done}/8`, done: r16Done === 8 },
          { label: 'QF picks', value: `${qfDone}/4`, done: qfDone === 4 },
          { label: 'SF picks', value: `${sfDone}/2`, done: sfDone === 2 },
        ].map(({ label, value, done }) => (
          <div key={label} className="bg-white/5 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-white/50">{label}</span>
            <span className={`text-xs font-bold ${done ? 'text-green-400' : 'text-white/70'}`}>
              {done ? '✓ ' : ''}{value}
            </span>
          </div>
        ))}
      </div>

      {/* Champion */}
      <div
        className={[
          'rounded-xl border p-4 text-center',
          champion
            ? 'border-gold-500/50 bg-gold-500/10'
            : 'border-white/10 bg-white/5',
        ].join(' ')}
      >
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Picked Champion</p>
        {champion ? (
          <p className="text-lg font-extrabold text-gold-400">
            {TEAM_FLAGS[champion] ?? ''} {champion}
          </p>
        ) : (
          <p className="text-sm text-white/20">Not yet picked</p>
        )}
      </div>
    </div>
  );
}

export function Leaderboard({ emPicks, roPicks }: Props) {
  const emPct = calcCompletion(emPicks);
  const roPct = calcCompletion(roPicks);

  const bothComplete = emPct === 100 && roPct === 100;
  const sameChampion =
    bothComplete &&
    emPicks.knockout_picks.final &&
    emPicks.knockout_picks.final === roPicks.knockout_picks.final;

  return (
    <div>
      {sameChampion && (
        <div className="mb-6 bg-gold-500/10 border border-gold-500/40 rounded-xl p-4 text-center">
          <p className="text-gold-400 font-bold text-lg">
            🤝 Em & Ro both picked {TEAM_FLAGS[emPicks.knockout_picks.final!] ?? ''}{' '}
            {emPicks.knockout_picks.final} to win it all!
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <PlayerCard name="Em" picks={emPicks} emoji="⚽" />
        <PlayerCard name="Ro" picks={roPicks} emoji="🏆" />
      </div>

      {/* Group picks comparison */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">
          Group Picks Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left py-2 px-3 font-semibold">Group</th>
                <th className="py-2 px-3 font-semibold text-gold-400">🥇 Em</th>
                <th className="py-2 px-3 font-semibold text-white/60">🥈 Em</th>
                <th className="py-2 px-3 font-semibold text-blue-300">🃏 Em</th>
                <th className="py-2 px-3 font-semibold border-l border-white/10 text-gold-400">🥇 Ro</th>
                <th className="py-2 px-3 font-semibold text-white/60">🥈 Ro</th>
                <th className="py-2 px-3 font-semibold text-blue-300">🃏 Ro</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group, i) => {
                const em = emPicks.group_picks[group.id] ?? { first: null, second: null, third: null };
                const ro = roPicks.group_picks[group.id] ?? { first: null, second: null, third: null };
                return (
                  <tr
                    key={group.id}
                    className={i % 2 === 0 ? 'bg-white/3' : ''}
                  >
                    <td className="py-2 px-3 font-bold text-white">
                      Group {group.id}
                    </td>
                    {[em.first, em.second, em.third].map((t, j) => (
                      <td key={j} className="py-2 px-3 text-white/70">
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-white/20">—</span>}
                      </td>
                    ))}
                    {[ro.first, ro.second, ro.third].map((t, j) => (
                      <td key={j} className="py-2 px-3 text-white/70 border-l border-white/5">
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-white/20">—</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
