"use client";

import { Smile, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const EMOJIS = ["👀", "✅", "⭐", "❤️", "💡", "❓", "🔥", "📌"];

interface EmojiPickerProps {
  currentEmoji?: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EmojiPicker({ currentEmoji, onEmojiSelect, disabled, onOpenChange }: EmojiPickerProps) {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
          title={currentEmoji ? `Current: ${currentEmoji} - Click to change` : "Add emoji"}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto min-w-0">
        <div className="grid grid-cols-4 gap-1 p-1">
          {EMOJIS.map((emoji) => (
            <DropdownMenuItem
              key={emoji}
              onClick={() => onEmojiSelect(emoji)}
              className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer hover:bg-muted"
            >
              <span className="text-base">{emoji}</span>
            </DropdownMenuItem>
          ))}
        </div>
        {currentEmoji && (
          <>
            <div className="h-px bg-border my-1" />
            <DropdownMenuItem
              onClick={() => onEmojiSelect(null)}
              className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer"
            >
              <X className="h-3 w-3" />
              Remove emoji
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
