"use client";

import { useState, useRef } from "react";
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
import { Download, Loader2, Upload, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface SettingsFormProps {
  profile: UserProfile;
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(profile.profile_image_url);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploadingImage(true);
    const supabase = createClient();

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete old image if exists
      if (profileImageUrl) {
        const oldPath = profileImageUrl.split("/").pop();
        if (oldPath) {
          await supabase.storage
            .from("profile-images")
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new image
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const newImageUrl = data.publicUrl;

      // Update profile in database
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_image_url: newImageUrl }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setProfileImageUrl(newImageUrl);
      toast.success("Profile image updated");
      router.refresh();
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    setIsUploadingImage(true);
    const supabase = createClient();

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete image from storage
      if (profileImageUrl) {
        const oldPath = profileImageUrl.split("/").pop();
        if (oldPath) {
          await supabase.storage
            .from("profile-images")
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Update profile in database
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_image_url: null }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setProfileImageUrl(null);
      toast.success("Profile image removed");
      router.refresh();
    } catch (error) {
      console.error("Image removal error:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsUploadingImage(false);
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
            {/* Profile Image Upload */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    {profileImageUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isUploadingImage}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

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
