import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSharedPageByToken } from '@/lib/database/shared-pages';
import { getSharedNoteByToken } from '@/lib/database/shared-notes';
import { getPageById, createPage } from '@/lib/database/pages';
import { getNoteById, getNotesByPageId, createNote } from '@/lib/database/notes';
import { getNotebooks, createNotebook } from '@/lib/database/notebooks';

export const dynamic = 'force-dynamic';

/**
 * Fork shared content (page or note) to user's account
 * This is the viral loop core - when new users sign up from shared links,
 * this automatically copies the content to their account
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
    const { share_token, share_type } = body;

    if (!share_token || !share_type) {
      return NextResponse.json(
        { error: 'share_token and share_type are required' },
        { status: 400 }
      );
    }

    if (share_type !== 'page' && share_type !== 'note') {
      return NextResponse.json(
        { error: 'share_type must be "page" or "note"' },
        { status: 400 }
      );
    }

    // Fetch shared content based on type
    let sourcePageId: string;
    let sourceNotesToFork: Array<{ id: string; content: string; timestamp_seconds: number | null }>;

    if (share_type === 'page') {
      // Fork entire page with all notes
      const sharedPage = await getSharedPageByToken(share_token);
      if (!sharedPage) {
        return NextResponse.json(
          { error: 'Shared page not found or expired' },
          { status: 404 }
        );
      }

      sourcePageId = sharedPage.page_id;
      const notes = await getNotesByPageId(sourcePageId);
      sourceNotesToFork = notes.map(note => ({
        id: note.id,
        content: note.content,
        timestamp_seconds: note.timestamp_seconds,
      }));
    } else {
      // Fork single note only
      const sharedNote = await getSharedNoteByToken(share_token);
      if (!sharedNote) {
        return NextResponse.json(
          { error: 'Shared note not found or expired' },
          { status: 404 }
        );
      }

      const note = await getNoteById(sharedNote.note_id);
      if (!note) {
        return NextResponse.json(
          { error: 'Note content not found' },
          { status: 404 }
        );
      }

      sourcePageId = note.page_id;
      sourceNotesToFork = [{
        id: note.id,
        content: note.content,
        timestamp_seconds: note.timestamp_seconds,
      }];
    }

    // Get the source page details (for video info)
    const sourcePage = await getPageById(sourcePageId);
    if (!sourcePage) {
      return NextResponse.json(
        { error: 'Source page not found' },
        { status: 404 }
      );
    }

    // Check if user already has a page for this video
    const { data: existingPages } = await supabase
      .from('pages')
      .select('*')
      .eq('youtube_video_id', sourcePage.youtube_video_id)
      .eq('user_id', user.id);

    let targetPageId: string;
    let notebookId: string;

    if (existingPages && existingPages.length > 0) {
      // User already has a page for this video - use the first one
      const existingPage = existingPages[0];
      targetPageId = existingPage.id;
      notebookId = existingPage.notebook_id;

      // Check for duplicate notes (by source_note_id or content match)
      const existingNotes = await getNotesByPageId(targetPageId);
      const existingNoteSourceIds = new Set(
        existingNotes
          .filter(n => n.source_note_id)
          .map(n => n.source_note_id)
      );

      // Only fork notes that don't already exist
      const notesToCreate = sourceNotesToFork.filter(
        note => !existingNoteSourceIds.has(note.id)
      );

      if (notesToCreate.length === 0) {
        // All notes already exist, no need to fork
        return NextResponse.json({
          page_id: targetPageId,
          notebook_id: notebookId,
          message: 'Content already exists in your account',
        });
      }

      // Create the new notes
      for (const note of notesToCreate) {
        await createNote({
          page_id: targetPageId,
          user_id: user.id,
          content: note.content,
          timestamp_seconds: note.timestamp_seconds,
          source_note_id: note.id,
          source_share_token: share_token,
        });
      }
    } else {
      // User doesn't have this video - create new page

      // Get user's notebooks or create one if none exist
      const notebooks = await getNotebooks();
      if (notebooks.length === 0) {
        // Create a default notebook
        const newNotebook = await createNotebook({
          user_id: user.id,
          title: 'My Notes',
        });
        notebookId = newNotebook.id;
      } else {
        // Use the first notebook
        notebookId = notebooks[0].id;
      }

      // Create new page with source tracking
      const newPage = await createPage({
        notebook_id: notebookId,
        user_id: user.id,
        title: sourcePage.title,
        youtube_url: sourcePage.youtube_url,
        youtube_video_id: sourcePage.youtube_video_id,
        video_title: sourcePage.video_title,
        thumbnail_url: sourcePage.thumbnail_url,
        channel_name: sourcePage.channel_name,
        duration_seconds: sourcePage.duration_seconds,
        description: sourcePage.description,
        source_share_token: share_token,
        source_share_type: share_type,
      });

      targetPageId = newPage.id;

      // Create all notes with source tracking
      for (const note of sourceNotesToFork) {
        await createNote({
          page_id: targetPageId,
          user_id: user.id,
          content: note.content,
          timestamp_seconds: note.timestamp_seconds,
          source_note_id: note.id,
          source_share_token: share_token,
        });
      }
    }

    return NextResponse.json({
      page_id: targetPageId,
      notebook_id: notebookId,
      message: 'Content forked successfully',
    });
  } catch (error) {
    console.error('Error forking shared content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fork content' },
      { status: 500 }
    );
  }
}
