import { createClient } from "@/lib/supabase/server";
import { createOnboardingNotebook, hasOnboardingNotebook } from "@/lib/database/onboarding";
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
        // Create onboarding notebook for new users
        const result = await createOnboardingNotebook(userId);

        if (result.success) {
          console.log(`Created onboarding notebook for new user: ${userId}`);
        } else {
          console.error(`Failed to create onboarding notebook: ${result.error}`);
          // Don't block the user from logging in if onboarding creation fails
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
