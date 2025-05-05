"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  
  // Redirect to login page for role selection
  useEffect(() => {
    router.push('/login')
  }, [router])
  
  return <div className="flex h-screen items-center justify-center">Redirecting to role selection...</div>
}
