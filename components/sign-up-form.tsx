"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { BookOpen, Loader2, Eye, EyeOff } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // パスワード確認
    if (password !== repeatPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    // パスワード強度チェック
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      
      // サインアップ成功画面に遷移
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "アカウント作成に失敗しました";
      
      // Supabaseエラーメッセージを日本語に変換
      if (errorMessage.includes("User already registered")) {
        setError("このメールアドレスは既に登録されています");
      } else if (errorMessage.includes("Password should be at least")) {
        setError("パスワードは6文字以上で入力してください");
      } else if (errorMessage.includes("Invalid email")) {
        setError("有効なメールアドレスを入力してください");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Wisdom-Hub</span>
          </div>
          <CardTitle className="text-2xl">アカウント作成</CardTitle>
          <CardDescription>
            新しいアカウントを作成して学習を始めましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">パスワード</Label>
                <div className="relative">
                <Input
                  id="password"
                    type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="6文字以上で入力"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">パスワード（確認）</Label>
                <div className="relative">
                <Input
                  id="repeat-password"
                    type={showRepeatPassword ? "text" : "password"}
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="パスワードを再入力"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    disabled={isLoading}
                  >
                    {showRepeatPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    アカウント作成中...
                  </>
                ) : (
                  "アカウント作成"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              既にアカウントをお持ちの方は{" "}
              <Link 
                href="/auth/login" 
                className="underline underline-offset-4 text-primary hover:text-primary/80"
              >
                ログイン
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
