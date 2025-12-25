-- Migration: Add note sharing and viral loop tracking
-- Description: Creates shared_notes table for individual note sharing
--              and adds source tracking to pages and notes for viral attribution

-- Create shared_notes table for individual note sharing
CREATE TABLE IF NOT EXISTS shared_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_shared_notes_share_token ON shared_notes(share_token);
CREATE INDEX IF NOT EXISTS idx_shared_notes_note_id ON shared_notes(note_id);

-- Add source tracking to pages table (to track original shared content for viral attribution)
ALTER TABLE pages ADD COLUMN IF NOT EXISTS source_share_token TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS source_share_type TEXT CHECK (source_share_type IN ('page', 'note'));

-- Add source tracking to notes table (to track which note was forked)
ALTER TABLE notes ADD COLUMN IF NOT EXISTS source_note_id UUID;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS source_share_token TEXT;

-- Create indexes for source tracking queries
CREATE INDEX IF NOT EXISTS idx_pages_source_share_token ON pages(source_share_token);
CREATE INDEX IF NOT EXISTS idx_notes_source_note_id ON notes(source_note_id);
CREATE INDEX IF NOT EXISTS idx_notes_source_share_token ON notes(source_share_token);

-- Enable Row Level Security on shared_notes
ALTER TABLE shared_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own shared notes
CREATE POLICY "Users can view their own shared notes"
  ON shared_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = shared_notes.note_id
      AND notes.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can create shared notes for their own notes
CREATE POLICY "Users can create shared notes for their own notes"
  ON shared_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = shared_notes.note_id
      AND notes.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete their own shared notes
CREATE POLICY "Users can delete their own shared notes"
  ON shared_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = shared_notes.note_id
      AND notes.user_id = auth.uid()
    )
  );
