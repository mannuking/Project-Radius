'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/auth'
import { LoadingPage } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, loading, isAuthorized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Helper function to get the required role from the pathname
  const getRoleFromPath = (): UserRole | undefined => {
    if (pathname.includes('/admin')) return 'admin'
    if (pathname.includes('/manager')) return 'manager'
    if (pathname.includes('/biller')) return 'biller'
    if (pathname.includes('/collector')) return 'collector'
    return undefined
  }

  // If requiredRole is not provided, try to determine it from the pathname
  const effectiveRequiredRole = requiredRole || getRoleFromPath()

  useEffect(() => {
    if (!loading) {
      // Not authenticated, redirect to login
      if (!user) {
        router.push('/login')
        return
      }

      // No specific role required, allow access
      if (!effectiveRequiredRole) {
        return
      }

      // Check if user has appropriate role
      if (!isAuthorized(effectiveRequiredRole)) {
        console.log(`Access denied: User role ${user.role} does not have access to ${effectiveRequiredRole} dashboard`)
        
        // Redirect to their appropriate dashboard
        router.push(`/dashboard/${user.role}`)
      }
    }
  }, [user, loading, effectiveRequiredRole, isAuthorized, router])

  // Show loading state while checking authorization
  if (loading || !user) {
    return <LoadingPage />
  }

  // Role check failed in useEffect will redirect, so if we're here, it's authorized
  return <>{children}</>
} 
