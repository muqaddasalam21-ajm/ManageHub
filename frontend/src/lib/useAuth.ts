'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isConfigured: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

/**
 * useAuth Hook
 * Subscribes to real-time Supabase auth state and extracts access token for backend REST API calls.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const handleSession = useCallback((session: Session | null) => {
    if (session?.user && session.access_token) {
      setUser(session.user);
      setToken(session.access_token);
    } else {
      setUser(null);
      setToken(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
      }
      handleSession(session);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve auth session';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [configured, handleSession]);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Fetch initial active session
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (!isMounted) return;
      if (sessionError) {
        setError(sessionError.message);
      }
      handleSession(session);
      setLoading(false);
    }).catch((err: unknown) => {
      if (!isMounted) return;
      const message = err instanceof Error ? err.message : 'Auth initialization failure';
      setError(message);
      setLoading(false);
    });

    // Listen to Supabase auth events (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        handleSession(session);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured, handleSession]);

  return {
    user,
    token,
    loading,
    isConfigured: configured,
    error,
    refreshSession,
  };
}
