"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const DEMO_CONTENT = `# Try taking a note!

Click the timestamp button below to add the current video time.

**Key features:**
- Take notes on YouTube videos
- Every note saves the timestamp
- Click to jump back instantly
- Organize by topic

Try editing this text or adding a timestamp! 👇`;

export function DemoNoteEditor() {
  const [content, setContent] = useState(DEMO_CONTENT);
  const [demoTime, setDemoTime] = useState(42); // Demo video time in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddTimestamp = () => {
    const timestamp = `[${formatTime(demoTime)}](javascript:void(0))`;
    const cursorPos = content.length;
    const newContent = content + `\n\n${timestamp} `;
    setContent(newContent);

    // Increment demo time to show it's "playing"
    setDemoTime((prev) => prev + Math.floor(Math.random() * 30) + 10);
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* "Try it" badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg animate-pulse">
          <Sparkles className="h-4 w-4" />
          Click to try!
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Demo video player placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-border flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-4xl">▶️</div>
            <div className="text-sm text-muted-foreground">
              Demo Video Playing: {formatTime(demoTime)}
            </div>
          </div>
        </div>

        {/* Timestamp button */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddTimestamp}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Add Timestamp ({formatTime(demoTime)})
          </Button>
          <div className="text-xs text-muted-foreground flex items-center">
            Try clicking to add the current time to your note!
          </div>
        </div>

        {/* Note editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Note:</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] font-mono text-sm resize-none"
            placeholder="Click to start editing..."
          />
          <p className="text-xs text-muted-foreground">
            This is a live demo - try editing the text or adding timestamps!
          </p>
        </div>
      </div>
    </Card>
  );
}
