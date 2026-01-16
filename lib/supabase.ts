
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Access env safely to prevent crash if import.meta.env is undefined
// We trim() values to avoid issues if you accidentally copy a space in Vercel dashboard
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL ? String(env.VITE_SUPABASE_URL).trim() : '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ? String(env.VITE_SUPABASE_ANON_KEY).trim() : '';

// Use 'any' schema to allow any table/row operations without strict validation errors.
export type Database = any;

let supabase: SupabaseClient<any, "public", any> | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Only warn in development, or if explicitly missing in prod
    console.warn("Supabase credentials missing. App running in mock mode.");
}

export { supabase };
