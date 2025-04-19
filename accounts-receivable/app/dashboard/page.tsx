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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Accounts Receivable Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John. Here's what's happening with your receivables.</p>
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
            <Button size="sm" className="bg-highradius-600 hover:bg-highradius-700">
              <FileText className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </div>

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
          <Card className="dashboard-stat-card border-t-4 border-t-highradius-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
              <div className="rounded-full bg-highradius-50 p-2">
                <DollarSign className="h-4 w-4 text-highradius-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">$24,563.00</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>5.2% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="dashboard-stat-card border-t-4 border-t-highradius-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected This Month</CardTitle>
              <div className="rounded-full bg-highradius-50 p-2">
                <CreditCard className="h-4 w-4 text-highradius-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">$12,234.00</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>18.2% increase</span>
              </div>
            </CardContent>
          </Card>
          <Card className="dashboard-stat-card border-t-4 border-t-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
              <div className="rounded-full bg-red-50 p-2">
                <FileText className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">38</div>
              <div className="flex items-center text-xs text-red-500 mt-1">
                <ArrowDown className="mr-1 h-3 w-3" />
                <span>4.1% increase</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="bg-white border">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-highradius-50 data-[state=active]:text-highradius-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="aging"
              className="data-[state=active]:bg-highradius-50 data-[state=active]:text-highradius-700"
            >
              Aging Analysis
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className="data-[state=active]:bg-highradius-50 data-[state=active]:text-highradius-700"
            >
              Collection Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-7">
              <Card className="col-span-4 border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Receivables Overview</CardTitle>
                      <CardDescription>Monthly breakdown of receivables</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-highradius-600 hover:text-highradius-700 hover:bg-highradius-50"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* This would be a chart component in a real application */}
                    <div className="flex h-full flex-col justify-end">
                      <div className="flex h-full items-end justify-around">
                        <div className="w-1/6 px-2">
                          <div className="h-[60%] rounded-t-md bg-highradius-400"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[45%] rounded-t-md bg-highradius-400"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[75%] rounded-t-md bg-highradius-400"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[55%] rounded-t-md bg-highradius-400"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[80%] rounded-t-md bg-highradius-400"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[65%] rounded-t-md bg-highradius-400"></div>
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
              <Card className="col-span-3 border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Recent Activity</CardTitle>
                      <CardDescription>Latest updates on your accounts receivable</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-highradius-600 hover:text-highradius-700 hover:bg-highradius-50"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">View all</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Payment received",
                        invoice: "INV-2023-004",
                        amount: "$1,250.00",
                        time: "2 hours ago",
                        user: "John Smith",
                      },
                      {
                        action: "Invoice created",
                        invoice: "INV-2023-005",
                        amount: "$3,750.00",
                        time: "5 hours ago",
                        user: "Sarah Johnson",
                      },
                      {
                        action: "Invoice overdue",
                        invoice: "INV-2023-001",
                        amount: "$2,340.00",
                        time: "1 day ago",
                        user: "System",
                      },
                      {
                        action: "Comment added",
                        invoice: "INV-2023-002",
                        amount: "$4,100.00",
                        time: "2 days ago",
                        user: "Mike Wilson",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="mr-4 rounded-full bg-highradius-50 p-2">
                          <FileText className="h-4 w-4 text-highradius-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-gray-800">
                            {activity.action} - {activity.invoice}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.amount} • {activity.time} • by {activity.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="aging" className="mt-4">
            <div className="grid gap-4 md:grid-cols-7">
              <Card className="col-span-4 border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Aging Analysis</CardTitle>
                      <CardDescription>Overview of outstanding invoices by age</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-highradius-600 hover:text-highradius-700 hover:bg-highradius-50"
                    >
                      <PieChart className="mr-2 h-4 w-4" />
                      View Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* This would be a chart component in a real application */}
                    <div className="flex h-full flex-col justify-center items-center">
                      <div className="flex w-full justify-between px-4">
                        <div className="text-center">
                          <div className="h-32 w-16 rounded-t-md bg-highradius-200"></div>
                          <p className="mt-2 text-xs">Current</p>
                          <p className="font-medium">$8,245</p>
                        </div>
                        <div className="text-center">
                          <div className="h-40 w-16 rounded-t-md bg-highradius-300"></div>
                          <p className="mt-2 text-xs">1-30 days</p>
                          <p className="font-medium">$10,584</p>
                        </div>
                        <div className="text-center">
                          <div className="h-24 w-16 rounded-t-md bg-highradius-400"></div>
                          <p className="mt-2 text-xs">31-60 days</p>
                          <p className="font-medium">$3,841</p>
                        </div>
                        <div className="text-center">
                          <div className="h-16 w-16 rounded-t-md bg-highradius-500"></div>
                          <p className="mt-2 text-xs">61-90 days</p>
                          <p className="font-medium">$1,352</p>
                        </div>
                        <div className="text-center">
                          <div className="h-8 w-16 rounded-t-md bg-highradius-600"></div>
                          <p className="mt-2 text-xs">90+ days</p>
                          <p className="font-medium">$541</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3 border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Aging Summary</CardTitle>
                      <CardDescription>Total outstanding by aging category</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-highradius-600 hover:text-highradius-700 hover:bg-highradius-50"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">View all</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-highradius-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Total Outstanding</div>
                        <div className="mt-1 text-2xl font-bold text-gray-800">$24,563.00</div>
                      </div>
                      <div className="rounded-lg bg-red-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Total Overdue</div>
                        <div className="mt-1 text-2xl font-bold text-red-600">$5,734.00</div>
                      </div>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left font-medium text-gray-500">Aging Period</th>
                          <th className="pb-2 text-right font-medium text-gray-500">Amount</th>
                          <th className="pb-2 text-right font-medium text-gray-500">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Current</td>
                          <td className="py-2 text-right">$8,245.00</td>
                          <td className="py-2 text-right">33.6%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">1-30 days</td>
                          <td className="py-2 text-right">$10,584.00</td>
                          <td className="py-2 text-right">43.1%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">31-60 days</td>
                          <td className="py-2 text-right">$3,841.00</td>
                          <td className="py-2 text-right">15.6%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">61-90 days</td>
                          <td className="py-2 text-right">$1,352.00</td>
                          <td className="py-2 text-right">5.5%</td>
                        </tr>
                        <tr>
                          <td className="py-2">90+ days</td>
                          <td className="py-2 text-right">$541.00</td>
                          <td className="py-2 text-right">2.2%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="mt-4">
            <div className="grid gap-4 md:grid-cols-7">
              <Card className="col-span-4 border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Collection Performance</CardTitle>
                      <CardDescription>Monthly collection trends</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-highradius-600 hover:text-highradius-700 hover:bg-highradius-50"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* This would be a chart component in a real application */}
                    <div className="flex h-full flex-col justify-end">
                      <div className="flex h-full items-end justify-around">
                        <div className="w-1/6 px-2">
                          <div className="h-[60%] rounded-t-md bg-highradius-600"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[45%] rounded-t-md bg-highradius-600"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[75%] rounded-t-md bg-highradius-600"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[55%] rounded-t-md bg-highradius-600"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[80%] rounded-t-md bg-highradius-600"></div>
                        </div>
                        <div className="w-1/6 px-2">
                          <div className="h-[65%] rounded-t-md bg-highradius-600"></div>
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
              <Card className="col-span-3 border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">Collection Metrics</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-highradius-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Collection Rate</div>
                        <div className="mt-1 text-2xl font-bold text-gray-800">78.5%</div>
                        <div className="mt-1 text-xs text-green-600">+2.3% from last period</div>
                      </div>
                      <div className="rounded-lg bg-highradius-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Avg. Days to Collect</div>
                        <div className="mt-1 text-2xl font-bold text-gray-800">32</div>
                        <div className="mt-1 text-xs text-green-600">-3 days from last period</div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-3">Top Collectors</h4>
                      <div className="space-y-3">
                        {[
                          { name: "John Smith", amount: "$38,450", rate: "85.0%" },
                          { name: "Sarah Johnson", amount: "$32,400", rate: "85.0%" },
                          { name: "Mike Wilson", amount: "$41,870", rate: "80.0%" },
                        ].map((collector, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-highradius-100 flex items-center justify-center text-highradius-700 text-sm font-medium mr-2">
                                {collector.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="text-sm font-medium">{collector.name}</div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">{collector.amount}</span>
                              <span className="text-muted-foreground ml-2">({collector.rate})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-800">Upcoming Due Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "INV-2023-003", customer: "Wayne Enterprises", amount: "$5,800.00", due: "Jun 15, 2023" },
                  { id: "INV-2023-004", customer: "Stark Industries", amount: "$2,340.00", due: "Jun 30, 2023" },
                  { id: "INV-2023-005", customer: "Umbrella Corp", amount: "$4,100.00", due: "Jul 15, 2023" },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-sm">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">{invoice.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{invoice.amount}</div>
                      <div className="text-xs text-muted-foreground">Due {invoice.due}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-800">Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Acme Corporation", amount: "$45,230", status: "Good" },
                  { name: "Globex Industries", amount: "$32,180", status: "Good" },
                  { name: "Wayne Enterprises", amount: "$28,450", status: "Warning" },
                ].map((customer, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="font-medium text-sm">{customer.name}</div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{customer.amount}</div>
                      <div className={`text-xs ${customer.status === "Good" ? "text-green-600" : "text-amber-600"}`}>
                        {customer.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-800">Collection Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { task: "Follow up on INV-2023-001", due: "Today", priority: "High" },
                  { task: "Send reminder for INV-2023-002", due: "Tomorrow", priority: "Medium" },
                  { task: "Call Acme Corp about payment", due: "Jun 20, 2023", priority: "Medium" },
                ].map((task, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-sm">{task.task}</div>
                      <div className="text-xs text-muted-foreground">Due {task.due}</div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "High" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
