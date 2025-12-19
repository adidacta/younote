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
import { BookOpen, FileText, Plus, Search } from "lucide-react";

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

interface CommandPaletteProps {
  notebooks: Notebook[];
  pages: Page[];
}

export function CommandPalette({ notebooks, pages }: CommandPaletteProps) {
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

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-between gap-2 w-full max-w-2xl px-4 py-2.5 text-sm text-muted-foreground rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Search...</span>
        </div>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search notebooks, pages..."
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
          </CommandList>
      </CommandDialog>
    </>
  );
}
