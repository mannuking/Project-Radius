import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

export async function getSessionUser() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    
    if (!sessionCookie) {
      return null;
    }
    
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decodedClaims;
    } catch (verifyError) {
      console.error('Error verifying session cookie:', verifyError);
      // Clear invalid session cookie
      cookies().delete('session');
      return null;
    }
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
}

export async function createSessionCookie(idToken: string) {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin Auth not initialized');
    }
    
    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    return { sessionCookie, expiresIn };
  } catch (error) {
    console.error('Error creating session cookie:', error);
    throw error;
  }
} 
