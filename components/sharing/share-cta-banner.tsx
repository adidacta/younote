"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareCTABannerProps {
  variant: 'mobile' | 'desktop';
  shareToken: string;
  shareType: 'page' | 'note';
}

export function ShareCTABanner({ variant, shareToken, shareType }: ShareCTABannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if banner was previously dismissed (use localStorage)
  useEffect(() => {
    const dismissed = localStorage.getItem(`cta-banner-${shareToken}`);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, [shareToken]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(`cta-banner-${shareToken}`, 'true');
  };

  if (isDismissed) return null;

  const signUpUrl = `/auth/sign-up?share_token=${shareToken}&share_type=${shareType}`;

  if (variant === 'mobile') {
    return (
      <div className="sticky top-0 z-50 bg-gradient-to-r from-primary/95 to-primary/90 backdrop-blur-sm border-b border-primary-foreground/20">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Sparkles className="h-4 w-4 text-primary-foreground flex-shrink-0" />
              <p className="text-sm font-medium text-primary-foreground truncate">
                Want to add your own notes?
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="font-semibold"
              >
                <Link href={signUpUrl}>
                  Sign up free
                </Link>
              </Button>
              <button
                onClick={handleDismiss}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="mt-4 mb-6">
      <div className={cn(
        "relative overflow-hidden rounded-lg",
        "bg-gradient-to-r from-primary/10 via-primary/5 to-background",
        "border-2 border-primary/20",
        "transition-all duration-300 hover:border-primary/30"
      )}>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />

        <div className="relative p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Want to add your own notes?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Join YouNote to create timestamped notes on any YouTube video.
                  {shareType === 'note' ? ' Save this note to your account and add more!' : ' Create your own collection of notes!'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="font-semibold">
                  <Link href={signUpUrl}>
                    Get Started - It's Free
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                ✓ Free forever &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Start taking notes in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
