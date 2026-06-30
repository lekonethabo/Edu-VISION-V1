// src/lib/auth/user.ts
import { query } from '../db';

export interface User {
  user_id: number;
  username: string;        // This stores the school registration number
  password_hash: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: 'super_admin' | 'region_admin' | 'subregion_admin' | 'school_head';
  region_id: number | null;
  sub_region_id: number | null;
  school_id: number | null;
  is_active: number;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface UserLoginResult {
  success: boolean;
  user?: {
    userId: number;
    regID: string;
    role: string;
    schoolId: number | null;
    firstLogin: boolean;
    isActive: boolean;
  };
  error?: string;
}

/**
 * Find a user by username (registration number)
 * Matches the users table in school_data_collection
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  const users = await query<User[]>(
    'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
    [username]
  );
  return users.length > 0 ? users[0] : null;
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: number): Promise<void> {
  await query(
    'UPDATE users SET last_login_at = NOW() WHERE user_id = ?',
    [userId]
  );
}

/**
 * Check if user has first login (never logged in before)
 */
export async function isFirstLogin(user: User): Promise<boolean> {
  return user.last_login_at === null;
}

/**
 * Get school details for a user
 */
export async function getUserSchoolDetails(userId: number) {
  const results = await query<any[]>(
    `SELECT s.* FROM schools s
     INNER JOIN users u ON u.school_id = s.school_id
     WHERE u.user_id = ? AND s.deleted_at IS NULL`,
    [userId]
  );
  return results.length > 0 ? results[0] : null;
}