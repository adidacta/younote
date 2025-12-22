"use client";

import { useEffect, useState } from "react";
import { VideoMobileTabs } from "./video-mobile-tabs";
import { useRouter } from "next/navigation";

interface VideoMobileTabsWrapperProps {
  description: string;
  videoId: string;
  pageId: string;
  children: React.ReactNode;
}

export function VideoMobileTabsWrapper({
  description,
  videoId,
  pageId,
  children,
}: VideoMobileTabsWrapperProps) {
  const router = useRouter();
  const [currentDescription, setCurrentDescription] = useState(description);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Auto-fetch description if empty
    if (!currentDescription && !isFetching) {
      setIsFetching(true);

      fetch(`/api/pages/${pageId}/fetch-description`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.description) {
            setCurrentDescription(data.description);
            // Refresh the page data
            router.refresh();
          }
        })
        .catch((error) => {
          console.error("Failed to fetch description:", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [currentDescription, pageId, router, isFetching]);

  return (
    <VideoMobileTabs
      description={currentDescription}
      videoId={videoId}
    >
      {children}
    </VideoMobileTabs>
  );
}
