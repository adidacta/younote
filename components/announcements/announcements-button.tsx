"use client";

import { useState, useEffect } from "react";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ANNOUNCEMENTS } from "@/lib/announcements/announcements";
import { getUnreadCount, markAllAsRead } from "@/lib/announcements/storage";
import { AnnouncementsList } from "./announcements-list";

export function AnnouncementsButton() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe mounting
  useEffect(() => {
    setMounted(true);
    setUnreadCount(getUnreadCount(ANNOUNCEMENTS));
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Mark as read when dropdown opens
      markAllAsRead(ANNOUNCEMENTS);
      setUnreadCount(0);
    }
  };

  // Don't render anything until mounted (avoid hydration mismatch)
  if (!mounted) {
    return (
      <Button variant="ghost" className="h-12 w-12 [&_svg]:!size-8" disabled>
        <BellRing />
        <span className="sr-only">Announcements</span>
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-12 w-12 relative [&_svg]:!size-8">
          <BellRing />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="default"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">
            Announcements{unreadCount > 0 ? ` (${unreadCount} unread)` : ''}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[420px] max-h-[600px] overflow-y-auto p-0">
        <AnnouncementsList variant="dropdown" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
