import { createClient } from "@/lib/supabase/server";
import type { SharedPage, SharedPageInsert } from "@/types/database";

/**
 * Get shared page by token (for public access)
 * Note: This bypasses RLS, so it should only be used for public share links
 */
export async function getSharedPageByToken(token: string): Promise<SharedPage | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shared_pages')
    .select('*')
    .eq('share_token', token)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching shared page:', error);
    throw new Error('Failed to fetch shared page');
  }

  // Check if share link has expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null;
  }

  return data;
}

/**
 * Get all shared pages for a specific page
 */
export async function getSharedPagesByPageId(pageId: string): Promise<SharedPage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shared_pages')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shared pages:', error);
    throw new Error('Failed to fetch shared pages');
  }

  return data || [];
}

/**
 * Create a new share link
 */
export async function createSharedPage(sharedPage: SharedPageInsert): Promise<SharedPage> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shared_pages')
    .insert(sharedPage)
    .select()
    .single();

  if (error) {
    console.error('Error creating shared page:', error);
    throw new Error('Failed to create share link');
  }

  return data;
}

/**
 * Delete a share link
 */
export async function deleteSharedPage(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('shared_pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting shared page:', error);
    throw new Error('Failed to delete share link');
  }
}

/**
 * Generate a unique share token
 */
export function generateShareToken(): string {
  return crypto.randomUUID();
}
