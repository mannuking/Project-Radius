// Add server-only directive to prevent this from being bundled for clients
import 'server-only';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Safer initialization - additional checks to ensure we're on the server
if (typeof window !== 'undefined') {
  throw new Error('firebase-admin should only be used on the server side!');
}

// Only initialize Firebase Admin SDK on server
let adminApp;
let adminAuth;
let adminDb;

try {
  adminApp = 
    !getApps().length 
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Make sure to properly handle and format the private key
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        })
      : getApps()[0];

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  // Provide fallbacks for testing/development
  adminApp = null;
  adminAuth = null;
  adminDb = null;
}

export { adminApp, adminAuth, adminDb }; 
