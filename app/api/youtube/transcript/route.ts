import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId is required' },
        { status: 400 }
      );
    }

    // Fetch transcript from YouTube (tries default language of video)
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: undefined // Let it auto-detect video's default language
    });

    console.log(`Transcript for ${videoId}:`, transcript?.length || 0, 'entries');

    // Transform to our format
    const formattedTranscript = transcript.map((entry: any) => ({
      text: entry.text,
      offset: Math.floor(entry.offset / 1000), // Convert ms to seconds
      duration: Math.floor(entry.duration / 1000),
    }));

    console.log(`Formatted transcript:`, formattedTranscript?.length || 0, 'entries');

    return NextResponse.json({ transcript: formattedTranscript });
  } catch (error) {
    console.error('Error fetching transcript:', error);

    // Check if it's a "no transcript available" error
    if (error instanceof Error && error.message.includes('Could not find')) {
      return NextResponse.json(
        { error: 'No transcript available for this video' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}
