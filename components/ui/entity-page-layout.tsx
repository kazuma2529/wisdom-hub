import { LucideIcon, Plus } from "lucide-react";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { PageHeader } from "@/components/ui/page-header";
import { PageStatus } from "@/components/ui/page-status";
import { CreateEntityDialog, CreateEntityField } from "@/components/ui/create-entity-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FixedActionButton } from "@/components/ui/fixed-action-button";
import { EntityList, EntityItem } from "@/components/ui/entity-list";

export interface EntityPageLayoutProps {
  // ページ基本情報
  backHref?: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon: LucideIcon;
  showBackButton?: boolean;
  
  // エンティティ一覧
  entities: EntityItem[];
  entityIcon: LucideIcon;
  loading: boolean;
  error: string | null;
  compact?: boolean;
  showContent?: boolean;
  
  // 作成機能
  createTitle: string;
  createFields: CreateEntityField[];
  isCreating: boolean;
  createError: string | null;
  showCreateDialog: boolean;
  onCreateSubmit: (data: Record<string, string>) => void;
  onCreateCancel: () => void;
  onCreateOpen: () => void;
  
  // 編集機能
  editingEntity: EntityItem | null;
  onEdit: (entity: EntityItem) => void;
  onEditSubmit: (data: Record<string, string>) => void;
  onEditCancel: () => void;
  
  // 削除機能
  deletingEntity: EntityItem | null;
  isDeleting: boolean;
  onDelete: (entity: EntityItem) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  deleteWarningMessage?: string;
}

/**
 * エンティティページ用の共通レイアウトコンポーネント
 * ワークスペース、ボックス、ブロック一覧ページで共通利用
 */
export function EntityPageLayout({
  backHref,
  title,
  subtitle,
  description,
  icon,
  showBackButton = true,
  entities,
  entityIcon,
  loading,
  error,
  compact = false,
  showContent = false,
  createTitle,
  createFields,
  isCreating,
  createError,
  showCreateDialog,
  onCreateSubmit,
  onCreateCancel,
  onCreateOpen,
  editingEntity,
  onEdit,
  onEditSubmit,
  onEditCancel,
  deletingEntity,
  isDeleting,
  onDelete,
  onDeleteConfirm,
  onDeleteCancel,
  deleteWarningMessage
}: EntityPageLayoutProps) {
  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <PageHeader
          backHref={backHref}
          title={title}
          subtitle={subtitle}
          description={description}
          icon={icon}
          showBackButton={showBackButton}
        />

        <PageStatus
          loading={loading}
          error={error}
          isEmpty={!loading && !error && entities.length === 0}
          emptyTitle={`${createTitle}がありません`}
          emptyDescription={`最初の${createTitle}を作成してください`}
          emptyAction={{
            label: `${createTitle}を作成`,
            onClick: onCreateOpen
          }}
        >
          <EntityList
            entities={entities}
            icon={entityIcon}
            onEdit={onEdit}
            onDelete={onDelete}
            compact={compact}
            showContent={showContent}
          />
        </PageStatus>

        {/* 作成用FAB */}
        <FixedActionButton
          label={`${createTitle}を作成`}
          onClick={onCreateOpen}
        />

        {/* 作成ダイアログ */}
        <CreateEntityDialog
          trigger={null}
          open={showCreateDialog}
          onOpenChange={(open) => !open && onCreateCancel()}
          title={`新しい${createTitle}`}
          description={`新しい${createTitle}を作成します`}
          fields={createFields}
          onSubmit={onCreateSubmit}
          isCreating={isCreating}
        />

        {/* 編集ダイアログ */}
        <CreateEntityDialog
          trigger={null}
          open={!!editingEntity}
          onOpenChange={(open) => !open && onEditCancel()}
          title={`${createTitle}を編集`}
          description={`${createTitle}の情報を編集します`}
          fields={createFields}
          submitLabel="更新"
          defaultValues={editingEntity ? {
            title: editingEntity.title,
            description: editingEntity.description || ''
          } : undefined}
          onSubmit={onEditSubmit}
          isCreating={isCreating}
        />

        {/* 削除確認ダイアログ */}
        <ConfirmDialog
          open={!!deletingEntity}
          onOpenChange={(open) => !open && onDeleteCancel()}
          title={`${createTitle}を削除`}
          description={
            deleteWarningMessage || 
            `「${deletingEntity?.title}」を削除してもよろしいですか？この操作は元に戻せません。`
          }
          confirmLabel="削除"
          cancelLabel="キャンセル"
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
          isLoading={isDeleting}
          variant="destructive"
        />
      </div>
    </AuthenticatedLayout>
  );
} 