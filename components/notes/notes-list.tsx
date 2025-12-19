"use client";

import { Note } from "@/types/database";
import { NoteItem } from "./note-item";
import { NewNoteCard } from "./new-note-card";

interface NotesListProps {
  notes: Note[];
  pageId: string;
  videoId: string;
}

export function NotesList({ notes, pageId, videoId }: NotesListProps) {
  return (
    <div className="space-y-6">
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
            <NoteItem key={note.id} note={note} videoId={videoId} />
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
