import { Suspense } from "react";
import { SetupContent } from "./setup-content";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function SetupFallback() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Loading...</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={<SetupFallback />}>
      <SetupContent />
    </Suspense>
  );
}
