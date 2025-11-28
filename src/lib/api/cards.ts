// src/lib/api/cards.ts
import { supabaseServer } from "../supabaseServer"; // your server supabase client

export async function getCardBySlug(slug: string) {
  const { data, error } = await supabaseServer
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
