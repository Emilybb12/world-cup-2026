import type { Group, BracketMatch } from '../types';

export const GROUPS: Group[] = [
  { id: 'A', teams: ['Mexico', 'South Korea', 'Czechia', 'South Africa'] },
  { id: 'B', teams: ['Switzerland', 'Canada', 'Qatar', 'Bosnia and Herzegovina'] },
  { id: 'C', teams: ['Brazil', 'Morocco', 'Scotland', 'Haiti'] },
  { id: 'D', teams: ['United States', 'Paraguay', 'Australia', 'Türkiye'] },
  { id: 'E', teams: ['Germany', 'Ivory Coast', 'Curaçao', 'Ecuador'] },
  { id: 'F', teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  { id: 'G', teams: ['Belgium', 'Iran', 'Egypt', 'New Zealand'] },
  { id: 'H', teams: ['Spain', 'Uruguay', 'Saudi Arabia', 'Cape Verde'] },
  { id: 'I', teams: ['France', 'Senegal', 'Norway', 'Iraq'] },
  { id: 'J', teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { id: 'K', teams: ['Portugal', 'Colombia', 'Congo', 'Uzbekistan'] },
  { id: 'L', teams: ['England', 'Croatia', 'Panama', 'Ghana'] },
];

export const GROUP_IDS = GROUPS.map((g) => g.id);

// Team flag emojis lookup
export const TEAM_FLAGS: Record<string, string> = {
  'Mexico': '🇲🇽',
  'South Korea': '🇰🇷',
  'Czechia': '🇨🇿',
  'South Africa': '🇿🇦',
  'Switzerland': '🇨🇭',
  'Canada': '🇨🇦',
  'Qatar': '🇶🇦',
  'Bosnia and Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷',
  'Morocco': '🇲🇦',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Haiti': '🇭🇹',
  'United States': '🇺🇸',
  'Paraguay': '🇵🇾',
  'Australia': '🇦🇺',
  'Türkiye': '🇹🇷',
  'Germany': '🇩🇪',
  'Ivory Coast': '🇨🇮',
  'Curaçao': '🇨🇼',
  'Ecuador': '🇪🇨',
  'Netherlands': '🇳🇱',
  'Japan': '🇯🇵',
  'Sweden': '🇸🇪',
  'Tunisia': '🇹🇳',
  'Belgium': '🇧🇪',
  'Iran': '🇮🇷',
  'Egypt': '🇪🇬',
  'New Zealand': '🇳🇿',
  'Spain': '🇪🇸',
  'Uruguay': '🇺🇾',
  'Saudi Arabia': '🇸🇦',
  'Cape Verde': '🇨🇻',
  'France': '🇫🇷',
  'Senegal': '🇸🇳',
  'Norway': '🇳🇴',
  'Iraq': '🇮🇶',
  'Argentina': '🇦🇷',
  'Algeria': '🇩🇿',
  'Austria': '🇦🇹',
  'Jordan': '🇯🇴',
  'Portugal': '🇵🇹',
  'Colombia': '🇨🇴',
  'Congo': '🇨🇩',
  'Uzbekistan': '🇺🇿',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Croatia': '🇭🇷',
  'Panama': '🇵🇦',
  'Ghana': '🇬🇭',
};

/**
 * Round of 32 — 16 matches.
 * Matches 0–11: group winners vs runners-up from paired groups.
 * Matches 12–15: wildcards (2 slots each, filled from wildcard_picks[0..7]).
 *
 * Pairing logic (group leaders play runners-up from the partner group):
 *   Pair 1 — A & D   Pair 2 — B & E   Pair 3 — C & F
 *   Pair 4 — G & J   Pair 5 — H & K   Pair 6 — I & L
 */
export const R32_MATCHES: BracketMatch[] = [
  // Pair 1: A & D
  { id: 0,  homeSource: { type: 'group', group: 'A', position: 'first' },  awaySource: { type: 'group', group: 'D', position: 'second' } },
  { id: 1,  homeSource: { type: 'group', group: 'D', position: 'first' },  awaySource: { type: 'group', group: 'A', position: 'second' } },
  // Pair 2: B & E
  { id: 2,  homeSource: { type: 'group', group: 'B', position: 'first' },  awaySource: { type: 'group', group: 'E', position: 'second' } },
  { id: 3,  homeSource: { type: 'group', group: 'E', position: 'first' },  awaySource: { type: 'group', group: 'B', position: 'second' } },
  // Pair 3: C & F
  { id: 4,  homeSource: { type: 'group', group: 'C', position: 'first' },  awaySource: { type: 'group', group: 'F', position: 'second' } },
  { id: 5,  homeSource: { type: 'group', group: 'F', position: 'first' },  awaySource: { type: 'group', group: 'C', position: 'second' } },
  // Pair 4: G & J
  { id: 6,  homeSource: { type: 'group', group: 'G', position: 'first' },  awaySource: { type: 'group', group: 'J', position: 'second' } },
  { id: 7,  homeSource: { type: 'group', group: 'J', position: 'first' },  awaySource: { type: 'group', group: 'G', position: 'second' } },
  // Pair 5: H & K
  { id: 8,  homeSource: { type: 'group', group: 'H', position: 'first' },  awaySource: { type: 'group', group: 'K', position: 'second' } },
  { id: 9,  homeSource: { type: 'group', group: 'K', position: 'first' },  awaySource: { type: 'group', group: 'H', position: 'second' } },
  // Pair 6: I & L
  { id: 10, homeSource: { type: 'group', group: 'I', position: 'first' },  awaySource: { type: 'group', group: 'L', position: 'second' } },
  { id: 11, homeSource: { type: 'group', group: 'L', position: 'first' },  awaySource: { type: 'group', group: 'I', position: 'second' } },
  // Wildcard matches (wildcards 0–7 fill these 4 games)
  { id: 12, homeSource: { type: 'wildcard', wcIndex: 0 }, awaySource: { type: 'wildcard', wcIndex: 1 } },
  { id: 13, homeSource: { type: 'wildcard', wcIndex: 2 }, awaySource: { type: 'wildcard', wcIndex: 3 } },
  { id: 14, homeSource: { type: 'wildcard', wcIndex: 4 }, awaySource: { type: 'wildcard', wcIndex: 5 } },
  { id: 15, homeSource: { type: 'wildcard', wcIndex: 6 }, awaySource: { type: 'wildcard', wcIndex: 7 } },
];

// R16: winners of R32 matches bracket together
export const R16_MATCHES: BracketMatch[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  homeSource: { type: 'winner' as const, round: 'r32' as const, matchIndex: i * 2 },
  awaySource: { type: 'winner' as const, round: 'r32' as const, matchIndex: i * 2 + 1 },
}));

export const QF_MATCHES: BracketMatch[] = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  homeSource: { type: 'winner' as const, round: 'r16' as const, matchIndex: i * 2 },
  awaySource: { type: 'winner' as const, round: 'r16' as const, matchIndex: i * 2 + 1 },
}));

export const SF_MATCHES: BracketMatch[] = Array.from({ length: 2 }, (_, i) => ({
  id: i,
  homeSource: { type: 'winner' as const, round: 'qf' as const, matchIndex: i * 2 },
  awaySource: { type: 'winner' as const, round: 'qf' as const, matchIndex: i * 2 + 1 },
}));

export const FINAL_MATCH: BracketMatch = {
  id: 0,
  homeSource: { type: 'winner', round: 'sf', matchIndex: 0 },
  awaySource: { type: 'winner', round: 'sf', matchIndex: 1 },
};

export const ROUND_LABELS: Record<string, string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-Finals',
  sf: 'Semi-Finals',
  final: 'Final',
};
