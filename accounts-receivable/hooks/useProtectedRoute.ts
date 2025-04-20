"use client"

import { useEffect, useState } from 'react';
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
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Prevent redirect during server-side rendering or hydration
    if (typeof window === 'undefined') return;

    // Only perform redirects after the auth state has been determined
    if (!loading && !hasChecked) {
      setHasChecked(true);
      
      if (!user) {
        router.push(redirectTo);
      } else if (allowedRoles.length > 0 && userData) {
        if (!allowedRoles.includes(userData.role)) {
          router.push('/dashboard');
        }
      }
    }
  }, [user, userData, loading, router, redirectTo, allowedRoles, hasChecked]);

  return { 
    isAuthenticated: !!user, 
    user, 
    userData, 
    loading: loading || !hasChecked 
  };
}
