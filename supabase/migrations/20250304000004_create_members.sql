-- Migration: create members table
-- Entity: docs/entities/team.md

create table public.members (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),

  startup_id       uuid not null references public.startups(id) on delete cascade,

  member_name      text not null check (char_length(member_name) >= 3),
  prior_experience text not null check (char_length(prior_experience) >= 20),
  member_linkedin  text,
  member_type      text not null,
  member_role      text not null check (char_length(member_role) >= 2)
);

-- RLS
alter table public.members enable row level security;

-- Apenas service role pode ler e escrever (acesso via server client)
create policy "service role full access"
  on public.members
  for all
  to service_role
  using (true)
  with check (true);
