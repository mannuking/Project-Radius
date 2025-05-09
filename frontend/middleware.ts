import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define role-based access control
const roleBasedAccess = {
  '/dashboard/admin': ['admin'],
  '/dashboard/manager': ['admin', 'manager'],
  '/dashboard/biller': ['admin', 'manager', 'biller'],
  '/dashboard/collector': ['admin', 'manager', 'collector'],
  '/invoices': ['admin', 'manager', 'biller', 'collector'],
  '/reports': ['admin', 'manager'],
  '/settings': ['admin'],
  '/users': ['admin'],
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

  // Get the session token from the cookie
  const sessionToken = request.cookies.get('session')?.value

  if (!sessionToken) {
    // Redirect to login if no session token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Import the server-auth module with edge runtime compatibility
    const res = await fetch(new URL('/api/auth/verify', request.url), {
      headers: {
        Cookie: `session=${sessionToken}`
      }
    })

    if (!res.ok) {
      throw new Error('Session invalid')
    }

    const { uid, roles = [] } = await res.json()

    // Check if user has access to the requested path
    const hasAccess = Object.entries(roleBasedAccess).some(([path, allowedRoles]) => {
      if (pathname.startsWith(path)) {
        return allowedRoles.some(role => roles.includes(role))
      }
      return false
    })

    if (!hasAccess) {
      // Redirect to unauthorized page if user doesn't have access
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Add user info to headers for use in API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', uid)
    requestHeaders.set('x-user-roles', JSON.stringify(roles))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Auth error in middleware:', error)
    // Clear invalid session cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
} 
