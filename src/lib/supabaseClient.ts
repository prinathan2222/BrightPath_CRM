import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable extraction
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

export interface ConfigStatus {
  isConfigured: boolean;
  url: string;
  hasKey: boolean;
  isServiceRoleDetected: boolean;
  issues: string[];
}

/**
 * Checks whether the Supabase environment is properly configured
 * with realistic credentials rather than empty strings or default placeholders.
 */
export function checkSupabaseConfig(): ConfigStatus {
  const issues: string[] = [];

  const isUrlMissing = !supabaseUrl || supabaseUrl.includes('your-project-id');
  const isKeyMissing = !supabaseAnonKey || supabaseAnonKey.includes('your-public-client');
  const isServiceRole = supabaseAnonKey.includes('service_role');

  if (isUrlMissing) {
    issues.push('Missing or placeholder VITE_SUPABASE_URL');
  } else if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    issues.push('VITE_SUPABASE_URL should be a valid URL formatted like https://xyz.supabase.co');
  }

  if (isKeyMissing) {
    issues.push('Missing or placeholder VITE_SUPABASE_ANON_KEY');
  }

  if (isServiceRole) {
    issues.push('SECURITY WARNING: Service-role key detected! Use only the public anon key.');
  }

  const isConfigured = !isUrlMissing && !isKeyMissing && !isServiceRole;

  return {
    isConfigured,
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey && !isKeyMissing,
    isServiceRoleDetected: isServiceRole,
    issues
  };
}

export const configStatus = checkSupabaseConfig();

/**
 * Single-instance Supabase Client
 * Falls back safely to a placeholder instance to avoid unhandled import crashes.
 */
export const supabase: SupabaseClient = createClient(
  configStatus.isConfigured ? supabaseUrl : 'https://placeholder-instance.supabase.co',
  configStatus.isConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
