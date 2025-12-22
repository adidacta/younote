import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              YouNote
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/legal/terms-of-use"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                href="/legal/privacy-policy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} YouNote. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/legal/terms-of-use"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/legal/privacy-policy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
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
