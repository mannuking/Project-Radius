'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// Define role-based access control
const roleAccess = {
  admin: ['/dashboard/admin'],
  manager: ['/dashboard/manager', '/dashboard/admin'],
  biller: ['/dashboard/biller', '/dashboard/manager', '/dashboard/admin'],
  collector: ['/dashboard/collector', '/dashboard/manager', '/dashboard/admin'],
};

// Public paths that don't require authentication
const publicPaths = ['/', '/login', '/register', '/forgot-password'];

export default function AuthCheck({ children, requiredRoles = [] }: AuthCheckProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait until auth state is determined

    // Check if the path is public
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    // Allow access to public paths
    if (isPublicPath) return;

    // If not authenticated and not on public path, redirect to login
    if (!user && !isPublicPath) {
      router.push('/login');
      return;
    }

    // If authenticated but doesn't have required role
    if (user && requiredRoles.length > 0) {
      const userRole = user.role;
      if (!requiredRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        const dashboardPath = `/dashboard/${userRole}`;
        router.push(dashboardPath);
        return;
      }
    }

    // If authenticated but on wrong path for role
    if (user) {
      const userRole = user.role;
      const allowedPaths = roleAccess[userRole] || [];
      
      // Check if current path is allowed for user role
      const isAllowedPath = allowedPaths.some(path => pathname?.startsWith(path));
      
      if (!isAllowedPath && !isPublicPath) {
        // Redirect to appropriate dashboard
        const dashboardPath = `/dashboard/${userRole}`;
        router.push(dashboardPath);
      }
    }
  }, [user, loading, pathname, router, requiredRoles]);

  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
} 
