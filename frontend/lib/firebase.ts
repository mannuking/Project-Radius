import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Check if Firebase auth should be used
const useFirebaseAuth = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAw8XF5kK0hD_vV33n2VnRGVmAlP98Fcxw",
  authDomain: "ar-tracker-c226f.firebaseapp.com",
  projectId: "ar-tracker-c226f",
  storageBucket: "ar-tracker-c226f.firebasestorage.app",
  messagingSenderId: "682110029066",
  appId: "1:682110029066:web:53acb495181020913d3ef3",
  measurementId: "G-NKB12LW8VN"
};

// Log setup mode
console.log(`Firebase Auth: ${useFirebaseAuth ? 'ENABLED' : 'DISABLED (Development Mode)'}`);

// Initialize Firebase for client-side
let app = null;
let auth = null;
let db = null;
let analytics = null;

// Only initialize in browser environment or if it's not already initialized
if (typeof window !== 'undefined') {
  try {
    // Initialize Firebase
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Initialize Firestore with long polling and local persistence
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      cacheSizeBytes: 50000000, // 50 MB
      localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager(),
      })
    });
    
    // Initialize Analytics
    isSupported().then(yes => yes && (analytics = getAnalytics(app)));
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

export { app, auth, db, analytics, useFirebaseAuth }; 
