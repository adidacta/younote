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
 * Get all notebooks with stats (page count and note count)
 */
export async function getNotebooksWithStats(): Promise<(Notebook & { pages_count: number; notes_count: number })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notebooks')
    .select(`
      *,
      pages:pages(count),
      notes:pages(notes(count))
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notebooks with stats:', error);
    throw new Error('Failed to fetch notebooks with stats');
  }

  // Transform the data to include counts
  const notebooksWithStats = (data || []).map((notebook: any) => {
    const pages_count = notebook.pages?.[0]?.count || 0;

    // Count total notes across all pages
    let notes_count = 0;
    if (notebook.notes && Array.isArray(notebook.notes)) {
      notes_count = notebook.notes.reduce((sum: number, page: any) => {
        return sum + (page.notes?.[0]?.count || 0);
      }, 0);
    }

    // Remove the nested data and add the counts
    const { pages, notes, ...notebookData } = notebook;
    return {
      ...notebookData,
      pages_count,
      notes_count,
    };
  });

  return notebooksWithStats;
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
