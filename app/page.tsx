import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BookOpen, PlayCircle, Share2, Target, GraduationCap, Briefcase, Search, Check } from "lucide-react";
import { StatsWidgets } from "@/components/stats/stats-widgets";
import { PageTransition } from "@/components/page-transition";
import { AnnouncementsButton } from "@/components/announcements/announcements-button";
import { Suspense } from "react";

export default async function LandingPage() {
  // If user is already logged in, redirect to notebooks
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/notebooks");
  }

  // Get actual user count for brutal honesty
  // Use service role to count all auth users
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { data: { users } } = await adminClient.auth.admin.listUsers();
  const userCount = users?.length || 0;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-b-foreground/10">
        <div className="container max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
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
          <div className="flex gap-4 items-center">
            <Suspense>
              <div className="mr-2">
                <AnnouncementsButton />
              </div>
            </Suspense>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Sign up free</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
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
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                YouTube is amazing for avid learners
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-primary">
                Add timestamped notes to make it unforgettable!
              </p>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto pt-2">
              Take notes on YouTube videos. Every note saves the timestamp. Click to jump back instantly. Organize by topic.
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
        </div>
      </main>

      {/* Use Cases Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Who uses YouNote?</h2>
            <p className="text-xl text-muted-foreground">Built for learners of all kinds</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Students */}
            <Card className="text-left hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4">
                  <div className="inline-flex p-4 rounded-full bg-blue-500/20">
                    <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-xl">Students & Academic Learners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Master your coursework and ace your exams with organized study materials.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Take notes on lecture videos and course content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Build study guides organized by subject</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Review key concepts by jumping to exact timestamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Prepare for exams with timestamped reference materials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Professionals */}
            <Card className="text-left hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4">
                  <div className="inline-flex p-4 rounded-full bg-purple-500/20">
                    <Briefcase className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-xl">Professionals & Career Learners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Stay ahead in your career by turning tutorials into practical knowledge.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Learn new frameworks and tools at your own pace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Build a personal knowledge base for work projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Reference best practices from industry experts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Organize training videos by skill or technology</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Researchers */}
            <Card className="text-left hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4">
                  <div className="inline-flex p-4 rounded-full bg-green-500/20">
                    <Search className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-xl">Researchers & Academics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Organize video sources and build comprehensive research libraries.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Catalog interviews, lectures, and documentary content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Create literature review notes with precise citations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Build topic-based research collections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Export notes to markdown for papers and publications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Build Your Knowledge Library</h3>
              </div>
              <p className="text-muted-foreground">
                Organize videos by topic, course, or project. Every notebook becomes a curated collection of insights from your learning journey.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Never Lose a Breakthrough Moment</h3>
              </div>
              <p className="text-muted-foreground">
                Capture insights at the perfect timestamp. Click to jump back to any moment—no more scrubbing through hours of video to find that one thing.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Zero Distractions, Pure Focus</h3>
              </div>
              <p className="text-muted-foreground">
                No algorithm pulling you toward cat videos. No recommended rabbit holes. Just you, the video you chose, and your notes. Perfect for learners with focus challenges.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Share2 className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Your Notes, Everywhere You Need Them</h3>
              </div>
              <p className="text-muted-foreground">
                Share page links with classmates and teammates. Export to markdown for your personal knowledge system. Your insights work the way you do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">
              Join {userCount} avid learners
            </h3>
            <StatsWidgets />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about YouNote
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does YouNote work?</AccordionTrigger>
              <AccordionContent>
                Simply paste a YouTube URL into YouNote, and we'll create a page with an embedded player and note-taking space. As you watch, click the timestamp button to capture the current moment. Your notes are automatically linked to that exact second in the video. Later, click any timestamp to jump right back to that moment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is YouNote free?</AccordionTrigger>
              <AccordionContent>
                Yes! YouNote is completely free to use, forever. We believe great learning tools should be accessible to everyone. There are no premium tiers, no feature paywalls, and no credit card required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What about my privacy and data?</AccordionTrigger>
              <AccordionContent>
                Your notes are private by default and stored securely. You control your data completely - you can share individual pages publicly if you choose, or keep everything private. We never sell your data or use it for advertising. You can export all your notes to markdown format anytime and own your knowledge forever.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I export my notes?</AccordionTrigger>
              <AccordionContent>
                Absolutely! Every page can be exported to markdown format, making your notes portable and future-proof. Use them in Obsidian, Notion, Roam Research, or any markdown editor. Your knowledge isn't locked into our platform - it's yours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Why not just use YouTube directly?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  YouTube is amazing for learning, but it's designed for entertainment and discovery, not focused study:
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold mb-1">Zero distractions</p>
                    <p className="text-sm text-muted-foreground">
                      No algorithm pulling you toward cat videos. No recommended rabbit holes. No autoplay temptations. Just you, your chosen video, and your notes. Perfect for learners with ADHD or focus challenges.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Organized learning</p>
                    <p className="text-sm text-muted-foreground">
                      Build notebooks by topic, create study guides, and organize your learning journey. YouTube's history and playlists weren't built for serious learning.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Persistent notes</p>
                    <p className="text-sm text-muted-foreground">
                      Your insights are saved with timestamps, exportable to markdown, and never lost. YouTube comments disappear in the noise.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Why not just use Notion or NotebookLM?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  Great question! While Notion and NotebookLM are powerful tools, they're not built specifically for video learning:
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold mb-1">Timestamps matter</p>
                    <p className="text-sm text-muted-foreground">
                      YouNote creates clickable timestamps automatically. Click any timestamp to jump to that exact moment in the video - no more manual scrubbing.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Purpose-built</p>
                    <p className="text-sm text-muted-foreground">
                      We focus on one thing and do it really well - timestamped YouTube notes. No feature bloat, no complexity.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Portable & simple</p>
                    <p className="text-sm text-muted-foreground">
                      Export to markdown anytime. No vendor lock-in, no complicated setup. Use YouNote for video learning, then export to your preferred system.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Free forever</p>
                    <p className="text-sm text-muted-foreground">
                      No tiers, no paywalls, no feature restrictions. Great learning tools should be accessible to everyone.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Can I share my notes with others?</AccordionTrigger>
              <AccordionContent>
                Yes! Each page has a share button that creates a public link. Anyone with the link can view your notes and watch the video alongside them - perfect for study groups, team learning, or sharing insights with friends. You can disable sharing anytime.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-t-foreground/10 py-12">
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
    </PageTransition>
  );
}
