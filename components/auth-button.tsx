"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useMount } from "@/lib/hooks/use-mount";
import { LogOut, User } from "lucide-react";

export function AuthButton() {
  const { user, loading, isInitialized, signOut } = useAuth();
  const isMounted = useMount();

  const handleSignOut = async () => {
    await signOut();
  };

  // サーバーサイドまたは初期化前は空の状態を表示
  if (!isMounted || !isInitialized || loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{user.email}</span>
      </div>
      <Button 
        onClick={handleSignOut}
        size="sm" 
        variant="outline"
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">ログアウト</span>
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login" className="text-sm">
          ログイン
        </Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up" className="text-sm">
          サインアップ
        </Link>
      </Button>
    </div>
  );
}
