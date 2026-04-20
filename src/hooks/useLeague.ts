import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { League, LeagueMember } from '../types';

export function useUserLeagues(userId: string | null) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeagues = useCallback(async () => {
    if (!userId) { setLeagues([]); setLoading(false); return; }

    const { data } = await supabase
      .from('league_members')
      .select('league_id, leagues(*)')
      .eq('user_id', userId);

    const joined = (data ?? []).map((row: Record<string, unknown>) => row.leagues as League).filter(Boolean);
    setLeagues(joined);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchLeagues(); }, [fetchLeagues]);

  return { leagues, loading, refetch: fetchLeagues };
}

export function useLeague(leagueId: string | null, userId: string | null) {
  const [league, setLeague] = useState<League | null>(null);
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leagueId || !userId) { setLoading(false); return; }

    async function load() {
      const [leagueRes, membersRes] = await Promise.all([
        supabase.from('leagues').select('*').eq('id', leagueId).single(),
        supabase
          .from('league_members')
          .select('league_id, user_id, joined_at, profiles(username)')
          .eq('league_id', leagueId),
      ]);

      setLeague(leagueRes.data as League | null);

      const rawMembers = (membersRes.data ?? []) as Array<{
        league_id: string;
        user_id: string;
        joined_at: string;
        profiles: { username: string } | null;
      }>;
      setMembers(
        rawMembers.map((m) => ({
          league_id: m.league_id,
          user_id: m.user_id,
          username: m.profiles?.username ?? 'Unknown',
          joined_at: m.joined_at,
        }))
      );
      setLoading(false);
    }

    load();
  }, [leagueId, userId]);

  return { league, members, loading };
}

export async function createLeague(
  name: string,
  userId: string
): Promise<{ league: League | null; error: string | null }> {
  const { data: league, error: leagueErr } = await supabase
    .from('leagues')
    .insert({ name, created_by: userId })
    .select()
    .single();

  if (leagueErr || !league) return { league: null, error: leagueErr?.message ?? 'Failed to create league' };

  const { error: memberErr } = await supabase
    .from('league_members')
    .insert({ league_id: league.id, user_id: userId });

  if (memberErr) return { league: null, error: memberErr.message };

  return { league: league as League, error: null };
}

export async function joinLeague(
  inviteCode: string,
  userId: string
): Promise<{ league: League | null; error: string | null }> {
  const { data: league, error: leagueErr } = await supabase
    .from('leagues')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();

  if (leagueErr || !league) return { league: null, error: 'League not found. Check the invite code.' };

  const { error: memberErr } = await supabase
    .from('league_members')
    .insert({ league_id: league.id, user_id: userId });

  if (memberErr) {
    if (memberErr.code === '23505') return { league: league as League, error: 'already_member' };
    return { league: null, error: memberErr.message };
  }

  return { league: league as League, error: null };
}
