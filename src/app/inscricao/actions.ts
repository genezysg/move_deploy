"use server"

import { insertFounder } from "@/lib/supabase/founders"
import { insertStartup } from "@/lib/supabase/startups"
import { insertMembers } from "@/lib/supabase/members"
import { uploadPitchDeck } from "@/lib/supabase/storage"
import type { FounderInsert, StartupInsert, MemberInsert } from "@/lib/supabase/types"

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string) ?? ""
}

function nullIfEmpty(fd: FormData, key: string): string | null {
  const val = (fd.get(key) as string | null)?.trim()
  return val || null
}

function num(fd: FormData, key: string): number {
  return parseInt(fd.get(key) as string, 10) || 0
}

function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "true"
}

function json<T>(fd: FormData, key: string): T {
  return JSON.parse(fd.get(key) as string) as T
}

export async function submitApplication(formData: FormData) {
  const founderPayload: FounderInsert = {
    founder_name: str(formData, "founder_name"),
    founder_email: str(formData, "founder_email"),
    founder_phone: str(formData, "founder_phone"),
    founder_linkedin: str(formData, "founder_linkedin"),
    acquisition_channel: json<string[]>(formData, "acquisition_channel"),
    internal_referral: bool(formData, "internal_referral"),
    referral_name: nullIfEmpty(formData, "referral_name"),
  }

  const founderResult = await insertFounder(founderPayload)
  if (founderResult.error !== null) {
    console.error("[submitApplication] insertFounder error:", founderResult.error)
    return { error: founderResult.error }
  }

  const startupPayload: StartupInsert = {
    founder_id: founderResult.data.id,
    startup_name: str(formData, "startup_name"),
    startup_cnpj: nullIfEmpty(formData, "startup_cnpj"),
    founding_year: num(formData, "founding_year"),
    city_state: str(formData, "city_state"),
    social_profile: str(formData, "social_profile"),
    sector: str(formData, "sector"),
    stage: str(formData, "stage"),
    business_description: str(formData, "business_description"),
    current_revenue: nullIfEmpty(formData, "current_revenue"),
    team_size: num(formData, "team_size"),
    problem_statement: str(formData, "problem_statement"),
    current_solution: str(formData, "current_solution"),
    competitive_advantage: str(formData, "competitive_advantage"),
    target_audience: str(formData, "target_audience"),
    revenue_model: nullIfEmpty(formData, "revenue_model"),
    active_clients: nullIfEmpty(formData, "active_clients"),
    had_investment_round: bool(formData, "had_investment_round"),
    investment_rounds_count: num(formData, "investment_rounds_count"),
    founders_equity_pct: num(formData, "founders_equity_pct"),
    captable_composition: nullIfEmpty(formData, "captable_composition"),
    pitch_deck_url: null,
    additional_info: nullIfEmpty(formData, "additional_info"),
    motivation: str(formData, "motivation"),
    development_areas: str(formData, "development_areas"),
    main_expectation: str(formData, "main_expectation"),
    dedicated_members: json<string[]>(formData, "dedicated_members"),
    accepted_terms: bool(formData, "accepted_terms"),
    attested_truthfulness: bool(formData, "attested_truthfulness"),
  }

  const startupResult = await insertStartup(startupPayload)
  if (startupResult.error !== null) {
    console.error("[submitApplication] insertStartup error:", startupResult.error)
    return { error: startupResult.error }
  }

  const pitchDeck = formData.get("pitch_deck") as File | null
  if (pitchDeck && pitchDeck.size > 0) {
    const uploadResult = await uploadPitchDeck(pitchDeck, startupResult.data.id)
    if (uploadResult.error) return { error: uploadResult.error }

    const supabase = (await import("@/lib/supabase/server")).createServerClient()
    await supabase
      .from("startups")
      .update({ pitch_deck_url: uploadResult.url })
      .eq("id", startupResult.data.id)
  }

  type RawMember = Pick<MemberInsert, "member_name" | "prior_experience" | "member_linkedin" | "member_type" | "member_role">
  const membersPayload: MemberInsert[] = json<RawMember[]>(formData, "members").map((m) => ({
    startup_id: startupResult.data.id,
    member_name: m.member_name,
    prior_experience: m.prior_experience,
    member_linkedin: m.member_linkedin ?? null,
    member_type: m.member_type,
    member_role: m.member_role,
  }))

  const membersResult = await insertMembers(membersPayload)
  if (membersResult.error) {
    console.error("[submitApplication] insertMembers error:", membersResult.error)
    return { error: membersResult.error }
  }

  return { error: null }
}
