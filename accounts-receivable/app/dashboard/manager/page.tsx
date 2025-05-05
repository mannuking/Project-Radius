"use client"

import ManagerDashboard from "../ManagerDashboard"
import DashboardLayout from "@/components/dashboard-layout"
import ProtectedRoute from "@/components/protected-route"

export default function ManagerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="manager">
      <DashboardLayout>
        <ManagerDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 
