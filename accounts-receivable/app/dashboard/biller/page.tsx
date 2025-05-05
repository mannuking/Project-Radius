"use client"

import BillerDashboard from "../BillerDashboard"
import DashboardLayout from "@/components/dashboard-layout"

export default function BillerDashboardPage() {
  return (
    <DashboardLayout>
      <BillerDashboard billerName="Default Biller" />
    </DashboardLayout>
  )
} 
