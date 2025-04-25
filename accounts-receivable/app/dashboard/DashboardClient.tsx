"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Filter,
  PieChart,
  ClipboardList,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthContext } from "@/lib/AuthContext"
import { UserRole } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

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

  // Role-specific dashboard content
  const getDashboardContent = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="dashboard-stat-card border-t-4 border-t-highradius-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                  <div className="rounded-full bg-highradius-50 p-2">
                    <FileText className="h-4 w-4 text-highradius-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">142</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>12% from last month</span>
                  </div>
                </CardContent>
              </Card>
              {/* ... other admin cards ... */}
            </div>
          </>
        )

      case "Manager":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="dashboard-stat-card border-t-4 border-t-highradius-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
                  <div className="rounded-full bg-highradius-50 p-2">
                    <Users className="h-4 w-4 text-highradius-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">85.2%</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>3.5% from last month</span>
                  </div>
                </CardContent>
              </Card>
              {/* ... other manager cards ... */}
            </div>
          </>
        )

      case "Collector":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="dashboard-stat-card border-t-4 border-t-highradius-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
                  <div className="rounded-full bg-highradius-50 p-2">
                    <ClipboardList className="h-4 w-4 text-highradius-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">28</div>
                  <div className="flex items-center text-xs text-blue-600 mt-1">
                    <ArrowRight className="mr-1 h-3 w-3" />
                    <span>Active cases</span>
                  </div>
                </CardContent>
              </Card>
              {/* ... other collector cards ... */}
            </div>
          </>
        )

      case "Biller":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="dashboard-stat-card border-t-4 border-t-highradius-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Invoices Created</CardTitle>
                  <div className="rounded-full bg-highradius-50 p-2">
                    <FileText className="h-4 w-4 text-highradius-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">34</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>This month</span>
                  </div>
                </CardContent>
              </Card>
              {/* ... other biller cards ... */}
            </div>
          </>
        )

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>Please contact your administrator to set up your role.</CardDescription>
            </CardHeader>
          </Card>
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {userData?.firstName}</h1>
            <p className="text-muted-foreground">
              {userData?.role} Dashboard - Here's your overview for today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            {userData?.role === "Biller" && (
              <Button size="sm" className="bg-highradius-600 hover:bg-highradius-700">
                <FileText className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            )}
          </div>
        </div>

        {userData?.role && getDashboardContent(userData.role)}
      </div>
    </DashboardLayout>
  )
} 
