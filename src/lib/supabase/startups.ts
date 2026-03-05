import { createServerClient } from "./server"
import type { StartupInsert, StartupRow } from "./types"

export type InsertStartupResult =
  | { data: StartupRow; error: null }
  | { data: null; error: string }

export async function insertStartup(
  payload: StartupInsert
): Promise<InsertStartupResult> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("startups")
    .insert(payload)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as StartupRow, error: null }
}
