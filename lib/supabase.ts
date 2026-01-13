
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Access env safely to prevent crash if import.meta.env is undefined
const env = (import.meta as any).env;
const supabaseUrl = env?.VITE_SUPABASE_URL;
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY;

// Use 'any' schema to allow any table/row operations without strict validation errors.
// This resolves TS2769 errors where tables are inferred as 'never' type.
export type Database = any;

let supabase: SupabaseClient<any, "public", any> | null = null;

if (supabaseUrl && supabaseAnonKey) {
    // We do not pass a generic to createClient, letting it default to 'any' schema
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase credentials missing. Using local mock data.");
}

export { supabase };
