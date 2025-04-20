"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/AuthContext';
import { UserRole } from './useAuth';

interface ProtectedRouteOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function useProtectedRoute(options: ProtectedRouteOptions = {}) {
  const { allowedRoles = [], redirectTo = '/login' } = options;
  const router = useRouter();
  const { user, userData, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
      } else if (allowedRoles.length > 0 && userData) {
        if (!allowedRoles.includes(userData.role)) {
          router.push('/dashboard');
        }
      }
    }
  }, [user, userData, loading, router, redirectTo, allowedRoles]);

  return { isAuthenticated: !!user, user, userData, loading };
} 
