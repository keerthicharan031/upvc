import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

// Check if valid keys are present (not default placeholders)
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  (
    (supabaseAnonKey && supabaseAnonKey !== 'your_anon_key_here' && supabaseAnonKey !== 'your-supabase-anon-key' && supabaseAnonKey.length > 20) ||
    (supabaseServiceKey && supabaseServiceKey.length > 20)
  )
);

// Client-side or Public anon client
let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!supabaseClientInstance) {
    const key = supabaseAnonKey || supabaseServiceKey;
    supabaseClientInstance = createClient(supabaseUrl, key, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClientInstance;
}

// Server-side admin client (uses service role key if available, else anon key)
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  const key = supabaseServiceKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
