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
 * Round of 32 — 16 matches (Match numbers 73–88 per FIFA schedule).
 *
 * Key rules per FIFA regulations:
 *   - Group winners never face each other in R32
 *   - Third-place (wildcard) teams always face group winners
 *   - Some R32 matches are runner-up vs runner-up
 *
 * Wildcard assignments (which group winner each 3rd-place team faces):
 *   wcIndex 0 → E1 (M74)   wcIndex 1 → I1 (M77)
 *   wcIndex 2 → A1 (M79)   wcIndex 3 → L1 (M80)
 *   wcIndex 4 → D1 (M81)   wcIndex 5 → G1 (M82)
 *   wcIndex 6 → B1 (M85)   wcIndex 7 → K1 (M87)
 *
 * Note: In reality the exact wildcard-to-winner assignment depends on which 8 of
 * 12 third-place teams qualify (495 pre-planned scenarios). This is a reasonable
 * approximation for a prediction bracket.
 */
export const R32_MATCHES: BracketMatch[] = [
  // Match 73: Runner-up A vs Runner-up B
  { id: 0,  homeSource: { type: 'group', group: 'A', position: 'second' }, awaySource: { type: 'group', group: 'B', position: 'second' } },
  // Match 74: Winner E vs Best 3rd (wcIndex 0)
  { id: 1,  homeSource: { type: 'group', group: 'E', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 0 } },
  // Match 75: Winner F vs Runner-up C
  { id: 2,  homeSource: { type: 'group', group: 'F', position: 'first' },  awaySource: { type: 'group', group: 'C', position: 'second' } },
  // Match 76: Winner C vs Runner-up F
  { id: 3,  homeSource: { type: 'group', group: 'C', position: 'first' },  awaySource: { type: 'group', group: 'F', position: 'second' } },
  // Match 77: Winner I vs Best 3rd (wcIndex 1)
  { id: 4,  homeSource: { type: 'group', group: 'I', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 1 } },
  // Match 78: Runner-up E vs Runner-up I
  { id: 5,  homeSource: { type: 'group', group: 'E', position: 'second' }, awaySource: { type: 'group', group: 'I', position: 'second' } },
  // Match 79: Winner A vs Best 3rd (wcIndex 2)
  { id: 6,  homeSource: { type: 'group', group: 'A', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 2 } },
  // Match 80: Winner L vs Best 3rd (wcIndex 3)
  { id: 7,  homeSource: { type: 'group', group: 'L', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 3 } },
  // Match 81: Winner D vs Best 3rd (wcIndex 4)
  { id: 8,  homeSource: { type: 'group', group: 'D', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 4 } },
  // Match 82: Winner G vs Best 3rd (wcIndex 5)
  { id: 9,  homeSource: { type: 'group', group: 'G', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 5 } },
  // Match 83: Runner-up K vs Runner-up L
  { id: 10, homeSource: { type: 'group', group: 'K', position: 'second' }, awaySource: { type: 'group', group: 'L', position: 'second' } },
  // Match 84: Winner H vs Runner-up J
  { id: 11, homeSource: { type: 'group', group: 'H', position: 'first' },  awaySource: { type: 'group', group: 'J', position: 'second' } },
  // Match 85: Winner B vs Best 3rd (wcIndex 6)
  { id: 12, homeSource: { type: 'group', group: 'B', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 6 } },
  // Match 86: Winner J vs Runner-up H
  { id: 13, homeSource: { type: 'group', group: 'J', position: 'first' },  awaySource: { type: 'group', group: 'H', position: 'second' } },
  // Match 87: Winner K vs Best 3rd (wcIndex 7)
  { id: 14, homeSource: { type: 'group', group: 'K', position: 'first' },  awaySource: { type: 'wildcard', wcIndex: 7 } },
  // Match 88: Runner-up D vs Runner-up G
  { id: 15, homeSource: { type: 'group', group: 'D', position: 'second' }, awaySource: { type: 'group', group: 'G', position: 'second' } },
];

/**
 * Round of 16 — 8 matches (Match numbers 89–96).
 * Pairings are NOT simply adjacent R32 matches.
 *
 *   M89 (id 0): Winner M74 (id 1) vs Winner M77 (id 4)
 *   M90 (id 1): Winner M73 (id 0) vs Winner M75 (id 2)
 *   M91 (id 2): Winner M76 (id 3) vs Winner M78 (id 5)
 *   M92 (id 3): Winner M79 (id 6) vs Winner M80 (id 7)
 *   M93 (id 4): Winner M83 (id 10) vs Winner M84 (id 11)
 *   M94 (id 5): Winner M81 (id 8) vs Winner M82 (id 9)
 *   M95 (id 6): Winner M86 (id 13) vs Winner M88 (id 15)
 *   M96 (id 7): Winner M85 (id 12) vs Winner M87 (id 14)
 */
export const R16_MATCHES: BracketMatch[] = [
  { id: 0, homeSource: { type: 'winner', round: 'r32', matchIndex: 1  }, awaySource: { type: 'winner', round: 'r32', matchIndex: 4  } },
  { id: 1, homeSource: { type: 'winner', round: 'r32', matchIndex: 0  }, awaySource: { type: 'winner', round: 'r32', matchIndex: 2  } },
  { id: 2, homeSource: { type: 'winner', round: 'r32', matchIndex: 3  }, awaySource: { type: 'winner', round: 'r32', matchIndex: 5  } },
  { id: 3, homeSource: { type: 'winner', round: 'r32', matchIndex: 6  }, awaySource: { type: 'winner', round: 'r32', matchIndex: 7  } },
  { id: 4, homeSource: { type: 'winner', round: 'r32', matchIndex: 10 }, awaySource: { type: 'winner', round: 'r32', matchIndex: 11 } },
  { id: 5, homeSource: { type: 'winner', round: 'r32', matchIndex: 8  }, awaySource: { type: 'winner', round: 'r32', matchIndex: 9  } },
  { id: 6, homeSource: { type: 'winner', round: 'r32', matchIndex: 13 }, awaySource: { type: 'winner', round: 'r32', matchIndex: 15 } },
  { id: 7, homeSource: { type: 'winner', round: 'r32', matchIndex: 12 }, awaySource: { type: 'winner', round: 'r32', matchIndex: 14 } },
];

// QF: adjacent R16 pairs (M97–M100)
export const QF_MATCHES: BracketMatch[] = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  homeSource: { type: 'winner' as const, round: 'r16' as const, matchIndex: i * 2 },
  awaySource: { type: 'winner' as const, round: 'r16' as const, matchIndex: i * 2 + 1 },
}));

// SF: adjacent QF pairs (M101–M102)
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
