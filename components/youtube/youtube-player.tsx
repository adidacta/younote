"use client";

import { useState, useRef, useEffect } from "react";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  startSeconds?: number;
}

export function YouTubePlayer({ videoId, title, startSeconds }: YouTubePlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}${
    startSeconds ? `?start=${Math.floor(startSeconds)}` : '?'
  }${startSeconds ? '&' : ''}enablejsapi=1`;

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  useEffect(() => {
    // Check if YouTube API script is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      // Load YouTube IFrame API only once
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Create player when API is ready
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    function initPlayer() {
      if (iframeRef.current) {
        try {
          const ytPlayer = new (window as any).YT.Player(iframeRef.current, {
            events: {
              onReady: () => setPlayer(ytPlayer),
              onError: (event: any) => {
                console.error('YouTube player error:', event.data);
                switch (event.data) {
                  case 2:
                    setError('Invalid video ID');
                    break;
                  case 5:
                    setError('HTML5 player error');
                    break;
                  case 100:
                    setError('Video not found or private');
                    break;
                  case 101:
                  case 150:
                    setError('Video cannot be embedded. The owner has restricted playback.');
                    break;
                  default:
                    setError('Failed to load video');
                }
              },
            },
          });
        } catch (err) {
          console.error('Error initializing YouTube player:', err);
          setError('Failed to initialize player');
        }
      }
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId]);

  // Expose player methods globally for NewNoteButton to access
  useEffect(() => {
    if (player) {
      (window as any).youtubePlayer = player;
    }
  }, [player]);

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Unable to play video</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button asChild variant="outline" size="sm">
            <a href={watchUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Watch on YouTube
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
