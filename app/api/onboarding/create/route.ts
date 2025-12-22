import { createClient } from "@/lib/supabase/server";
import { createOnboardingNotebook } from "@/lib/database/onboarding";
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
