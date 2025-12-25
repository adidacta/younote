import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ShareCTACardProps {
  sharedByNickname: string;
  shareToken: string;
  shareType: 'page' | 'note';
}

export function ShareCTACard({ sharedByNickname, shareToken, shareType }: ShareCTACardProps) {
  const signUpUrl = `/auth/sign-up?share_token=${shareToken}&share_type=${shareType}`;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {sharedByNickname} shared this {shareType === 'note' ? 'note' : 'page'} with you
            </h3>
            <p className="text-sm text-muted-foreground">
              Make this page yours and add more notes by signing up or logging in
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <Button asChild className="flex-1 group">
              <Link href={signUpUrl}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/auth/login?share_token=${shareToken}&share_type=${shareType}`}>
                Log In
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Free forever • No credit card required
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
