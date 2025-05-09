import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionCookie } from '@/lib/server-auth'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    
    // Create session cookie
    const { sessionCookie, expiresIn } = await createSessionCookie(token)
    
    // Set cookie
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Clear session cookie
    cookies().delete('session')
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error clearing session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
