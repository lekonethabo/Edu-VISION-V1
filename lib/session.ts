// src/lib/session.ts
import { cookies } from 'next/headers';

export interface SessionData {
  userId: number;
  username: string;
  role: string;
  schoolId: number | null;
  schoolName?: string;
  loggedInAt: string;
}

/**
 * Get current session
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Set session
 */
export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

/**
 * Clear session
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession();
  return session?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: string[]): Promise<boolean> {
  const session = await getSession();
  return session ? roles.includes(session.role) : false;
}