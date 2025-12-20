"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Note } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2, Loader2, Play, Share2 } from "lucide-react";
import { formatTimestamp } from "@/lib/youtube/format-timestamp";
import { generateTimestampUrl } from "@/lib/youtube/generate-timestamp-url";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { MarkdownToolbar } from "./markdown-toolbar";
import { MarkdownRenderer } from "../markdown/markdown-renderer";
import { toast } from "sonner";

interface NoteItemProps {
  note: Note;
  videoId: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function NoteItem({ note, videoId }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debounce content changes for auto-save
  const debouncedContent = useDebounce(content, 800);

  // Auto-focus on new empty notes
  useEffect(() => {
    if (!note.content && !isEditing) {
      setIsEditing(true);
    }
  }, [note.content]);

  // Auto-save when debounced content changes
  useEffect(() => {
    // Only auto-save if:
    // 1. We're in editing mode
    // 2. Content has actually changed from the original
    // 3. Not the initial render (check if debouncedContent !== note.content)
    if (isEditing && debouncedContent !== note.content) {
      handleAutoSave();
    }
  }, [debouncedContent]);

  const handleAutoSave = async () => {
    setSaveState('saving');

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: debouncedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      setSaveState('saved');

      // Reset to idle after 2 seconds
      setTimeout(() => setSaveState('idle'), 2000);

      router.refresh();
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveState('error');
      toast.error('Failed to save note');

      // Reset error state after 3 seconds
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      toast.success('Note deleted');
      router.refresh();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      setIsDeleting(false);
    }
  };

  const handleTimestampClick = () => {
    const player = (window as any).youtubePlayer;
    if (player && typeof player.seekTo === 'function' && note.timestamp_seconds) {
      player.seekTo(note.timestamp_seconds, true);
    }
  };

  const handleShare = async () => {
    const shareUrl = generateTimestampUrl(videoId, note.timestamp_seconds || 0);
    const shareText = `Check out this YouNote I made: ${note.content}. Watch the clip here: ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Note copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy note');
    }
  };

  const handleInsertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    // Insert markdown syntax around selected text
    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Keyboard shortcuts for markdown formatting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return;

      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key === 'b') {
        e.preventDefault();
        handleInsertMarkdown('**', '**');
      } else if (isMod && e.key === 'i') {
        e.preventDefault();
        handleInsertMarkdown('*', '*');
      } else if (isMod && e.key === 'k') {
        e.preventDefault();
        handleInsertMarkdown('[', '](url)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, content]);

  return (
    <Card className="group/card hover:shadow-md transition-all duration-200">
      <CardContent className="pt-4 relative">
        {/* Hover Toolbar */}
        <div className="absolute -top-3 right-4 opacity-0 group-hover/card:opacity-100 transition-all duration-200 flex gap-1 bg-background border border-border rounded-lg shadow-lg p-1 z-10">
          {/* Play - Skip to timestamp */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            onClick={handleTimestampClick}
            disabled={note.timestamp_seconds == null}
            title={note.timestamp_seconds != null ? `Jump to ${formatTimestamp(note.timestamp_seconds)}` : 'No timestamp'}
          >
            <Play className="h-4 w-4 fill-current" />
          </Button>

          {/* Share */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500"
            onClick={handleShare}
            title="Copy link to clipboard"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          {/* Edit */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500"
            onClick={() => setIsEditing(true)}
            title="Edit note"
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          {/* Delete */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Note content */}
        {isEditing ? (
          <div className="space-y-3">
            {/* Markdown toolbar */}
            <MarkdownToolbar onInsert={handleInsertMarkdown} />

            {/* Simple editor - no preview */}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note in markdown...

# Heading 1
## Heading 2
**bold** *italic* ~~strikethrough~~
- bullet list
1. numbered list
- [ ] checkbox"
                className="min-h-[150px] font-mono text-sm border-primary/20 focus:border-primary focus:ring-primary/20"
                dir="auto"
                autoFocus
              />
              {/* Subtle save state indicator */}
              {(saveState === 'saving' || saveState === 'error') && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-muted-foreground bg-background/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-sm border border-border">
                  {saveState === 'saving' && (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  )}
                  {saveState === 'error' && (
                    <span className="text-destructive">Failed to save</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setContent(note.content);
                  setIsEditing(false);
                  setSaveState('idle');
                }}
                className="rounded-md"
              >
                Done Editing
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative" dir="auto">
            {content ? (
              <MarkdownRenderer
                content={content}
                onContentChange={async (newContent) => {
                  // Auto-save when checkbox is toggled
                  setContent(newContent);
                  try {
                    await fetch(`/api/notes/${note.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content: newContent }),
                    });
                    router.refresh();
                  } catch (error) {
                    console.error('Error saving note:', error);
                    toast.error('Failed to save checkbox state');
                  }
                }}
                editable={true}
              />
            ) : (
              <p className="text-muted-foreground text-sm italic py-4">
                Empty note - hover and click edit to add content
              </p>
            )}
          </div>
        )}

        {/* Metadata with improved styling */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Date(note.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
          <div className="flex items-center gap-2">
            {note.updated_at !== note.created_at && (
              <span className="text-muted-foreground/70">Edited</span>
            )}
            {note.timestamp_seconds != null && note.timestamp_seconds >= 0 && (
              <button
                onClick={handleTimestampClick}
                className="inline-flex items-center gap-1 font-mono text-primary hover:text-primary/80 transition-colors cursor-pointer"
                title={`Jump to ${formatTimestamp(note.timestamp_seconds)}`}
              >
                {formatTimestamp(note.timestamp_seconds)}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
