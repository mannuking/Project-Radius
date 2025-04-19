import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth')
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/forgot-password']
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If there's no auth cookie and the path is not public, redirect to login
  if (!authCookie && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If there's an auth cookie and trying to access auth pages, redirect to dashboard
  if (authCookie && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
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
