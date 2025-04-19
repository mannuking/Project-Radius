"use client"

import { useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'Admin' | 'Manager' | 'Collector' | 'Biller';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (data: UserData & { password: string }) => {
    let lastError: any;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Check network connectivity
        if (!navigator.onLine) {
          throw new Error('You are offline. Please check your internet connection.');
        }

        const { email, password, ...rest } = data;
        
        // Create authentication user
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore with retry
        for (let docAttempt = 0; docAttempt < MAX_RETRIES; docAttempt++) {
          try {
            const userData = {
              ...rest,
              email,
              createdAt: new Date().toISOString(),
            };
            
            await setDoc(doc(db, 'users', user.uid), userData);
            
            // Set the user data in state
            setUser(user);
            setUserData(userData);
            
            return { user, userData };
          } catch (docError: any) {
            if (docAttempt === MAX_RETRIES - 1) throw docError;
            await delay(RETRY_DELAY);
          }
        }
      } catch (error: any) {
        lastError = error;
        
        // Don't retry for these specific errors
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('This email is already registered. Please try logging in instead.');
        }
        if (error.code === 'auth/invalid-email') {
          throw new Error('Invalid email address. Please check and try again.');
        }
        if (error.code === 'auth/weak-password') {
          throw new Error('Password is too weak. Please use a stronger password.');
        }
        
        // If it's the last attempt, throw the error
        if (attempt === MAX_RETRIES - 1) {
          throw new Error(error.message || 'Failed to create account. Please try again.');
        }
        
        // Wait before retrying
        await delay(RETRY_DELAY);
      }
    }
    
    throw lastError;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        setUserData(userData);
      }
      return user;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
      }
      throw new Error('Failed to sign in. Please try again.');
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserData(null);
  };

  return {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
  };
} 
