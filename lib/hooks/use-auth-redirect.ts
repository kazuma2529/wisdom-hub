"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { useMount } from "./use-mount";

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * 認証状態に基づいてリダイレクトを行うフック
 * @param options - リダイレクトオプション
 */
export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const { redirectTo = "/auth/login", requireAuth = true } = options;
  const { user, loading, isInitialized } = useAuth();
  const router = useRouter();
  const isMounted = useMount();

  useEffect(() => {
    if (!isMounted || !isInitialized || loading) return;

    if (requireAuth && !user) {
      // 認証が必要だがユーザーがいない場合
      router.push(redirectTo);
    } else if (!requireAuth && user) {
      // 認証が不要だがユーザーがいる場合（ランディングページなど）
      router.push("/dashboard");
    }
  }, [user, loading, isInitialized, isMounted, router, redirectTo, requireAuth]);

  return {
    user,
    loading,
    isInitialized,
    isMounted,
    isReady: isMounted && isInitialized && !loading,
  };
} 