'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingPage } from '@/components/LoadingSpinner'
import { UserData, signIn, signUp, signOut, getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/use-toast'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface AuthContextType {
  user: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: UserData['role'], name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
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
          if (userData) {
            setUser(userData)
            // Redirect to appropriate dashboard if on login/register page
            const currentPath = window.location.pathname
            if (currentPath === '/login' || currentPath === '/register') {
              redirectToDashboard(userData.role)
            }
          }
        } else {
          setUser(null)
          // Redirect to login if not already there
          const currentPath = window.location.pathname
          if (currentPath.startsWith('/dashboard')) {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userData = await signIn(email, password)
      setUser(userData)
      toast({
        title: 'Success',
        description: 'Successfully signed in',
      })
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
