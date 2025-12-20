/**
 * One-time migration script to truncate notebook and page titles to new character limits
 * Run with: npx tsx scripts/migrate-title-limits.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateNotebookTitles() {
  console.log('Migrating notebook titles...');

  // Fetch all notebooks with titles longer than 80 characters
  const { data: notebooks, error: fetchError } = await supabase
    .from('notebooks')
    .select('id, title')
    .gt('title', ''); // Just to get all

  if (fetchError) {
    console.error('Error fetching notebooks:', fetchError);
    return;
  }

  const notebooksToUpdate = notebooks?.filter(n => n.title.length > 80) || [];
  console.log(`Found ${notebooksToUpdate.length} notebooks with titles > 80 characters`);

  for (const notebook of notebooksToUpdate) {
    const truncatedTitle = notebook.title.slice(0, 80);
    const { error: updateError } = await supabase
      .from('notebooks')
      .update({ title: truncatedTitle })
      .eq('id', notebook.id);

    if (updateError) {
      console.error(`Error updating notebook ${notebook.id}:`, updateError);
    } else {
      console.log(`✓ Updated notebook: "${notebook.title}" -> "${truncatedTitle}"`);
    }
  }

  console.log(`Migrated ${notebooksToUpdate.length} notebook titles\n`);
}

async function migratePageTitles() {
  console.log('Migrating page titles...');

  // Fetch all pages with titles longer than 120 characters
  const { data: pages, error: fetchError } = await supabase
    .from('pages')
    .select('id, title')
    .gt('title', ''); // Just to get all

  if (fetchError) {
    console.error('Error fetching pages:', fetchError);
    return;
  }

  const pagesToUpdate = pages?.filter(p => p.title.length > 120) || [];
  console.log(`Found ${pagesToUpdate.length} pages with titles > 120 characters`);

  for (const page of pagesToUpdate) {
    const truncatedTitle = page.title.slice(0, 120);
    const { error: updateError } = await supabase
      .from('pages')
      .update({ title: truncatedTitle })
      .eq('id', page.id);

    if (updateError) {
      console.error(`Error updating page ${page.id}:`, updateError);
    } else {
      console.log(`✓ Updated page: "${page.title}" -> "${truncatedTitle}"`);
    }
  }

  console.log(`Migrated ${pagesToUpdate.length} page titles\n`);
}

async function main() {
  console.log('Starting title migration...\n');

  await migrateNotebookTitles();
  await migratePageTitles();

  console.log('Migration complete!');
}

main().catch(console.error);
