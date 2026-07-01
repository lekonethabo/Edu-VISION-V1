// scripts/check-users.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { query } from '../lib/db';

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    // Check all users
    const allUsers = await query<any[]>(
      'SELECT user_id, username, email, role, is_active, last_login_at, deleted_at FROM users'
    );
    
    console.log(`\n📊 Total users found: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('\n⚠️ No users found in the database!');
      console.log('Please run the seed script: npm run seed');
    } else {
      console.log('\n👥 Users:');
      allUsers.forEach(user => {
        console.log(`   - ${user.username} (${user.role}) [Active: ${user.is_active ? 'Yes' : 'No'}]`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Last Login: ${user.last_login_at || 'Never'}`);
        console.log(`     Deleted: ${user.deleted_at ? 'Yes' : 'No'}`);
      });
    }
    
    // Specifically check for the test user
    const testUser = await query<any[]>(
      'SELECT * FROM users WHERE username = ?',
      ['E5/7/29']
    );
    
    if (testUser.length > 0) {
      console.log('\n✅ Test user found:');
      console.log(`   Username: ${testUser[0].username}`);
      console.log(`   Role: ${testUser[0].role}`);
      console.log(`   Active: ${testUser[0].is_active}`);
      console.log(`   Password Hash Length: ${testUser[0].password_hash.length}`);
      console.log(`   Password Hash: ${testUser[0].password_hash.substring(0, 20)}...`);
    } else {
      console.log('\n❌ Test user (E5/7/29) NOT found!');
      console.log('Run the seed script: npm run seed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsers();