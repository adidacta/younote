import { notFound } from "next/navigation";
import { getSharedPageByToken } from "@/lib/database/shared-pages";
import { getNotesByPageId } from "@/lib/database/notes";
import { createClient } from "@/lib/supabase/server";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatTimestamp } from "@/lib/youtube/format-timestamp";
import { generateTimestampUrl } from "@/lib/youtube/generate-timestamp-url";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Get page details (bypassing RLS using service role)
  const supabase = await createClient();
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("id", sharedPage.page_id)
    .single();

  if (pageError || !page) {
    notFound();
  }

  // Get notes for this page
  const notes = await getNotesByPageId(page.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-b-foreground/10 h-14 flex items-center px-4">
        <div className="flex-1">
          <h1 className="font-semibold">YouNote - Shared Page</h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/">Sign In to Create Your Own</a>
        </Button>
      </header>

      {/* Content */}
      <div className="container max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{page.title}</h2>
              <p className="text-sm text-muted-foreground">{page.video_title}</p>
            </div>
            <YouTubePlayer
              videoId={page.youtube_video_id}
              title={page.video_title}
            />
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notes ({notes.length})</h3>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No notes yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="pt-4">
                      {/* Timestamp */}
                      {note.timestamp_seconds !== null && (
                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <span className="font-mono text-primary">
                            {formatTimestamp(note.timestamp_seconds)}
                          </span>
                          <a
                            href={generateTimestampUrl(
                              page.youtube_video_id,
                              note.timestamp_seconds
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {/* Note content */}
                      {note.content ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {note.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm italic">
                          Empty note
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="mt-3 text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
