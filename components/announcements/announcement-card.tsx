"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/lib/announcements/announcements";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  announcement: Announcement;
  variant: 'dropdown' | 'page';
}

const badgeVariants = {
  new: { text: "New", className: "bg-primary" },
  major: { text: "Major Update", className: "bg-blue-500" },
  improvement: { text: "Improved", className: "bg-green-500" }
};

export function AnnouncementCard({ announcement, variant }: AnnouncementCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden",
      variant === 'dropdown' && "shadow-sm",
      variant === 'page' && "shadow-md"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{announcement.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {announcement.displayDate}
            </CardDescription>
          </div>
          {announcement.badge && (
            <Badge className={badgeVariants[announcement.badge].className}>
              {badgeVariants[announcement.badge].text}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {announcement.features.map((feature, idx) => {
          // Dynamically load icon from lucide-react
          const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.Sparkles;

          return (
            <div key={idx} className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight">{feature.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
