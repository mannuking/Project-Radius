"use client"

import { useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
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

// Cache user data in memory
const userDataCache = new Map<string, UserData>();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence once at startup
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Check cache first
          const cachedData = userDataCache.get(user.uid);
          if (cachedData) {
            setUserData(cachedData);
            setLoading(false);
            return;
          }

          // If not in cache, fetch from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            userDataCache.set(user.uid, data); // Cache the data
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
        // Clear cache on logout
        userDataCache.clear();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (data: UserData & { password: string }) => {
    const { email, password, ...rest } = data;
    
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData = {
        ...rest,
        email,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      // Update cache
      userDataCache.set(user.uid, userData);
      
      // Update local state
      setUser(user);
      setUserData(userData);
      
      return { user, userData };
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please try logging in instead.');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please check and try again.');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.');
      }
      throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Check cache first
      const cachedData = userDataCache.get(user.uid);
      if (cachedData) {
        setUserData(cachedData);
        return user;
      }
      
      // If not in cache, fetch from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        userDataCache.set(user.uid, userData); // Cache the data
        setUserData(userData);
      }
      
      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
      }
      throw new Error('Failed to sign in. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      userDataCache.clear(); // Clear cache on logout
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
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
