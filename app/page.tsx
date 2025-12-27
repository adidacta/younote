import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { GraduationCap, Briefcase, Search, Timer, Zap, Share2, PlayCircle, Check } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { DemoNoteEditor } from "@/components/demo-note-editor";
import { StatsWidgets } from "@/components/stats/stats-widgets";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export default function AlternateHomepage() {
  return (
    <div className={`min-h-screen bg-white ${playfair.variable}`}>
      {/* Sticky Navigation with Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-[12px] border-b border-[#E2E8F0]">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
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
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-slate-700 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="/auth/login" className="text-slate-700 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all rounded-[12px]">
                  Get Started Free
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - 60/40 Split */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-[60fr_40fr] gap-12 md:gap-20 items-center">
            {/* Left: Content (60%) */}
            <div className="space-y-8 text-center md:text-left">
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] leading-[1.1]">
                Stop Watching.<br />Start Retaining.
              </h1>
              <p className="text-xl sm:text-2xl text-[#475569] leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                Turn YouTube's endless stream of information into your personal, searchable knowledge library.
                Capture insights at the speed of thought.
              </p>

              {/* CTA */}
              <div className="pt-4">
                <Button asChild size="lg" className="text-lg px-10 py-6 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all">
                  <Link href="/auth/sign-up">Start Learning for Free</Link>
                </Button>
              </div>
            </div>

            {/* Right: Screenshot (40%) - Floating Effect */}
            <div className="relative md:rotate-3 transition-transform duration-500 hover:rotate-0">
              <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden shadow-2xl">
                <Image
                  src="/images/side-by-side.png"
                  alt="YouNote interface showing video player and notes side-by-side"
                  width={1200}
                  height={675}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Use Cases Section */}
      <section className="py-40 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-20">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1]">
              Who uses YouNote?
            </h2>
            <p className="text-xl text-[#475569] leading-[1.6] max-w-3xl mx-auto font-[family-name:var(--font-geist-sans)]">
              Designed for the serious learner who values mastery over mindless scrolling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Students */}
            <Card className="text-left bg-white/70 backdrop-blur-[12px] border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-[400ms] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:border-indigo-200/20">
              <CardHeader>
                <div className="mb-6">
                  <div className="inline-flex p-5 rounded-2xl bg-blue-500/20">
                    <GraduationCap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl leading-[1.3]"><strong>Students</strong> who want to understand, not just memorize</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#475569] text-lg leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                  Transform lecture videos into organized study guides. Search your semester's worth of notes in seconds.
                </p>
              </CardContent>
            </Card>

            {/* Professionals */}
            <Card className="text-left bg-white/70 backdrop-blur-[12px] border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-[400ms] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:border-indigo-200/20">
              <CardHeader>
                <div className="mb-6">
                  <div className="inline-flex p-5 rounded-2xl bg-purple-500/20">
                    <Briefcase className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl leading-[1.3]">True <strong>experts</strong> who never stop learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#475569] text-lg leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                  Turn industry tutorials into actionable SOPs. Create a knowledge advantage that compounds daily.
                </p>
              </CardContent>
            </Card>

            {/* Researchers */}
            <Card className="text-left bg-white/70 backdrop-blur-[12px] border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-[400ms] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:border-indigo-200/20">
              <CardHeader>
                <div className="mb-6">
                  <div className="inline-flex p-5 rounded-2xl bg-green-500/20">
                    <Search className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl leading-[1.3]"><strong>Researchers</strong> who connect dots faster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#475569] text-lg leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                  Synthesize complex topics with cross-referenced citations. Your literature review, organized and searchable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Interactive Bento Grid */}
      <section id="features" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-20">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1]">
              Mastery in every click.
            </h2>
            <p className="text-xl text-[#475569] leading-[1.6] max-w-3xl mx-auto font-[family-name:var(--font-geist-sans)]">
              Features designed for the serious learner who values time over mindless scrolling.
            </p>
          </div>

          {/* Bento Grid: 3 columns */}
          <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {/* Card 1: Precision Timestamps (Double Width, Double Height) */}
            <Card className="md:col-span-2 md:row-span-2 p-10 text-left bg-white border border-slate-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-[400ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:border-indigo-200/20">
              <CardContent className="p-0 space-y-8 h-full flex flex-col justify-center">
                <div className="inline-flex p-6 rounded-2xl bg-indigo-500/20 shadow-lg w-fit">
                  <Timer className="h-16 w-16 text-indigo-600" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-3xl">Precision Timestamps</h3>
                  <p className="text-[#475569] text-lg leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                    Don't just take notes; bookmark moments. One click takes you back to the exact second an idea was born. Every thought captured with pinpoint accuracy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Auto-Pause Flow */}
            <Card className="p-8 text-left bg-white border border-slate-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-[400ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:border-indigo-200/20">
              <CardContent className="p-0 space-y-6">
                <div className="inline-flex p-5 rounded-2xl bg-amber-500/20 shadow-lg">
                  <Zap className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="font-bold text-xl">Auto-Pause Flow</h3>
                <p className="text-[#475569] text-base leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                  Focus on the thought, not the 'Play' button. We pause when you type and resume when you're done.
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Search Your Brain */}
            <Card className="p-8 text-left bg-white border border-slate-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-[400ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:border-indigo-200/20">
              <CardContent className="p-0 space-y-6">
                <div className="inline-flex p-5 rounded-2xl bg-emerald-500/20 shadow-lg">
                  <Search className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="font-bold text-xl">Search Your Brain</h3>
                <p className="text-[#475569] text-base leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                  Find that one quote from a video you watched months ago with global keyword search.
                </p>
              </CardContent>
            </Card>

            {/* Card 4: Export Anywhere (Full Width at Bottom) */}
            <Card className="md:col-span-3 p-8 text-left bg-white border border-slate-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-[400ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:border-indigo-200/20">
              <CardContent className="p-0 flex flex-col md:flex-row items-center gap-8">
                <div className="inline-flex p-5 rounded-2xl bg-blue-500/20 shadow-lg">
                  <Share2 className="h-12 w-12 text-blue-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-2xl">Export Anywhere</h3>
                  <p className="text-[#475569] text-lg leading-[1.6] font-[family-name:var(--font-geist-sans)]">
                    Seamlessly sync your insights to Notion, Obsidian, or Markdown for your permanent second brain. Your knowledge isn't locked in—it's yours to use everywhere.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-40 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-20">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1]">
              See YouNote in action
            </h2>
            <p className="text-xl text-[#475569] leading-[1.6] font-[family-name:var(--font-geist-sans)]">
              Simple, powerful, and built for learning
            </p>
          </div>

          <div className="space-y-16">
            {/* Screenshot 1: Video player with notes */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Watch and take notes side-by-side</h3>
                <p className="text-lg text-muted-foreground">
                  Bringing YouTube into YouNote lets you focus on learning, not funny pets (which are sooo funny). Your notes and the YouTube clip, side by side, alone at last. No distractions.
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-lg">
                <Image
                  src="/images/side-by-side.png"
                  alt="YouNote interface showing video player and notes side-by-side"
                  width={1200}
                  height={675}
                  className="rounded-lg w-full"
                />
              </div>
            </div>

            {/* Screenshot 2: Notebooks view */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Organize by topic or project</h3>
                <p className="text-lg text-muted-foreground">
                  Organization without the effort. Simple, intuitive structure and powerful search means you never waste time finding a captured insight.
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-lg">
                <Image
                  src="/images/notebooks.png"
                  alt="Notebooks view showing organized video pages with thumbnails"
                  width={1200}
                  height={675}
                  className="rounded-lg w-full"
                />
              </div>
            </div>

            {/* Screenshot 3: Smart note-taking with interactive demo */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Smart note-taking with auto-timestamping</h3>
                <p className="text-lg text-muted-foreground">
                  Start a note and YouNote will auto-capture its timestamp for quick playback of that moment. Full markdown support, emoji status, and one-click sharing — perfect for review and study.
                </p>
                <div className="flex justify-end">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-lg">
                    <span className="animate-pulse">✏️</span>
                    Try editing the note →
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <DemoNoteEditor useTypingEffect={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-8 mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1]">
              Join a community of avid learners like yourself
            </h2>
            <p className="text-xl text-[#475569] leading-[1.6] max-w-3xl mx-auto font-[family-name:var(--font-geist-sans)]">
              Building knowledge libraries, one timestamp at a time
            </p>
          </div>

          {/* Stats Widgets */}
          <div className="mb-12">
            <StatsWidgets />
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="text-lg px-10 py-6 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all">
              <Link href="/auth/sign-up">Start Learning for Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-40 bg-slate-50">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-slate-900 tracking-[-0.02em] leading-[1.1]">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-2xl px-6 border-none shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                Why not just use YouTube directly?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                <p className="mb-4">
                  <strong>YouTube is for consumption; YouNote is for mastery.</strong>
                </p>
                <p className="mb-4">
                  YouTube is designed to keep you watching. YouNote is designed to help you retain and apply what you learn.
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Zero distractions:</strong> No algorithm pulling you toward cat videos. No recommended rabbit holes.</li>
                  <li>• <strong>Organized learning:</strong> Build notebooks by topic, create study guides, and organize your learning journey.</li>
                  <li>• <strong>Persistent notes:</strong> Your insights are saved with timestamps, exportable to markdown, and never lost.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-2xl px-6 border-none shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                How does YouNote work?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Simply paste a YouTube URL into YouNote, and we'll create a page with an embedded player and note-taking space.
                As you watch, click the timestamp button to capture the current moment. Your notes are automatically linked to
                that exact second in the video. Later, click any timestamp to jump right back to that moment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-2xl px-6 border-none shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                Is YouNote free?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Yes! YouNote is completely free to use, forever. We believe great learning tools should be accessible to everyone.
                There are no premium tiers, no feature paywalls, and no credit card required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-2xl px-6 border-none shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                Can I export my notes?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Absolutely! Every page can be exported to markdown format, making your notes portable and future-proof.
                Use them in Obsidian, Notion, Roam Research, or any markdown editor. Your knowledge isn't locked into
                our platform—it's yours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-2xl px-6 border-none shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                What about my privacy and data?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Your notes are private by default and stored securely. You control your data completely—you can share
                individual pages publicly if you choose, or keep everything private. We never sell your data or use it
                for advertising.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <div className="space-y-6">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1]">
              Your next breakthrough is one timestamp away.
            </h2>
            <p className="text-xl text-[#475569] leading-[1.6] font-[family-name:var(--font-geist-sans)]">
              Start taking timestamped notes today. It's free, forever.
            </p>
          </div>
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-10 py-6 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all">
              <Link href="/auth/sign-up">Start Learning for Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-10 py-6">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-t-foreground/10 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 YouNote. Free forever.</p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/adidacta/younote/issues/new/choose"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Feedback
              </a>
              <Link href="/legal/terms-of-use" className="hover:text-foreground transition-colors">
                Terms of Use
              </Link>
              <Link href="/legal/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <a href="mailto:adi@adidacta.com" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
