// 共通型定義
// 各種型定義を一箇所に集約してメンテナンス性を向上

// =============================================================================
// Database Types (Supabase)
// =============================================================================

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Box {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  title: string;
  content?: string;
  cover_image_url?: string;
  box_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  block_id: string;
  activity_type: string;
  duration_minutes?: number;
  created_at: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// =============================================================================
// AI/Dify Types
// =============================================================================

export interface DifyMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DifyChatRequest {
  query: string;
  conversation_id?: string;
  user?: string;
  inputs?: Record<string, any>;
  response_mode?: 'blocking' | 'streaming';
}

export interface DifyChatResponse {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  metadata: {
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      total_price: string;
      currency: string;
      latency: number;
    };
    retriever_resources?: Array<{
      position: number;
      dataset_id: string;
      dataset_name: string;
      document_id: string;
      document_name: string;
      segment_id: string;
      score: number;
      content: string;
    }>;
  };
  created_at: number;
}

export interface DifyError {
  message: string;
  code?: string;
  status?: number;
}

// =============================================================================
// Storage Types
// =============================================================================

export interface UploadResult {
  url: string;
  path: string;
}

export interface UploadError {
  message: string;
  code?: string;
}

// =============================================================================
// Auth Types
// =============================================================================

export interface AuthState {
  user: any | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface UseAuthReturn extends AuthState {
  signUp: (email: string, password: string) => Promise<{
    data: any;
    error: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    data: any;
    error: any;
  }>;
  signOut: () => Promise<{ error: any }>;
}

// =============================================================================
// UI Component Types
// =============================================================================

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  showLogo?: boolean;
}

export interface ImageUploadProps {
  userId: string;
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
  disabled?: boolean;
} 