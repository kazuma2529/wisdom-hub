import { Plus } from "lucide-react";
import { Button } from "./button";

interface FixedActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * 画面下部に固定されるアクションボタンコンポーネント
 */
export function FixedActionButton({ 
  label, 
  onClick, 
  icon = <Plus className="h-6 w-6" />,
  disabled = false 
}: FixedActionButtonProps) {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
      <div className="max-w-md mx-auto">
        <Button
          onClick={onClick}
          disabled={disabled}
          className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #68B275 0%, #5aa166 100%)',
            boxShadow: '0 8px 25px rgba(104, 178, 117, 0.5)'
          }}
        >
          {icon}
          {label}
        </Button>
      </div>
    </div>
  );
} 