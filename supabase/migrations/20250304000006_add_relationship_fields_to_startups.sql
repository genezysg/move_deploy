-- Migration: add relationship fields to startups
-- Entity: docs/entities/relationship.md

alter table public.startups
  add column motivation            text not null default '',
  add column development_areas     text not null default '',
  add column main_expectation      text not null default '',
  add column dedicated_members     text[] not null default '{}',
  add column accepted_terms        boolean not null default false,
  add column attested_truthfulness boolean not null default false;

-- Remove defaults used only for backfill
alter table public.startups
  alter column motivation            drop default,
  alter column development_areas     drop default,
  alter column main_expectation      drop default,
  alter column dedicated_members     drop default,
  alter column accepted_terms        drop default,
  alter column attested_truthfulness drop default;
