"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LayoutGrid, Table2, FileText, StickyNote, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Notebook } from "@/types/database";
import { toast } from "sonner";

interface NotebookWithStats extends Notebook {
  pages_count: number;
  notes_count: number;
}

interface NotebooksViewProps {
  notebooks: NotebookWithStats[];
}

export function NotebooksView({ notebooks }: NotebooksViewProps) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState<NotebookWithStats | null>(null);
  const [notebookToRename, setNotebookToRename] = useState<NotebookWithStats | null>(null);
  const [newName, setNewName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const router = useRouter();

  const handleRenameClick = (notebook: NotebookWithStats, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotebookToRename(notebook);
    setNewName(notebook.title);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = async () => {
    if (!notebookToRename || !newName.trim()) return;

    setIsRenaming(true);
    try {
      const response = await fetch(`/api/notebooks/${notebookToRename.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename notebook');
      }

      toast.success('Notebook renamed');
      router.refresh();
      setRenameDialogOpen(false);
    } catch (error) {
      console.error('Error renaming notebook:', error);
      toast.error('Failed to rename notebook');
    } finally {
      setIsRenaming(false);
      setNotebookToRename(null);
      setNewName("");
    }
  };

  const handleDeleteClick = (notebook: NotebookWithStats, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotebookToDelete(notebook);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notebookToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/notebooks/${notebookToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notebook');
      }

      toast.success('Notebook deleted');
      router.refresh();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting notebook:', error);
      toast.error('Failed to delete notebook');
    } finally {
      setIsDeleting(false);
      setNotebookToDelete(null);
    }
  };

  if (notebooks.length === 0) {
    return null;
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-border p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            className="gap-2"
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notebooks.map((notebook) => (
            <div key={notebook.id} className="group relative">
              <Link href={`/notebooks/${notebook.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{notebook.title}</CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="text-xs">
                        Created {new Date(notebook.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-4 text-xs pt-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          <span className="font-medium">{notebook.pages_count}</span>
                          <span className="text-muted-foreground">
                            {notebook.pages_count === 1 ? "page" : "pages"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StickyNote className="h-3.5 w-3.5" />
                          <span className="font-medium">{notebook.notes_count}</span>
                          <span className="text-muted-foreground">
                            {notebook.notes_count === 1 ? "note" : "notes"}
                          </span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {/* Kebab menu */}
              <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleRenameClick(notebook, e)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleDeleteClick(notebook, e)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Notebook</th>
                <th className="text-left p-4 font-semibold">Pages</th>
                <th className="text-left p-4 font-semibold">Notes</th>
                <th className="text-left p-4 font-semibold">Created</th>
                <th className="text-left p-4 font-semibold w-16"></th>
              </tr>
            </thead>
            <tbody>
              {notebooks.map((notebook) => (
                <tr
                  key={notebook.id}
                  className="border-b last:border-b-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/notebooks/${notebook.id}`)}
                >
                  <td className="p-4">
                    <div className="font-medium">
                      {notebook.title}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{notebook.pages_count}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <StickyNote className="h-4 w-4 text-muted-foreground" />
                      <span>{notebook.notes_count}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(notebook.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleRenameClick(notebook, e)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleDeleteClick(notebook, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rename dialog */}
      <AlertDialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Notebook</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for "{notebookToRename?.title}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="Notebook name"
              disabled={isRenaming}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameConfirm();
                }
              }}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRenaming}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRenameConfirm}
              disabled={isRenaming || !newName.trim()}
            >
              {isRenaming ? "Renaming..." : "Rename"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notebook?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{notebookToDelete?.title}"? This will permanently
              delete the notebook and all its pages and notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
