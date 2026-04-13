import type { Player, PlayerPicks } from '../types';
import { GROUPS, TEAM_FLAGS } from '../data/tournament';
import { ALL_PLAYERS } from '../hooks/usePicks';

const DISPLAY_NAMES: Record<Player, string> = {
  em:       'Em',
  allie:    'Allie',
  brian:    'Brian',
  kathleen: 'Kathleen',
  jaivon:   'Jaivon',
  zay:      'Zay',
};

interface Props {
  allPicks: Record<Player, PlayerPicks>;
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
    <div className="border border-warm-200 min-w-[220px] flex-1">
      {/* Name */}
      <div className="px-6 py-5 border-b border-warm-100 flex items-end justify-between">
        <h3 className="font-serif text-3xl font-light text-warm-900">{name}</h3>
        <p className="text-xs tracking-widest uppercase text-warm-400 mb-1">
          {pct === 100 ? 'Complete' : `${pct}%`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4 pb-1">
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
          <div key={label} className="px-3 py-3 text-center">
            <p className="font-serif text-lg font-light text-warm-900">{value}</p>
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
          <div key={label} className="px-3 py-3 text-center">
            <p className="font-serif text-lg font-light text-warm-900">{value}</p>
            <p className="text-xs tracking-widest uppercase text-warm-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Champion */}
      <div className="px-6 py-5">
        <p className="text-xs tracking-widest uppercase text-warm-400 mb-2">Champion</p>
        {champion ? (
          <p className="font-serif text-xl font-light text-warm-900">
            {TEAM_FLAGS[champion] ?? ''} {champion}
          </p>
        ) : (
          <p className="font-serif text-lg text-warm-300">Not yet picked</p>
        )}
      </div>
    </div>
  );
}

export function Leaderboard({ allPicks }: Props) {
  // Find if everyone picked the same champion
  const champions = ALL_PLAYERS.map((p) => allPicks[p].knockout_picks.final).filter(Boolean);
  const uniqueChampions = [...new Set(champions)];
  const allAgree = uniqueChampions.length === 1 && champions.length === ALL_PLAYERS.length;

  return (
    <div>
      <div className="mb-10 border-b border-warm-100 pb-6">
        <h2 className="font-serif text-3xl font-light text-warm-900 mb-1">Leaderboard</h2>
        <p className="text-xs tracking-widest uppercase text-warm-400">
          Completion &amp; champion picks
        </p>
      </div>

      {allAgree && (
        <div className="mb-8 border border-warm-900 px-8 py-5">
          <p className="font-serif text-xl font-light text-warm-900 text-center">
            Everyone picked {TEAM_FLAGS[uniqueChampions[0]!] ?? ''} {uniqueChampions[0]} to win it all
          </p>
        </div>
      )}

      {/* Player cards */}
      <div className="flex flex-wrap gap-px bg-warm-100 mb-12">
        {ALL_PLAYERS.map((p) => (
          <PlayerCard key={p} name={DISPLAY_NAMES[p]} picks={allPicks[p]} />
        ))}
      </div>

      {/* Comparison table */}
      <div>
        <p className="text-xs tracking-widest uppercase text-warm-400 mb-6">Group Picks — All Players</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-warm-200">
                <th className="text-left py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal sticky left-0 bg-cream-100">Group</th>
                {ALL_PLAYERS.map((p) => (
                  <th key={p} colSpan={3} className="py-3 px-4 text-xs tracking-widest uppercase text-warm-400 font-normal text-left border-l border-warm-100">
                    {DISPLAY_NAMES[p]}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-warm-100">
                <th className="sticky left-0 bg-cream-100" />
                {ALL_PLAYERS.map((p) => (
                  ['1st', '2nd', 'WC'].map((label, i) => (
                    <th key={`${p}-${label}`} className={`py-2 px-4 text-xs tracking-widest uppercase text-warm-300 font-normal text-left ${i === 0 ? 'border-l border-warm-100' : ''}`}>
                      {label}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group, gi) => {
                return (
                  <tr key={group.id} className={`border-b border-warm-100 ${gi % 2 === 0 ? '' : 'bg-cream-200/40'}`}>
                    <td className="py-3 px-4 font-serif text-warm-900 sticky left-0 bg-inherit">Group {group.id}</td>
                    {ALL_PLAYERS.map((p) => {
                      const gp = allPicks[p].group_picks[group.id] ?? { first: null, second: null, third: null };
                      return [gp.first, gp.second, gp.third].map((t, j) => (
                        <td key={`${p}-${j}`} className={`py-3 px-4 text-warm-600 ${j === 0 ? 'border-l border-warm-100' : ''}`}>
                          {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-warm-200">—</span>}
                        </td>
                      ));
                    })}
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
