"use client";

import { BottomNavigation } from "@/components/bottom-navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 認証が必要なページ用の共通レイアウト
 */
export function AuthenticatedLayout({ children, fallback }: AuthenticatedLayoutProps) {
  const { isReady, user } = useAuthRedirect({ requireAuth: true });

  // ローディング中や認証前の表示
  if (!isReady || !user) {
    return fallback || (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <LoadingSpinner showLogo />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
} 