import { notFound } from "next/navigation";
import { getSharedNoteByToken } from "@/lib/database/shared-notes";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { NoteItem } from "@/components/notes/note-item";
import Image from "next/image";
import Link from "next/link";
import { VideoSection } from "@/components/video/video-section";
import { extractTitle, extractDescription, getYouTubeThumbnail } from "@/lib/metadata/extract-metadata";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface ShareNotePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: ShareNotePageProps): Promise<Metadata> {
  const { token } = await params;

  // Use service role client to fetch data for metadata
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get shared note
  const sharedNote = await getSharedNoteByToken(token);
  if (!sharedNote) {
    return {
      title: "Note Not Found",
      description: "This shared note could not be found.",
    };
  }

  // Get note details
  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", sharedNote.note_id)
    .single();

  if (!note) {
    return {
      title: "Note Not Found",
      description: "This shared note could not be found.",
    };
  }

  // Get page details for video info
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", note.page_id)
    .single();

  // Get user's nickname
  let sharedByNickname = "A user";
  if (page) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("nickname")
      .eq("user_id", page.user_id)
      .single();
    sharedByNickname = profile?.nickname || "A user";
  }

  // Extract metadata from note content
  const noteTitle = extractTitle(note.content);
  const noteDescription = extractDescription(note.content);

  // Generate metadata
  const title = `${noteTitle} - YouNote`;
  const description = noteDescription;
  const videoTitle = page?.video_title || "YouTube Video";
  const ogImage = page?.youtube_video_id
    ? getYouTubeThumbnail(page.youtube_video_id)
    : undefined;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://younote-two.vercel.app'}/share/note/${token}`;

  return {
    title,
    description: `${description} - Note by ${sharedByNickname} on "${videoTitle}"`,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1280,
          height: 720,
          alt: videoTitle,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ShareNotePage({ params }: ShareNotePageProps) {
  const { token } = await params;

  // Use service role client to bypass RLS for anonymous users viewing shared content
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get shared note
  const sharedNote = await getSharedNoteByToken(token);
  if (!sharedNote) {
    notFound();
  }

  // Get note details using service role client (bypasses RLS)
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", sharedNote.note_id)
    .single();

  if (noteError || !note) {
    notFound();
  }

  // Get page details (for video information)
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("id", note.page_id)
    .single();

  if (pageError || !page) {
    notFound();
  }

  // Get user's nickname who shared this note
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("nickname")
    .eq("user_id", page.user_id)
    .single();

  const sharedByNickname = profile?.nickname || "A user";

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
              <Link href={`/auth/login?share_token=${token}&share_type=note`}>
                Log In
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/auth/sign-up?share_token=${token}&share_type=note`}>
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
              shareType="note"
            />
          </div>

          {/* Notes section - LEFT side on desktop, BELOW on mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="space-y-6 pb-[50vh]">
              {/* Shared Note */}
              <NoteItem
                note={note}
                videoId={page.youtube_video_id}
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
