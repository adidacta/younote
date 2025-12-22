"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Validate nickname
    if (!nickname || nickname.trim().length === 0) {
      setError("Nickname is required");
      setIsLoading(false);
      return;
    }

    if (nickname.length < 3 || nickname.length > 20) {
      setError("Nickname must be between 3 and 20 characters");
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(nickname)) {
      setError("Nickname can only contain letters and numbers");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Use and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            nickname: nickname,
          },
        },
      });
      if (error) throw error;

      // If email confirmation is disabled, user is automatically logged in
      // Check if we have a session and redirect accordingly
      if (data.session) {
        // User is logged in, redirect to setup page for account initialization
        router.push("/auth/setup");
      } else {
        // User needs to confirm email, show success page
        router.push("/auth/sign-up-success");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Get started for free - no credit card required</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6 mt-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="johndoe"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9]+"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters, letters and numbers only
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>

              {/* Terms and Privacy Policy Checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/legal/terms-of-use"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy-policy"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading || !agreedToTerms}>
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
