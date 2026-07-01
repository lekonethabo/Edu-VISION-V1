// scripts/seed.ts
import 'dotenv/config';
import { query } from '../lib/db';
import { hashPassword } from '../lib/auth/password';

async function seed() {
  try {
    console.log('⏳ Seeding test user...');
    
    // First check if users table exists
    try {
      await query('SELECT 1 FROM users LIMIT 1');
    } catch (error: any) {
      if (error.message.includes('does not exist')) {
        console.error('❌ Users table does not exist!');
        console.log('Please run your SQL schema first.');
        process.exit(1);
      }
    }
    
    const passwordHash = await hashPassword('admin123');
    console.log('🔑 Password hash created');
    
    // Check if user exists
    const existingUser = await query<any[]>(
      'SELECT * FROM users WHERE username = ?',
      ['E5/7/29']
    );

    if (existingUser.length > 0) {
      // Update existing user
      await query(
        `UPDATE users SET 
          password_hash = ?, 
          email = ?, 
          full_name = ?, 
          role = ?, 
          is_active = 1,
          deleted_at = NULL,
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
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding:', error.message);
    process.exit(1);
  }
}

seed();