"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  pattern: RegExp;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    icon: Home,
    label: "ホーム",
    pattern: /^\/dashboard$/
  },
  {
    href: "/learning-data", 
    icon: TrendingUp,
    label: "学習データ",
    pattern: /^\/learning-data$/
  },
  {
    href: "/profile",
    icon: User,
    label: "マイページ",
    pattern: /^\/profile$/
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-wisdom-200 px-4 py-2 safe-area-pb">
      {/* プレミアムアクセント */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-wisdom-400 to-wisdom-600" />
      
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = item.pattern.test(pathname);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 scale-hover",
                "min-w-[60px] touch-optimized relative overflow-hidden",
                isActive 
                  ? "text-wisdom-600 bg-wisdom-50 shadow-lg scale-105" 
                  : "text-dark-600 hover:text-wisdom-500 hover:bg-wisdom-50/50"
              )}
            >
              {/* アクティブ時のグロー効果 */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-wisdom-400/20 to-wisdom-600/20 rounded-xl animate-pulse" />
              )}
              
              {/* アイコン */}
              <div className={cn(
                "relative p-1.5 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-br from-wisdom-400 to-wisdom-600 text-white glow-accent" 
                  : "bg-transparent"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "animate-bounce-in"
                )} />
              </div>
              
              {/* ラベル */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
                isActive ? "text-wisdom-700 font-semibold" : "text-dark-600"
              )}>
                {item.label}
              </span>
              
              {/* アクティブインジケーター */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-wisdom-500 rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
      
      {/* プレミアムバッジ */}
      <div className="absolute top-2 right-4 flex items-center gap-1 bg-gradient-to-r from-wisdom-400 to-wisdom-600 text-white px-2 py-1 rounded-full text-xs font-medium">
        <Crown className="h-3 w-3" />
        Premium
      </div>
    </nav>
  );
} 