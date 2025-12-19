import { getNotebooks } from "@/lib/database/notebooks";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreateNotebookDialog } from "@/components/notebooks/create-notebook-dialog";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NotebooksPage() {
  const notebooks = await getNotebooks();

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notebooks</h1>
          <p className="text-muted-foreground mt-1">
            Organize your YouTube notes into notebooks
          </p>
        </div>
        <CreateNotebookDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Notebook
          </Button>
        </CreateNotebookDialog>
      </div>

      {notebooks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No notebooks yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first notebook to start taking notes on YouTube videos
          </p>
          <CreateNotebookDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Notebook
            </Button>
          </CreateNotebookDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notebooks.map((notebook) => (
            <Link key={notebook.id} href={`/notebooks/${notebook.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{notebook.title}</CardTitle>
                  <CardDescription>
                    Created {new Date(notebook.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
