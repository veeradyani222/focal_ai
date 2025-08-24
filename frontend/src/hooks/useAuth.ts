'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const redirectToDashboard = () => {
    // Use setTimeout to defer the navigation to the next tick
    setTimeout(() => {
      router.push('/dashboard');
    }, 0);
  };

  const redirectToHome = () => {
    // Use setTimeout to defer the navigation to the next tick
    setTimeout(() => {
      router.push('/');
    }, 0);
  };

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
    redirectToDashboard,
    redirectToHome,
  };
}
