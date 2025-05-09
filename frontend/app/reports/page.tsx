"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"
import { Download, FileText, Printer } from "lucide-react"

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("month")
  const [region, setRegion] = useState("all")

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="aging" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
          <TabsTrigger value="collection">Collection Performance</TabsTrigger>
          <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
              <SelectItem value="east">East Region</SelectItem>
              <SelectItem value="west">West Region</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="aging" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aging Summary</CardTitle>
              <CardDescription>Overview of outstanding invoices by age</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Current</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$45,231</div>
                    <p className="text-xs text-muted-foreground">32 invoices</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">1-30 Days</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$28,459</div>
                    <p className="text-xs text-muted-foreground">24 invoices</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">31-60 Days</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$15,792</div>
                    <p className="text-xs text-muted-foreground">18 invoices</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">61-90 Days</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$8,345</div>
                    <p className="text-xs text-muted-foreground">9 invoices</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">90+ Days</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$4,128</div>
                    <p className="text-xs text-muted-foreground">5 invoices</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 h-80 w-full">
                {/* This would be a chart component in a real application */}
                <div className="flex h-full flex-col justify-end">
                  <div className="flex h-full items-end justify-around">
                    <div className="w-1/5 px-2">
                      <div className="h-[45%] rounded-t-md bg-primary/20"></div>
                    </div>
                    <div className="w-1/5 px-2">
                      <div className="h-[28%] rounded-t-md bg-primary/40"></div>
                    </div>
                    <div className="w-1/5 px-2">
                      <div className="h-[15%] rounded-t-md bg-primary/60"></div>
                    </div>
                    <div className="w-1/5 px-2">
                      <div className="h-[8%] rounded-t-md bg-primary/80"></div>
                    </div>
                    <div className="w-1/5 px-2">
                      <div className="h-[4%] rounded-t-md bg-primary"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-around text-sm text-muted-foreground">
                    <div className="w-1/5 text-center">Current</div>
                    <div className="w-1/5 text-center">1-30 Days</div>
                    <div className="w-1/5 text-center">31-60 Days</div>
                    <div className="w-1/5 text-center">61-90 Days</div>
                    <div className="w-1/5 text-center">90+ Days</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Aging Report</CardTitle>
              <CardDescription>Breakdown of invoices by aging category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Age (Days)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      customer: "Acme Corporation",
                      invoice: "INV-2023-001",
                      issueDate: "2023-04-15",
                      dueDate: "2023-05-15",
                      amount: "$3,450.00",
                      age: 45,
                      status: "Overdue",
                    },
                    {
                      customer: "Globex Industries",
                      invoice: "INV-2023-002",
                      issueDate: "2023-05-01",
                      dueDate: "2023-06-01",
                      amount: "$1,200.00",
                      age: 29,
                      status: "Paid",
                    },
                    {
                      customer: "Wayne Enterprises",
                      invoice: "INV-2023-003",
                      issueDate: "2023-05-15",
                      dueDate: "2023-06-15",
                      amount: "$5,800.00",
                      age: 15,
                      status: "Pending",
                    },
                    {
                      customer: "Stark Industries",
                      invoice: "INV-2023-004",
                      issueDate: "2023-05-30",
                      dueDate: "2023-06-30",
                      amount: "$2,340.00",
                      age: 0,
                      status: "Pending",
                    },
                    {
                      customer: "Umbrella Corporation",
                      invoice: "INV-2023-005",
                      issueDate: "2023-06-15",
                      dueDate: "2023-07-15",
                      amount: "$4,100.00",
                      age: 0,
                      status: "Pending",
                    },
                  ].map((invoice, index) => (
                    <TableRow key={index}>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.invoice}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.age}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collection" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collection Performance</CardTitle>
              <CardDescription>Analysis of collection efficiency and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">78.5%</div>
                    <p className="text-xs text-green-500">+2.3% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Average Days to Collect</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">32 days</div>
                    <p className="text-xs text-green-500">-3 days from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$124,568</div>
                    <p className="text-xs text-green-500">+12.4% from last period</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 h-80 w-full">
                {/* This would be a chart component in a real application */}
                <div className="flex h-full flex-col justify-end">
                  <div className="flex h-full items-end justify-around">
                    <div className="w-1/6 px-2">
                      <div className="h-[60%] rounded-t-md bg-primary/70"></div>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[45%] rounded-t-md bg-primary/70"></div>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[75%] rounded-t-md bg-primary/70"></div>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[55%] rounded-t-md bg-primary/70"></div>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[80%] rounded-t-md bg-primary/70"></div>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[65%] rounded-t-md bg-primary/70"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-around text-sm text-muted-foreground">
                    <div className="w-1/6 text-center">Jan</div>
                    <div className="w-1/6 text-center">Feb</div>
                    <div className="w-1/6 text-center">Mar</div>
                    <div className="w-1/6 text-center">Apr</div>
                    <div className="w-1/6 text-center">May</div>
                    <div className="w-1/6 text-center">Jun</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collector Performance</CardTitle>
              <CardDescription>Performance metrics by collector</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collector</TableHead>
                    <TableHead>Assigned Amount</TableHead>
                    <TableHead>Collected Amount</TableHead>
                    <TableHead>Collection Rate</TableHead>
                    <TableHead>Avg. Days to Collect</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      collector: "John Smith",
                      assigned: "$45,230",
                      collected: "$38,450",
                      rate: "85.0%",
                      days: "28",
                      success: "92%",
                    },
                    {
                      collector: "Sarah Johnson",
                      assigned: "$38,120",
                      collected: "$32,400",
                      rate: "85.0%",
                      days: "30",
                      success: "88%",
                    },
                    {
                      collector: "Mike Wilson",
                      assigned: "$52,340",
                      collected: "$41,870",
                      rate: "80.0%",
                      days: "35",
                      success: "85%",
                    },
                    {
                      collector: "Emily Davis",
                      assigned: "$28,750",
                      collected: "$22,430",
                      rate: "78.0%",
                      days: "32",
                      success: "82%",
                    },
                    {
                      collector: "David Brown",
                      assigned: "$35,680",
                      collected: "$24,980",
                      rate: "70.0%",
                      days: "38",
                      success: "75%",
                    },
                  ].map((collector, index) => (
                    <TableRow key={index}>
                      <TableCell>{collector.collector}</TableCell>
                      <TableCell>{collector.assigned}</TableCell>
                      <TableCell>{collector.collected}</TableCell>
                      <TableCell>{collector.rate}</TableCell>
                      <TableCell>{collector.days}</TableCell>
                      <TableCell>{collector.success}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analysis</CardTitle>
              <CardDescription>Analysis of accounts receivable by customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Top Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">Acme Corporation</div>
                    <p className="text-xs text-muted-foreground">$45,230 outstanding</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Most Reliable</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">Stark Industries</div>
                    <p className="text-xs text-muted-foreground">98% on-time payment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Highest Risk</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">Umbrella Corporation</div>
                    <p className="text-xs text-muted-foreground">45% late payment rate</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Outstanding</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>1-30 Days</TableHead>
                      <TableHead>31-60 Days</TableHead>
                      <TableHead>61-90 Days</TableHead>
                      <TableHead>90+ Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        customer: "Acme Corporation",
                        total: "$45,230",
                        current: "$12,450",
                        days30: "$18,340",
                        days60: "$8,900",
                        days90: "$3,540",
                        days90plus: "$2,000",
                      },
                      {
                        customer: "Globex Industries",
                        total: "$32,180",
                        current: "$15,230",
                        days30: "$10,450",
                        days60: "$4,500",
                        days90: "$2,000",
                        days90plus: "$0",
                      },
                      {
                        customer: "Wayne Enterprises",
                        total: "$28,450",
                        current: "$8,450",
                        days30: "$12,000",
                        days60: "$5,000",
                        days90: "$3,000",
                        days90plus: "$0",
                      },
                      {
                        customer: "Stark Industries",
                        total: "$18,900",
                        current: "$10,900",
                        days30: "$8,000",
                        days60: "$0",
                        days90: "$0",
                        days90plus: "$0",
                      },
                      {
                        customer: "Umbrella Corporation",
                        total: "$35,680",
                        current: "$5,680",
                        days30: "$10,000",
                        days60: "$8,000",
                        days90: "$7,000",
                        days90plus: "$5,000",
                      },
                    ].map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell>{customer.customer}</TableCell>
                        <TableCell>{customer.total}</TableCell>
                        <TableCell>{customer.current}</TableCell>
                        <TableCell>{customer.days30}</TableCell>
                        <TableCell>{customer.days60}</TableCell>
                        <TableCell>{customer.days90}</TableCell>
                        <TableCell>{customer.days90plus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Payment History</CardTitle>
                <CardDescription>Historical payment patterns by customer</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View Full Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {/* This would be a chart component in a real application */}
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>Customer payment history chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
