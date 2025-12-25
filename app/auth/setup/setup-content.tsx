"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

const SETUP_STEPS = [
  { message: "Setting up your account...", duration: 800 },
  { message: "Creating your first notebook...", duration: 1200 },
  { message: "Adding tutorial notes...", duration: 1000 },
  { message: "Almost done...", duration: 600 },
];

export function SetupContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let mounted = true;

    async function setupAccount() {
      const supabase = createClient();

      // Verify user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Show setup steps with animations
      for (let i = 0; i < SETUP_STEPS.length; i++) {
        if (!mounted) return;
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, SETUP_STEPS[i].duration));
      }

      // Call API to create onboarding
      try {
        const response = await fetch("/api/onboarding/create", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create onboarding");
        }

        if (!mounted) return;
        setIsComplete(true);

        // Check if coming from shared link
        const shareToken = searchParams.get('share_token');
        const shareType = searchParams.get('share_type');

        // Wait a moment to show completion, then fork content if needed
        setTimeout(async () => {
          if (!mounted) return;

          if (shareToken && shareType) {
            // Fork shared content to user's account
            try {
              const forkResponse = await fetch('/api/share/fork', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  share_token: shareToken,
                  share_type: shareType
                })
              });

              if (forkResponse.ok) {
                const { page_id, notebook_id } = await forkResponse.json();
                // Redirect to the forked content
                router.push(`/notebooks/${notebook_id}/pages/${page_id}`);
              } else {
                // Fork failed, redirect to notebooks anyway
                console.error('Failed to fork content');
                router.push("/notebooks");
              }
            } catch (error) {
              console.error('Error forking content:', error);
              router.push("/notebooks");
            }
          } else {
            // No share context, redirect to notebooks
            router.push("/notebooks");
          }
        }, 800);
      } catch (error) {
        console.error("Setup error:", error);
        // Even if onboarding fails, redirect to notebooks
        // The notebooks page will handle creating it if needed
        if (mounted) {
          router.push("/notebooks");
        }
      }
    }

    setupAccount();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Logo or Icon */}
              <div className="relative">
                {isComplete ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-300" />
                ) : (
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                )}
              </div>

              {/* Current Step Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  {isComplete ? "All Set!" : "Welcome to YouNote"}
                </h2>
                <p className="text-muted-foreground animate-in fade-in duration-300">
                  {isComplete
                    ? "Redirecting to your notebooks..."
                    : SETUP_STEPS[currentStep]?.message || "Setting up..."}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex gap-2">
                {SETUP_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index <= currentStep
                        ? "bg-primary scale-110"
                        : "bg-muted scale-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
