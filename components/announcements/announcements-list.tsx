"use client";

import { useState } from "react";
import { ANNOUNCEMENTS } from "@/lib/announcements/announcements";
import { AnnouncementCard } from "./announcement-card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface AnnouncementsListProps {
  variant: 'dropdown' | 'page';
}

const ITEMS_PER_PAGE = 3;

export function AnnouncementsList({ variant }: AnnouncementsListProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const visibleAnnouncements = ANNOUNCEMENTS.slice(0, visibleCount);
  const hasMore = visibleCount < ANNOUNCEMENTS.length;
  const remainingCount = Math.min(ITEMS_PER_PAGE, ANNOUNCEMENTS.length - visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, ANNOUNCEMENTS.length));
  };

  if (ANNOUNCEMENTS.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No announcements yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className={variant === 'dropdown' ? 'p-4 space-y-4' : 'space-y-6'}>
      {/* Header - only in dropdown */}
      {variant === 'dropdown' && (
        <div className="pb-2 border-b">
          <h2 className="font-semibold text-lg">What's New in YouNote</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Latest features and improvements
          </p>
        </div>
      )}

      {/* Announcements */}
      <div className="space-y-4">
        {visibleAnnouncements.map((announcement) => (
          <AnnouncementCard
            key={announcement.date}
            announcement={announcement}
            variant={variant}
          />
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleShowMore}
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Show {remainingCount} more
          </Button>
        </div>
      )}
    </div>
  );
}
