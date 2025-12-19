"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NewNoteButtonProps {
  pageId: string;
}

export function NewNoteButton({ pageId }: NewNoteButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleNewNote = async () => {
    setIsCreating(true);

    try {
      // Get current timestamp from YouTube player
      let timestampSeconds: number | null = null;
      const player = (window as any).youtubePlayer;

      if (player && typeof player.getCurrentTime === 'function') {
        timestampSeconds = Math.floor(player.getCurrentTime());
      }

      // Create new note
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: pageId,
          content: '',
          timestamp_seconds: timestampSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      toast.success('Note created!');
      router.refresh();
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      onClick={handleNewNote}
      disabled={isCreating}
      size="sm"
    >
      <Plus className="h-4 w-4 mr-2" />
      {isCreating ? 'Creating...' : 'New Note'}
    </Button>
  );
}
