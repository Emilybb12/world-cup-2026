import type { UserPicks, LeagueMember } from '../types';
import { GROUPS, TEAM_FLAGS } from '../data/tournament';
import type { AllPicks } from '../hooks/usePicks';

interface Props {
  allPicks: AllPicks;
  members: LeagueMember[];
  currentUserId: string;
}

function calcCompletion(picks: UserPicks): number {
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

function MemberCard({ picks, isYou }: { picks: UserPicks; isYou: boolean }) {
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
    <div
      className={`border flex-1 min-w-[220px] bg-navy-800 relative corner-brackets transition-all ${isYou ? 'border-gold-500' : 'border-navy-600'}`}
      style={isYou ? { boxShadow: '0 0 30px rgba(201, 168, 50, 0.1)' } : undefined}
    >
      <div className="px-6 py-5 border-b border-navy-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {isYou && <span className="shrink-0 text-[10px] font-display font-800 text-gold-500 border border-gold-500/50 px-1.5 py-0.5 tracking-widest uppercase">you</span>}
          <h3 className="font-display font-800 text-2xl tracking-wide text-white uppercase truncate">
            {picks.username}
          </h3>
        </div>
        <p className={`font-display font-700 text-2xl shrink-0 ${pct === 100 ? 'text-gold-400' : 'text-navy-400'}`}>
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
        {[
          { label: 'Groups', value: `${groupsDone}/12` },
          { label: 'WC', value: `${picks.wildcard_picks.length}/8` },
          { label: 'R32', value: `${r32Done}/16` },
        ].map(({ label, value }) => (
          <div key={label} className="px-3 py-3 text-center">
            <p className="font-display font-700 text-lg text-white">{value}</p>
            <p className="text-xs tracking-widest uppercase text-navy-300 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 divide-x divide-navy-700 border-b border-navy-700">
        {[
          { label: 'R16', value: `${r16Done}/8` },
          { label: 'QF',  value: `${qfDone}/4` },
          { label: 'SF',  value: `${sfDone}/2` },
        ].map(({ label, value }) => (
          <div key={label} className="px-3 py-3 text-center">
            <p className="font-display font-700 text-lg text-white">{value}</p>
            <p className="text-xs tracking-widest uppercase text-navy-300 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="px-6 py-5">
        <p className="text-xs font-display tracking-widest uppercase text-navy-300 mb-2">Champion Pick</p>
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

export function LeagueLeaderboard({ allPicks, members, currentUserId }: Props) {
  const memberPicks = members.map((m) => allPicks[m.user_id]).filter(Boolean) as UserPicks[];

  const champions = memberPicks.map((p) => p.knockout_picks.final).filter(Boolean) as string[];
  const uniqueChampions = [...new Set(champions)];
  const allAgree = uniqueChampions.length === 1 && champions.length === memberPicks.length && memberPicks.length > 1;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-800 text-4xl tracking-wide text-white uppercase mb-1">Leaderboard</h2>
        <p className="text-sm text-navy-200 tracking-wider">Completion &amp; champion picks</p>
      </div>

      {allAgree && (
        <div className="mb-8 border-2 border-gold-500 bg-gold-500 px-8 py-4 flex items-center gap-3">
          <p className="font-display font-700 text-lg tracking-wide text-navy-900 uppercase">
            Everyone picked {TEAM_FLAGS[uniqueChampions[0]] ?? ''} {uniqueChampions[0]} to win it all!
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-12">
        {memberPicks.map((p) => (
          <MemberCard key={p.user_id} picks={p} isYou={p.user_id === currentUserId} />
        ))}
      </div>

      {/* Group picks comparison table */}
      {memberPicks.length >= 2 && (
        <div>
          <p className="text-xs font-display font-600 tracking-widest uppercase text-navy-300 mb-4">
            Group Picks — Side by Side
          </p>
          <div className="overflow-x-auto border border-navy-600">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-600 bg-navy-850">
                  <th className="text-left py-3 px-4 font-display tracking-widest uppercase text-navy-300 font-600 whitespace-nowrap">Group</th>
                  {memberPicks.map((p) => (
                    <>
                      <th key={`${p.user_id}-1`} className="py-3 px-3 font-display tracking-widest uppercase text-navy-300 font-600 text-left whitespace-nowrap">
                        {p.username} 1st
                      </th>
                      <th key={`${p.user_id}-2`} className="py-3 px-3 font-display tracking-widest uppercase text-navy-300 font-600 text-left whitespace-nowrap">
                        2nd
                      </th>
                      <th key={`${p.user_id}-wc`} className="py-3 px-3 font-display tracking-widest uppercase text-navy-300 font-600 text-left whitespace-nowrap border-r border-navy-700">
                        WC
                      </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GROUPS.map((group, gi) => (
                  <tr key={group.id} className={`border-b border-navy-700 ${gi % 2 === 0 ? 'bg-navy-800' : 'bg-navy-850'}`}>
                    <td className="py-3 px-4 font-display font-700 tracking-wider text-white uppercase whitespace-nowrap">
                      Group {group.id}
                    </td>
                    {memberPicks.map((p) => {
                      const gp = p.group_picks[group.id] ?? { first: null, second: null, third: null };
                      return [gp.first, gp.second, gp.third].map((t, j) => (
                        <td key={`${p.user_id}-${j}`} className={`py-3 px-3 text-navy-100 ${j === 2 ? 'border-r border-navy-700' : ''}`}>
                          {t ? `${TEAM_FLAGS[t] ?? ''} ${t}` : <span className="text-navy-500">—</span>}
                        </td>
                      ));
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
