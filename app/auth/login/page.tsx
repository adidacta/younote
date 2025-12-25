import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";

interface LoginPageProps {
  searchParams: Promise<{
    share_token?: string;
    share_type?: string;
  }>;
}

export default async function Page({ searchParams }: LoginPageProps) {
  const params = await searchParams;
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
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Sign up free</Link>
            </Button>
          </div>
        </header>

        {/* Centered login form */}
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm
              shareToken={params.share_token}
              shareType={params.share_type as 'page' | 'note' | undefined}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
