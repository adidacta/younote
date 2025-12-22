import { createClient } from "@/lib/supabase/server";
import { getNotebooks } from "@/lib/database/notebooks";
import { getUserProfile } from "@/lib/database/user-profiles";
import { NextResponse } from "next/server";
import JSZip from "jszip";

/**
 * GET /api/export
 * Export all user data as a zip file
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Get user profile for the folder name
    const profile = await getUserProfile();
    const username = profile?.nickname || user.email?.split('@')[0] || 'user';

    // Fetch all notebooks
    const notebooks = await getNotebooks();

    // Create zip file
    const zip = new JSZip();
    const rootFolder = zip.folder(`${username} notebooks by YouNote`);

    if (!rootFolder) {
      throw new Error("Failed to create root folder");
    }

    // Process each notebook
    for (const notebook of notebooks) {
      const notebookFolder = rootFolder.folder(sanitizeFilename(notebook.title));

      if (!notebookFolder) continue;

      // Fetch pages for this notebook
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('notebook_id', notebook.id)
        .order('created_at', { ascending: true });

      if (pagesError || !pages) {
        console.error('Error fetching pages:', pagesError);
        continue;
      }

      // Process each page
      for (const page of pages) {
        const pageFolder = notebookFolder.folder(sanitizeFilename(page.title));

        if (!pageFolder) continue;

        // Add page info file
        const pageInfo = `# ${page.title}

**YouTube URL:** ${page.youtube_url}
**Channel:** ${page.channel_name}
**Video ID:** ${page.youtube_video_id}
**Created:** ${new Date(page.created_at).toLocaleDateString()}

---

${page.description || 'No description available'}
`;

        pageFolder.file('_page-info.md', pageInfo);

        // Fetch notes for this page
        const { data: notes, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .eq('page_id', page.id)
          .order('created_at', { ascending: true });

        if (notesError || !notes) {
          console.error('Error fetching notes:', notesError);
          continue;
        }

        // Add each note as a separate file
        notes.forEach((note, index) => {
          const noteNumber = String(index + 1).padStart(3, '0');
          let noteContent = '';

          // Add timestamp if present
          if (note.timestamp_seconds !== null) {
            const timestamp = formatTimestamp(note.timestamp_seconds);
            noteContent += `**Timestamp:** [${timestamp}](${page.youtube_url}&t=${note.timestamp_seconds}s)\n\n`;
          }

          // Add note content
          noteContent += note.content;

          // Add metadata at the bottom
          noteContent += `\n\n---\n*Created: ${new Date(note.created_at).toLocaleString()}*`;

          pageFolder.file(`note-${noteNumber}.md`, noteContent);
        });

        // If no notes, add a placeholder
        if (notes.length === 0) {
          pageFolder.file('_no-notes.md', 'No notes for this page yet.');
        }
      }

      // If no pages, add a placeholder
      if (pages.length === 0) {
        notebookFolder.file('_empty.md', 'This notebook is empty.');
      }
    }

    // Generate zip file
    const zipContent = await zip.generateAsync({ type: "uint8array" });

    // Return zip file
    return new NextResponse(zipContent, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${username}-notebooks-export.zip"`,
      },
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

/**
 * Sanitize filename by removing/replacing invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200); // Limit length
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}
