import { getNotebookById, getNotebooksWithStats } from "@/lib/database/notebooks";
import { getPagesByNotebookIdWithStats } from "@/lib/database/pages";
import { Button } from "@/components/ui/button";
import { AddPageDialog } from "@/components/pages/add-page-dialog";
import { PagesView } from "@/components/pages/pages-view";
import { BreadcrumbsNav } from "@/components/breadcrumbs/breadcrumbs-nav";
import { FloatingActionButton, FABTrigger } from "@/components/ui/floating-action-button";
import { Plus, BookOpen, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNotebooksBreadcrumb } from "@/lib/breadcrumb/personalize";

export const dynamic = 'force-dynamic';

export default async function NotebookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const pages = await getPagesByNotebookIdWithStats(id);
  const allNotebooks = await getNotebooksWithStats();

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
            dropdownItems: pages.map((page) => ({
              id: page.id,
              label: page.title,
              href: `/notebooks/${id}/pages/${page.id}`,
              icon: <FileText className="h-4 w-4" />,
            })),
          },
        ]}
        subtitle={`${pages.length} ${pages.length === 1 ? 'page' : 'pages'}`}
        action={
          <AddPageDialog notebookId={id}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>
          </AddPageDialog>
        }
      />

      <div>
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first page with a YouTube video to start taking notes
            </p>
            <AddPageDialog notebookId={id}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Page
              </Button>
            </AddPageDialog>
          </div>
        ) : (
          <PagesView pages={pages} notebookId={id} />
        )}
      </div>

      {/* Floating Action Button for mobile */}
      <FloatingActionButton>
        <AddPageDialog notebookId={id}>
          <FABTrigger />
        </AddPageDialog>
      </FloatingActionButton>
    </div>
  );
}
