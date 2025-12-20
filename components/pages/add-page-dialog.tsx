"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddPageDialogProps {
  notebookId: string;
  children: React.ReactNode;
}

export function AddPageDialog({ notebookId, children }: AddPageDialogProps) {
  const [open, setOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const router = useRouter();

  const handleFetchMetadata = async () => {
    if (!youtubeUrl.trim()) return;

    setIsFetchingMetadata(true);
    setError(null);
    setMetadata(null);

    try {
      const response = await fetch(
        `/api/youtube/metadata?url=${encodeURIComponent(youtubeUrl)}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch video metadata");
      }

      const data = await response.json();
      setMetadata(data.metadata);
      // Truncate title to 120 characters
      setTitle(data.metadata.video_title.slice(0, 120));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch video");
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata || !title.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notebook_id: notebookId,
          youtube_url: youtubeUrl,
          title: title.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create page");
      }

      const data = await response.json();
      setOpen(false);
      setYoutubeUrl("");
      setTitle("");
      setMetadata(null);
      router.refresh();
      router.push(`/notebooks/${notebookId}/pages/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setYoutubeUrl("");
      setTitle("");
      setMetadata(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle>Add Page</DialogTitle>
            <DialogDescription>
              Add a new page with a YouTube video to this notebook
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <div className="flex gap-2">
                <Input
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={isFetchingMetadata || Boolean(metadata)}
                  required
                  autoFocus
                />
                {!metadata && (
                  <Button
                    type="button"
                    onClick={handleFetchMetadata}
                    disabled={!youtubeUrl.trim() || isFetchingMetadata}
                  >
                    {isFetchingMetadata ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Fetch"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {metadata && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="title">Page Name</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter page name"
                    maxLength={120}
                    required
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Auto-filled from video title, but you can customize it</span>
                    <span>{title.length}/120</span>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <p className="text-sm font-medium mb-1">Video Details:</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Video:</span> {metadata.video_title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Channel:</span> {metadata.channel_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Duration:</span> {Math.floor(metadata.duration_seconds / 60)}m {metadata.duration_seconds % 60}s
                  </p>
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {metadata && (
              <Button type="submit" disabled={isLoading || !title.trim()}>
                {isLoading ? "Creating..." : "Create Page"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
