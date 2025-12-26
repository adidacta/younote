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
import { EmojiPicker } from "./emoji-picker";

interface NoteItemProps {
  note: Note;
  videoId: string;
  isHighlighted?: boolean;
  searchQuery?: string;
  readOnly?: boolean; // For shared notes view
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function NoteItem({ note, videoId, isHighlighted, searchQuery, readOnly = false }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [emoji, setEmoji] = useState(note.emoji);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showHighlight, setShowHighlight] = useState(isHighlighted);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fade out highlight after 3 seconds
  useEffect(() => {
    if (isHighlighted) {
      setShowHighlight(true);
      const timer = setTimeout(() => setShowHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  // Debounce content changes for auto-save
  const debouncedContent = useDebounce(content, 800);

  // Auto-focus on new empty notes (but not in read-only mode)
  useEffect(() => {
    if (!note.content && !isEditing && !readOnly) {
      setIsEditing(true);
    }
  }, [note.content, readOnly]);

  // Check if content is truncated
  useEffect(() => {
    if (!isEditing && contentRef.current) {
      const checkTruncation = () => {
        const element = contentRef.current;
        if (element) {
          // Check if content height exceeds 200px
          const isTruncatedNow = element.scrollHeight > 200;
          setIsTruncated(isTruncatedNow);
        }
      };

      // Check immediately
      checkTruncation();

      // Check again after a short delay to ensure content is rendered
      const timer = setTimeout(checkTruncation, 100);
      return () => clearTimeout(timer);
    }
  }, [content, isEditing]);

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
    try {
      // Generate share link for this individual note
      const response = await fetch('/api/share/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_id: note.id })
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const { share_token } = await response.json();
      const shareUrl = `${window.location.origin}/share/note/${share_token}`;

      await navigator.clipboard.writeText(shareUrl);
      toast.success('Note share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to share note:', err);
      toast.error('Failed to generate share link');
    }
  };

  const handleEmojiSelect = async (selectedEmoji: string | null) => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: selectedEmoji }),
      });

      if (!response.ok) {
        throw new Error('Failed to update emoji');
      }

      setEmoji(selectedEmoji);
      router.refresh();
    } catch (error) {
      console.error('Error updating emoji:', error);
      toast.error('Failed to update emoji');
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
    <Card
      className={`group/card hover:shadow-md transition-all duration-200 ${
        showHighlight
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg'
          : ''
      }`}
    >
      <CardContent className="pt-4 relative">
        {/* Hover Toolbar */}
        <div className={`absolute -top-3 right-4 transition-all duration-200 flex gap-1 bg-background border border-border rounded-lg shadow-lg p-1 z-10 ${
          isEmojiPickerOpen ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
        }`}>
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

          {/* Emoji Picker - only show if not read-only */}
          {!readOnly && (
            <EmojiPicker
              currentEmoji={emoji}
              onEmojiSelect={handleEmojiSelect}
              onOpenChange={setIsEmojiPickerOpen}
            />
          )}

          {/* Edit - only show if not read-only */}
          {!readOnly && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500"
              onClick={() => setIsEditing(true)}
              title="Edit note"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}

          {/* Delete - only show if not read-only */}
          {!readOnly && (
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
          )}
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
                className="min-h-[150px] font-[family-name:var(--font-noto-sans-hebrew)] text-sm border-primary/20 focus:border-primary focus:ring-primary/20"
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
              <>
                <div className="relative">
                  <div
                    ref={contentRef}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      !isExpanded && isTruncated ? 'max-h-[200px]' : ''
                    }`}
                    style={isExpanded ? { maxHeight: 'none' } : undefined}
                  >
                    <MarkdownRenderer
                    content={content}
                    searchQuery={searchQuery}
                    onContentChange={async (newContent) => {
                      // Update content state for frontend display
                      setContent(newContent);

                      // Only save to database if not in read-only mode
                      if (readOnly) return;

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
                  </div>
                  {/* Fade gradient overlay when truncated */}
                  {!isExpanded && isTruncated && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                  )}
                </div>
                {isTruncated && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm italic py-4">
                Empty note - hover and click edit to add content
              </p>
            )}
          </div>
        )}

        {/* Metadata with improved styling */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {emoji && (
              <span className="text-base" title="Note status">
                {emoji}
              </span>
            )}
            <span>{new Date(note.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            {note.updated_at !== note.created_at && (
              <span className="text-muted-foreground/70">Edited</span>
            )}
            {note.timestamp_seconds != null && note.timestamp_seconds >= 0 && (
              <button
                onClick={handleTimestampClick}
                className="inline-flex items-center gap-1 font-mono text-foreground hover:text-primary transition-colors cursor-pointer"
                title={`Jump to ${formatTimestamp(note.timestamp_seconds)}`}
              >
                {formatTimestamp(note.timestamp_seconds)}
                <Play className="h-3 w-3 fill-current" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
