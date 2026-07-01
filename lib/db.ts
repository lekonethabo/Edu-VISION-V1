// src/lib/db.ts
import mysql from 'mysql2/promise';

// Get credentials from environment
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Validate environment variables
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error('❌ Missing environment variables:');
  console.error('   DB_HOST:', DB_HOST ? '✅' : '❌');
  console.error('   DB_USER:', DB_USER ? '✅' : '❌');
  console.error('   DB_PASSWORD:', DB_PASSWORD ? '✅' : '❌');
  console.error('   DB_NAME:', DB_NAME ? '✅' : '❌');
  throw new Error('Missing required database environment variables');
}

console.log('📊 Connecting to database...');
console.log(`   Host: ${DB_HOST}`);
console.log(`   Port: ${DB_PORT}`);
console.log(`   Database: ${DB_NAME}`);

// Create connection pool with working SSL configuration
const pool = mysql.createPool({
  host: DB_HOST,
  port: parseInt(DB_PORT || '3306'),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  // This works with Aiven's self-signed certificates
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 30000, // 30 seconds
  // Add these for better connectivity
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection immediately
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    console.error('   Please check:');
    console.error('   1. Your IP is whitelisted in Aiven');
    console.error('   2. The database credentials are correct');
    console.error('   3. The database service is running');
    return false;
  }
}

// Run connection test
testConnection();

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error: any) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
}

export default pool;