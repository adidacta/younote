/**
 * Database functions for creating onboarding content
 */

import { createClient } from "@/lib/supabase/server";
import {
  ONBOARDING_NOTEBOOK_TITLE,
  ONBOARDING_PAGE_TITLE,
  ONBOARDING_VIDEO_URL,
  ONBOARDING_VIDEO_ID,
  ONBOARDING_NOTES,
} from "@/lib/onboarding/templates";

/**
 * Convert ISO 8601 duration (PT5M30S) to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetch YouTube video metadata
 */
async function fetchYouTubeMetadata(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    const video = data.items?.[0];

    if (!video) {
      return null;
    }

    return {
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      channelName: video.snippet.channelTitle,
      durationSeconds: parseDuration(video.contentDetails.duration),
    };
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    return null;
  }
}

/**
 * Create onboarding notebook with tutorial content for new user
 */
export async function createOnboardingNotebook(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Create the notebook
    const { data: notebook, error: notebookError } = await supabase
      .from("notebooks")
      .insert({
        title: ONBOARDING_NOTEBOOK_TITLE,
        user_id: userId,
      })
      .select()
      .single();

    if (notebookError || !notebook) {
      console.error("Error creating onboarding notebook:", notebookError);
      return {
        success: false,
        error: "Failed to create onboarding notebook",
      };
    }

    // 2. Fetch YouTube metadata
    const videoMetadata = await fetchYouTubeMetadata(ONBOARDING_VIDEO_ID);

    if (!videoMetadata) {
      console.error("Failed to fetch YouTube metadata for onboarding video");
      // Continue anyway with fallback data
    }

    // 3. Create the page with video
    const { data: page, error: pageError } = await supabase
      .from("pages")
      .insert({
        notebook_id: notebook.id,
        user_id: userId,
        title: ONBOARDING_PAGE_TITLE,
        youtube_url: ONBOARDING_VIDEO_URL,
        youtube_video_id: ONBOARDING_VIDEO_ID,
        video_title: videoMetadata?.title || "Alice in Chains - Nutshell (MTV Unplugged)",
        thumbnail_url:
          videoMetadata?.thumbnail ||
          "https://i.ytimg.com/vi/9EKi2E9dVY8/hqdefault.jpg",
        channel_name: videoMetadata?.channelName || "Alice in Chains",
        duration_seconds: videoMetadata?.durationSeconds || 330, // 5:30 fallback
      })
      .select()
      .single();

    if (pageError || !page) {
      console.error("Error creating onboarding page:", pageError);
      return { success: false, error: "Failed to create onboarding page" };
    }

    // 4. Create all tutorial notes
    const notesData = ONBOARDING_NOTES.map((note) => ({
      page_id: page.id,
      user_id: userId,
      content: note.content,
      timestamp_seconds: note.timestamp,
    }));

    const { error: notesError } = await supabase
      .from("notes")
      .insert(notesData);

    if (notesError) {
      console.error("Error creating onboarding notes:", notesError);
      return { success: false, error: "Failed to create onboarding notes" };
    }

    console.log(
      `Successfully created onboarding notebook for user ${userId}`
    );
    return { success: true };
  } catch (error) {
    console.error("Unexpected error creating onboarding content:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if user already has onboarding notebook
 */
export async function hasOnboardingNotebook(
  userId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notebooks")
      .select("id")
      .eq("user_id", userId)
      .eq("title", ONBOARDING_NOTEBOOK_TITLE)
      .limit(1);

    if (error) {
      console.error("Error checking for onboarding notebook:", error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (error) {
    console.error("Unexpected error checking onboarding notebook:", error);
    return false;
  }
}
