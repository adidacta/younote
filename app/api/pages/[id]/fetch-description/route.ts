import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPageById } from '@/lib/database/pages';
import { fetchYouTubeVideoMetadata } from '@/lib/youtube/fetch-video-metadata';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the page to retrieve video ID
    const page = await getPageById(id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if user owns this page
    if (page.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch metadata from YouTube
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API not configured' },
        { status: 500 }
      );
    }

    const metadata = await fetchYouTubeVideoMetadata(page.youtube_video_id, apiKey);

    // Update page with description
    const { error: updateError } = await supabase
      .from('pages')
      .update({ description: metadata.description })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      description: metadata.description,
      success: true
    });
  } catch (error) {
    console.error('Error fetching description:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch description' },
      { status: 500 }
    );
  }
}
