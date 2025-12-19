"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Download, Mail, MessageCircle, Check } from "lucide-react";
import { exportToMarkdown, downloadMarkdown } from "@/lib/markdown/export-to-markdown";
import { Note } from "@/types/database";
import { toast } from "sonner";

interface ShareDialogProps {
  pageId: string;
  pageTitle: string;
  videoTitle: string;
  videoId: string;
  videoUrl: string;
  notes: Note[];
}

export function ShareDialog({
  pageId,
  pageTitle,
  videoTitle,
  videoId,
  videoUrl,
  notes,
}: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateShareLink = async () => {
    if (shareUrl) return; // Already generated

    setIsGenerating(true);
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate share link");
      }

      const data = await response.json();
      const url = `${window.location.origin}/share/${data.share_token}`;
      setShareUrl(url);
      toast.success("Share link generated!");
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error("Failed to generate share link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      const markdown = exportToMarkdown({
        pageTitle,
        videoTitle,
        videoId,
        videoUrl,
        notes,
      });
      downloadMarkdown(pageTitle, markdown);
      toast.success("Markdown file downloaded!");
    } catch (error) {
      console.error("Failed to download:", error);
      toast.error("Failed to download markdown");
    }
  };

  const handleShareViaEmail = () => {
    const markdown = exportToMarkdown({
      pageTitle,
      videoTitle,
      videoId,
      videoUrl,
      notes,
    });
    const subject = encodeURIComponent(`Notes: ${pageTitle}`);
    const body = encodeURIComponent(markdown);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleShareViaWhatsApp = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`Check out my notes: ${pageTitle}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this page</DialogTitle>
          <DialogDescription>
            Share your notes with others or export them
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Public Link Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Public Link</h4>
            <p className="text-xs text-muted-foreground">
              Anyone with the link can view this page (no sign-in required)
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateShareLink}
                disabled={isGenerating || !!shareUrl}
                className="flex-1"
                variant={shareUrl ? "secondary" : "default"}
              >
                {isGenerating
                  ? "Generating..."
                  : shareUrl
                  ? "Link Generated"
                  : "Generate Link"}
              </Button>
              {shareUrl && (
                <Button
                  onClick={handleCopyLink}
                  size="icon"
                  variant="outline"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {shareUrl && (
              <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                {shareUrl}
              </div>
            )}
          </div>

          {/* Share Via Section */}
          {shareUrl && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Share Via</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleShareViaWhatsApp}
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleShareViaEmail}
                  variant="outline"
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          )}

          {/* Export Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Export</h4>
            <Button
              onClick={handleDownloadMarkdown}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as Markdown
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
