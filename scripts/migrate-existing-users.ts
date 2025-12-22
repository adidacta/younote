/**
 * Migration script to create user profiles for existing users
 * Uses email prefix as default nickname
 *
 * Run with: npx tsx scripts/migrate-existing-users.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateUsers() {
  console.log('Starting user profile migration...\n');

  // Get all users from auth.users
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error fetching users:', usersError);
    process.exit(1);
  }

  console.log(`Found ${users.length} users\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of users) {
    const email = user.email;
    if (!email) {
      console.log(`⚠️  User ${user.id} has no email, skipping`);
      skipped++;
      continue;
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      console.log(`✓ User ${email} already has a profile, skipping`);
      skipped++;
      continue;
    }

    // Extract nickname from email prefix
    const emailPrefix = email.split('@')[0];
    // Clean up the nickname: remove special chars, limit length
    let nickname = emailPrefix
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 20);

    // Ensure minimum length
    if (nickname.length < 3) {
      nickname = `user${user.id.substring(0, 5)}`;
    }

    // Create profile
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        nickname: nickname,
      });

    if (insertError) {
      console.error(`✗ Failed to create profile for ${email}:`, insertError.message);
      failed++;
    } else {
      console.log(`✓ Created profile for ${email} with nickname: ${nickname}`);
      created++;
    }
  }

  console.log('\n--- Migration Summary ---');
  console.log(`Total users: ${users.length}`);
  console.log(`Profiles created: ${created}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log('-------------------------\n');
}

migrateUsers()
  .then(() => {
    console.log('Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
