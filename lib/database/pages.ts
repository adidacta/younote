import { createClient } from "@/lib/supabase/server";
import type { Page, PageInsert, PageUpdate } from "@/types/database";

/**
 * Get all pages for a notebook, sorted by creation date (newest first)
 */
export async function getPagesByNotebookId(notebookId: string): Promise<Page[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('notebook_id', notebookId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pages:', error);
    throw new Error('Failed to fetch pages');
  }

  return data || [];
}

/**
 * Get all pages for a notebook with note count
 */
export async function getPagesByNotebookIdWithStats(notebookId: string): Promise<(Page & { notes_count: number })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .select(`
      *,
      notes:notes(count)
    `)
    .eq('notebook_id', notebookId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pages with stats:', error);
    throw new Error('Failed to fetch pages with stats');
  }

  // Transform the data to include note count
  const pagesWithStats = (data || []).map((page: any) => {
    const notes_count = page.notes?.[0]?.count || 0;
    const { notes, ...pageData } = page;
    return {
      ...pageData,
      notes_count,
    };
  });

  return pagesWithStats;
}

/**
 * Get a single page by ID
 */
export async function getPageById(id: string): Promise<Page | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching page:', error);
    throw new Error('Failed to fetch page');
  }

  return data;
}

/**
 * Get all pages for the current user (for search/command palette)
 */
export async function getAllPages(): Promise<Page[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all pages:', error);
    throw new Error('Failed to fetch pages');
  }

  return data || [];
}

/**
 * Create a new page
 */
export async function createPage(page: PageInsert): Promise<Page> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .insert(page)
    .select()
    .single();

  if (error) {
    console.error('Error creating page:', error);
    throw new Error('Failed to create page');
  }

  return data;
}

/**
 * Update a page
 */
export async function updatePage(id: string, updates: PageUpdate): Promise<Page> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating page:', error);
    throw new Error('Failed to update page');
  }

  return data;
}

/**
 * Delete a page (cascades to delete all notes)
 */
export async function deletePage(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting page:', error);
    throw new Error('Failed to delete page');
  }
}
