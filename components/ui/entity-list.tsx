import Link from "next/link";
import { LucideIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

export interface EntityItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  href: string;
}

export interface EntityListProps {
  entities: EntityItem[];
  icon: LucideIcon;
  onEdit?: (entity: EntityItem) => void;
  onDelete?: (entity: EntityItem) => void;
  className?: string;
  compact?: boolean;
  showContent?: boolean;
}

/**
 * エンティティ一覧表示用の汎用コンポーネント
 * ワークスペース、ボックス、ブロック一覧で共通利用
 */
export function EntityList({
  entities,
  icon: Icon,
  onEdit,
  onDelete,
  className = "",
  compact = false,
  showContent = false
}: EntityListProps) {
  const gridCols = compact ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "md:grid-cols-2 lg:grid-cols-3";
  const cardPadding = compact ? "p-3" : "p-4";
  const iconSize = compact ? "w-7 h-7" : "w-8 h-8";
  const iconContent = compact ? "h-3.5 w-3.5" : "h-4 w-4";
  const titleSize = compact ? "text-sm" : "text-lg";
  const gap = compact ? "gap-2" : "gap-3";

  return (
    <div className={`grid gap-4 ${gridCols} animate-fade-in ${className}`}>
      {entities.map((entity, index) => (
        <Card 
          key={entity.id} 
          className="border-0 hover:shadow-lg transition-all duration-300 animate-scale-in group"
          style={{
            animationDelay: `${index * 100}ms`,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(104, 178, 117, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(104, 178, 117, 0.1)'
          }}
        >
          <div className={`${cardPadding} group-hover:scale-105 transition-transform duration-300 flex items-start ${gap}`}>
            {/* エンティティアイコン */}
            <div className={`flex-shrink-0 ${iconSize} bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110`} style={{ boxShadow: '0 0 12px rgba(104, 178, 117, 0.3)' }}>
              <Icon className={`${iconContent} text-white`} />
            </div>
            
            {/* エンティティ内容（クリック可能） */}
            <Link 
              href={entity.href}
              className="flex-1 min-w-0"
            >
              <h3 className={`${titleSize} font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-wisdom-600 transition-colors`}>
                {entity.title}
              </h3>
              {entity.description && (
                <p className="text-xs text-gray-600 line-clamp-1">
                  {entity.description}
                </p>
              )}
              {showContent && entity.content && (
                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                  {entity.content.replace(/<[^>]*>/g, '')}
                </p>
              )}
            </Link>
            
            {/* 3本線メニュー */}
            {(onEdit || onDelete) && (
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-gray-100 hover:text-gray-800 w-6 h-6 p-0"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onEdit(entity);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        編集
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onDelete(entity);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        削除
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
} 