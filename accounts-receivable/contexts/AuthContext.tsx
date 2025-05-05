'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingPage } from '@/components/LoadingSpinner'
import { UserData, signIn, signUp, signOut, getCurrentUser, isAuthorized } from '@/lib/auth'
import { useToast } from '@/components/ui/use-toast'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface AuthContextType {
  user: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: UserData['role'], name: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthorized: (requiredRole: UserData['role']) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAuthorized: () => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Function to redirect user to the appropriate dashboard based on role
  const redirectToDashboard = (role: UserData['role']) => {
    console.log(`Redirecting user with role: ${role}`)
    
    switch(role) {
      case 'admin':
        router.push('/dashboard/admin')
        break
      case 'manager':
        router.push('/dashboard/manager')
        break
      case 'biller':
        router.push('/dashboard/biller')
        break
      case 'collector':
        router.push('/dashboard/collector')
        break
      default:
        router.push('/dashboard')
    }
  }

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const userData = await getCurrentUser()
          setUser(userData)
          
          // Create session cookie for server-side auth
          const token = await firebaseUser.getIdToken()
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userData = await signIn(email, password)
      setUser(userData)
      toast({
        title: 'Success',
        description: 'Successfully signed in',
      })
      
      // Log the user role for debugging
      console.log(`User signed in with role: ${userData.role}`)
      
      // Redirect based on role
      redirectToDashboard(userData.role)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (
    email: string,
    password: string,
    role: UserData['role'],
    name: string
  ) => {
    try {
      setLoading(true)
      const userData = await signUp(email, password, role, name)
      setUser(userData)
      toast({
        title: 'Success',
        description: 'Successfully signed up',
      })
      
      // Redirect based on role
      redirectToDashboard(userData.role)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      // Clear session cookie
      await fetch('/api/auth/session', {
        method: 'DELETE',
      })
      toast({
        title: 'Success',
        description: 'Successfully signed out',
      })
      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    }
  }

  const checkAuthorization = (requiredRole: UserData['role']) => {
    if (!user) return false
    return isAuthorized(user.role, requiredRole)
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        isAuthorized: checkAuthorization,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
