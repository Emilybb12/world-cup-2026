import { useState, useEffect, useCallback } from 'react';

export type MatchStatus =
  | 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED'
  | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED';

export interface ScoreMatch {
  id: number;
  status: MatchStatus;
  utcDate: string;
  minute: number | null;
  stage: string;
  group: string | null;
  homeTeam: { name: string; shortName: string; };
  awayTeam: { name: string; shortName: string; };
  score: {
    home: number | null;
    away: number | null;
    halfHome: number | null;
    halfAway: number | null;
  };
}

function dateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function useScores() {
  const [matches, setMatches] = useState<ScoreMatch[]>([]);
  const [hasCreds, setHasCreds] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    const token = import.meta.env.VITE_FD_TOKEN as string | undefined;
    if (!token) { setLoading(false); return; }
    setHasCreds(true);

    try {
      const from = dateString(-1);  // yesterday
      const to   = dateString(6);   // next 6 days
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${from}&dateTo=${to}`,
        { headers: { 'X-Auth-Token': token } }
      );
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      const raw = (data.matches ?? []) as Array<Record<string, unknown>>;

      setMatches(
        raw.map((m) => {
          const score = m.score as Record<string, Record<string, number | null>>;
          const ft = score?.fullTime ?? {};
          const ht = score?.halfTime ?? {};
          return {
            id: m.id as number,
            status: m.status as MatchStatus,
            utcDate: m.utcDate as string,
            minute: (m.minute as number | null) ?? null,
            stage: (m.stage as string) ?? '',
            group: (m.group as string | null) ?? null,
            homeTeam: m.homeTeam as { name: string; shortName: string },
            awayTeam: m.awayTeam as { name: string; shortName: string },
            score: {
              home: ft.home ?? null,
              away: ft.away ?? null,
              halfHome: ht.home ?? null,
              halfAway: ht.away ?? null,
            },
          };
        })
      );
    } catch {
      // silently fail
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 60_000);
    return () => clearInterval(interval);
  }, [fetchScores]);

  // Matches happening today (local time)
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
  const todayMatches = matches.filter((m) => {
    const local = new Date(m.utcDate).toLocaleDateString('en-CA');
    return local === todayStr;
  });

  return { matches, todayMatches, hasCreds, loading };
}
