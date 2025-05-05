import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export type UserRole = 'admin' | 'manager' | 'biller' | 'collector'

interface UserData {
  uid: string
  email: string
  role: UserRole
  name: string
  createdAt: Date
}

// Special email to role mapping for development/testing
const ADMIN_EMAILS = ['tannu0720@gmail.com', 'admin@example.com'];
const MANAGER_EMAILS = ['jk422331@gmail.com', 'manager@example.com'];

export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  name: string
): Promise<UserData> {
  try {
    // Create user with email and password
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    const user = userCredential.user

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      role,
      name,
      createdAt: new Date()
    }

    await setDoc(doc(db, 'users', user.uid), userData)

    return userData
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<UserData> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    try {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        console.warn('User document not found in Firestore, using email-based role assignment');
        
        // Create a base user data object
        const userData: UserData = {
          uid: user.uid,
          email: user.email || email,
          role: determineRoleFromEmail(email),
          name: email.split('@')[0],
          createdAt: new Date()
        };
        
        // Save this user data to Firestore for future logins
        await setDoc(doc(db, 'users', user.uid), userData);
        
        return userData;
      }

      // Get the data and ensure the role is correct
      const data = userDoc.data() as UserData;
      
      // Override role based on email if it's a special account
      if (ADMIN_EMAILS.includes(email.toLowerCase()) && data.role !== 'admin') {
        console.log('Updating admin role for special account');
        data.role = 'admin';
        await setDoc(doc(db, 'users', user.uid), data);
      } else if (MANAGER_EMAILS.includes(email.toLowerCase()) && data.role !== 'manager') {
        console.log('Updating manager role for special account');
        data.role = 'manager';
        await setDoc(doc(db, 'users', user.uid), data);
      }
      
      return data;
    } catch (firestoreError) {
      console.error('Firestore error during login:', firestoreError);
      // Return basic user data with role based on email
      return {
        uid: user.uid,
        email: user.email || email,
        role: determineRoleFromEmail(email),
        name: email.split('@')[0],
        createdAt: new Date()
      } as UserData;
    }
  } catch (error: any) {
    console.error('Authentication error:', error);
    throw new Error(error.message)
  }
}

// Helper function to determine role based on email
function determineRoleFromEmail(email: string): UserRole {
  email = email.toLowerCase();
  
  if (ADMIN_EMAILS.includes(email)) {
    return 'admin';
  }
  
  if (MANAGER_EMAILS.includes(email)) {
    return 'manager';
  }
  
  // Default role assignment based on email domain or other patterns could be added here
  
  return 'collector'; // Default lowest role
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser(): Promise<UserData | null> {
  const user = auth.currentUser
  if (!user) return null

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (!userDoc.exists()) {
      // Create user data if it doesn't exist
      const email = user.email || '';
      const userData: UserData = {
        uid: user.uid,
        email: email,
        role: determineRoleFromEmail(email),
        name: email.split('@')[0],
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    }

    const data = userDoc.data() as UserData;
    
    // Ensure special accounts have correct roles
    if (user.email) {
      const email = user.email.toLowerCase();
      
      if (ADMIN_EMAILS.includes(email) && data.role !== 'admin') {
        data.role = 'admin';
        await setDoc(doc(db, 'users', user.uid), data);
      } else if (MANAGER_EMAILS.includes(email) && data.role !== 'manager') {
        data.role = 'manager';
        await setDoc(doc(db, 'users', user.uid), data);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error getting current user:', error)
    
    // Fallback if Firestore fails
    if (user.email) {
      return {
        uid: user.uid,
        email: user.email,
        role: determineRoleFromEmail(user.email),
        name: user.email.split('@')[0],
        createdAt: new Date()
      } as UserData;
    }
    
    return null;
  }
}

export function isAuthorized(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 4,
    manager: 3,
    biller: 2,
    collector: 1
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
} 
