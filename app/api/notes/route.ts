import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createNote } from '@/lib/database/notes';

export const dynamic = 'force-dynamic';

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
    const { page_id, content, timestamp_seconds } = body;

    if (!page_id) {
      return NextResponse.json(
        { error: 'page_id is required' },
        { status: 400 }
      );
    }

    const note = await createNote({
      page_id,
      user_id: user.id,
      content: content || '',
      timestamp_seconds: timestamp_seconds || null,
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create note' },
      { status: 500 }
    );
  }
}
