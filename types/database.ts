// Database type definitions for YouTube Note-Taking App

export interface UserProfile {
  id: string;
  user_id: string;
  nickname: string;
  profile_image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notebook {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  notebook_id: string;
  user_id: string;
  title: string;
  youtube_url: string;
  youtube_video_id: string;
  video_title: string;
  thumbnail_url: string;
  channel_name: string;
  duration_seconds: number;
  description: string;
  source_share_token?: string | null;
  source_share_type?: 'page' | 'note' | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  page_id: string;
  user_id: string;
  content: string;
  timestamp_seconds: number | null;
  emoji?: string | null;
  source_note_id?: string | null;
  source_share_token?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SharedPage {
  id: string;
  page_id: string;
  share_token: string;
  created_at: string;
  expires_at: string | null;
}

export interface SharedNote {
  id: string;
  note_id: string;
  share_token: string;
  created_at: string;
  expires_at: string | null;
}

// Insert types (without auto-generated fields)
export type UserProfileInsert = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
export type NotebookInsert = Omit<Notebook, 'id' | 'created_at' | 'updated_at'>;
export type PageInsert = Omit<Page, 'id' | 'created_at' | 'updated_at'>;
export type NoteInsert = Omit<Note, 'id' | 'created_at' | 'updated_at'>;
export type SharedPageInsert = Omit<SharedPage, 'id' | 'created_at' | 'expires_at'> & { expires_at?: string | null };
export type SharedNoteInsert = Omit<SharedNote, 'id' | 'created_at' | 'expires_at'> & { expires_at?: string | null };

// Update types (all fields optional except id)
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type NotebookUpdate = Partial<Omit<Notebook, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type PageUpdate = Partial<Omit<Page, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type NoteUpdate = Partial<Omit<Note, 'id' | 'user_id' | 'page_id' | 'created_at' | 'updated_at'>>;

// YouTube API response types
export interface YouTubeVideoMetadata {
  video_title: string;
  thumbnail_url: string;
  channel_name: string;
  duration_seconds: number;
  description: string;
}
