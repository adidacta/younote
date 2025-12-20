import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteNotebook, updateNotebook } from '@/lib/database/notebooks';

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

    await deleteNotebook(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notebook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete notebook' },
      { status: 500 }
    );
  }
}

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
    const { title } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 80) {
      return NextResponse.json(
        { error: 'Title must be 80 characters or less' },
        { status: 400 }
      );
    }

    const notebook = await updateNotebook(id, { title: trimmedTitle });

    return NextResponse.json(notebook);
  } catch (error) {
    console.error('Error updating notebook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update notebook' },
      { status: 500 }
    );
  }
}
