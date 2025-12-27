import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { GraduationCap, Briefcase, Search, BookOpen, PlayCircle, Share2, Target } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair"
});

export default function AlternateHomepage() {
  return (
    <div className={`min-h-screen bg-slate-50 ${playfair.variable}`}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="container max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/younote-logo-dark.png"
              alt="YouNote"
              width={120}
              height={40}
            />
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                Get started for free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="sm" variant="ghost" className="text-white hover:text-white/80">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Dark Navy with Floating UI */}
      <section className="relative bg-slate-900 text-white pt-32 pb-24 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50" />

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Elevate Your Learning with YouNote.
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Transform YouTube into a powerful, searchable knowledge library. Take timestamped notes, organize thoughts, and never lose a breakthrough moment.
              </p>
              <div className="flex gap-4 items-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all">
                  Get started for free
                </Button>
                <Button size="lg" variant="ghost" className="text-white hover:text-white/80">
                  Watch demo
                </Button>
              </div>
            </div>

            {/* Right: Floating UI Mockup */}
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
      <section className="bg-white border-y border-slate-200 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-slate-500 mb-6">TRUSTED BY AVID LEARNERS</p>
          <div className="flex justify-center items-center gap-12 opacity-40 grayscale">
            <div className="text-2xl font-bold text-slate-600">Joomify</div>
            <div className="text-2xl font-bold text-slate-600">WaveConnect</div>
            <div className="text-2xl font-bold text-slate-600">Google</div>
            <div className="text-2xl font-bold text-slate-600">University</div>
          </div>
        </div>
      </section>

      {/* Who uses YouNote - Glassmorphism Cards */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
              Who uses YouNote?
            </h2>
            <p className="text-xl text-slate-600">
              Transform YouTube into a powerful, searchable knowledge library. Take timestamped notes, organize thoughts, and never lose a breakthrough moment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Students */}
            <Card className="bg-white/60 backdrop-blur-lg border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-blue-100">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Students</h3>
                <p className="text-slate-600 leading-relaxed">
                  Grasp every concept, organize knowledge, conquer exams and grow your career.
                </p>
              </CardContent>
            </Card>

            {/* Professionals */}
            <Card className="bg-white/60 backdrop-blur-lg border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-purple-100">
                  <Briefcase className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Professionals</h3>
                <p className="text-slate-600 leading-relaxed">
                  Energize unstructured video professional conversations into career-ready insights.
                </p>
              </CardContent>
            </Card>

            {/* Researchers */}
            <Card className="bg-white/60 backdrop-blur-lg border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-green-100">
                  <Search className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Researchers</h3>
                <p className="text-slate-600 leading-relaxed">
                  Transform scattered video thoughts and deep dives into curated research projects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features - Bento Grid Style */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
              Key Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Timestamped Notes */}
            <Card className="bg-slate-800 text-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-10 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-blue-500/20">
                  <PlayCircle className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold">Timestamped Notes</h3>
                <p className="text-slate-300 leading-relaxed">
                  Every note automatically captures the exact moment. Click to jump back—no more scrubbing.
                </p>
              </CardContent>
            </Card>

            {/* Anti-Procs */}
            <Card className="bg-indigo-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-10 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-500/20">
                  <Target className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Anti-Procs</h3>
                <p className="text-slate-700 leading-relaxed">
                  Zero distractions. No algorithm rabbit holes. Just you and focused learning.
                </p>
              </CardContent>
            </Card>

            {/* Instant Recall */}
            <Card className="bg-emerald-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-10 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20">
                  <BookOpen className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Instant Away-Back</h3>
                <p className="text-slate-700 leading-relaxed">
                  Search your entire knowledge library. Find the exact video moment you need, instantly.
                </p>
              </CardContent>
            </Card>

            {/* Organize & Search */}
            <Card className="bg-slate-800 text-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-10 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-purple-500/20">
                  <Share2 className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold">Organize & Search</h3>
                <p className="text-slate-300 leading-relaxed">
                  Group videos by topic. Export to markdown. Share with teammates. Your knowledge, portable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* See YouNote in Action */}
      <section className="py-24 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
              See YouNote in action
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
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

      {/* Stats - Bento Grid */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="bg-slate-900 text-white rounded-3xl p-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-4">
              Join 9 avid learners
            </h2>
            <p className="text-center text-slate-300 text-xl mb-12">
              Join the community that is building knowledge libraries, one timestamp at a time
            </p>

            <div className="grid md:grid-cols-3 gap-8">
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

            <div className="text-center mt-12">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8">
                Get started for free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">
              FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "What is YouNote, exactly?", a: "YouNote is a note-taking app specifically designed for YouTube videos..." },
              { q: "How can I save time about stats?", a: "All stats are automatically tracked and displayed on your dashboard..." },
              { q: "Does everyone visualize?", a: "Yes, all notes and notebooks are visualized in an intuitive interface..." },
              { q: "What is your password?", a: "We use industry-standard encryption and never store passwords in plain text..." },
              { q: "What is a smooth transition?", a: "Our UI is designed with smooth animations and transitions for a polished experience..." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold">
            Ready to transform your YouTube learning?
          </h2>
          <p className="text-xl text-slate-300">
            Loved with 9 avid learners already
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8">
              Get started
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Sign in
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <p>© 2025 YouNote. Free forever.</p>
            <div className="flex items-center gap-6">
              <Link href="/legal/terms-of-use" className="hover:text-slate-900">
                Terms of Use
              </Link>
              <Link href="/legal/privacy-policy" className="hover:text-slate-900">
                Privacy Policy
              </Link>
              <a href="mailto:adi@adidacta.com" className="hover:text-slate-900">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
