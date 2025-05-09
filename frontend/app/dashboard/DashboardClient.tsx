"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminDashboard from "./AdminDashboard"
import ManagerDashboard from "./ManagerDashboard"
import CollectorDashboard from "./CollectorDashboard"
import BillerDashboard from "./BillerDashboard"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardClient() {
  const pathname = usePathname()
  const router = useRouter()

  // Determine the role based on the path
  const getRoleFromPath = () => {
    if (pathname.includes('/admin')) return "Admin"
    if (pathname.includes('/manager')) return "Manager"
    if (pathname.includes('/collector')) return "Collector"
    if (pathname.includes('/biller')) return "Biller"
    return "Unknown"
  }

  const role = getRoleFromPath()

  // If at /dashboard directly, redirect to a default role
  useEffect(() => {
    if (pathname === '/dashboard') {
      router.push('/dashboard/admin')
    }
  }, [pathname, router])

  // Render dashboard based on path-determined role
  const renderDashboard = () => {
    switch (role) {
      case "Admin":
        return <AdminDashboard />
      case "Manager":
        return <ManagerDashboard />
      case "Collector":
        return <CollectorDashboard collectorName="Default Collector" />
      case "Biller":
        return <BillerDashboard billerName="Default Biller" />
      default:
        return (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-lg text-muted-foreground">
              Welcome! Your role-specific dashboard is coming soon.
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
