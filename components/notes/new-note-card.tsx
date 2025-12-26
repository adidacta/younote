"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownToolbar } from "./markdown-toolbar";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface NewNoteCardProps {
  pageId: string;
}

export function NewNoteCard({ pageId }: NewNoteCardProps) {
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [capturedTimestamp, setCapturedTimestamp] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleInsertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd+Enter (Mac) or Ctrl+Enter (Windows) to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveNote();
      return;
    }

    // Enter key to continue list/checkbox pattern
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];

      // Check for checkbox pattern
      const checkboxMatch = currentLine.match(/^(\s*)- \[([ x])\]\s/);
      if (checkboxMatch) {
        e.preventDefault();
        const indent = checkboxMatch[1];
        const newLine = `\n${indent}- [ ] `;
        const newContent = content.substring(0, cursorPos) + newLine + content.substring(cursorPos);
        setContent(newContent);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPos + newLine.length;
        }, 0);
        return;
      }

      // Check for bullet list pattern
      const bulletMatch = currentLine.match(/^(\s*)- (.+)/);
      if (bulletMatch) {
        e.preventDefault();
        const indent = bulletMatch[1];
        const newLine = `\n${indent}- `;
        const newContent = content.substring(0, cursorPos) + newLine + content.substring(cursorPos);
        setContent(newContent);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPos + newLine.length;
        }, 0);
        return;
      }

      // Check for numbered list pattern
      const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.+)/);
      if (numberedMatch) {
        e.preventDefault();
        const indent = numberedMatch[1];
        const nextNumber = parseInt(numberedMatch[2]) + 1;
        const newLine = `\n${indent}${nextNumber}. `;
        const newContent = content.substring(0, cursorPos) + newLine + content.substring(cursorPos);
        setContent(newContent);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPos + newLine.length;
        }, 0);
        return;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Capture timestamp on first keystroke (but don't create note yet)
    if (capturedTimestamp === null && newContent.length > 0) {
      const player = (window as any).youtubePlayer;
      if (player && typeof player.getCurrentTime === 'function') {
        const timestamp = Math.floor(player.getCurrentTime());
        setCapturedTimestamp(timestamp);
      }
    }
  };

  const handleSaveNote = async () => {
    if (!content.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    setIsCreating(true);

    try {
      // Create new note with captured timestamp
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: pageId,
          content: content.trim(),
          timestamp_seconds: capturedTimestamp,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      // Reset for new note
      setContent("");
      setCapturedTimestamp(null);
      toast.success('Note saved!');
      router.refresh();
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 shadow-sm hover:shadow-md">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <MarkdownToolbar onInsert={handleInsertMarkdown} />

          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your note... (timestamp will be captured on first keystroke)"
            className="min-h-[120px] font-[family-name:var(--font-noto-sans-hebrew)] text-sm border-primary/20 focus:border-primary focus:ring-primary/20 bg-background"
            dir="auto"
            disabled={isCreating}
          />

          <div className="flex items-center justify-between">
            <div className="text-xs">
              {capturedTimestamp !== null && (
                <span className="text-primary font-medium flex items-center gap-1.5 bg-primary/10 px-2.5 py-1.5 rounded-md">
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Timestamp captured
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleSaveNote}
              disabled={isCreating || !content.trim()}
              className="rounded-md shadow-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
