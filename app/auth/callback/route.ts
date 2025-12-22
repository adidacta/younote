import { createClient } from "@/lib/supabase/server";
import { hasOnboardingNotebook } from "@/lib/database/onboarding";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/notebooks";

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const userId = data.user.id;

      // Check if this is a new user (just signed up)
      // We detect this by checking if they already have the onboarding notebook
      const hasOnboarding = await hasOnboardingNotebook(userId);

      if (!hasOnboarding) {
        // New user - redirect to setup page for onboarding creation
        return NextResponse.redirect(`${origin}/auth/setup`);
      }

      // Existing user - redirect to requested page
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
