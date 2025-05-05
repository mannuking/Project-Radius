"use client"

import CollectorDashboard from "../CollectorDashboard"
import DashboardLayout from "@/components/dashboard-layout"

export default function CollectorDashboardPage() {
  return (
    <DashboardLayout>
      <CollectorDashboard collectorName="Default Collector" />
    </DashboardLayout>
  )
} 
