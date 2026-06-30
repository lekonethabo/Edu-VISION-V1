// src/app/auth/page.tsx
'use client';

import LandingPage from './LandingPage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.isActive) {
          router.push('/dashboard');
        }
      } catch {
        // Invalid JSON, continue to login
      }
    }
  }, [router]);

  const handleLogin = (user: {
    regID: string;
    role: string;
    schoolId?: number | null;  // ✅ Fixed: number, not string
    firstLogin: boolean;
    isActive: boolean;
  }) => {
    // Store user info in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return <LandingPage onLogin={handleLogin} />;
}