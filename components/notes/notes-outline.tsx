"use client";

import { useEffect, useState, useRef } from "react";
import { Note } from "@/types/database";

interface NotesOutlineProps {
  notes: Note[];
}

export function NotesOutline({ notes }: NotesOutlineProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );

  useEffect(() => {
    // Set up intersection observer to track visible notes
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Trigger when note is in top 30% of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting note
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        const noteId = visibleEntry.target.getAttribute("data-note-id");
        if (noteId) {
          setActiveNoteId(noteId);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all note cards
    const noteElements = document.querySelectorAll("[data-note-id]");
    noteElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [notes]);

  const scrollToNote = (noteId: string) => {
    const element = document.querySelector(`[data-note-id="${noteId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-20 self-start">
      <div className="flex flex-col gap-3 py-2 items-center min-w-[30px]">
        {notes.map((note) => {
          const isActive = activeNoteId === note.id;
          return (
            <button
              key={note.id}
              onClick={() => scrollToNote(note.id)}
              className="group relative transition-all duration-200"
              aria-label={`Jump to note ${notes.indexOf(note) + 1}`}
            >
              {isActive ? (
                // Filled dot for active note
                <div className="w-2.5 h-2.5 rounded-full bg-primary transition-all duration-200" />
              ) : (
                // Outlined dot for inactive notes
                <div className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary/50 transition-all duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
