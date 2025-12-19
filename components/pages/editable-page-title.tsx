"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface EditablePageTitleProps {
  pageId: string;
  initialTitle: string;
}

export function EditablePageTitle({ pageId, initialTitle }: EditablePageTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Page title cannot be empty");
      setTitle(initialTitle);
      setIsEditing(false);
      return;
    }

    if (title.trim() === initialTitle) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update page title');
      }

      toast.success('Page title updated');
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating page title:', error);
      toast.error('Failed to update page title');
      setTitle(initialTitle);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        disabled={isSaving}
        className="text-foreground bg-background border border-primary rounded px-1 py-0.5 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-primary"
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-foreground hover:text-primary transition-colors truncate cursor-pointer inline-flex items-center gap-1"
    >
      <span>{title}</span>
      {isHovered && <Pencil className="h-3 w-3 flex-shrink-0" />}
    </button>
  );
}
