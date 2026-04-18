import type { Player, PlayerPicks } from '../types';
import { GROUPS, TEAM_FLAGS } from '../data/tournament';
import { ALL_PLAYERS } from '../hooks/usePicks';

const DISPLAY_NAMES: Record<Player, string> = { em: 'Em', ro: 'Ro' };

interface Props { allPicks: Record<Player, PlayerPicks>; }

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

function PlayerCard({ name, picks }: { name: string; picks: PlayerPicks }) {
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
    <div className="border border-navy-600 bg-navy-800 flex-1 min-w-[220px]">
      <div className="px-6 py-5 border-b border-navy-700 flex items-center justify-between">
        <h3 className="font-display font-800 text-3xl tracking-wide text-white uppercase">{name}</h3>
        <p className={`font-display font-700 text-2xl ${pct === 100 ? 'text-gold-400' : 'text-navy-400'}`}>
          {pct}<span className="text-sm">%</span>
        </p>
      </div>

      <div className="px-6 pt-4 pb-2">
        <div className="h-px bg-navy-600 relative">
          <div className="absolute top-0 left-0 h-px bg-gold-500 transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-navy-700 border-b border-navy-700">
        {[{ label: 'Groups', value: `${groupsDone}/12` }, { label: 'WC', value: `${picks.wildcard_picks.length}/8` }, { label: 'R32', value: `${r32Done}/16` }]
          .map(({ label, value }) => (
            <div key={label} className="px-3 py-3 text-center">
              <p className="font-display font-700 text-lg text-white">{value}</p>
              <p className="text-xs tracking-widest uppercase text-navy-300 mt-0.5">{label}</p>
            </div>
          ))}
      </div>
      <div className="grid grid-cols-3 divide-x divide-navy-700 border-b border-navy-700">
        {[{ label: 'R16', value: `${r16Done}/8` }, { label: 'QF', value: `${qfDone}/4` }, { label: 'SF', value: `${sfDone}/2` }]
          .map(({ label, value }) => (
            <div key={label} className="px-3 py-3 text-center">
              <p className="font-display font-700 text-lg text-white">{value}</p>
              <p className="text-xs tracking-widest uppercase text-navy-300 mt-0.5">{label}</p>
            </div>
          ))}
      </div>

      <div className="px-6 py-5">
        <p className="text-xs font-display tracking-widest uppercase text-navy-300 mb-2">🏆 Champion</p>
        {champion ? (
          <p className="font-display font-700 text-xl tracking-wide text-white uppercase">
            {TEAM_FLAGS[champion] ?? ''} {champion}
          </p>
        ) : (
          <p className="font-display text-lg text-navy-500 uppercase">Not yet picked</p>
        )}
      </div>
    </div>
  );
}

export function Leaderboard({ allPicks }: Props) {
  const champions = ALL_PLAYERS.map((p) => allPicks[p].knockout_picks.final).filter(Boolean);
  const uniqueChampions = [...new Set(champions)];
  const allAgree = uniqueChampions.length === 1 && champions.length === ALL_PLAYERS.length;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-800 text-4xl tracking-wide text-white uppercase mb-1">Leaderboard</h2>
        <p className="text-sm text-navy-200 tracking-wider">Completion &amp; champion picks</p>
      </div>

      {allAgree && (
        <div className="mb-8 border-2 border-gold-500 bg-gold-500 px-8 py-4 flex items-center gap-3">
          <span className="text-2xl">🤝</span>
          <p className="font-display font-700 text-lg tracking-wide text-navy-900 uppercase">
            Both picked {TEAM_FLAGS[uniqueChampions[0]!] ?? ''} {uniqueChampions[0]} to win it all!
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-12">
        {ALL_PLAYERS.map((p) => (
          <PlayerCard key={p} name={DISPLAY_NAMES[p]} picks={allPicks[p]} />
        ))}
      </div>

      <div>
        <p className="text-xs font-display font-600 tracking-widest uppercase text-navy-300 mb-4">
          Group Picks — Side by Side
        </p>
        <div className="overflow-x-auto border border-navy-600">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-navy-600 bg-navy-850">
                <th className="text-left py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600">Group</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600 text-left">Em 1st</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600 text-left">Em 2nd</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600 text-left border-r border-navy-600">Em WC</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600 text-left">Ro 1st</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600 text-left">Ro 2nd</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600 text-left">Ro WC</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group, gi) => {
                const em = allPicks.em.group_picks[group.id] ?? { first: null, second: null, third: null };
                const ro = allPicks.ro.group_picks[group.id] ?? { first: null, second: null, third: null };
                return (
                  <tr key={group.id} className={`border-b border-navy-700 ${gi % 2 === 0 ? 'bg-navy-800' : 'bg-navy-850'}`}>
                    <td className="py-3 px-4 font-display font-700 tracking-wider text-white uppercase">
                      Group {group.id}
                    </td>
                    {[em.first, em.second, em.third].map((t, j) => (
                      <td key={j} className="py-3 px-4 text-navy-100">
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-navy-500">—</span>}
                      </td>
                    ))}
                    {[ro.first, ro.second, ro.third].map((t, j) => (
                      <td key={j} className={`py-3 px-4 text-navy-100 ${j === 0 ? 'border-l border-navy-600' : ''}`}>
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-navy-500">—</span>}
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
