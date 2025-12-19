"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function MarkdownGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-muted/50 transition-colors text-sm font-medium"
      >
        <span className="text-muted-foreground">Markdown Formatting</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 space-y-3 text-xs font-mono">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded"># Heading 1</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">## Heading 2</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">**bold**</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">*italic*</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">~~strike~~</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">`code`</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">- item</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">1. item</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">- [ ] task</code>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> <code className="bg-background px-1.5 py-0.5 rounded">[link](url)</code>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-muted-foreground text-[11px]">
              Shortcuts: <kbd className="bg-background px-1.5 py-0.5 rounded">⌘B</kbd> bold • <kbd className="bg-background px-1.5 py-0.5 rounded">⌘I</kbd> italic • <kbd className="bg-background px-1.5 py-0.5 rounded">⌘K</kbd> link • <kbd className="bg-background px-1.5 py-0.5 rounded">⌘⏎</kbd> save
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
