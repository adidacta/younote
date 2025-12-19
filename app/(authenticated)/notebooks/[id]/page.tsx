import { getNotebookById } from "@/lib/database/notebooks";
import { getPagesByNotebookId } from "@/lib/database/pages";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddPageDialog } from "@/components/pages/add-page-dialog";
import Link from "next/link";
import { Plus, Play, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function NotebookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notebook = await getNotebookById(id);

  if (!notebook) {
    notFound();
  }

  const pages = await getPagesByNotebookId(id);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with consistent height */}
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
                <span className="text-foreground truncate">{notebook.title}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {pages.length} {pages.length === 1 ? 'page' : 'pages'}
              </p>
            </div>
            <AddPageDialog notebookId={id}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </AddPageDialog>
          </div>
        </div>
      </div>

      <div className="flex-1 container max-w-6xl mx-auto p-6">

      {pages.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first page with a YouTube video to start taking notes
          </p>
          <AddPageDialog notebookId={id}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </AddPageDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link key={page.id} href={`/notebooks/${id}/pages/${page.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={page.thumbnail_url}
                    alt={page.video_title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{page.title}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {page.channel_name}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
