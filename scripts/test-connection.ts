// scripts/test-connection.ts
import 'dotenv/config';
import { query } from '../lib/db';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    
    // Test simple query
    const result = await query<any[]>('SELECT 1 as test, NOW() as time, DATABASE() as db');
    console.log('✅ Connection successful!');
    console.log('   Result:', result[0]);
    
    // Check users table
    const users = await query<any[]>('SELECT COUNT(*) as count FROM users');
    console.log(`   Users in database: ${users[0].count}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();