import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile, createUserProfile } from "@/lib/database/user-profiles";
import { SettingsForm } from "@/components/settings-form";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let profile = await getUserProfile();

  // If profile doesn't exist, create one from user metadata or email
  if (!profile) {
    let nickname = user.user_metadata?.nickname;

    // If no nickname in metadata, use email prefix
    if (!nickname && user.email) {
      const emailPrefix = user.email.split('@')[0];
      nickname = emailPrefix
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 20);

      // Ensure minimum length
      if (nickname.length < 3) {
        nickname = `user${user.id.substring(0, 5)}`;
      }
    }

    if (nickname) {
      try {
        profile = await createUserProfile({
          user_id: user.id,
          nickname: nickname,
        });
      } catch (error) {
        console.error("Failed to create profile:", error);
      }
    }

    // If still no profile, show an error message
    if (!profile) {
      return (
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="mb-3">
            <BackButton />
          </div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Profile Not Found</CardTitle>
              <CardDescription>
                We couldn't find or create your profile. Please contact support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                User ID: {user.id}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="mb-3">
        <BackButton />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}
