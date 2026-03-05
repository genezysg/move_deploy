-- Migration: add corporate fields to startups + create pitch-decks storage bucket
-- Entity: docs/entities/corporate.md

alter table public.startups
  add column had_investment_round   boolean not null default false,
  add column investment_rounds_count integer not null default 0 check (investment_rounds_count >= 0),
  add column founders_equity_pct    integer not null default 0 check (founders_equity_pct between 1 and 100),
  add column captable_composition   text,
  add column pitch_deck_url         text,
  add column additional_info        text;

-- Remove defaults used only for backfill
alter table public.startups
  alter column had_investment_round    drop default,
  alter column investment_rounds_count drop default,
  alter column founders_equity_pct     drop default;

-- Storage bucket para pitch decks
insert into storage.buckets (id, name, public)
values ('pitch-decks', 'pitch-decks', true)
on conflict (id) do nothing;

-- Apenas service role pode fazer upload
create policy "service role storage access"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'pitch-decks')
  with check (bucket_id = 'pitch-decks');
