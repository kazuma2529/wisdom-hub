import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PageStatusProps {
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  loadingText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  onRetry?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * ページのローディング・エラー・空状態を表示する共通コンポーネント
 */
export function PageStatus({
  loading,
  error,
  isEmpty,
  loadingText = "読み込み中...",
  emptyTitle = "データがありません",
  emptyDescription,
  emptyIcon: EmptyIcon,
  emptyAction,
  onRetry,
  className,
  children
}: PageStatusProps) {
  const containerClass = cn(
    "flex flex-col items-center justify-center min-h-[50vh] text-center",
    className
  );

  // ローディング状態
  if (loading) {
    return (
      <div className={containerClass}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{loadingText}</p>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className={containerClass}>
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            再試行
          </Button>
        )}
        {children}
      </div>
    );
  }

  // 空状態
  if (isEmpty) {
    return (
      <div className={containerClass}>
        {EmptyIcon && <EmptyIcon className="h-16 w-16 text-muted-foreground mb-4" />}
        <h2 className="text-xl font-semibold mb-2">{emptyTitle}</h2>
        {emptyDescription && (
          <p className="text-muted-foreground mb-6 max-w-md">{emptyDescription}</p>
        )}
        {emptyAction && (
          <Button onClick={emptyAction.onClick} className="flex items-center gap-2">
            {emptyAction.label}
          </Button>
        )}
        {children}
      </div>
    );
  }

  // 通常状態（childrenを表示）
  return <>{children}</>;
} 