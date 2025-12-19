import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeVideoMetadata } from '@/lib/youtube/fetch-video-metadata';
import { extractYouTubeVideoId } from '@/lib/youtube/extract-video-id';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const videoId = searchParams.get('videoId');

    // Extract video ID from URL if provided, otherwise use direct videoId
    const extractedVideoId = url ? extractYouTubeVideoId(url) : videoId;

    if (!extractedVideoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL or video ID' },
        { status: 400 }
      );
    }

    // Get YouTube API key from environment
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error('YOUTUBE_API_KEY not configured');
      return NextResponse.json(
        { error: 'YouTube API not configured' },
        { status: 500 }
      );
    }

    // Fetch metadata from YouTube API
    const metadata = await fetchYouTubeVideoMetadata(extractedVideoId, apiKey);

    return NextResponse.json({
      success: true,
      videoId: extractedVideoId,
      metadata,
    });
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch video metadata',
      },
      { status: 500 }
    );
  }
}
