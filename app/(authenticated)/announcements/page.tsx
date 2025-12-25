"use client";

import { useEffect } from "react";
import { AnnouncementsList } from "@/components/announcements/announcements-list";
import { BellRing } from "lucide-react";
import { markAllAsRead } from "@/lib/announcements/storage";
import { ANNOUNCEMENTS } from "@/lib/announcements/announcements";

export default function AnnouncementsPage() {
  // Mark all announcements as read when page is viewed
  useEffect(() => {
    markAllAsRead(ANNOUNCEMENTS);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Sticky Header - Mobile Friendly */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BellRing className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">What's New</h1>
              <p className="text-sm text-muted-foreground">
                Latest features and improvements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto px-4 py-6">
        <AnnouncementsList variant="page" />
      </div>
    </div>
  );
}
