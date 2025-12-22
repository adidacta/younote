"use client";

import { Note } from "@/types/database";
import { NoteItem } from "./note-item";
import { NewNoteCard } from "./new-note-card";
import { useEffect, useRef } from "react";

interface NotesListProps {
  notes: Note[];
  pageId: string;
  videoId: string;
  highlightNoteId?: string;
  searchQuery?: string;
}

export function NotesList({
  notes,
  pageId,
  videoId,
  highlightNoteId,
  searchQuery,
}: NotesListProps) {
  const noteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to highlighted note
  useEffect(() => {
    if (highlightNoteId && noteRefs.current[highlightNoteId]) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        noteRefs.current[highlightNoteId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [highlightNoteId]);
  return (
    <div className="space-y-6 pb-[50vh]">
      {/* Always show new note card at top */}
      <NewNoteCard pageId={pageId} />

      {/* Separator if there are existing notes */}
      {notes.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Previous Notes
            </span>
          </div>
        </div>
      )}

      {/* Existing notes */}
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              data-note-id={note.id}
              ref={(el) => {
                noteRefs.current[note.id] = el;
              }}
            >
              <NoteItem
                note={note}
                videoId={videoId}
                isHighlighted={note.id === highlightNoteId}
                searchQuery={searchQuery}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No previous notes</p>
        </div>
      )}
    </div>
  );
}
