import { createClient } from "@/lib/supabase/server";
import { getUserProfile, updateUserProfile } from "@/lib/database/user-profiles";
import { NextResponse } from "next/server";

/**
 * GET /api/user-profile
 * Get the current user's profile
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user-profile
 * Update the current user's profile
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { nickname, profile_image_url } = body;

    // Build update object based on provided fields
    const updates: { nickname?: string; profile_image_url?: string | null } = {};

    // Validate and add nickname if provided
    if (nickname !== undefined) {
      if (!nickname || nickname.length < 3 || nickname.length > 20) {
        return NextResponse.json(
          { error: "Nickname must be between 3 and 20 characters" },
          { status: 400 }
        );
      }

      if (!/^[a-zA-Z0-9]+$/.test(nickname)) {
        return NextResponse.json(
          { error: "Nickname can only contain letters and numbers" },
          { status: 400 }
        );
      }

      updates.nickname = nickname;
    }

    // Add profile_image_url if provided
    if (profile_image_url !== undefined) {
      updates.profile_image_url = profile_image_url;
    }

    // Ensure at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedProfile = await updateUserProfile(updates);

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
