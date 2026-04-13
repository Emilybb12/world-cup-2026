import type { PlayerPicks } from '../types';
import { GROUPS, TEAM_FLAGS } from '../data/tournament';

interface Props {
  emPicks: PlayerPicks;
  roPicks: PlayerPicks;
}

function calcCompletion(picks: PlayerPicks): number {
  let groupDone = 0;
  for (const group of GROUPS) {
    const gp = picks.group_picks[group.id];
    if (gp?.first)  groupDone++;
    if (gp?.second) groupDone++;
    if (gp?.third)  groupDone++;
  }
  const wildDone = Math.min(picks.wildcard_picks.length, 8);
  const kp = picks.knockout_picks;
  const knockoutDone =
    Object.values(kp.r32).filter(Boolean).length +
    Object.values(kp.r16).filter(Boolean).length +
    Object.values(kp.qf).filter(Boolean).length +
    Object.values(kp.sf).filter(Boolean).length +
    (kp.final ? 1 : 0);
  return Math.round(((groupDone + wildDone + knockoutDone) / 75) * 100);
}

interface PlayerCardProps {
  name: string;
  picks: PlayerPicks;
}

function PlayerCard({ name, picks }: PlayerCardProps) {
  const pct = calcCompletion(picks);
  const champion = picks.knockout_picks.final;
  const groupsDone = GROUPS.filter((g) => {
    const gp = picks.group_picks[g.id];
    return gp?.first && gp?.second && gp?.third;
  }).length;
  const kp = picks.knockout_picks;
  const r32Done = Object.values(kp.r32).filter(Boolean).length;
  const r16Done = Object.values(kp.r16).filter(Boolean).length;
  const qfDone  = Object.values(kp.qf).filter(Boolean).length;
  const sfDone  = Object.values(kp.sf).filter(Boolean).length;

  return (
    <div className="border border-warm-200 flex-1 min-w-[280px]">
      {/* Name */}
      <div className="px-8 py-6 border-b border-warm-100 flex items-end justify-between">
        <h3 className="font-serif text-4xl italic font-light text-warm-900">{name}</h3>
        <p className="text-xs tracking-widest uppercase text-warm-400 mb-1">
          {pct === 100 ? 'Complete' : `${pct}%`}
        </p>
      </div>

      {/* Progress */}
      <div className="px-8 pt-5 pb-1">
        <div className="h-px bg-warm-100 relative">
          <div
            className="absolute top-0 left-0 h-px bg-warm-900 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-warm-100 border-b border-warm-100">
        {[
          { label: 'Groups',    value: `${groupsDone}/12` },
          { label: 'Wildcards', value: `${picks.wildcard_picks.length}/8` },
          { label: 'R32',       value: `${r32Done}/16` },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-4 text-center">
            <p className="font-serif text-xl font-light text-warm-900">{value}</p>
            <p className="text-xs tracking-widest uppercase text-warm-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 divide-x divide-warm-100 border-b border-warm-100">
        {[
          { label: 'R16', value: `${r16Done}/8` },
          { label: 'QF',  value: `${qfDone}/4`  },
          { label: 'SF',  value: `${sfDone}/2`  },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-4 text-center">
            <p className="font-serif text-xl font-light text-warm-900">{value}</p>
            <p className="text-xs tracking-widest uppercase text-warm-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Champion */}
      <div className="px-8 py-6">
        <p className="text-xs tracking-widest uppercase text-warm-400 mb-2">Picked Champion</p>
        {champion ? (
          <p className="font-serif text-2xl italic font-light text-warm-900">
            {TEAM_FLAGS[champion] ?? ''} {champion}
          </p>
        ) : (
          <p className="font-serif text-xl italic text-warm-300">Not yet picked</p>
        )}
      </div>
    </div>
  );
}

export function Leaderboard({ emPicks, roPicks }: Props) {
  const emChamp = emPicks.knockout_picks.final;
  const roChamp = roPicks.knockout_picks.final;
  const sameChampion = emChamp && roChamp && emChamp === roChamp;

  return (
    <div>
      <div className="mb-10 border-b border-warm-100 pb-6">
        <h2 className="font-serif text-3xl italic font-light text-warm-900 mb-1">Leaderboard</h2>
        <p className="text-xs tracking-widest uppercase text-warm-400">
          Completion &amp; champion picks
        </p>
      </div>

      {sameChampion && (
        <div className="mb-8 border border-warm-900 px-8 py-5">
          <p className="font-serif text-xl italic font-light text-warm-900 text-center">
            Em &amp; Ro both picked {TEAM_FLAGS[emChamp] ?? ''} {emChamp} to win it all
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-px bg-warm-100 mb-12">
        <PlayerCard name="Em" picks={emPicks} />
        <PlayerCard name="Ro" picks={roPicks} />
      </div>

      {/* Comparison table */}
      <div>
        <p className="text-xs tracking-widest uppercase text-warm-400 mb-6">Group Picks — Side by Side</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-warm-200">
                <th className="text-left py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal">Group</th>
                <th className="py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal text-left">Em — 1st</th>
                <th className="py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal text-left">Em — 2nd</th>
                <th className="py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal text-left border-r border-warm-200">Em — WC</th>
                <th className="py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal text-left">Ro — 1st</th>
                <th className="py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal text-left">Ro — 2nd</th>
                <th className="py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal text-left">Ro — WC</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group, i) => {
                const em = emPicks.group_picks[group.id] ?? { first: null, second: null, third: null };
                const ro = roPicks.group_picks[group.id] ?? { first: null, second: null, third: null };
                return (
                  <tr key={group.id} className={`border-b border-warm-100 ${i % 2 === 0 ? '' : 'bg-cream-200/40'}`}>
                    <td className="py-3 px-4 font-serif italic text-warm-900">Group {group.id}</td>
                    {[em.first, em.second, em.third].map((t, j) => (
                      <td key={j} className="py-3 px-4 text-warm-600">
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-warm-200">—</span>}
                      </td>
                    ))}
                    {[ro.first, ro.second, ro.third].map((t, j) => (
                      <td key={j} className={`py-3 px-4 text-warm-600 ${j === 0 ? 'border-l border-warm-200' : ''}`}>
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-warm-200">—</span>}
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
