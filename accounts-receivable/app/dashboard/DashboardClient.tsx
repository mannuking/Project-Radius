"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/lib/AuthContext"
import { Loader2 } from "lucide-react"
import AdminDashboard from "./AdminDashboard"
import ManagerDashboard from "./ManagerDashboard"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardClient() {
  const { userData, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    // If not loading and no user data, redirect to login
    if (!loading && !userData) {
      router.push("/login")
    }
  }, [loading, userData, router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-highradius-600" />
            <span className="text-lg text-muted-foreground">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!userData) {
    return null // Will be redirected by the useEffect
  }

  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (userData.role) {
      case "Admin":
        return <AdminDashboard />
      case "Manager":
        return <ManagerDashboard />
      default:
        return (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-lg text-muted-foreground">
              Welcome {userData.firstName}! Your role-specific dashboard is coming soon.
            </div>
          </div>
        )
    }
  }

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  )
} 
