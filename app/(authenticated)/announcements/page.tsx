"use client";

import { useEffect } from "react";
import { AnnouncementsList } from "@/components/announcements/announcements-list";
import { BackButton } from "@/components/back-button";
import { markAllAsRead } from "@/lib/announcements/storage";
import { ANNOUNCEMENTS } from "@/lib/announcements/announcements";

export default function AnnouncementsPage() {
  // Mark all announcements as read when page is viewed
  useEffect(() => {
    markAllAsRead(ANNOUNCEMENTS);
  }, []);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="mb-3">
        <BackButton />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">What's New</h1>
        <p className="text-muted-foreground">
          Latest features and improvements
        </p>
      </div>
      <AnnouncementsList variant="page" />
    </div>
  );
}
