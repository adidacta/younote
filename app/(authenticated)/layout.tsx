import { AuthButton } from "@/components/auth-button";
import { AnnouncementsButton } from "@/components/announcements/announcements-button";
import { ConnectExtensionButton } from "@/components/connect-extension-button";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to home if not authenticated
  if (!user) {
    redirect("/");
  }

  // Fetch notebooks, pages, and notes for command palette
  const { data: notebooksData } = await supabase
    .from("notebooks")
    .select("id, title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: pagesData } = await supabase
    .from("pages")
    .select("id, notebook_id, title, video_title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: notesData } = await supabase
    .from("notes")
    .select("id, page_id, content, timestamp_seconds")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const notebooks = notebooksData || [];
  const pages = pagesData || [];
  const notes = notesData || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-b-foreground/10 relative">
        {/* Logo - absolute positioned on left with 32px padding */}
        <div className="absolute left-4 md:left-8 top-0 h-14 flex items-center z-10">
          <Link href="/notebooks" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/younote-logo-light.png"
              alt="YouNote"
              width={120}
              height={40}
              className="dark:hidden"
              priority
            />
            <Image
              src="/images/younote-logo-dark.png"
              alt="YouNote"
              width={120}
              height={40}
              className="hidden dark:block"
              priority
            />
          </Link>
        </div>

        {/* Search - in same container as page content to align with breadcrumbs */}
        {/* Hidden on mobile to prevent overlap, visible on md+ screens */}
        <div className="container max-w-7xl mx-auto px-4 hidden md:block">
          <div className="h-14 flex items-center justify-center">
            {/* Add padding to prevent overlap with logo (left) and user buttons (right) */}
            <div className="w-full max-w-2xl px-40 lg:px-44">
              <CommandPalette notebooks={notebooks} pages={pages} notes={notes} />
            </div>
          </div>
        </div>

        {/* User info - absolute positioned on right with 32px padding */}
        <div className="absolute right-4 md:right-8 top-0 h-14 flex items-center gap-2 md:gap-4 z-10">
          {/* Connect Extension - Desktop only */}
          <div className="hidden md:block">
            <ConnectExtensionButton />
          </div>

          {/* Announcements - Desktop only */}
          <div className="hidden md:block">
            <Suspense>
              <AnnouncementsButton />
            </Suspense>
          </div>

          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
