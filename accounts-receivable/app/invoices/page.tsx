"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for invoices
const invoices = [
  {
    id: "INV-2023-001",
    customer: "Acme Corporation",
    amount: "$3,450.00",
    dueDate: "2023-05-15",
    status: "Overdue",
    priority: "High",
  },
  {
    id: "INV-2023-002",
    customer: "Globex Industries",
    amount: "$1,200.00",
    dueDate: "2023-06-01",
    status: "Paid",
    priority: "Medium",
  },
  {
    id: "INV-2023-003",
    customer: "Wayne Enterprises",
    amount: "$5,800.00",
    dueDate: "2023-06-15",
    status: "Pending",
    priority: "Low",
  },
  {
    id: "INV-2023-004",
    customer: "Stark Industries",
    amount: "$2,340.00",
    dueDate: "2023-06-30",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "INV-2023-005",
    customer: "Umbrella Corporation",
    amount: "$4,100.00",
    dueDate: "2023-07-15",
    status: "Pending",
    priority: "High",
  },
  {
    id: "INV-2023-006",
    customer: "Cyberdyne Systems",
    amount: "$1,850.00",
    dueDate: "2023-07-30",
    status: "Paid",
    priority: "Low",
  },
  {
    id: "INV-2023-007",
    customer: "Oscorp Industries",
    amount: "$3,200.00",
    dueDate: "2023-08-15",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "INV-2023-008",
    customer: "LexCorp",
    amount: "$6,500.00",
    dueDate: "2023-08-30",
    status: "Overdue",
    priority: "High",
  },
]

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [date, setDate] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)

  // Filter invoices based on search term and filters
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.amount.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter
    const matchesPriority = priorityFilter === "All" || invoice.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-amber-100 text-amber-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-amber-100 text-amber-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <Button className="bg-highradius-600 hover:bg-highradius-700">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card className="mt-6 border shadow-sm">
        <CardHeader className="pb-3 bg-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-800">Invoice Management</CardTitle>
              <CardDescription>Manage and track all your invoices</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-highradius-200 text-highradius-700 hover:bg-highradius-50 hover:text-highradius-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-highradius-200 text-highradius-700 hover:bg-highradius-50 hover:text-highradius-800"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-8 border-highradius-200 focus-visible:ring-highradius-300"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-highradius-200 text-highradius-700 hover:bg-highradius-50 hover:text-highradius-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-highradius-100 bg-highradius-50/50 p-4 md:grid-cols-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 border-highradius-200 focus:ring-highradius-300">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="h-9 border-highradius-200 focus:ring-highradius-300">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-9 border-highradius-200",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  className="w-full bg-white border border-highradius-200 text-highradius-700 hover:bg-highradius-50"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("All")
                    setPriorityFilter("All")
                    setDate(undefined)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border border-highradius-100 overflow-hidden">
            <Table className="enterprise-table">
              <TableHeader>
                <TableRow className="bg-highradius-50 hover:bg-highradius-50">
                  <TableHead className="font-medium text-highradius-800">Invoice #</TableHead>
                  <TableHead className="font-medium text-highradius-800">Customer</TableHead>
                  <TableHead className="font-medium text-highradius-800">Amount</TableHead>
                  <TableHead className="font-medium text-highradius-800">Due Date</TableHead>
                  <TableHead className="font-medium text-highradius-800">Status</TableHead>
                  <TableHead className="font-medium text-highradius-800">Priority</TableHead>
                  <TableHead className="text-right font-medium text-highradius-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-highradius-50">
                    <TableCell className="font-medium text-highradius-700">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)} variant="outline">
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(invoice.priority)} variant="outline">
                        {invoice.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-highradius-600 hover:text-highradius-700 hover:bg-highradius-50"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredInvoices.length}</strong> of <strong>{invoices.length}</strong> invoices
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled className="border-highradius-200">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-highradius-50 border-highradius-200 text-highradius-700"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-highradius-200">
                2
              </Button>
              <Button variant="outline" size="sm" className="border-highradius-200">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
