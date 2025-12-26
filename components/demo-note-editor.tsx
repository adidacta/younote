"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit2, Trash2, Play, Share2, Sparkles } from "lucide-react";
import { MarkdownRenderer } from "./markdown/markdown-renderer";
import { MarkdownToolbar } from "./notes/markdown-toolbar";
import { EmojiPicker } from "./notes/emoji-picker";
import { toast } from "sonner";

const DEMO_CONTENT = `# Welcome to YouNote!

This is an **interactive demo** - try hovering over this card to see the action bar.

## Key Features:
- 📝 Take notes on YouTube videos
- ⏰ Every note saves the timestamp
- 🎯 Click to jump back instantly
- 📂 Organize by topic

## Try it yourself:
- [ ] Click to check this box
- [ ] Click **Edit** to modify this note
- [ ] Click **Share** to see how sharing works

*Hover over the card to reveal the action bar!*`;

export function DemoNoteEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(DEMO_CONTENT);
  const [emoji, setEmoji] = useState("✨");

  const handleInsertMarkdown = (before: string, after: string = '') => {
    // Simple markdown insertion for demo
    const newContent = content + `\n${before}text${after}`;
    setContent(newContent);
  };

  const handleShare = () => {
    toast.success("In the real app, this would copy a share link to your clipboard!");
  };

  const handleDelete = () => {
    toast.info("Demo notes can't be deleted - sign up to save real notes!");
  };

  const handlePlay = () => {
    toast.info("This would jump to the timestamp in the video!");
  };

  const handleEmojiSelect = (selectedEmoji: string | null) => {
    setEmoji(selectedEmoji || "✨");
    toast.success("Emoji updated! In the real app, this saves automatically.");
  };

  return (
    <TooltipProvider>
      <Card className="group/card hover:shadow-md transition-all duration-200 relative border-2 border-primary/20 self-start">
      {/* "Try it" badge */}
      <div className="absolute -top-3 left-4 z-20">
        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          <Sparkles className="h-4 w-4" />
          Interactive Demo
        </div>
      </div>

      <CardContent className="pt-4 relative">
        {/* Action Bar (shows on hover) */}
        <div className="absolute -top-3 right-4 opacity-0 group-hover/card:opacity-100 transition-all duration-200 flex gap-1 bg-background border border-border rounded-lg shadow-lg p-1 z-10">
          {/* Play */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            onClick={handlePlay}
            title="Jump to timestamp"
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

          {/* Emoji Picker */}
          <EmojiPicker
            currentEmoji={emoji}
            onEmojiSelect={handleEmojiSelect}
          />

          {/* Edit */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500"
            onClick={() => setIsEditing(!isEditing)}
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
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Note Content */}
        {isEditing ? (
          <div className="space-y-3">
            <MarkdownToolbar onInsert={handleInsertMarkdown} />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note in markdown..."
              className="min-h-[200px] font-mono text-sm border-primary/20 focus:border-primary"
              dir="auto"
              autoFocus
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Done Editing
            </Button>
          </div>
        ) : (
          <div className="relative" dir="auto">
            <MarkdownRenderer
              content={content}
              editable={true}
              onContentChange={(newContent) => {
                setContent(newContent);
                toast.success("Checkbox toggled! In the real app, this saves automatically.");
              }}
            />
          </div>
        )}

        {/* Metadata Footer */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-base" title="Note status">
              {emoji}
            </span>
            <span>{new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handlePlay}
                  className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span className="text-muted-foreground/70">Timestamp:</span>
                  <span className="font-mono">2:45</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This skips the video to the right time of the note.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}
