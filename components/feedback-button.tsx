"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedbackButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => window.open("https://github.com/adidacta/younote/issues/new/choose", "_blank")}
      title="Submit feedback, feature request, or bug report"
    >
      <MessageSquare className="h-4 w-4" />
      <span className="hidden lg:inline">Feedback</span>
    </Button>
  );
}
