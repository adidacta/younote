-- Migration: Add emoji status indicator to notes
-- Description: Adds an optional emoji column to notes for quick visual status/categorization

-- Add emoji column to notes table (nullable text field)
ALTER TABLE notes ADD COLUMN IF NOT EXISTS emoji TEXT;

-- Add comment to document the column
COMMENT ON COLUMN notes.emoji IS 'Optional emoji status indicator (e.g., 👀, ✅, ⭐, ❤️, 💡, ❓, 🔥, 📌)';
