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
    <div className="border border-ink-200 bg-white flex-1 min-w-[220px]">
      <div className="px-6 py-5 border-b border-ink-100 flex items-center justify-between">
        <h3 className="font-display font-800 text-3xl tracking-wide text-ink-900 uppercase">{name}</h3>
        <p className={`font-display font-700 text-2xl ${pct === 100 ? 'text-ink-900' : 'text-ink-300'}`}>
          {pct}<span className="text-sm">%</span>
        </p>
      </div>

      <div className="px-6 pt-4 pb-2">
        <div className="h-px bg-ink-100 relative">
          <div className="absolute top-0 left-0 h-px bg-ink-900 transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-ink-100 border-b border-ink-100">
        {[{ label: 'Groups', value: `${groupsDone}/12` }, { label: 'WC', value: `${picks.wildcard_picks.length}/8` }, { label: 'R32', value: `${r32Done}/16` }]
          .map(({ label, value }) => (
            <div key={label} className="px-3 py-3 text-center">
              <p className="font-display font-700 text-lg text-ink-900">{value}</p>
              <p className="text-xs tracking-widest uppercase text-ink-300 mt-0.5">{label}</p>
            </div>
          ))}
      </div>
      <div className="grid grid-cols-3 divide-x divide-ink-100 border-b border-ink-100">
        {[{ label: 'R16', value: `${r16Done}/8` }, { label: 'QF', value: `${qfDone}/4` }, { label: 'SF', value: `${sfDone}/2` }]
          .map(({ label, value }) => (
            <div key={label} className="px-3 py-3 text-center">
              <p className="font-display font-700 text-lg text-ink-900">{value}</p>
              <p className="text-xs tracking-widest uppercase text-ink-300 mt-0.5">{label}</p>
            </div>
          ))}
      </div>

      <div className="px-6 py-5">
        <p className="text-xs font-display tracking-widest uppercase text-ink-300 mb-2">🏆 Champion</p>
        {champion ? (
          <p className="font-display font-700 text-xl tracking-wide text-ink-900 uppercase">
            {TEAM_FLAGS[champion] ?? ''} {champion}
          </p>
        ) : (
          <p className="font-display text-lg text-ink-200 uppercase">Not yet picked</p>
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
        <h2 className="font-display font-800 text-4xl tracking-wide text-ink-900 uppercase mb-1">Leaderboard</h2>
        <p className="text-sm text-ink-400 tracking-wider">Completion &amp; champion picks</p>
      </div>

      {allAgree && (
        <div className="mb-8 border-2 border-ink-900 bg-ink-900 px-8 py-4 flex items-center gap-3">
          <span className="text-2xl">🤝</span>
          <p className="font-display font-700 text-lg tracking-wide text-white uppercase">
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
        <p className="text-xs font-display font-600 tracking-widest uppercase text-ink-400 mb-4">
          Group Picks — Side by Side
        </p>
        <div className="overflow-x-auto border border-ink-200">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink-200 bg-off-50">
                <th className="text-left py-3 px-4 font-display tracking-widest uppercase text-ink-400 font-600">Group</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-ink-400 font-600 text-left">Em 1st</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-ink-400 font-600 text-left">Em 2nd</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-ink-400 font-600 text-left border-r border-ink-200">Em WC</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-ink-400 font-600 text-left">Ro 1st</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-ink-400 font-600 text-left">Ro 2nd</th>
                <th className="py-3 px-4 font-display tracking-widest uppercase text-ink-400 font-600 text-left">Ro WC</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group, gi) => {
                const em = allPicks.em.group_picks[group.id] ?? { first: null, second: null, third: null };
                const ro = allPicks.ro.group_picks[group.id] ?? { first: null, second: null, third: null };
                return (
                  <tr key={group.id} className={`border-b border-ink-100 ${gi % 2 === 0 ? 'bg-white' : 'bg-off-50'}`}>
                    <td className="py-3 px-4 font-display font-700 tracking-wider text-ink-900 uppercase">
                      Group {group.id}
                    </td>
                    {[em.first, em.second, em.third].map((t, j) => (
                      <td key={j} className="py-3 px-4 text-ink-600">
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-ink-200">—</span>}
                      </td>
                    ))}
                    {[ro.first, ro.second, ro.third].map((t, j) => (
                      <td key={j} className={`py-3 px-4 text-ink-600 ${j === 0 ? 'border-l border-ink-200' : ''}`}>
                        {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-ink-200">—</span>}
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
