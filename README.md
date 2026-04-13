# 2026 FIFA World Cup Bracket Predictor — Em & Ro

A real-time bracket prediction app for two players built with React + Vite, Supabase, and Tailwind CSS.

## Features

- **Player selector** — toggle between Em and Ro views
- **Group Stage** — pick 1st, 2nd, and 3rd (wildcard) place for all 12 groups (A–L)
- **Wildcard Selection** — choose 8 of the 12 third-place finishers to advance
- **Knockout Bracket** — Round of 32 → R16 → QF → SF → Final; auto-populates from group picks, click to advance teams
- **Leaderboard** — completion %, champion picks, side-by-side group comparison
- **Live sync** — all picks saved to Supabase and synced in real time between both players

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd world-cup-2026
npm install
```

### 2. Supabase setup

#### 2a. Create a project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon/public API key** from **Settings → API**.

#### 2b. Create the database table

In your Supabase dashboard, open the **SQL Editor** and run:

```sql
-- Create the picks table (one row per player)
CREATE TABLE IF NOT EXISTS public.player_picks (
  player       TEXT PRIMARY KEY CHECK (player IN ('em', 'ro')),
  group_picks  JSONB NOT NULL DEFAULT '{}',
  wildcard_picks JSONB NOT NULL DEFAULT '[]',
  knockout_picks JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed empty rows so real-time subscriptions fire on UPDATE (not just INSERT)
INSERT INTO public.player_picks (player) VALUES ('em'), ('ro')
ON CONFLICT (player) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.player_picks ENABLE ROW LEVEL SECURITY;

-- Allow anyone with the anon key to read and write
-- (both players share the same anonymous access)
CREATE POLICY "Allow all reads"  ON public.player_picks FOR SELECT USING (true);
CREATE POLICY "Allow all writes" ON public.player_picks FOR ALL    USING (true) WITH CHECK (true);
```

#### 2c. Enable Realtime

In your Supabase dashboard:

1. Go to **Database → Replication**.
2. Under **Supabase Realtime**, make sure **player_picks** is toggled **on**.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. When asked about the framework, select **Vite**.

### Option B — GitHub integration

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects Vite. Leave build settings as default.
4. Add environment variables under **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

The `vercel.json` at the root rewrites all routes to `index.html` for client-side routing.

---

## Project structure

```
src/
├── components/
│   ├── GroupCard.tsx        # Single group pick UI
│   ├── GroupStage.tsx       # All 12 groups + progress
│   ├── KnockoutBracket.tsx  # Full bracket with inline wildcard picker
│   ├── WildcardPicker.tsx   # Select 8 of 12 third-place teams
│   ├── Leaderboard.tsx      # Stats, champion, comparison table
│   └── PlayerSelector.tsx   # Em / Ro toggle
├── hooks/
│   └── usePicks.ts          # All Supabase reads, writes, real-time sync
├── lib/
│   └── supabase.ts          # Supabase client
├── data/
│   └── tournament.ts        # Groups, teams, bracket structure, flags
└── types/
    └── index.ts             # Shared TypeScript types
```

## Bracket structure

| Round | Matches | Notes |
|---|---|---|
| Round of 32 | 16 | 12 group matchups + 4 wildcard games |
| Round of 16 | 8 | Winners of R32 |
| Quarter-Finals | 4 | Winners of R16 |
| Semi-Finals | 2 | Winners of QF |
| Final | 1 | Champion |

Groups are paired for the R32: **A–D**, **B–E**, **C–F**, **G–J**, **H–K**, **I–L**.
