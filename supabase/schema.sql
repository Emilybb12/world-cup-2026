-- ============================================================
-- World Cup 2026 Bracket App — Supabase Schema
-- Run this in the Supabase SQL editor to set up your database
-- ============================================================

-- Profiles (one per auth user)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique,
  created_at  timestamptz not null default now()
);

-- Leagues
create table if not exists public.leagues (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  invite_code  text not null unique default upper(substring(md5(random()::text) from 1 for 6)),
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- League membership
create table if not exists public.league_members (
  league_id  uuid not null references public.leagues(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (league_id, user_id)
);

-- Picks (one row per user per league)
create table if not exists public.picks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  league_id       uuid not null references public.leagues(id) on delete cascade,
  group_picks     jsonb not null default '{}',
  wildcard_picks  jsonb not null default '[]',
  knockout_picks  jsonb not null default '{"r32":{},"r16":{},"qf":{},"sf":{},"final":null}',
  updated_at      timestamptz not null default now(),
  unique (user_id, league_id)
);

-- ── Row Level Security ──────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.leagues        enable row level security;
alter table public.league_members enable row level security;
alter table public.picks          enable row level security;

-- profiles
create policy "Anyone can view profiles"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- leagues: readable by members; joinable by invite code lookup (select is open, but
-- we scope sensitive data in the app layer via invite code)
create policy "League members can view leagues"
  on public.leagues for select using (
    id in (select league_id from public.league_members where user_id = auth.uid())
  );

create policy "Authenticated users can create leagues"
  on public.leagues for insert with check (
    auth.uid() is not null and auth.uid() = created_by
  );

create policy "League creator can update league"
  on public.leagues for update using (auth.uid() = created_by);

-- Separate policy so invite-code lookup works before membership exists
create policy "Anyone can look up a league by invite code"
  on public.leagues for select using (true);

-- league_members
create policy "Members can view membership of their leagues"
  on public.league_members for select using (
    league_id in (select league_id from public.league_members where user_id = auth.uid())
  );

create policy "Users can join a league"
  on public.league_members for insert with check (auth.uid() = user_id);

create policy "Users can leave a league"
  on public.league_members for delete using (auth.uid() = user_id);

-- picks
create policy "League members can view all picks in their leagues"
  on public.picks for select using (
    league_id in (select league_id from public.league_members where user_id = auth.uid())
  );

create policy "Users can insert own picks"
  on public.picks for insert with check (auth.uid() = user_id);

create policy "Users can update own picks"
  on public.picks for update using (auth.uid() = user_id);

-- ── Trigger: auto-create profile on signup ─────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
