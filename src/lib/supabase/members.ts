import { createServerClient } from "./server"
import type { MemberInsert } from "./types"

export async function insertMembers(
  members: MemberInsert[]
): Promise<{ error: string | null }> {
  const supabase = createServerClient()

  const { error } = await supabase.from("members").insert(members)

  if (error) return { error: error.message }
  return { error: null }
}
