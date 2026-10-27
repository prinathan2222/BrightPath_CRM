import { supabase } from '../lib/supabaseClient';
import { Profile, UserRole } from '../types/database.types';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error?: string;
}

export interface ProfileResult {
  profile: Profile | null;
  error?: string;
}

/**
 * Sign in with email and password using Supabase Auth
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: data.user, session: data.session };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected authentication error';
    return { user: null, session: null, error: message };
  }
}

/**
 * Sign up a new staff member with email, password, and full name.
 * Default role is counsellor.
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  fullName: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: 'counsellor' as UserRole,
        },
      },
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    // Auto-create/ensure profile row in public.profiles table
    if (data.user) {
      await ensureProfile(data.user, fullName.trim());
    }

    return { user: data.user, session: data.session };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected registration error';
    return { user: null, session: null, error: message };
  }
}

/**
 * Sign out the current user and invalidate the session
 */
export async function signOutUser(): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected sign out error';
    return { error: message };
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Fetch profile for a given user ID
 */
export async function getProfile(userId: string): Promise<ProfileResult> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data as Profile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    return { profile: null, error: message };
  }
}

/**
 * Fallback to ensure a profile exists for the user.
 * If missing, inserts a default 'counsellor' profile.
 */
export async function ensureProfile(user: User, fallbackName?: string): Promise<Profile | null> {
  try {
    // 1. Try to fetch existing profile
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (existing) {
      return existing as Profile;
    }

    // 2. Insert default profile
    const name = fallbackName || 
      user.user_metadata?.full_name || 
      user.email?.split('@')[0] || 
      'Staff Member';

    const newProfile: Omit<Profile, 'created_at' | 'updated_at'> = {
      id: user.id,
      full_name: name,
      role: 'counsellor',
    };

    const { data: created, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.warn('Could not auto-provision profile:', error.message);
      return null;
    }

    return created as Profile;
  } catch (err) {
    console.warn('ensureProfile exception:', err);
    return null;
  }
}

/**
 * Listen to auth state transitions (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
 */
export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
