-- Migration: add business model fields to startups
-- Entity: docs/entities/business.md

alter table public.startups
  add column problem_statement      text not null default '',
  add column current_solution       text not null default '',
  add column competitive_advantage  text not null default '',
  add column target_audience        text not null default '',
  add column revenue_model          text,
  add column active_clients         text;

-- Remove defaults used only for backfill
alter table public.startups
  alter column problem_statement     drop default,
  alter column current_solution      drop default,
  alter column competitive_advantage drop default,
  alter column target_audience       drop default;
