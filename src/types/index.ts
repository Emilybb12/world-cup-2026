export type RoundKey = 'r32' | 'r16' | 'qf' | 'sf' | 'final';

export interface Group {
  id: string;
  teams: string[];
}

export interface GroupPick {
  first: string | null;
  second: string | null;
  third: string | null;
}

export type GroupPicks = Record<string, GroupPick>;

// knockout_picks stores the WINNER of each match slot per round
export interface KnockoutPicks {
  r32: Record<number, string | null>;
  r16: Record<number, string | null>;
  qf: Record<number, string | null>;
  sf: Record<number, string | null>;
  final: string | null;
}

export interface UserPicks {
  user_id: string;
  league_id: string;
  username: string;
  group_picks: GroupPicks;
  wildcard_picks: string[]; // 8 teams chosen from 12 third-place finishers
  knockout_picks: KnockoutPicks;
  updated_at?: string;
}

// Describes one side of a bracket match (which source feeds this slot)
export type SlotSource =
  | { type: 'group'; group: string; position: 'first' | 'second' }
  | { type: 'wildcard'; wcIndex: number }
  | { type: 'winner'; round: RoundKey; matchIndex: number };

export interface BracketMatch {
  id: number;
  homeSource: SlotSource;
  awaySource: SlotSource;
}

// Auth / league types
export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export interface League {
  id: string;
  name: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface LeagueMember {
  league_id: string;
  user_id: string;
  username: string;
  joined_at: string;
}
