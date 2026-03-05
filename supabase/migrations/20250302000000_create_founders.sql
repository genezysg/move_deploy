-- Migration: create founders table
-- Entity: docs/entities/founders.md

create table public.founders (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  founder_name        text not null check (char_length(founder_name) >= 3),
  founder_email       text not null,
  founder_phone       text not null,
  founder_linkedin    text not null check (founder_linkedin like '%linkedin.com/in/%'),

  acquisition_channel text[] not null check (cardinality(acquisition_channel) >= 1),
  internal_referral   boolean not null
);

-- RLS
alter table public.founders enable row level security;

-- Apenas service role pode ler e escrever (acesso via server client)
create policy "service role full access"
  on public.founders
  for all
  to service_role
  using (true)
  with check (true);
