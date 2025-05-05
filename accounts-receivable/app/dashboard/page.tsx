"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingPage } from "@/components/LoadingSpinner"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  
  // Redirect users to their role-specific dashboard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        router.push('/login')
      } else {
        // Redirect to the appropriate role dashboard
        router.push(`/dashboard/${user.role}`)
      }
    }
  }, [user, loading, router])
  
  // Show loading while we redirect
  return <LoadingPage />
}
