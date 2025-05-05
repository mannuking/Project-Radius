"use client"

import BillerDashboard from "../BillerDashboard"
import DashboardLayout from "@/components/dashboard-layout"
import ProtectedRoute from "@/components/protected-route"

export default function BillerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="biller">
      <DashboardLayout>
        <BillerDashboard billerName="Default Biller" />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 
