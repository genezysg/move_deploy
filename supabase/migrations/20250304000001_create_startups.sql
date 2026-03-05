-- Migration: create startups table
-- Entity: docs/entities/startups.md

create table public.startups (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  founder_id     uuid not null references public.founders(id) on delete cascade,

  startup_name   text not null check (char_length(startup_name) >= 2),
  startup_cnpj   text,
  founding_year  integer not null check (founding_year >= 1900 and founding_year <= 2100),
  city_state     text not null check (char_length(city_state) >= 3),
  social_profile text not null,
  sector         text not null,
  stage          text not null
);

-- RLS
alter table public.startups enable row level security;

-- Apenas service role pode ler e escrever (acesso via server client)
create policy "service role full access"
  on public.startups
  for all
  to service_role
  using (true)
  with check (true);
