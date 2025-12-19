import { Note } from "@/types/database";
import { formatTimestamp } from "@/lib/youtube/format-timestamp";
import { generateTimestampUrl } from "@/lib/youtube/generate-timestamp-url";

interface ExportOptions {
  pageTitle: string;
  videoTitle: string;
  videoId: string;
  videoUrl: string;
  notes: Note[];
}

/**
 * Export notes to markdown format
 */
export function exportToMarkdown(options: ExportOptions): string {
  const { pageTitle, videoTitle, videoId, videoUrl, notes } = options;

  let markdown = `# ${pageTitle}\n\n`;
  markdown += `**Video:** [${videoTitle}](${videoUrl})\n\n`;
  markdown += `---\n\n`;

  if (notes.length === 0) {
    markdown += `*No notes*\n`;
  } else {
    markdown += `## Notes\n\n`;

    notes.forEach((note, index) => {
      // Add timestamp if available
      if (note.timestamp_seconds !== null) {
        const timestamp = formatTimestamp(note.timestamp_seconds);
        const timestampUrl = generateTimestampUrl(videoId, note.timestamp_seconds);
        markdown += `### [${timestamp}](${timestampUrl})\n\n`;
      } else {
        markdown += `### Note ${index + 1}\n\n`;
      }

      // Add note content
      if (note.content) {
        markdown += `${note.content}\n\n`;
      } else {
        markdown += `*Empty note*\n\n`;
      }

      // Add metadata
      const date = new Date(note.created_at).toLocaleString();
      markdown += `*Created: ${date}*\n\n`;
      markdown += `---\n\n`;
    });
  }

  markdown += `\n*Exported from YouNote*\n`;

  return markdown;
}

/**
 * Download markdown as a file
 */
export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
