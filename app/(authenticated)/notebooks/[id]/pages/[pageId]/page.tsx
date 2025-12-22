import { getPageById, getPagesByNotebookIdWithStats } from "@/lib/database/pages";
import { getNotesByPageId } from "@/lib/database/notes";
import { getNotebookById, getNotebooksWithStats } from "@/lib/database/notebooks";
import { notFound } from "next/navigation";
import { NotesList } from "@/components/notes/notes-list";
import { ShareDialog } from "@/components/sharing/share-dialog";
import { EditablePageTitle } from "@/components/pages/editable-page-title";
import { BreadcrumbsNav } from "@/components/breadcrumbs/breadcrumbs-nav";
import { VideoSection } from "@/components/video/video-section";
import { BookOpen, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getNotebooksBreadcrumb } from "@/lib/breadcrumb/personalize";

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

  // Fetch user nickname
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase
        .from("user_profiles")
        .select("nickname")
        .eq("user_id", user.id)
        .single()
    : { data: null };

  const notes = await getNotesByPageId(pageId);
  const allNotebooks = await getNotebooksWithStats();
  const pagesInNotebook = await getPagesByNotebookIdWithStats(id);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <BreadcrumbsNav
        items={[
          {
            label: getNotebooksBreadcrumb(profile?.nickname),
            href: "/notebooks",
            dropdownItems: allNotebooks.map((nb) => ({
              id: nb.id,
              label: nb.title,
              href: `/notebooks/${nb.id}`,
              icon: <BookOpen className="h-4 w-4" />,
            })),
          },
          {
            label: notebook.title,
            href: `/notebooks/${id}`,
            dropdownItems: pagesInNotebook.map((p) => ({
              id: p.id,
              label: p.title,
              href: `/notebooks/${id}/pages/${p.id}`,
              icon: <FileText className="h-4 w-4" />,
            })),
          },
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
          <div className="lg:col-span-2 order-1 lg:order-2">
            <VideoSection
              videoId={page.youtube_video_id}
              videoTitle={page.video_title}
              description={page.description}
            />
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
