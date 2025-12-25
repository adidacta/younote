import { notFound } from "next/navigation";
import { getSharedPageByToken } from "@/lib/database/shared-pages";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { NoteItem } from "@/components/notes/note-item";
import { VideoSection } from "@/components/video/video-section";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;

  // Get shared page
  const sharedPage = await getSharedPageByToken(token);
  if (!sharedPage) {
    notFound();
  }

  // Use service role client to bypass RLS for anonymous users viewing shared content
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get page details (bypassing RLS using service role)
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("id", sharedPage.page_id)
    .single();

  if (pageError || !page) {
    notFound();
  }

  // Get notes for this page (using service role to bypass RLS)
  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("*")
    .eq("page_id", page.id)
    .order("created_at", { ascending: false });

  if (notesError) {
    console.error("Error fetching notes:", notesError);
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - matches home page */}
      <header className="border-b border-b-foreground/10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/younote-logo-light.png"
              alt="YouNote"
              width={120}
              height={40}
              className="dark:hidden"
            />
            <Image
              src="/images/younote-logo-dark.png"
              alt="YouNote"
              width={120}
              height={40}
              className="hidden dark:block"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/auth/login?share_token=${token}&share_type=page`}>
                Log In
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/auth/sign-up?share_token=${token}&share_type=page`}>
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content - EXACT SAME LAYOUT as logged-in page */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb area - simplified for shared view */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{page.title}</h1>
          {page.channel_name && (
            <p className="text-sm text-muted-foreground">{page.channel_name}</p>
          )}
        </div>

        {/* Grid layout - EXACTLY matches logged-in page */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video player - RIGHT side on desktop, TOP on mobile */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <VideoSection
              videoId={page.youtube_video_id}
              videoTitle={page.video_title}
              description={page.description}
              readOnly={true}
              shareToken={token}
              shareType="page"
            />
          </div>

          {/* Notes section - LEFT side on desktop, BELOW on mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="space-y-6 pb-[50vh]">
              {!notes || notes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No notes on this page yet</p>
                </div>
              ) : (
                notes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    videoId={page.youtube_video_id}
                    readOnly={true}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
