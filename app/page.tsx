import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BookOpen, PlayCircle, Share2 } from "lucide-react";

export default async function LandingPage() {
  // If user is already logged in, redirect to notebooks
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/notebooks");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-b-foreground/10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/younote-logo-light.png"
              alt="YouNote"
              width={120}
              height={40}
              className="dark:hidden"
            />
            <Image
              src="/images/younote-logo-dark.png"
              alt="YouNote"
              width={120}
              height={40}
              className="hidden dark:block"
            />
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Sign up free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/younote-logo-light.png"
              alt="YouNote Logo"
              width={300}
              height={100}
              className="dark:hidden"
            />
            <Image
              src="/images/younote-logo-dark.png"
              alt="YouNote Logo"
              width={300}
              height={100}
              className="hidden dark:block"
            />
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Take better notes while watching YouTube
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organize your learning with timestamped markdown notes. Create notebooks,
              capture insights, and never lose track of important moments in your videos.
            </p>
          </div>

          {/* CTA */}
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">Get started for free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Organized Notebooks</h3>
              </div>
              <p className="text-muted-foreground">
                Create notebooks for different topics. Each page links to a YouTube video
                with your timestamped notes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Timestamped Notes</h3>
              </div>
              <p className="text-muted-foreground">
                Capture the exact moment in the video. Click any timestamp to jump right
                to that point in the video.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Share & Export</h3>
              </div>
              <p className="text-muted-foreground">
                Share your notes with anyone or export as markdown. Perfect for study groups
                and course notes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-t-foreground/10 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 YouNote. Free forever.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/legal/terms-of-use"
                className="hover:text-foreground transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                href="/legal/privacy-policy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <a
                href="mailto:adi@adidacta.com"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
