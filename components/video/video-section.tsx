"use client";

import { useState, useEffect } from "react";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import { VideoInfoTabs } from "@/components/video/video-info-tabs";
import { VideoMobileTabs } from "@/components/video/video-mobile-tabs";

interface VideoSectionProps {
  videoId: string;
  videoTitle: string;
  description: string;
}

export function VideoSection({ videoId, videoTitle, description }: VideoSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Desktop: Video + tabs below */}
      {!isMobile && (
        <div className="space-y-4">
          <YouTubePlayer
            videoId={videoId}
            title={videoTitle}
          />
          <VideoInfoTabs
            description={description}
            videoId={videoId}
          />
        </div>
      )}

      {/* Mobile: Tabbed interface (Video | Description | Transcript) */}
      {isMobile && (
        <VideoMobileTabs
          description={description}
          videoId={videoId}
        >
          <YouTubePlayer
            videoId={videoId}
            title={videoTitle}
          />
        </VideoMobileTabs>
      )}
    </>
  );
}
