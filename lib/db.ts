// src/lib/db.ts
import mysql from 'mysql2/promise';

// Get credentials from environment variables
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SSL_REJECT_UNAUTHORIZED = 'true'
} = process.env;

// Validate required environment variables
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error(
    'Missing required database environment variables. ' +
    'Please check DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env.local'
  );
}

// Create connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  port: parseInt(DB_PORT || '11827'),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: {
    rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED === 'true'
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully to school_data_collection');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export default pool;