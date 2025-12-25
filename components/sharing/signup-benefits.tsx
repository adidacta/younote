import { Button } from "@/components/ui/button";
import { Sparkles, Infinity, Download } from "lucide-react";
import Link from "next/link";

interface SignUpBenefitsProps {
  shareToken: string;
  shareType: 'page' | 'note';
  compact?: boolean; // For mobile version
}

export function SignUpBenefits({ shareToken, shareType, compact = false }: SignUpBenefitsProps) {
  if (compact) {
    // Mobile: stacked layout
    return (
      <div className="relative overflow-hidden rounded-lg border-2 border-primary shadow-lg shadow-primary/25 bg-gradient-to-br from-primary/40 via-blue-500/30 to-purple-500/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 pointer-events-none" />

        <div className="relative space-y-6">
          {/* Headline */}
          <div className="text-center">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Start Taking Smart Notes
            </h3>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-400/40 to-blue-500/50 flex-shrink-0 shadow-md shadow-blue-500/20">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="font-semibold text-sm">100% Free</div>
                <div className="text-xs text-muted-foreground">Forever. No credit card.</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-400/40 to-purple-500/50 flex-shrink-0 shadow-md shadow-purple-500/20">
                <Infinity className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="font-semibold text-sm">Unlimited</div>
                <div className="text-xs text-muted-foreground">Notes, pages, notebooks.</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-pink-400/40 to-pink-500/50 flex-shrink-0 shadow-md shadow-pink-500/20">
                <Download className="h-5 w-5 text-pink-600 dark:text-pink-300" />
              </div>
              <div>
                <div className="font-semibold text-sm">Your Data</div>
                <div className="text-xs text-muted-foreground">Export anytime.</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">New to YouNote?</p>
              <Button asChild size="lg" className="w-full font-semibold shadow-lg shadow-primary/20">
                <Link href={`/auth/sign-up?share_token=${shareToken}&share_type=${shareType}`}>
                  Sign Up for Free
                </Link>
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">Already enjoying YouNote?</p>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href={`/auth/login?share_token=${shareToken}&share_type=${shareType}`}>
                  Log In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: 2/3 benefits | 1/3 CTAs layout
  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-primary shadow-lg shadow-primary/25 bg-gradient-to-br from-primary/40 via-blue-500/30 to-purple-500/30">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 pointer-events-none" />

      <div className="relative grid grid-cols-3 gap-6 p-6">
        {/* Left 2/3: Benefits */}
        <div className="col-span-2 flex flex-col justify-center space-y-6">
          {/* Headline */}
          <div>
            <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Start Taking Smart Notes
            </h3>
            <p className="text-sm text-muted-foreground">
              Make this page yours in seconds
            </p>
          </div>

          {/* 3 Benefits - Horizontal row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Free */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-400/40 to-blue-500/50 shadow-md shadow-blue-500/20">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="font-semibold">100% Free</div>
                <div className="text-xs text-muted-foreground">Forever. No credit card.</div>
              </div>
            </div>

            {/* Unlimited */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-400/40 to-purple-500/50 shadow-md shadow-purple-500/20">
                <Infinity className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="font-semibold">Unlimited</div>
                <div className="text-xs text-muted-foreground">Notes, pages, notebooks.</div>
              </div>
            </div>

            {/* Portable */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-gradient-to-br from-pink-400/40 to-pink-500/50 shadow-md shadow-pink-500/20">
                <Download className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <div>
                <div className="font-semibold">Your Data</div>
                <div className="text-xs text-muted-foreground">Export anytime.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1/3: CTAs */}
        <div className="col-span-1 flex flex-col justify-center space-y-4 border-l border-border/50 pl-6">
          {/* New Users */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">New to YouNote?</p>
            <Button asChild size="lg" className="w-full font-semibold shadow-lg shadow-primary/20">
              <Link href={`/auth/sign-up?share_token=${shareToken}&share_type=${shareType}`}>
                Sign Up for Free
              </Link>
            </Button>
          </div>

          {/* Existing Users */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Already enjoying YouNote?</p>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href={`/auth/login?share_token=${shareToken}&share_type=${shareType}`}>
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
