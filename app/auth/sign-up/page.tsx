import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";

export default function Page() {
  return (
    <PageTransition>
      <div className="flex min-h-svh flex-col">
        {/* Header - same as home page */}
        <header className="border-b border-b-foreground/10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/younote-logo-light.png"
              alt="YouNote"
              width={120}
              height={40}
              className="dark:hidden"
              priority
            />
            <Image
              src="/images/younote-logo-dark.png"
              alt="YouNote"
              width={120}
              height={40}
              className="hidden dark:block"
              priority
            />
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Centered sign-up form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
