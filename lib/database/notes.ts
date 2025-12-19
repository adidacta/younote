import { createClient } from "@/lib/supabase/server";
import type { Note, NoteInsert, NoteUpdate } from "@/types/database";

/**
 * Get all notes for a page, sorted by creation date (newest first)
 */
export async function getNotesByPageId(pageId: string): Promise<Note[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes');
  }

  return data || [];
}

/**
 * Get a single note by ID
 */
export async function getNoteById(id: string): Promise<Note | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching note:', error);
    throw new Error('Failed to fetch note');
  }

  return data;
}

/**
 * Create a new note
 */
export async function createNote(note: NoteInsert): Promise<Note> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .single();

  if (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }

  return data;
}

/**
 * Update a note
 */
export async function updateNote(id: string, updates: NoteUpdate): Promise<Note> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note');
  }

  return data;
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
}
