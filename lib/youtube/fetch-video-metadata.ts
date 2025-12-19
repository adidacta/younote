import type { YouTubeVideoMetadata } from "@/types/database";

/**
 * Parse ISO 8601 duration format (PT15M30S) to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetch video metadata from YouTube Data API v3
 * This should be called from a server-side API route to keep the API key secure
 */
export async function fetchYouTubeVideoMetadata(
  videoId: string,
  apiKey: string
): Promise<YouTubeVideoMetadata> {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('id', videoId);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('part', 'snippet,contentDetails');

  const response = await fetch(url.toString());

  if (!response.ok) {
    console.error('YouTube API error:', response.status, response.statusText);
    throw new Error(`Failed to fetch video metadata: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found or is private/unavailable');
  }

  const video = data.items[0];
  const snippet = video.snippet;
  const contentDetails = video.contentDetails;

  // Get high quality thumbnail (default to medium if high not available)
  const thumbnailUrl =
    snippet.thumbnails.high?.url ||
    snippet.thumbnails.medium?.url ||
    snippet.thumbnails.default?.url;

  return {
    video_title: snippet.title,
    thumbnail_url: thumbnailUrl,
    channel_name: snippet.channelTitle,
    duration_seconds: parseDuration(contentDetails.duration),
  };
}
