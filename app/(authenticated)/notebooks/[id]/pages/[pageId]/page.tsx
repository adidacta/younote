import { getPageById } from "@/lib/database/pages";
import { getNotesByPageId } from "@/lib/database/notes";
import { getNotebookById } from "@/lib/database/notebooks";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import { NotesList } from "@/components/notes/notes-list";
import { ShareDialog } from "@/components/sharing/share-dialog";
import { EditablePageTitle } from "@/components/pages/editable-page-title";

export const dynamic = 'force-dynamic';

export default async function PageDetailPage({
  params,
}: {
  params: Promise<{ id: string; pageId: string }>;
}) {
  const { id, pageId } = await params;
  const page = await getPageById(pageId);

  if (!page) {
    notFound();
  }

  const notebook = await getNotebookById(id);
  if (!notebook) {
    notFound();
  }

  const notes = await getNotesByPageId(pageId);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Breadcrumb Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Breadcrumb Navigation */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link
                  href="/notebooks"
                  className="hover:text-foreground transition-colors"
                >
                  Notebooks
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/notebooks/${id}`}
                  className="hover:text-foreground transition-colors truncate"
                >
                  {notebook.title}
                </Link>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                <EditablePageTitle pageId={pageId} initialTitle={page.title} />
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {page.channel_name}
              </p>
            </div>
            <ShareDialog
              pageId={pageId}
              pageTitle={page.title}
              videoTitle={page.video_title}
              videoId={page.youtube_video_id}
              videoUrl={page.youtube_url}
              notes={notes}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video player - RIGHT side on desktop, TOP on mobile */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <YouTubePlayer
              videoId={page.youtube_video_id}
              title={page.video_title}
            />
          </div>

          {/* Notes section - LEFT side on desktop, BELOW video on mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <NotesList notes={notes} pageId={pageId} videoId={page.youtube_video_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
