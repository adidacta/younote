import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createSharedNote,
  generateShareToken,
  getSharedNotesByNoteId,
} from '@/lib/database/shared-notes';
import { getNoteById } from '@/lib/database/notes';

export const dynamic = 'force-dynamic';

/**
 * Create a share link for an individual note
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
    const { note_id } = body;

    if (!note_id) {
      return NextResponse.json(
        { error: 'note_id is required' },
        { status: 400 }
      );
    }

    // Verify user owns the note
    const note = await getNoteById(note_id);
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    if (note.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if share link already exists
    const existingShares = await getSharedNotesByNoteId(note_id);
    if (existingShares.length > 0) {
      // Return existing share link
      return NextResponse.json({
        share_token: existingShares[0].share_token,
      });
    }

    // Create new share link
    const shareToken = generateShareToken();
    const sharedNote = await createSharedNote({
      note_id,
      share_token: shareToken,
    });

    return NextResponse.json({ share_token: sharedNote.share_token });
  } catch (error) {
    console.error('Error creating note share link:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create share link' },
      { status: 500 }
    );
  }
}
