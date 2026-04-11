-- ─── Run this in Supabase SQL Editor ────────────────────────────────────────
-- Enable UUID extension (usually already enabled on Supabase)
create extension if not exists "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  email                 text not null,
  plan                  text not null default 'free' check (plan in ('free', 'pro')),
  daily_calc_count      int  not null default 0,
  daily_reset_date      date,
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  created_at            timestamptz not null default now()
);

-- ─── calculations ────────────────────────────────────────────────────────────
create table if not exists public.calculations (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  product_name   text,
  purchase_price numeric(10,2) not null,
  selling_price  numeric(10,2) not null,
  shipping_cost  numeric(10,2) not null default 0,
  ebay_fees_pct  numeric(5,2)  not null,
  net_profit     numeric(10,2) not null,
  margin_pct     numeric(6,2)  not null,
  roi_pct        numeric(8,2)  not null,
  is_profitable  boolean       not null default false,
  verdict        text          not null check (verdict in ('profitable', 'low_margin', 'loss')),
  created_at     timestamptz   not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index if not exists calculations_user_id_idx on public.calculations(user_id);
create index if not exists calculations_created_at_idx on public.calculations(created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.calculations enable row level security;

-- profiles: users can only see/edit their own profile
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

-- calculations: users can only see/insert/delete their own rows
create policy "calculations: own rows" on public.calculations
  for all using (auth.uid() = user_id);

-- ─── Trigger: auto-create profile on user signup ──────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
