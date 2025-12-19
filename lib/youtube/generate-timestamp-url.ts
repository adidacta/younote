/**
 * Generate a YouTube URL with timestamp parameter
 * Example: https://youtu.be/VIDEO_ID?t=123
 */
export function generateTimestampUrl(videoId: string, seconds: number): string {
  return `https://youtu.be/${videoId}?t=${Math.floor(seconds)}`;
}

/**
 * Generate YouTube embed URL
 */
export function generateEmbedUrl(videoId: string, startSeconds?: number): string {
  let url = `https://www.youtube.com/embed/${videoId}`;
  if (startSeconds !== undefined) {
    url += `?start=${Math.floor(startSeconds)}`;
  }
  return url;
}
