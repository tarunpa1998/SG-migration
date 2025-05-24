'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook to protect routes that require authentication
 * @param redirectTo Path to redirect to if user is not authenticated
 */
export function useProtectedRoute(redirectTo = '/login') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}

/**
 * Hook to protect routes that require admin authentication
 * @param redirectTo Path to redirect to if user is not an admin
 */
export function useAdminRoute(redirectTo = '/') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!user.isAdmin) {
        router.push(redirectTo);
      }
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}

/**
 * Hook to redirect authenticated users away from pages like login/register
 * @param redirectTo Path to redirect to if user is authenticated
 */
export function useRedirectAuthenticated(redirectTo = '/') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { isLoading };
}
