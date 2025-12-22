"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";

interface Chapter {
  timestamp: number; // in seconds
  title: string;
}

interface VideoInfoTabsProps {
  description: string;
  videoId: string;
  className?: string;
}

export function VideoInfoTabs({
  description,
  videoId,
  className = "",
}: VideoInfoTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  // Parse chapters from description
  const chapters = parseChapters(description);

  const handleChapterClick = (timestamp: number) => {
    // Seek video to timestamp and start playing
    const player = (window as any).youtubePlayer;
    if (player && typeof player.seekTo === 'function') {
      player.seekTo(timestamp, true);
      if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
    }
  };

  return (
    <div className={`${className} transition-opacity duration-200 opacity-70 hover:opacity-100`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="description" className="flex-1">
            Description
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex-1">
            Transcript
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-4">
          <div className="bg-muted/30 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            {/* Chapters Section */}
            {chapters.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Chapters
                </h3>
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => handleChapterClick(chapter.timestamp)}
                      className="w-full text-left p-2 rounded hover:bg-accent transition-colors group flex items-start gap-3"
                    >
                      <span className="text-xs font-mono text-muted-foreground group-hover:text-primary min-w-[48px]">
                        {formatTimestamp(chapter.timestamp)}
                      </span>
                      <span className="text-sm flex-1">{chapter.title}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-border mt-4 mb-4" />
              </div>
            )}

            {/* Full Description */}
            {description ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description available for this video.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="mt-4">
          <div className="bg-muted/30 rounded-lg p-4 text-center py-12">
            <p className="text-muted-foreground text-sm">
              Transcript feature coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Parse chapters from video description
 * Chapters format: "0:00 Title" or "1:23 Title" or "1:23:45 Title"
 */
function parseChapters(description: string): Chapter[] {
  if (!description) return [];

  const lines = description.split('\n');
  const chapters: Chapter[] = [];

  // Regex to match timestamps at start of line: 0:00, 1:23, 1:23:45
  const timestampRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(.+)$/;

  for (const line of lines) {
    const match = line.trim().match(timestampRegex);
    if (match) {
      const hours = match[3] ? parseInt(match[1]) : 0;
      const minutes = match[3] ? parseInt(match[2]) : parseInt(match[1]);
      const seconds = match[3] ? parseInt(match[3]) : parseInt(match[2]);
      const title = match[4].trim();

      const timestamp = hours * 3600 + minutes * 60 + seconds;
      chapters.push({ timestamp, title });
    }
  }

  return chapters;
}

/**
 * Format seconds to MM:SS or H:MM:SS
 */
function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
