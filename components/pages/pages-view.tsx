"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { LayoutGrid, Table2, Play, StickyNote, Clock, MoreVertical, Pencil, Trash2, FolderInput } from "lucide-react";
import type { Page, Notebook } from "@/types/database";
import { toast } from "sonner";

interface PageWithStats extends Page {
  notes_count: number;
}

interface PagesViewProps {
  pages: PageWithStats[];
  notebookId: string;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function PagesView({ pages, notebookId }: PagesViewProps) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageWithStats | null>(null);
  const [pageToRename, setPageToRename] = useState<PageWithStats | null>(null);
  const [pageToMove, setPageToMove] = useState<PageWithStats | null>(null);
  const [newName, setNewName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState("");
  const router = useRouter();

  // Fetch notebooks for move dialog
  useEffect(() => {
    async function fetchNotebooks() {
      try {
        const response = await fetch('/api/notebooks');
        if (response.ok) {
          const data = await response.json();
          setNotebooks(data);
        }
      } catch (error) {
        console.error('Error fetching notebooks:', error);
      }
    }
    fetchNotebooks();
  }, []);

  const handleRenameClick = (page: PageWithStats, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPageToRename(page);
    setNewName(page.title);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = async () => {
    if (!pageToRename || !newName.trim()) return;

    setIsRenaming(true);
    try {
      const response = await fetch(`/api/pages/${pageToRename.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename page');
      }

      toast.success('Page renamed');
      router.refresh();
      setRenameDialogOpen(false);
    } catch (error) {
      console.error('Error renaming page:', error);
      toast.error('Failed to rename page');
    } finally {
      setIsRenaming(false);
      setPageToRename(null);
      setNewName("");
    }
  };

  const handleMoveClick = (page: PageWithStats, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPageToMove(page);
    setSelectedNotebookId("");
    setMoveDialogOpen(true);
  };

  const handleMoveConfirm = async () => {
    if (!pageToMove || !selectedNotebookId) return;

    setIsMoving(true);
    try {
      const response = await fetch(`/api/pages/${pageToMove.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notebook_id: selectedNotebookId }),
      });

      if (!response.ok) {
        throw new Error('Failed to move page');
      }

      toast.success('Page moved successfully');
      router.refresh();
      setMoveDialogOpen(false);
    } catch (error) {
      console.error('Error moving page:', error);
      toast.error('Failed to move page');
    } finally {
      setIsMoving(false);
      setPageToMove(null);
      setSelectedNotebookId("");
    }
  };

  const handleDeleteClick = (page: PageWithStats, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete page');
      }

      toast.success('Page deleted');
      router.refresh();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    } finally {
      setIsDeleting(false);
      setPageToDelete(null);
    }
  };

  if (pages.length === 0) {
    return null;
  }

  return (
    <div>
      {/* View toggle - hidden on mobile */}
      <div className="hidden md:flex justify-end mb-4">
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
          {pages.map((page) => (
            <div key={page.id} className="group relative">
              <Link href={`/notebooks/${notebookId}/pages/${page.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-full">
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
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(page.duration_seconds)}
                    </div>
                  </div>
                  <CardHeader className="pr-12">
                    <CardTitle className="line-clamp-2" dir="auto">{page.title}</CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="line-clamp-1">{page.channel_name}</div>
                      <div className="flex items-center gap-1.5 text-xs pt-1">
                        <StickyNote className="h-3.5 w-3.5" />
                        <span className="font-medium">{page.notes_count}</span>
                        <span className="text-muted-foreground">
                          {page.notes_count === 1 ? "note" : "notes"}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {/* Kebab menu */}
              <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleRenameClick(page, e)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleMoveClick(page, e)}>
                      <FolderInput className="mr-2 h-4 w-4" />
                      Move to...
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleDeleteClick(page, e)}>
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
                <th className="text-left p-4 font-semibold w-16"></th>
                <th className="text-left p-4 font-semibold">Page Title</th>
                <th className="text-left p-4 font-semibold">Channel</th>
                <th className="text-left p-4 font-semibold">Duration</th>
                <th className="text-left p-4 font-semibold">Notes</th>
                <th className="text-left p-4 font-semibold">Created</th>
                <th className="text-left p-4 font-semibold w-16"></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b last:border-b-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/notebooks/${notebookId}/pages/${page.id}`)}
                >
                  <td className="p-4">
                    <div className="relative w-12 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={page.thumbnail_url}
                        alt={page.video_title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium line-clamp-2" dir="auto">
                      {page.title}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {page.channel_name}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDuration(page.duration_seconds)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <StickyNote className="h-4 w-4 text-muted-foreground" />
                      <span>{page.notes_count}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(page.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleRenameClick(page, e)}
                        title="Rename"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleMoveClick(page, e)}
                        title="Move to..."
                      >
                        <FolderInput className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleDeleteClick(page, e)}
                        title="Delete"
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
            <AlertDialogTitle>Rename Page</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for "{pageToRename?.title}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="Page name"
              maxLength={40}
              disabled={isRenaming}
              dir="auto"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameConfirm();
                }
              }}
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {newName.length}/40 characters
            </p>
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
            <AlertDialogTitle>Delete Page?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{pageToDelete?.title}"? This will permanently
              delete the page and all its notes. This action cannot be undone.
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

      {/* Move dialog */}
      <AlertDialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Page</AlertDialogTitle>
            <AlertDialogDescription>
              Move "{pageToMove?.title}" to another notebook
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <select
              value={selectedNotebookId}
              onChange={(e) => setSelectedNotebookId(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              disabled={isMoving}
              autoFocus
            >
              <option value="">Select a notebook...</option>
              {notebooks
                .filter(nb => nb.id !== notebookId)
                .map(notebook => (
                  <option key={notebook.id} value={notebook.id}>
                    {notebook.title}
                  </option>
                ))}
            </select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMoveConfirm}
              disabled={isMoving || !selectedNotebookId}
            >
              {isMoving ? "Moving..." : "Move"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
