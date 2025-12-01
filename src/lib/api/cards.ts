// src/lib/api/cards.ts
import { createClient } from "../supabaseServer";

export async function getCardBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
}
