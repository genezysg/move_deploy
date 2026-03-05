import { createServerClient } from "./server"
import type { FounderInsert, FounderRow } from "./types"

export type InsertFounderResult =
  | { data: FounderRow; error: null }
  | { data: null; error: string }

export async function insertFounder(
  payload: FounderInsert
): Promise<InsertFounderResult> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("founders")
    .insert(payload)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as FounderRow, error: null }
}
