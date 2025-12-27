import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { GraduationCap, Briefcase, Search, Timer, Zap, Share2, PlayCircle } from "lucide-react";
import { Playfair_Display } from "next/font/google";

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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-[10px] border-b border-slate-200/60">
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
              <Link href="#pricing" className="text-slate-700 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="/auth/login" className="text-slate-700 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all rounded-[12px]">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Two Column Grid */}
      <section className="relative bg-slate-900 text-white pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50" />

        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px'
        }} />

        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Stop Watching.<br />Start Retaining.
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Turn YouTube's endless stream of information into your personal, searchable knowledge library.
                Capture insights at the speed of thought.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all text-lg rounded-[12px]">
                  Start Learning for Free
                </Button>
                <Button size="lg" variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10 text-lg rounded-[12px]">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch 1-min Demo
                </Button>
              </div>
            </div>

            {/* Right Column - Floating UI Mockup */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-slate-950 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/side-by-side.png"
                    alt="YouNote Interface"
                    width={800}
                    height={500}
                    className="w-full"
                  />
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="container max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-slate-500 mb-8 tracking-wide uppercase">Trusted by Avid Learners</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-40 grayscale">
            <div className="text-2xl font-bold text-slate-600">Google</div>
            <div className="text-2xl font-bold text-slate-600">Stanford</div>
            <div className="text-2xl font-bold text-slate-600">MIT</div>
            <div className="text-2xl font-bold text-slate-600">Harvard</div>
          </div>
        </div>
      </section>

      {/* ICP Persona Grid - Glassmorphism Cards */}
      <section className="py-24 bg-slate-50/50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
              Who uses YouNote?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Designed for the serious learner who values mastery over mindless scrolling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Students */}
            <Card className="bg-white/60 backdrop-blur-lg border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[24px] overflow-hidden group">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex p-4 rounded-2xl bg-blue-100 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Ace the Exam,<br />Not the Playback</h3>
                <p className="text-slate-600 leading-relaxed">
                  Transform lecture videos into organized study guides. Search your semester's worth of notes in seconds.
                </p>
              </CardContent>
            </Card>

            {/* Professionals */}
            <Card className="bg-white/60 backdrop-blur-lg border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[24px] overflow-hidden group">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex p-4 rounded-2xl bg-purple-100 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Build Your<br />Career Moat</h3>
                <p className="text-slate-600 leading-relaxed">
                  Turn industry tutorials into actionable SOPs. Create a knowledge advantage that compounds daily.
                </p>
              </CardContent>
            </Card>

            {/* Researchers */}
            <Card className="bg-white/60 backdrop-blur-lg border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[24px] overflow-hidden group">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex p-4 rounded-2xl bg-green-100 group-hover:scale-110 transition-transform">
                  <Search className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Connect<br />the Dots</h3>
                <p className="text-slate-600 leading-relaxed">
                  Synthesize complex topics with cross-referenced citations. Your literature review, organized and searchable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-white" id="features">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
              Mastery in every click.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Features designed for the serious learner who values time over mindless scrolling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
            {/* Feature 1: Precision Timestamps (LARGE 2x2) */}
            <div className="md:col-span-2 md:row-span-2 bg-indigo-50/50 border border-slate-200/60 rounded-[24px] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-indigo-100/50 transition-all duration-300 group">
              <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                <Timer className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="font-semibold text-2xl text-slate-900 mb-3">Precision Timestamps</h3>
              <p className="text-slate-600 leading-relaxed">
                Don't just take notes; bookmark moments. One click takes you back to the exact second an idea was born.
              </p>
            </div>

            {/* Feature 2: Auto-Pause Flow */}
            <div className="md:col-span-1 bg-white border border-slate-200/60 rounded-[24px] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-indigo-100/50 transition-all duration-300 group">
              <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-xl text-slate-900 mb-2">Auto-Pause Flow</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Focus on the thought, not the 'Play' button. We pause when you type and resume when you're done.
              </p>
            </div>

            {/* Feature 3: Search Your Brain */}
            <div className="md:col-span-1 bg-white border border-slate-200/60 rounded-[24px] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-indigo-100/50 transition-all duration-300 group">
              <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-xl text-slate-900 mb-2">Search Your Brain</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Find that one quote from a video you watched months ago with global keyword search.
              </p>
            </div>

            {/* Feature 4: Export Anywhere */}
            <div className="md:col-span-2 bg-white border border-slate-200/60 rounded-[24px] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-indigo-100/50 transition-all duration-300 group">
              <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-xl text-slate-900 mb-2">Export Anywhere</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Seamlessly sync your insights to Notion, Obsidian, or Markdown for your permanent second brain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* See YouNote in Action */}
      <section className="py-24 bg-slate-50/50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
              See YouNote in action
            </h2>
            <p className="text-xl text-slate-600">
              Watch how timestamps transform learning
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
            <Image
              src="/images/side-by-side.png"
              alt="YouNote in action"
              width={1200}
              height={675}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Section - Bento Style */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 text-white rounded-3xl p-12 relative overflow-hidden">
            {/* Background grain */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px'
            }} />

            <div className="relative z-10">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-4">
                Join 9 avid learners
              </h2>
              <p className="text-center text-slate-300 text-xl mb-12">
                Building knowledge libraries, one timestamp at a time
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-amber-400">13+</div>
                  <div className="text-slate-400 text-lg">Notebooks</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-amber-400">16+</div>
                  <div className="text-slate-400 text-lg">Pages</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-amber-400">105+</div>
                  <div className="text-slate-400 text-lg">Notes</div>
                </div>
              </div>

              <div className="text-center">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8 rounded-[12px] text-lg">
                  Start Learning for Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50/50">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
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

      {/* Final CTA - Gradient Background */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden" id="pricing">
        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px'
        }} />

        <div className="container max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold">
            Your next breakthrough is one timestamp away.
          </h2>
          <p className="text-xl text-slate-300">
            Join the community building knowledge libraries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-slate-100 text-indigo-600 font-semibold px-8 rounded-[12px] text-lg">
              Build My Knowledge Library
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-[12px] text-lg">
              Sign in
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <p>© 2025 YouNote. Free forever.</p>
            <div className="flex items-center gap-6">
              <Link href="/legal/terms-of-use" className="hover:text-slate-900 transition-colors">
                Terms of Use
              </Link>
              <Link href="/legal/privacy-policy" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <a href="mailto:adi@adidacta.com" className="hover:text-slate-900 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
