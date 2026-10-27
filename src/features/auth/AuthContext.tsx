import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Profile, UserRole } from '../../types/database.types';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  getSession, 
  ensureProfile, 
  getProfile,
  onAuthStateChange 
} from '../../services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isAdminOrManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to load profile for a user
  const loadProfile = async (currentUser: User) => {
    // 1. Try to fetch existing
    const res = await getProfile(currentUser.id);
    if (res.profile) {
      setProfile(res.profile);
      return;
    }

    // 2. Fallback ensure profile exists
    const ensured = await ensureProfile(currentUser);
    if (ensured) {
      setProfile(ensured);
    } else {
      // Create a local fallback representation to prevent UI crash
      setProfile({
        id: currentUser.id,
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Staff Member',
        role: 'counsellor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  useEffect(() => {
    // Initial session recovery
    const initializeAuth = async () => {
      try {
        const initialSession = await getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await loadProfile(initialSession.user);
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to changes in auth state (login, logout, token refresh)
    const { data: listener } = onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      setUser(newUser);

      if (newUser) {
        await loadProfile(newUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    const result = await signInWithEmail(email, pass);
    if (result.error) {
      setLoading(false);
      return { error: result.error };
    }

    if (result.user) {
      setUser(result.user);
      setSession(result.session);
      await loadProfile(result.user);
    }

    setLoading(false);
    return {};
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setLoading(true);
    const result = await signUpWithEmail(email, pass, name);
    if (result.error) {
      setLoading(false);
      return { error: result.error };
    }

    if (result.user) {
      setUser(result.user);
      setSession(result.session);
      await loadProfile(result.user);
    }

    setLoading(false);
    return {};
  };

  const signOut = async () => {
    setLoading(true);
    await signOutUser();
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
  };

  const role: UserRole = profile?.role ?? 'counsellor';
  const isAuthenticated = !!user;
  const isAdminOrManager = role === 'admin' || role === 'manager';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        isAuthenticated,
        isAdminOrManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
