import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserProfileInsert, UserProfileUpdate } from "@/types/database";

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Profile not found
    }
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }

  return data;
}

/**
 * Get a user profile by user ID
 */
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Profile not found
    }
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }

  return data;
}

/**
 * Create a new user profile
 */
export async function createUserProfile(profile: UserProfileInsert): Promise<UserProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }

  return data;
}

/**
 * Update a user profile
 */
export async function updateUserProfile(updates: UserProfileUpdate): Promise<UserProfile> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }

  return data;
}

/**
 * Delete a user profile
 */
export async function deleteUserProfile(): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}
