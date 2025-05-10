import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/firebase'
import { getCurrentUser } from '@/lib/auth'

// Define role-based access control
const roleAccess = {
  admin: ['/dashboard/admin'],
  manager: ['/dashboard/manager', '/dashboard/admin'],
  biller: ['/dashboard/biller', '/dashboard/manager', '/dashboard/admin'],
  collector: ['/dashboard/collector', '/dashboard/manager', '/dashboard/admin'],
}

// Public paths that don't require authentication
const publicPaths = ['/', '/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const user = await getCurrentUser()
  
  if (!user) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check role-based access
  const userRole = user.role
  const allowedPaths = roleAccess[userRole] || []

  // Allow access to allowed paths
  if (allowedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Redirect to appropriate dashboard based on role
  const dashboardPath = `/dashboard/${userRole}`
  return NextResponse.redirect(new URL(dashboardPath, request.url))
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
} 
