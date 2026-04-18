import { useState, useEffect, useCallback } from 'react';

export type MatchStatus =
  | 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED'
  | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED';

export interface ScoreMatch {
  id: number;
  status: MatchStatus;
  utcDate: string;
  minute: number | null;
  homeTeam: { name: string; shortName: string; };
  awayTeam: { name: string; shortName: string; };
  score: { home: number | null; away: number | null; };
}

export function useScores() {
  const [matches, setMatches] = useState<ScoreMatch[]>([]);
  const [hasCreds, setHasCreds] = useState(false);

  const fetchScores = useCallback(async () => {
    const token = import.meta.env.VITE_FD_TOKEN as string | undefined;
    if (!token) return;
    setHasCreds(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${today}&dateTo=${today}`,
        { headers: { 'X-Auth-Token': token } }
      );
      if (!res.ok) return;
      const data = await res.json();
      const raw = (data.matches ?? []) as Array<Record<string, unknown>>;
      setMatches(
        raw.map((m) => {
          const score = m.score as Record<string, Record<string, number | null>>;
          const ft = score?.fullTime ?? {};
          return {
            id: m.id as number,
            status: m.status as MatchStatus,
            utcDate: m.utcDate as string,
            minute: (m.minute as number | null) ?? null,
            homeTeam: m.homeTeam as { name: string; shortName: string },
            awayTeam: m.awayTeam as { name: string; shortName: string },
            score: { home: ft.home ?? null, away: ft.away ?? null },
          };
        })
      );
    } catch {
      // silently fail — scores are best-effort
    }
  }, []);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 60_000);
    return () => clearInterval(interval);
  }, [fetchScores]);

  return { matches, hasCreds };
}
