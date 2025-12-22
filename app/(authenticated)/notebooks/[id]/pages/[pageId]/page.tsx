import { getPageById } from "@/lib/database/pages";
import { getNotesByPageId } from "@/lib/database/notes";
import { getNotebookById } from "@/lib/database/notebooks";
import { notFound } from "next/navigation";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import { NotesList } from "@/components/notes/notes-list";
import { ShareDialog } from "@/components/sharing/share-dialog";
import { EditablePageTitle } from "@/components/pages/editable-page-title";
import { BreadcrumbsNav } from "@/components/breadcrumbs/breadcrumbs-nav";
import { VideoInfoTabs } from "@/components/video/video-info-tabs";
import { VideoMobileTabs } from "@/components/video/video-mobile-tabs";

export const dynamic = 'force-dynamic';

export default async function PageDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; pageId: string }>;
  searchParams: Promise<{ note?: string; q?: string }>;
}) {
  const { id, pageId } = await params;
  const { note: highlightNoteId, q: searchQuery } = await searchParams;
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
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <BreadcrumbsNav
        items={[
          { label: "Notebooks", href: "/notebooks" },
          { label: notebook.title, href: `/notebooks/${id}` },
          {
            label: page.title,
            href: `/notebooks/${id}/pages/${pageId}`,
            isEditable: true,
            editComponent: <EditablePageTitle pageId={pageId} initialTitle={page.title} />
          },
        ]}
        subtitle={page.channel_name}
        action={
          <ShareDialog
            pageId={pageId}
            pageTitle={page.title}
            videoTitle={page.video_title}
            videoId={page.youtube_video_id}
            videoUrl={page.youtube_url}
            notes={notes}
          />
        }
      />

      {/* Main content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video player + tabs - RIGHT side on desktop, TOP on mobile */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
            {/* Desktop: Video + tabs below */}
            <div className="hidden lg:block space-y-4">
              <YouTubePlayer
                videoId={page.youtube_video_id}
                title={page.video_title}
              />
              <VideoInfoTabs
                description={page.description}
                videoId={page.youtube_video_id}
              />
            </div>

            {/* Mobile: Tabbed interface (Video | Description | Transcript) */}
            <VideoMobileTabs
              description={page.description}
              videoId={page.youtube_video_id}
            >
              <YouTubePlayer
                videoId={page.youtube_video_id}
                title={page.video_title}
              />
            </VideoMobileTabs>
          </div>

          {/* Notes section - LEFT side on desktop, BELOW tabs on mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <NotesList
              notes={notes}
              pageId={pageId}
              videoId={page.youtube_video_id}
              highlightNoteId={highlightNoteId}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
