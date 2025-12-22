import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/database/user-profiles";
import { UserMenu } from "./user-menu";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (user) {
    // Fetch user profile for the menu
    let profile = null;
    try {
      profile = await getUserProfile();
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }

    return <UserMenu profile={profile} />;
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
