import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createSharedPage,
  generateShareToken,
  getSharedPagesByPageId,
} from '@/lib/database/shared-pages';
import { getPageById } from '@/lib/database/pages';

export const dynamic = 'force-dynamic';

/**
 * Create a share link for a page
 */
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
    const { page_id } = body;

    if (!page_id) {
      return NextResponse.json(
        { error: 'page_id is required' },
        { status: 400 }
      );
    }

    // Verify user owns the page
    const page = await getPageById(page_id);
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    if (page.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if share link already exists
    const existingShares = await getSharedPagesByPageId(page_id);
    if (existingShares.length > 0) {
      // Return existing share link
      return NextResponse.json({
        share_token: existingShares[0].share_token,
      });
    }

    // Create new share link
    const shareToken = generateShareToken();
    const sharedPage = await createSharedPage({
      page_id,
      share_token: shareToken,
    });

    return NextResponse.json({ share_token: sharedPage.share_token });
  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create share link' },
      { status: 500 }
    );
  }
}
