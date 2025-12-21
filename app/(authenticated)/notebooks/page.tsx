import { getNotebooksWithStats } from "@/lib/database/notebooks";
import { Button } from "@/components/ui/button";
import { CreateNotebookDialog } from "@/components/notebooks/create-notebook-dialog";
import { NotebooksView } from "@/components/notebooks/notebooks-view";
import { BreadcrumbsNav } from "@/components/breadcrumbs/breadcrumbs-nav";
import { FloatingActionButton, FABTrigger } from "@/components/ui/floating-action-button";
import { WelcomeToast } from "@/components/onboarding/welcome-toast";
import { ONBOARDING_NOTEBOOK_TITLE } from "@/lib/onboarding/templates";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NotebooksPage() {
  const notebooks = await getNotebooksWithStats();

  // Check if user has the onboarding notebook
  const hasOnboardingNotebook = notebooks.some(
    (nb) => nb.title === ONBOARDING_NOTEBOOK_TITLE
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      {/* Welcome toast for new users */}
      <WelcomeToast
        notebookCount={notebooks.length}
        hasOnboardingNotebook={hasOnboardingNotebook}
      />

      <BreadcrumbsNav
        items={[
          { label: "Notebooks", href: "/notebooks" },
        ]}
        subtitle={`${notebooks.length} ${notebooks.length === 1 ? 'notebook' : 'notebooks'}`}
        action={
          <CreateNotebookDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Notebook
            </Button>
          </CreateNotebookDialog>
        }
      />

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
        <NotebooksView notebooks={notebooks} />
      )}

      {/* Floating Action Button for mobile */}
      <FloatingActionButton>
        <CreateNotebookDialog>
          <FABTrigger />
        </CreateNotebookDialog>
      </FloatingActionButton>
    </div>
  );
}
