-- Migration: add referral_name to founders
-- Entity: docs/entities/founders.md

alter table public.founders
  add column referral_name text check (referral_name is null or char_length(referral_name) >= 3);
