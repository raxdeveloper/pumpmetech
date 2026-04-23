
-- Enums
do $$ begin
  create type public.badge_tier as enum ('Bronze','Silver','Gold','Platinum','Graduate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.momentum_trend as enum ('rising','stable','falling','up','down');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.challenge_status as enum ('active','completed','failed','disputed');
exception when duplicate_object then null; end $$;

-- creators
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  display_name text not null,
  token_symbol text not null,
  initials text not null,
  avatar_color text not null default '#9945FF',
  x_handle text,
  x_verified boolean not null default false,
  bio text,
  momentum_score int not null default 0,
  momentum_trend public.momentum_trend not null default 'stable',
  momentum_reasoning text,
  badge_tier public.badge_tier not null default 'Bronze',
  badge_metadata_uri text,
  price_sol numeric not null default 0,
  price_change_24h numeric not null default 0,
  price_history numeric[] not null default '{}',
  supply numeric not null default 0,
  sol_reserves numeric not null default 0,
  market_cap_sol numeric not null default 0,
  holder_count int not null default 0,
  volume_sol numeric not null default 0,
  challenge_completions int not null default 0,
  is_graduated boolean not null default false,
  last_scored_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creators_momentum_idx on public.creators (momentum_score desc);
create index if not exists creators_volume_idx on public.creators (volume_sol desc);

-- price_history
create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  price_sol numeric not null,
  supply numeric not null,
  market_cap_sol numeric not null,
  volume_1h numeric not null default 0,
  recorded_at timestamptz not null default now()
);
create index if not exists price_history_creator_time_idx on public.price_history (creator_id, recorded_at desc);

-- challenges
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  on_chain_id bigint,
  title text not null,
  description text,
  reward_bps int not null check (reward_bps between 100 and 1000),
  deadline timestamptz not null,
  status public.challenge_status not null default 'active',
  stake_yes_sol numeric not null default 0,
  stake_no_sol numeric not null default 0,
  proof_url text,
  ai_confidence int,
  ai_reasoning text,
  ai_recommendation text,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists challenges_creator_idx on public.challenges (creator_id, deadline);
create index if not exists challenges_status_idx on public.challenges (status, deadline);

-- on_chain_events
create table if not exists public.on_chain_events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete cascade,
  event_type text not null,
  wallet text,
  sol_amount numeric,
  token_amount numeric,
  signature text,
  metadata jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists events_creator_time_idx on public.on_chain_events (creator_id, occurred_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists creators_set_updated_at on public.creators;
create trigger creators_set_updated_at before update on public.creators
  for each row execute function public.set_updated_at();

-- RLS: public read, no public writes (edge functions use service role)
alter table public.creators enable row level security;
alter table public.price_history enable row level security;
alter table public.challenges enable row level security;
alter table public.on_chain_events enable row level security;

drop policy if exists "creators public read" on public.creators;
create policy "creators public read" on public.creators for select using (true);

drop policy if exists "price_history public read" on public.price_history;
create policy "price_history public read" on public.price_history for select using (true);

drop policy if exists "challenges public read" on public.challenges;
create policy "challenges public read" on public.challenges for select using (true);

drop policy if exists "events public read" on public.on_chain_events;
create policy "events public read" on public.on_chain_events for select using (true);

-- Realtime
alter publication supabase_realtime add table public.creators;
alter publication supabase_realtime add table public.price_history;
alter publication supabase_realtime add table public.challenges;
alter publication supabase_realtime add table public.on_chain_events;
