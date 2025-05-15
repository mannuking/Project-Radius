                              "use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Pie, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { DollarSign, AlertTriangle, XCircle, FileText, ClipboardCheck } from "lucide-react"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Helper function for formatting currency
const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  } else if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
};

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

type BillerDashboardProps = {
  billerName?: string;
}

import apiConfig from "@/lib/api-config"

export default function BillerDashboard({ billerName }: BillerDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    // Use the API configuration with parameters
    const queryParams: Record<string, string> = { role: 'biller' };
    if (billerName) {
      queryParams.name = billerName;
    }
    
    const apiUrl = apiConfig.getUrl(apiConfig.endpoints.arData, queryParams);
      
    // Log the API request for debugging
    console.log("Fetching biller data from:", apiUrl);
      
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Biller data received:", data);
        setDashboardData(data);
      })
      .catch(error => {
        console.error("Error fetching biller data:", error);
        // Show error message instead of using mock data
        alert("Error fetching data. Please try again later.");
      });
  }, [billerName])

  if (!dashboardData) return <div>Loading...</div>

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { boxWidth: 12, padding: 15, font: { size: 10 } }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== undefined) {
              label += formatCurrency(context.parsed.y);
            } else if (context.parsed !== undefined) {
              label += formatCurrency(context.parsed);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: { font: { size: 10 }, callback: (value: any) => formatCurrency(value) },
        grid: { drawTicks: false },
        border: { display: false }
      },
      x: {
        ticks: { font: { size: 10 } },
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  const horizontalBarOptions = { 
    ...chartOptions, 
    indexAxis: 'y' as const,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.x !== undefined) {
              label += formatCurrency(context.parsed.x);
            }
            return label;
          }
        }
      }
    }
  };

  const pieOptions = { 
    ...chartOptions, 
    scales: {}, // Remove scales for pie/doughnut
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-100/50 min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Invoices</CardTitle>
            <FileText className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalAssigned}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-teal-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalAssignedAmount)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disputed Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalDisputedAmount)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Disputed</CardTitle>
            <XCircle className="h-4 w-4 text-red-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.disputedPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="text-sm font-medium">
            {billerName ? `Biller: ${billerName}` : "All Billers"}
          </div>
          <Button size="sm" className="h-8 text-xs bg-slate-700 hover:bg-slate-800">Refresh Data</Button>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Root Cause Distribution */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Root Cause Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)] flex items-center justify-center">
            <Doughnut data={dashboardData.rootCauseDistribution} options={pieOptions} />
          </CardContent>
        </Card>

        {/* Dispute Code Distribution */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Dispute Code Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)] flex items-center justify-center">
            <Doughnut data={dashboardData.disputeCodeDistribution} options={pieOptions} />
          </CardContent>
        </Card>

        {/* Top Customers by Disputed */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Top 5 Customers by Disputed Amount</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)]">
            <Bar data={dashboardData.topCustomersByDisputed} options={horizontalBarOptions} />
          </CardContent>
        </Card>

        {/* Outcome Status Distribution */}
        <Card className="bg-white p-4 shadow-sm h-[350px] lg:col-span-3">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Outcome Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)] flex items-center justify-center">
            <Doughnut data={dashboardData.outcomeDistribution} options={pieOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Worklist */}
      <Card className="bg-white p-4 shadow-sm">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold text-gray-700">My Worklist</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dispute Code</TableHead>
                  <TableHead>Root Cause</TableHead>
                  <TableHead>Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.worklist.map((invoice: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{invoice["Customer Name"]}</TableCell>
                    <TableCell>{invoice["Invoice number"]}</TableCell>
                    <TableCell>{formatCurrency(invoice["Invoice Amount"])}</TableCell>
                    <TableCell>{formatDate(invoice["Invoice due date"])}</TableCell>
                    <TableCell className={invoice["Days overdue"] > 0 ? "text-red-600 font-medium" : ""}>
                      {invoice["Days overdue"]}
                    </TableCell>
                    <TableCell>
                      <span className={`py-1 px-2 rounded-full text-xs ${
                        invoice["Invoice Status"]?.includes("Overdue") 
                          ? "bg-red-100 text-red-800" 
                          : invoice["Invoice Status"] === "Disputed" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                      }`}>
                        {invoice["Invoice Status"]}
                      </span>
                    </TableCell>
                    <TableCell>{invoice["Dispute code L1"] || "—"}</TableCell>
                    <TableCell>{invoice["Root cause dropdown"] || "—"}</TableCell>
                    <TableCell>
                      <span className={`py-1 px-2 rounded-full text-xs ${
                        invoice["Outcome Status"] === "Resolved" 
                          ? "bg-green-100 text-green-800" 
                          : invoice["Outcome Status"] === "Escalated" 
                            ? "bg-red-100 text-red-800" 
                            : invoice["Outcome Status"] === "Pending Investigation"
                              ? "bg-yellow-100 text-yellow-800"
                              : invoice["Outcome Status"] === "Closed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                      }`}>
                        {invoice["Outcome Status"] || "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
