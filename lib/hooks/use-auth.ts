"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
}

interface UseAuthReturn extends AuthState {
  signUp: (email: string, password: string) => Promise<{
    data: any;
    error: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    data: any;
    error: any;
  }>;
  signOut: () => Promise<{ error: any }>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    // 現在のセッション取得
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Session error:", error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    getSession();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
        setIsInitialized(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return {
    user,
    loading,
    isInitialized,
    signUp: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      return { data, error };
    },
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
  };
} 