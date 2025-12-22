"use client";

import { useEffect, useState } from "react";
import { VideoInfoTabs } from "./video-info-tabs";
import { useRouter } from "next/navigation";

interface VideoTabsWrapperProps {
  description: string;
  videoId: string;
  pageId: string;
  className?: string;
}

export function VideoTabsWrapper({
  description,
  videoId,
  pageId,
  className = "",
}: VideoTabsWrapperProps) {
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
    <VideoInfoTabs
      description={currentDescription}
      videoId={videoId}
      className={className}
    />
  );
}
