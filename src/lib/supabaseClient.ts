// src/lib/supabaseClient.ts
/**
 * Supabase Client (Browser)
 * 
 * Creates a Supabase client for browser-side authentication and queries.
 * SECURITY: Only uses NEXT_PUBLIC_SUPABASE_ANON_KEY - never the service role key.
 * 
 * The anon key is safe to expose in the browser and is restricted by RLS policies.
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
