/**
 * Utilities for extracting metadata from markdown content for social sharing
 */

/**
 * Extract a title from markdown content
 * Tries to find the first heading (H1/H2), otherwise uses the first line
 * @param content - Markdown content
 * @returns Extracted title or default fallback
 */
export function extractTitle(content: string | null | undefined): string {
  if (!content || content.trim().length === 0) {
    return "Untitled Note";
  }

  const lines = content.split('\n').filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    return "Untitled Note";
  }

  // Look for first H1 or H2 heading
  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      return h1Match[1].trim();
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      return h2Match[1].trim();
    }
  }

  // Fall back to first non-empty line, stripped of markdown syntax
  const firstLine = lines[0];

  // Remove common markdown syntax
  const cleaned = firstLine
    .replace(/^#{1,6}\s+/, '') // Remove heading markers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/~~(.+?)~~/g, '$1') // Remove strikethrough
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
    .replace(/^[-*+]\s+/, '') // Remove list markers
    .replace(/^\d+\.\s+/, '') // Remove numbered list markers
    .replace(/^>\s+/, '') // Remove blockquote markers
    .trim();

  return cleaned || "Untitled Note";
}

/**
 * Generate a description from markdown content
 * Extracts first ~150 characters of clean text
 * @param content - Markdown content
 * @param maxLength - Maximum length of description (default: 160)
 * @returns Extracted description
 */
export function extractDescription(content: string | null | undefined, maxLength: number = 160): string {
  if (!content || content.trim().length === 0) {
    return "View this note on YouNote";
  }

  // Remove all markdown syntax to get plain text
  const plainText = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove headings markers but keep text
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold, italic
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove strikethrough
    .replace(/~~(.+?)~~/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove list markers
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Remove blockquote markers
    .replace(/^>\s+/gm, '')
    // Remove checkbox markers
    .replace(/^- \[[ x]\]\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length === 0) {
    return "View this note on YouNote";
  }

  // Truncate to max length, cutting at word boundary
  if (plainText.length <= maxLength) {
    return plainText;
  }

  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    // If we have a good word boundary, use it
    return truncated.substring(0, lastSpace) + '...';
  }

  // Otherwise just truncate
  return truncated + '...';
}

/**
 * Get YouTube thumbnail URL
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, medium, high, maxres)
 * @returns Thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality}default.jpg`;
}
