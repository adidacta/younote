import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>
              We couldn&apos;t verify your email confirmation link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                This could happen if:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>The link has expired</li>
                <li>The link was already used</li>
                <li>The link is invalid</li>
              </ul>
              <div className="flex flex-col gap-2 mt-4">
                <Button asChild>
                  <Link href="/auth/sign-up">Try signing up again</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Back to login</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
