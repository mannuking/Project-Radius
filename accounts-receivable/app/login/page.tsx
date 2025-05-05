"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { DollarSign, FileText, Users, BarChart3, ChevronRight } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <Card className="w-full max-w-md shadow-xl bg-white rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-slate-800 text-white py-8">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <CardTitle className="text-3xl font-bold">Accounts Receivable System</CardTitle>
          <CardDescription className="text-slate-300 text-lg mt-2">Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Link href="/dashboard/admin" className="no-underline">
              <Button className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-between group transition-all duration-300">
                <div className="flex items-center">
                  <BarChart3 className="mr-3 h-6 w-6" />
                  <span>Admin Dashboard</span>
                </div>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard/manager" className="no-underline">
              <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 flex items-center justify-between group transition-all duration-300">
                <div className="flex items-center">
                  <Users className="mr-3 h-6 w-6" />
                  <span>Manager Dashboard</span>
                </div>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard/biller" className="no-underline">
              <Button className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-between group transition-all duration-300">
                <div className="flex items-center">
                  <FileText className="mr-3 h-6 w-6" />
                  <span>Biller Dashboard</span>
                </div>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard/collector" className="no-underline">
              <Button className="w-full py-6 text-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-between group transition-all duration-300">
                <div className="flex items-center">
                  <DollarSign className="mr-3 h-6 w-6" />
                  <span>Collector Dashboard</span>
                </div>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
