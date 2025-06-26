import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CreateEntityField {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'textarea';
}

export interface CreateEntityDialogProps {
  trigger: React.ReactNode | null;
  title: string;
  description: string;
  fields: CreateEntityField[];
  submitLabel?: string;
  isCreating?: boolean;
  onSubmit: (data: Record<string, string>) => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Record<string, string>;
}

/**
 * エンティティ作成用の汎用ダイアログコンポーネント
 */
export function CreateEntityDialog({
  trigger,
  title,
  description,
  fields,
  submitLabel = "作成",
  isCreating = false,
  onSubmit,
  open,
  onOpenChange,
  defaultValues
}: CreateEntityDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData = fields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {});
    return defaultValues ? { ...initialData, ...defaultValues } : initialData;
  });

  // open状態の管理（外部制御 or 内部制御）
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // defaultValuesが変更された時にformDataを更新
  useEffect(() => {
    if (defaultValues) {
      const initialData = fields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {});
      setFormData({ ...initialData, ...defaultValues });
    }
  }, [defaultValues, fields]);

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      // 成功時にフォームをリセットしてダイアログを閉じる
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {}));
      setIsOpen(false);
    } catch (error) {
      // エラーは上位コンポーネントで処理される
      console.error('CreateEntityDialog submit error:', error);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isValid = fields
    .filter(field => field.required)
    .every(field => formData[field.key]?.trim());

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription className="text-sm">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.key}
                value={formData[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                disabled={isCreating}
                className="touch-optimized"
              />
            </div>
          ))}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
            className="touch-optimized w-full sm:w-auto"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || !isValid}
            className="touch-optimized w-full sm:w-auto"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                作成中...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 