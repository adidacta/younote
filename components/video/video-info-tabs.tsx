"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Loader2 } from "lucide-react";
import { SignUpBenefits } from "@/components/sharing/signup-benefits";

interface Chapter {
  timestamp: number; // in seconds
  title: string;
}

interface TranscriptEntry {
  text: string;
  offset: number; // in seconds
  duration: number;
}

interface VideoInfoTabsProps {
  description: string;
  videoId: string;
  className?: string;
  readOnly?: boolean; // For shared/public views - shows benefits instead of description
  shareToken?: string; // Required when readOnly is true
  shareType?: 'page' | 'note'; // Required when readOnly is true
}

export function VideoInfoTabs({
  description,
  videoId,
  className = "",
  readOnly = false,
  shareToken,
  shareType,
}: VideoInfoTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [transcript, setTranscript] = useState<TranscriptEntry[] | null>(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  // Parse chapters from description
  const chapters = parseChapters(description);

  // Fetch transcript when transcript tab is activated
  useEffect(() => {
    if (activeTab === "transcript" && !transcript && !isLoadingTranscript && !transcriptError) {
      fetchTranscript();
    }
  }, [activeTab, transcript, isLoadingTranscript, transcriptError]);

  const fetchTranscript = async () => {
    setIsLoadingTranscript(true);
    setTranscriptError(null);

    try {
      const response = await fetch(`/api/youtube/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      console.log('Transcript data received:', data.transcript?.length, 'entries');
      setTranscript(data.transcript);
    } catch (error) {
      console.error('Error fetching transcript:', error);
      setTranscriptError(error instanceof Error ? error.message : 'Failed to load transcript');
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  const handleChapterClick = (timestamp: number) => {
    // Start playing first, then seek to timestamp
    const player = (window as any).youtubePlayer;
    console.log('Desktop chapter click:', {
      timestamp,
      currentState: player?.getPlayerState?.()
    });

    if (player && typeof player.playVideo === 'function' && typeof player.seekTo === 'function') {
      // Play first to start the video
      player.playVideo();
      console.log('Called playVideo, state:', player.getPlayerState?.());

      // Then seek to the timestamp after a brief delay
      setTimeout(() => {
        player.seekTo(timestamp, true);
        console.log('Seeked to', timestamp, 'state:', player.getPlayerState?.());
      }, 100);
    }
  };

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="description" className="flex-1">
            {readOnly ? "Sign Up" : "Description"}
          </TabsTrigger>
          {/* Hide transcript tab in shared/public views */}
          {!readOnly && (
            <TabsTrigger value="transcript" className="flex-1">
              Transcript
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="description" className="mt-4">
          {readOnly && shareToken && shareType ? (
            <SignUpBenefits shareToken={shareToken} shareType={shareType} />
          ) : (
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
          )}
        </TabsContent>

        {/* Hide transcript content in shared/public views */}
        {!readOnly && (
          <TabsContent value="transcript" className="mt-4">
            <div className="bg-muted/30 rounded-lg p-4 max-h-[400px] overflow-y-auto">
              {isLoadingTranscript && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading transcript...</span>
                </div>
              )}

              {transcriptError && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground mb-2">{transcriptError}</p>
                  <button
                    onClick={fetchTranscript}
                    className="text-sm text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {transcript && transcript.length > 0 && (
                <div className="space-y-2">
                  {transcript.map((entry, index) => (
                    <button
                      key={index}
                      onClick={() => handleChapterClick(entry.offset)}
                      className="w-full text-left p-2 rounded hover:bg-accent transition-colors group flex items-start gap-3"
                    >
                      <span className="text-xs font-mono text-muted-foreground group-hover:text-primary min-w-[48px]">
                        {formatTimestamp(entry.offset)}
                      </span>
                      <span className="text-sm flex-1">{entry.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {transcript && transcript.length === 0 && !isLoadingTranscript && !transcriptError && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    No transcript available for this video.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        )}
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
