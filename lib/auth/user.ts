// src/lib/auth/user.ts
import { query } from '../db';

export interface User {
  user_id: number;
  username: string;
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

export async function findUserByUsername(username: string): Promise<User | null> {
  try {
    const users = await query<User[]>(
      'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
      [username]
    );
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

export async function updateLastLogin(userId: number): Promise<void> {
  try {
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE user_id = ?',
      [userId]
    );
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

export async function isFirstLogin(user: User): Promise<boolean> {
  return user.last_login_at === null;
}

export async function getUserSchoolDetails(userId: number) {
  try {
    const results = await query<any[]>(
      `SELECT s.* FROM schools s
       INNER JOIN users u ON u.school_id = s.school_id
       WHERE u.user_id = ? AND s.deleted_at IS NULL`,
      [userId]
    );
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error getting school details:', error);
    return null;
  }
}