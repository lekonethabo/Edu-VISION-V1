// src/app/login/actions.ts
'use server';

import { findUserByUsername, updateLastLogin, isFirstLogin, getUserSchoolDetails } from '@/lib/auth/user';
import { verifyPassword } from '@/lib/auth/password';
import { cookies } from 'next/headers';

// Session configuration
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export interface LoginActionResult {
  success: boolean;
  user?: {
    userId: number;
    regID: string;
    role: string;
    schoolId: number | null;
    schoolName?: string;
    firstLogin: boolean;
    isActive: boolean;
  };
  error?: string;
}

export async function loginAction(
  username: string,
  password: string
): Promise<LoginActionResult> {
  try {
    // Validate input
    if (!username || !password) {
      return {
        success: false,
        error: 'Please provide both registration number and password.'
      };
    }

    // Find user by username (registration number)
    const user = await findUserByUsername(username);

    if (!user) {
      return {
        success: false,
        error: 'Invalid registration number or password.'
      };
    }

    // Check if user is active
    if (!user.is_active) {
      return {
        success: false,
        error: 'Your account has been deactivated. Please contact the system administrator.'
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid registration number or password.'
      };
    }

    // Update last login timestamp
    await updateLastLogin(user.user_id);

    // Check if first login
    const firstLogin = await isFirstLogin(user);

    // Get school details if user is associated with a school
    let schoolName: string | undefined;
    if (user.school_id) {
      const school = await getUserSchoolDetails(user.user_id);
      schoolName = school?.name;
    }

    // Prepare user data for response
    const userData = {
      userId: user.user_id,
      regID: user.username,
      role: user.role,
      schoolId: user.school_id,
      schoolName: schoolName,
      firstLogin: firstLogin,
      isActive: Boolean(user.is_active)
    };

    // Set session cookie
    const cookieStore = await cookies();
    
    // Create session data
    const sessionData = JSON.stringify({
      userId: user.user_id,
      username: user.username,
      role: user.role,
      schoolId: user.school_id,
      schoolName: schoolName,
      loggedInAt: new Date().toISOString()
    });

    cookieStore.set('session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
      path: '/'
    });

    return {
      success: true,
      user: userData
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    };
  }
}

/**
 * Logout action - clear session
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

/**
 * Get current session user
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSessionUser();
  return session !== null;
}