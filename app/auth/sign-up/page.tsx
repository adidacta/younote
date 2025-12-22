import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between p-6 md:p-8">
        <Link href="/">
          <Image
            src="/images/younote-logo-light.png"
            alt="YouNote"
            width={150}
            height={30}
            className="dark:hidden"
            priority
          />
          <Image
            src="/images/younote-logo-dark.png"
            alt="YouNote"
            width={150}
            height={30}
            className="hidden dark:block"
            priority
          />
        </Link>
        <Link
          href="/auth/login"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Sign in
        </Link>
      </header>

      {/* Centered sign-up form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
