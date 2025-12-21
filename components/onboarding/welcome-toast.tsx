"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { ONBOARDING_NOTEBOOK_TITLE } from "@/lib/onboarding/templates";

interface WelcomeToastProps {
  notebookCount: number;
  hasOnboardingNotebook: boolean;
}

export function WelcomeToast({
  notebookCount,
  hasOnboardingNotebook,
}: WelcomeToastProps) {
  useEffect(() => {
    // Show welcome toast if user only has the onboarding notebook
    // and hasn't seen it before (using sessionStorage to show only once per session)
    if (
      notebookCount === 1 &&
      hasOnboardingNotebook &&
      !sessionStorage.getItem("onboarding-welcome-shown")
    ) {
      toast.success(
        `👋 Welcome to YouNote! We've created a tutorial notebook to help you get started.`,
        {
          duration: 6000,
          position: "top-center",
        }
      );
      sessionStorage.setItem("onboarding-welcome-shown", "true");
    }
  }, [notebookCount, hasOnboardingNotebook]);

  return null; // This component doesn't render anything
}
