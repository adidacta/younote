-- Add description column to pages table
-- Run this in Supabase SQL Editor

ALTER TABLE pages
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Update existing pages to have empty description
UPDATE pages SET description = '' WHERE description IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN pages.description IS 'YouTube video description text, may contain chapters';
