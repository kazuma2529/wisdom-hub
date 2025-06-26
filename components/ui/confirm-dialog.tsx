import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}

/**
 * 確認アクション用の汎用ダイアログコンポーネント
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  isLoading = false,
  onConfirm,
  onCancel,
  variant = "default"
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] max-w-md mx-auto bg-white border border-gray-200 shadow-2xl"
      >
        <DialogHeader className="text-center pb-4">
          <DialogTitle className={`text-xl font-bold ${variant === "destructive" ? "text-red-600" : "text-gray-900"}`}>
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 mt-3 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto h-11 text-base border-gray-300 hover:bg-gray-50"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto h-11 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                処理中...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 