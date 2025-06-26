import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error || "特定されていないエラーが発生しました";

  // エラーメッセージに基づいて日本語の説明を提供
  const getErrorDescription = (error: string) => {
    if (error.includes("No token hash or type")) {
      return "メール確認リンクが無効です。新しい確認メールを送信してください。";
    }
    if (error.includes("Email verification failed")) {
      return "メールアドレスの確認に失敗しました。リンクの有効期限が切れている可能性があります。";
    }
    if (error.includes("Invalid login credentials")) {
      return "ログイン情報が正しくありません。メールアドレスとパスワードを確認してください。";
    }
    return "認証処理中にエラーが発生しました。しばらく時間をおいて再度お試しください。";
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">
                認証エラー
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {getErrorDescription(errorMessage)}
              </p>
              
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                  技術的な詳細を表示
                </summary>
                <code className="mt-2 block bg-gray-100 p-2 rounded text-red-600">
                  {errorMessage}
                </code>
              </details>

              <div className="flex flex-col gap-2 pt-4">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    ログインページに戻る
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/sign-up">
                    新規アカウント作成
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
