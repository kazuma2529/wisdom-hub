import { Loader2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  showLogo?: boolean;
}

export function LoadingSpinner({ 
  size = "md", 
  className,
  text = "読み込み中...",
  showLogo = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {showLogo && (
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Wisdom-Hub</span>
        </div>
      )}
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
} 