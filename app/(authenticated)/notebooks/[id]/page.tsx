import { getNotebookById } from "@/lib/database/notebooks";
import { getPagesByNotebookIdWithStats } from "@/lib/database/pages";
import { Button } from "@/components/ui/button";
import { AddPageDialog } from "@/components/pages/add-page-dialog";
import { PagesView } from "@/components/pages/pages-view";
import { BreadcrumbsNav } from "@/components/breadcrumbs/breadcrumbs-nav";
import { FloatingActionButton, FABTrigger } from "@/components/ui/floating-action-button";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function NotebookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notebook = await getNotebookById(id);

  if (!notebook) {
    notFound();
  }

  const pages = await getPagesByNotebookIdWithStats(id);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <BreadcrumbsNav
        items={[
          { label: "Notebooks", href: "/notebooks" },
          { label: notebook.title, href: `/notebooks/${id}` },
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
