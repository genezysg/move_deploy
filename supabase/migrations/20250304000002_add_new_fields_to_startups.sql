-- Migration: add business_description, current_revenue, team_size to startups
-- Entity: docs/entities/startups.md

alter table public.startups
  add column business_description text not null default '',
  add column current_revenue       text,
  add column team_size             integer not null default 1 check (team_size >= 1);

-- Remove defaults used only for backfill
alter table public.startups
  alter column business_description drop default,
  alter column team_size             drop default;
