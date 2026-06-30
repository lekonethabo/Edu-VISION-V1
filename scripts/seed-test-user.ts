// scripts/seed-test-user.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Also try .env if .env.local doesn't have the variables
if (!process.env.DB_HOST) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

import { query } from '../lib/db';
import { hashPassword } from '../lib/auth/password';

async function seedTestUser() {
  try {
    console.log('⏳ Connecting to school_data_collection database...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    
    // Check if user already exists
    const existingUser = await query<any[]>(
      'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
      ['E5/7/29']
    );

    // Test user with registration number "E5/7/29"
    const passwordHash = await hashPassword('admin123');
    
    if (existingUser.length > 0) {
      // Update existing user
      await query(
        `UPDATE users SET 
          password_hash = ?, 
          email = ?, 
          full_name = ?, 
          role = ?, 
          is_active = 1,
          updated_at = NOW()
         WHERE username = ?`,
        [
          passwordHash,
          'test@school.com',
          'Test School Administrator',
          'school_head',
          'E5/7/29'
        ]
      );
      console.log('✅ Test user updated successfully!');
    } else {
      // Insert new user
      await query(
        `INSERT INTO users 
          (username, password_hash, email, full_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'E5/7/29',
          passwordHash,
          'test@school.com',
          'Test School Administrator',
          'school_head',
          1
        ]
      );
      console.log('✅ Test user created successfully!');
    }
    
    console.log('\n📝 Test Credentials:');
    console.log('   Registration Number: E5/7/29');
    console.log('   Password: admin123');
    console.log('   Role: school_head');
    console.log('   Database: school_data_collection');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test user:', error);
    console.error('Make sure you have created the database tables first.');
    process.exit(1);
  }
}

seedTestUser();