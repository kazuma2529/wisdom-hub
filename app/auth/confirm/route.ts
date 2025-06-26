import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("Confirm route accessed with:", { token_hash: !!token_hash, type, next });

  if (token_hash && type) {
    const supabase = await createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      
      if (!error) {
        console.log("Email verification successful, redirecting to:", next);
        // redirect user to specified redirect URL or dashboard
        redirect(next);
      } else {
        console.error("Email verification failed:", error);
        // redirect the user to an error page with some instructions
        redirect(`/auth/error?error=${encodeURIComponent(error?.message || "Email verification failed")}`);
      }
    } catch (err) {
      console.error("Exception during email verification:", err);
      redirect(`/auth/error?error=${encodeURIComponent("An unexpected error occurred during email verification")}`);
    }
  }

  console.log("Missing token_hash or type");
  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=${encodeURIComponent("No token hash or type provided")}`);
}
