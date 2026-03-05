/** Row retornada pelo Supabase para a tabela `founders` */
export interface FounderRow {
  id: string
  created_at: string
  founder_name: string
  founder_email: string
  founder_phone: string
  founder_linkedin: string
  acquisition_channel: string[]
  internal_referral: boolean
  referral_name: string | null
}

/** Payload para INSERT/UPSERT — sem os campos gerados pelo banco */
export type FounderInsert = Omit<FounderRow, "id" | "created_at">

/** Row retornada pelo Supabase para a tabela `startups` */
export interface StartupRow {
  id: string
  created_at: string
  founder_id: string
  startup_name: string
  startup_cnpj: string | null
  founding_year: number
  city_state: string
  social_profile: string
  sector: string
  stage: string
  business_description: string
  current_revenue: string | null
  team_size: number
  problem_statement: string
  current_solution: string
  competitive_advantage: string
  target_audience: string
  revenue_model: string | null
  active_clients: string | null
  had_investment_round: boolean
  investment_rounds_count: number
  founders_equity_pct: number
  captable_composition: string | null
  pitch_deck_url: string | null
  additional_info: string | null
  motivation: string
  development_areas: string
  main_expectation: string
  dedicated_members: string[]
  accepted_terms: boolean
  attested_truthfulness: boolean
}

/** Payload para INSERT/UPSERT — sem os campos gerados pelo banco */
export type StartupInsert = Omit<StartupRow, "id" | "created_at">

/** Row retornada pelo Supabase para a tabela `members` */
export interface MemberRow {
  id: string
  created_at: string
  startup_id: string
  member_name: string
  prior_experience: string
  member_linkedin: string | null
  member_type: string
  member_role: string
}

/** Payload para INSERT/UPSERT — sem os campos gerados pelo banco */
export type MemberInsert = Omit<MemberRow, "id" | "created_at">
