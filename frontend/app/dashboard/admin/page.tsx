"use client"

import AdminDashboard from "../AdminDashboard"
import DashboardLayout from "@/components/dashboard-layout"
import ProtectedRoute from "@/components/protected-route"

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 
