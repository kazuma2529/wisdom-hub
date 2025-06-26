import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Button } from "./button";

interface PageHeaderProps {
  backHref?: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  showBackButton?: boolean;
}

/**
 * ページヘッダーの共通コンポーネント
 */
export function PageHeader({
  backHref,
  title,
  subtitle,
  description,
  icon: Icon,
  action,
  showBackButton = true
}: PageHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-start gap-4 mb-6">
        {showBackButton && backHref && (
          <Link href={backHref} className="flex-shrink-0 mt-1">
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-xl flex items-center justify-center shadow-lg" style={{ 
              boxShadow: '0 0 20px rgba(104, 178, 117, 0.3)' 
            }}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-wisdom-600 via-wisdom-500 to-wisdom-600 bg-clip-text text-transparent truncate"
                style={{ animation: 'glow 2s ease-in-out infinite alternate' }}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 opacity-80">{subtitle}</p>
              )}
            </div>
          </div>
          {description && (
            <p className={`text-gray-700 text-lg line-clamp-2 ${showBackButton ? 'ml-16' : ''}`}>{description}</p>
          )}
        </div>

        {action}
      </div>
      <div 
        className="h-1 rounded-full mb-6"
        style={{
          background: 'linear-gradient(90deg, #68B275 0%, rgba(104, 178, 117, 0.3) 50%, #68B275 100%)',
          animation: 'shimmer 2s ease-in-out infinite'
        }}
      />
    </div>
  );
} 