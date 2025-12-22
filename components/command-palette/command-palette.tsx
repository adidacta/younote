"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BookOpen, FileText, Plus, Search, StickyNote } from "lucide-react";

interface Notebook {
  id: string;
  title: string;
}

interface Page {
  id: string;
  notebook_id: string;
  title: string;
  video_title: string;
}

interface Note {
  id: string;
  page_id: string;
  content: string;
  timestamp_seconds: number | null;
}

interface CommandPaletteProps {
  notebooks: Notebook[];
  pages: Page[];
  notes: Note[];
}

export function CommandPalette({ notebooks, pages, notes }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter items based on search
  const filteredNotebooks = notebooks.filter((notebook) =>
    notebook.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(search.toLowerCase()) ||
      page.video_title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotes = notes
    .filter((note) =>
      note.content.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 10); // Limit to 10 results to avoid overwhelming the UI

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  // Helper to get a snippet of note content for display
  const getNoteSnippet = (content: string, searchTerm: string, maxLength: number = 100) => {
    // Remove markdown formatting for cleaner display
    const cleanContent = content.replace(/[#*`~\[\]]/g, '');

    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }

    // Find the search term and show context around it
    const lowerContent = cleanContent.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const index = lowerContent.indexOf(lowerSearch);

    if (index === -1) {
      return cleanContent.substring(0, maxLength) + '...';
    }

    // Show 30 chars before and 70 chars after the match
    const start = Math.max(0, index - 30);
    const end = Math.min(cleanContent.length, index + searchTerm.length + 70);

    let snippet = cleanContent.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < cleanContent.length) snippet = snippet + '...';

    return snippet;
  };

  // Helper to format timestamp
  const formatTimestamp = (seconds: number | null) => {
    if (seconds === null) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to get notebook_id for a note
  const getNotebookIdForNote = (note: Note) => {
    const page = pages.find(p => p.id === note.page_id);
    return page?.notebook_id;
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => {
          if (!open) {
            setOpen(true);
          }
        }}
        className="flex items-center justify-between gap-3 px-5 py-2 text-sm text-foreground/70 rounded-lg border-2 border-input bg-muted/30 hover:bg-muted/50 hover:border-foreground/20 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
      >
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5" />
          <span className="font-medium">Search notebooks, pages, notes...</span>
        </div>
        <kbd className="pointer-events-none hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-foreground/20 bg-background px-2 font-mono text-xs font-medium text-muted-foreground shadow-sm">
          <span className="text-sm">⌘</span>K
        </kbd>
      </button>

      {/* Command dialog */}
      <CommandDialog open={open} onOpenChange={setOpen} modal={false}>
        <CommandInput
          placeholder="Search notebooks, pages, notes..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </CommandEmpty>

            {/* Quick Actions */}
            <CommandGroup heading="Quick Actions" className="mb-2">
              <CommandItem
                onSelect={() => handleSelect(() => router.push("/notebooks"))}
                className="px-3 py-2.5"
              >
                <Plus className="mr-3 h-4 w-4" />
                <span>New Notebook</span>
              </CommandItem>
            </CommandGroup>

            {/* Notebooks */}
            {filteredNotebooks.length > 0 && (
              <CommandGroup heading="Notebooks" className="mb-2">
                {filteredNotebooks.map((notebook) => (
                  <CommandItem
                    key={notebook.id}
                    onSelect={() =>
                      handleSelect(() => router.push(`/notebooks/${notebook.id}`))
                    }
                    className="px-3 py-2.5"
                  >
                    <BookOpen className="mr-3 h-4 w-4" />
                    <span>{notebook.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Pages */}
            {filteredPages.length > 0 && (
              <CommandGroup heading="Pages" className="mb-2">
                {filteredPages.map((page) => (
                  <CommandItem
                    key={page.id}
                    onSelect={() =>
                      handleSelect(() =>
                        router.push(
                          `/notebooks/${page.notebook_id}/pages/${page.id}`
                        )
                      )
                    }
                    className="px-3 py-2.5"
                  >
                    <FileText className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{page.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {page.video_title}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Notes */}
            {filteredNotes.length > 0 && (
              <CommandGroup heading="Notes" className="mb-2">
                {filteredNotes.map((note) => {
                  const notebookId = getNotebookIdForNote(note);
                  if (!notebookId) return null;

                  return (
                    <CommandItem
                      key={note.id}
                      onSelect={() =>
                        handleSelect(() =>
                          router.push(
                            `/notebooks/${notebookId}/pages/${note.page_id}?note=${note.id}&q=${encodeURIComponent(search)}`
                          )
                        )
                      }
                      className="px-3 py-2.5"
                    >
                      <StickyNote className="mr-3 h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm truncate">
                          {note.timestamp_seconds !== null && (
                            <span className="text-muted-foreground mr-2">
                              {formatTimestamp(note.timestamp_seconds)}
                            </span>
                          )}
                          {getNoteSnippet(note.content, search)}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
      </CommandDialog>
    </>
  );
}
