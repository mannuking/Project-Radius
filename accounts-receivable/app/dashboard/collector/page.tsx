"use client"

import CollectorDashboard from "../CollectorDashboard"
import DashboardLayout from "@/components/dashboard-layout"
import ProtectedRoute from "@/components/protected-route"

export default function CollectorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="collector">
      <DashboardLayout>
        <CollectorDashboard collectorName="Default Collector" />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 
