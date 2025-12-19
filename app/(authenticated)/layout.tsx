import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch notebooks and pages for command palette
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notebooks: any[] = [];
  let pages: any[] = [];

  if (user) {
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

    notebooks = notebooksData || [];
    pages = pagesData || [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-b-foreground/10 h-14 flex items-center">
        <div className="container max-w-7xl mx-auto px-4 w-full flex items-center">
          <div className="flex-1 flex items-center gap-4">
            <h1 className="font-semibold">YouNote</h1>
            <CommandPalette notebooks={notebooks} pages={pages} />
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
