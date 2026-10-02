import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceRoleKey || config.supabase.anonKey;

/**
 * Checks whether valid Supabase configuration is present in environment variables.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseKey.includes('your-supabase')
  );
};

/**
 * Server-side Supabase client instance.
 * Utilizes the Service Role Key or Anon Key for backend database queries and auth verification.
 */
export const supabaseServer: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);
