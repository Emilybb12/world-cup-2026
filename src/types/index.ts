export type Player = 'em' | 'ro';
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

export interface PlayerPicks {
  player: Player;
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
