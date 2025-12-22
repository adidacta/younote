"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserProfile } from "@/types/database";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

interface SettingsFormProps {
  profile: UserProfile;
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export");

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "notebooks-export.zip";

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    try {
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Nickname updated successfully");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Failed to update nickname");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">Display Name</Label>
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
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                Your display name is visible throughout the app. Use 3-20 characters (letters and numbers only).
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isLoading || nickname === profile.nickname}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              {nickname !== profile.nickname && !isLoading && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setNickname(profile.nickname)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Download all your notebooks, pages, and notes as a ZIP file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export your data to keep a local backup or migrate to another service.
              Your notes will be exported in Markdown format with YouTube links included.
            </p>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
