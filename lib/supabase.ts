
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Access env safely to prevent crash if import.meta.env is undefined
const env = (import.meta as any).env;
const supabaseUrl = env?.VITE_SUPABASE_URL;
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY;

// Define a loose schema to prevent "Type is not assignable to never" errors in strict mode.
// This allows specific interfaces (UserProfile, Vendor) to be passed to insert/update methods.
export type Database = {
  public: {
    Tables: {
      users: { Row: any; Insert: any; Update: any };
      vendors: { Row: any; Insert: any; Update: any };
      inquiries: { Row: any; Insert: any; Update: any };
      settings: { Row: any; Insert: any; Update: any };
    };
  };
};

let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase credentials missing. Using local mock data.");
}

export { supabase };
