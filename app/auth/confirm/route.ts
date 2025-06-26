import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // 新しい形式のパラメータ
  let token_hash = searchParams.get("token_hash");
  let type = searchParams.get("type") as EmailOtpType | null;
  
  // 古い形式のパラメータもチェック
  const token = searchParams.get("token");
  const confirmation_url = searchParams.get("confirmation_url");
  
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("Confirm route accessed with:", { 
    token_hash: !!token_hash, 
    type, 
    token: !!token, 
    confirmation_url: !!confirmation_url,
    next,
    allParams: Object.fromEntries(searchParams.entries())
  });

  // 古い形式の場合、confirmation_urlから新しいパラメータを抽出を試みる
  if (!token_hash && !type && confirmation_url) {
    try {
      const confirmUrl = new URL(confirmation_url);
      token_hash = confirmUrl.searchParams.get("token_hash");
      type = confirmUrl.searchParams.get("type") as EmailOtpType | null;
      console.log("Extracted from confirmation_url:", { token_hash: !!token_hash, type });
    } catch (err) {
      console.error("Failed to parse confirmation_url:", err);
    }
  }

  // 古い形式のtokenをtoken_hashとして使用を試みる
  if (!token_hash && token) {
    token_hash = token;
    type = type || "signup";
    console.log("Using legacy token format");
  }

  if (token_hash && type) {
    const supabase = await createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      
      if (!error) {
        console.log("Email verification successful, redirecting to:", next);
        redirect(next);
      } else {
        console.error("Email verification failed:", error);
        redirect(`/auth/error?error=${encodeURIComponent(error?.message || "Email verification failed")}`);
      }
    } catch (err) {
      console.error("Exception during email verification:", err);
      redirect(`/auth/error?error=${encodeURIComponent("An unexpected error occurred during email verification")}`);
    }
  }

  console.log("Missing token_hash or type after all attempts");
  redirect(`/auth/error?error=${encodeURIComponent("No valid token found in confirmation link")}`);
}
