import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUser } from '@/lib/server-auth'

export async function GET() {
  try {
    const sessionCookie = cookies().get('session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session cookie found' },
        { status: 401 }
      )
    }
    
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      roles: user.roles || [],
    })
  } catch (error) {
    console.error('Error verifying session:', error)
    return NextResponse.json(
      { error: 'Error verifying session' },
      { status: 500 }
    )
  }
} 
