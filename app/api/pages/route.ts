import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPage, getPagesByNotebookId } from '@/lib/database/pages';
import { createNote } from '@/lib/database/notes';
import { extractYouTubeVideoId } from '@/lib/youtube/extract-video-id';
import { fetchYouTubeVideoMetadata } from '@/lib/youtube/fetch-video-metadata';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notebook_id, youtube_url, title } = body;

    if (!notebook_id || !youtube_url || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 120) {
      return NextResponse.json(
        { error: 'Title must be 120 characters or less' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractYouTubeVideoId(youtube_url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Fetch metadata
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API not configured' },
        { status: 500 }
      );
    }

    const metadata = await fetchYouTubeVideoMetadata(videoId, apiKey);

    // Check if this is the first page of the notebook
    const existingPages = await getPagesByNotebookId(notebook_id);
    const isFirstPage = existingPages.length === 0;

    // Create page
    const page = await createPage({
      notebook_id,
      user_id: user.id,
      title: trimmedTitle,
      youtube_url,
      youtube_video_id: videoId,
      video_title: metadata.video_title.slice(0, 120), // Also truncate metadata title
      thumbnail_url: metadata.thumbnail_url,
      channel_name: metadata.channel_name,
      duration_seconds: metadata.duration_seconds,
      description: metadata.description,
    });

    // If this is the first page, create a markdown guide note
    if (isFirstPage) {
      const guideContent = `# Here are typing tips to make note taking fast:

**Want a title?** Add \`#\` before a line
**Want a subtitle?** Add \`##\` before a line

**Want bold text?** Wrap with \`**text**\` or press ⌘B
**Want italic?** Wrap with \`*text*\` or press ⌘I
**Want strikethrough?** Wrap with \`~~text~~\`

**Want a link?** Type \`[text](url)\` or press ⌘K
**Want code?** Wrap with \`\\\`code\\\`\`

**Want a bullet list?** Start with \`- \` (dash + space)
**Want numbers?** Start with \`1. \` (number + dot + space)
**Want a task?** Start with \`- [ ] \` (dash + space + brackets)

Press ⌘⏎ (Cmd+Enter) to save your note quickly!`;

      await createNote({
        page_id: page.id,
        user_id: user.id,
        content: guideContent,
        timestamp_seconds: null,
      });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create page' },
      { status: 500 }
    );
  }
}
