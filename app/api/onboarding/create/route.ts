import { createClient } from "@/lib/supabase/server";
import { createOnboardingNotebook } from "@/lib/database/onboarding";
import { createUserProfile } from "@/lib/database/user-profiles";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Create user profile from metadata
    const nickname = user.user_metadata?.nickname;

    if (!nickname) {
      return NextResponse.json(
        { error: "Nickname not found in user metadata" },
        { status: 400 }
      );
    }

    try {
      await createUserProfile({
        user_id: user.id,
        nickname: nickname,
      });
    } catch (error) {
      // If profile already exists, that's okay - continue
      console.log("User profile may already exist:", error);
    }

    // Create onboarding notebook
    const result = await createOnboardingNotebook(user.id);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Onboarding creation error:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding" },
      { status: 500 }
    );
  }
}
