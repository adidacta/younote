import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";
import { BookOpen, FileText, StickyNote } from "lucide-react";

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Marketing content */}
      <div className="flex flex-col items-center justify-center gap-8 p-6 md:p-10 bg-muted/50">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <Image
            src="/images/younote-logo-light.png"
            alt="YouNote"
            width={200}
            height={40}
            className="dark:hidden"
            priority
          />
          <Image
            src="/images/younote-logo-dark.png"
            alt="YouNote"
            width={200}
            height={40}
            className="hidden dark:block"
            priority
          />

          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Transform YouTube into Your Learning Library
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Take timestamped notes while watching videos. Organize your insights. Never forget what you learned.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-6 w-full mt-4">
            <div className="flex items-start gap-4 text-left">
              <div className="p-3 rounded-full bg-primary/10 shrink-0">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Organize Notebooks</h3>
                <p className="text-sm text-muted-foreground">
                  Create notebooks for different topics and keep all your learning organized
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="p-3 rounded-full bg-primary/10 shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Video Pages</h3>
                <p className="text-sm text-muted-foreground">
                  One page per video with embedded player and all your notes in one place
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="p-3 rounded-full bg-primary/10 shrink-0">
                <StickyNote className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Timestamped Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Link notes to specific moments - click to jump right to that timestamp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
