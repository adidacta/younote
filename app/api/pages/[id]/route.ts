import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updatePage, deletePage } from '@/lib/database/pages';

export const dynamic = 'force-dynamic';

export async function PATCH(
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
    const body = await request.json();
    const { title, notebook_id } = body;

    // Build update object with only provided fields
    const updates: { title?: string; notebook_id?: string } = {};

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (trimmedTitle.length > 120) {
        return NextResponse.json(
          { error: 'Title must be 120 characters or less' },
          { status: 400 }
        );
      }
      updates.title = trimmedTitle;
    }

    if (notebook_id !== undefined) {
      updates.notebook_id = notebook_id;
    }

    // Require at least one field to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const page = await updatePage(id, updates);

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await deletePage(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete page' },
      { status: 500 }
    );
  }
}
