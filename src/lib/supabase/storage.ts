import { createServerClient } from "./server"

export async function uploadPitchDeck(
  file: File,
  startupId: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createServerClient()
  const ext = file.name.split(".").pop() ?? "pdf"
  const path = `${startupId}/pitch-deck.${ext}`

  const { error } = await supabase.storage
    .from("pitch-decks")
    .upload(path, file, { upsert: true })

  if (error) return { url: null, error: error.message }

  const { data } = supabase.storage.from("pitch-decks").getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
