import { createClient } from "@/lib/supabase/server";
import type { SharedNote, SharedNoteInsert } from "@/types/database";

/**
 * Get shared note by token (for public access)
 * Note: This bypasses RLS, so it should only be used for public share links
 */
export async function getSharedNoteByToken(token: string): Promise<SharedNote | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shared_notes')
    .select('*')
    .eq('share_token', token)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching shared note:', error);
    throw new Error('Failed to fetch shared note');
  }

  // Check if share link has expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null;
  }

  return data;
}

/**
 * Get all shared notes for a specific note
 */
export async function getSharedNotesByNoteId(noteId: string): Promise<SharedNote[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shared_notes')
    .select('*')
    .eq('note_id', noteId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shared notes:', error);
    throw new Error('Failed to fetch shared notes');
  }

  return data || [];
}

/**
 * Create a new share link for a note
 */
export async function createSharedNote(sharedNote: SharedNoteInsert): Promise<SharedNote> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shared_notes')
    .insert(sharedNote)
    .select()
    .single();

  if (error) {
    console.error('Error creating shared note:', error);
    throw new Error('Failed to create share link');
  }

  return data;
}

/**
 * Delete a share link for a note
 */
export async function deleteSharedNote(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('shared_notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting shared note:', error);
    throw new Error('Failed to delete share link');
  }
}

/**
 * Generate a unique share token
 */
export function generateShareToken(): string {
  return crypto.randomUUID();
}
