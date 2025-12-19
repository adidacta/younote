import { createClient } from "@/lib/supabase/server";
import type { Notebook, NotebookInsert, NotebookUpdate } from "@/types/database";

/**
 * Get all notebooks for the current user, sorted by creation date (newest first)
 */
export async function getNotebooks(): Promise<Notebook[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notebooks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notebooks:', error);
    throw new Error('Failed to fetch notebooks');
  }

  return data || [];
}

/**
 * Get a single notebook by ID
 */
export async function getNotebookById(id: string): Promise<Notebook | null> {
  const supabase = await createClient();

  // Debug: Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  console.log('getNotebookById - User:', user?.id, 'Notebook ID:', id);

  const { data, error } = await supabase
    .from('notebooks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('Notebook not found:', id);
      return null; // Not found
    }
    console.error('Error fetching notebook:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw new Error(`Failed to fetch notebook: ${error.message || 'Unknown error'}`);
  }

  console.log('Notebook fetched successfully:', data?.id);
  return data;
}

/**
 * Create a new notebook
 */
export async function createNotebook(notebook: NotebookInsert): Promise<Notebook> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notebooks')
    .insert(notebook)
    .select()
    .single();

  if (error) {
    console.error('Error creating notebook:', error);
    throw new Error('Failed to create notebook');
  }

  return data;
}

/**
 * Update a notebook
 */
export async function updateNotebook(id: string, updates: NotebookUpdate): Promise<Notebook> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notebooks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating notebook:', error);
    throw new Error('Failed to update notebook');
  }

  return data;
}

/**
 * Delete a notebook (cascades to delete all pages and notes)
 */
export async function deleteNotebook(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notebooks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting notebook:', error);
    throw new Error('Failed to delete notebook');
  }
}
