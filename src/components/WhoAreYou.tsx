import type { Player, PlayerPicks } from '../types';
import { GROUPS, TEAM_FLAGS } from '../data/tournament';
import { ALL_PLAYERS } from '../hooks/usePicks';

interface Props {
  allPicks: Record<Player, PlayerPicks>;
  onSelect: (p: Player) => void;
}

const DISPLAY_NAMES: Record<Player, string> = { em: 'Em', ro: 'Ro' };

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

function PlayerStat({ player, picks }: { player: Player; picks: PlayerPicks }) {
  const pct = calcCompletion(picks);
  const champion = picks.knockout_picks.final;
  const groupsDone = GROUPS.filter((g) => {
    const gp = picks.group_picks[g.id];
    return gp?.first && gp?.second && gp?.third;
  }).length;

  return (
    <div className="flex-1 p-6 flex flex-col items-center text-center gap-3">
      <p className="font-display font-900 text-2xl text-white tracking-wide">
        {DISPLAY_NAMES[player]}
      </p>

      {/* Big percentage */}
      <div>
        <span className={`font-display font-900 text-6xl ${pct === 100 ? 'text-gold-400' : 'text-white'}`}>
          {pct}
        </span>
        <span className="font-display font-700 text-2xl text-navy-400">%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Groups done */}
      <p className="text-xs font-display font-600 text-navy-300 tracking-wider">
        {groupsDone}/12 groups · {picks.wildcard_picks.length}/8 wildcards
      </p>

      {/* Champion pick */}
      <div className="mt-1">
        {champion ? (
          <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 px-4 py-2 rounded-sm">
            <span className="text-xl">{TEAM_FLAGS[champion] ?? '🏆'}</span>
            <span className="font-display font-800 text-sm text-gold-400 uppercase tracking-wider">
              {champion}
            </span>
          </div>
        ) : (
          <p className="text-xs text-navy-500 font-display tracking-wider uppercase">No champion yet</p>
        )}
      </div>
    </div>
  );
}

export function WhoAreYou({ allPicks, onSelect }: Props) {
  const champions = ALL_PLAYERS.map((p) => allPicks[p].knockout_picks.final).filter(Boolean);
  const uniqueChamps = [...new Set(champions)];
  const bothAgree = uniqueChamps.length === 1 && champions.length === 2;
  const bothDone = ALL_PLAYERS.every((p) => calcCompletion(allPicks[p]) === 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">

      {/* ── Fun Leaderboard ── */}
      <div className="w-full max-w-lg">
        <p className="text-center text-xs font-display font-700 tracking-widest uppercase text-navy-400 mb-3">
          📊 current standings
        </p>

        <div className="border border-navy-600 bg-navy-800 overflow-hidden">
          {/* Players side by side */}
          <div className="flex divide-x divide-navy-600">
            {ALL_PLAYERS.map((p) => (
              <PlayerStat key={p} player={p} picks={allPicks[p]} />
            ))}
          </div>

          {/* Agreement banner */}
          {bothAgree && (
            <div className="border-t border-gold-500/30 bg-gold-500/10 px-6 py-3 text-center">
              <p className="text-sm font-display font-800 text-gold-400 tracking-wide">
                🤝 Both picking {TEAM_FLAGS[uniqueChamps[0]!] ?? ''} {uniqueChamps[0]}!
              </p>
            </div>
          )}
          {bothDone && !bothAgree && (
            <div className="border-t border-star-500/30 bg-star-500/10 px-6 py-3 text-center">
              <p className="text-sm font-display font-800 text-star-300 tracking-wide">
                ✅ Both brackets complete — may the best picker win!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Login section ── */}
      <div className="flex flex-col items-center relative">
        {/* Decorative corner lines */}
        <div className="absolute -top-4 -left-8 w-8 h-8 border-l-2 border-t-2 border-gold-500/30" />
        <div className="absolute -top-4 -right-8 w-8 h-8 border-r-2 border-t-2 border-gold-500/30" />

        <div className="text-4xl mb-4 select-none">⚽</div>

        {/* FIFA badge */}
        <div className="border-2 border-gold-500 px-4 py-2 flex flex-col items-center mb-6">
          <span className="font-display font-900 text-gold-400 text-xl leading-none tracking-widest">FIFA</span>
          <div className="h-px w-full bg-gold-500/50 my-1" />
          <span className="font-display font-700 text-gold-500 text-[10px] leading-none tracking-widest">2026</span>
        </div>

        <p className="text-xs font-display font-700 tracking-widest uppercase text-navy-300 mb-1">
          World Cup Predictions
        </p>
        <h1 className="font-display font-900 text-5xl tracking-wide text-white uppercase mb-1">
          Ro & Em
        </h1>
        <p className="text-sm text-navy-300 tracking-wider mb-8">Who are you?</p>

        <div className="flex gap-3 w-full max-w-xs">
          {(['ro', 'em'] as Player[]).map((p) => (
            <button
              key={p}
              onClick={() => onSelect(p)}
              className="flex-1 py-5 border border-navy-600 bg-navy-800 hover:border-gold-500 hover:bg-gold-500 transition-all duration-200 group"
            >
              <span className="font-display font-900 text-3xl tracking-widest text-white uppercase group-hover:text-navy-900 transition-colors">
                {p === 'em' ? 'Em' : 'Ro'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-8">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-gold-500/50 text-xs">★</span>
          ))}
        </div>
      </div>
    </div>
  );
}
