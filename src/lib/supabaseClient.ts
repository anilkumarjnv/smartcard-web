// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_* env variables');
}

// Singleton client (prevents multiple clients in dev HMR)
export const supabase = createClient(url, anonKey, {
  auth: {
    // configure if you want cookies/session to work with SSR
  }
});
