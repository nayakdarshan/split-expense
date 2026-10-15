import { type NextRequest, NextResponse } from "next/server";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";

// Google -> Supabase -> here with ?code=... (PKCE). Exchange it for a session cookie.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error(JSON.stringify({ action: "auth.callback", outcome: "exchange_failed", error: error.message }));
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
  }

  const reason = searchParams.get("error") ?? "missing_code";
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason)}`);
}
