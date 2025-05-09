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
import { DollarSign, Percent, CreditCard, Clock, AlertTriangle, CheckCircle } from "lucide-react"

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

type CollectorDashboardProps = {
  collectorName?: string;
}

export default function CollectorDashboard({ collectorName }: CollectorDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    const apiUrl = collectorName 
      ? `http://127.0.0.1:5001/api/ar-data?role=collector&name=${encodeURIComponent(collectorName)}`
      : "http://127.0.0.1:5001/api/ar-data?role=collector";
    
    // Log the API request for debugging
    console.log("Fetching collector data from:", apiUrl);
      
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Collector data received:", data);
        setDashboardData(data);
      })
      .catch(error => {
        console.error("Error fetching collector data:", error);
        // Only use mock data as fallback when API fails
        alert("Using fallback mock data. Could not connect to the API at " + apiUrl);
        setDashboardData({
          totalAssigned: 158,
          totalAssignedAmount: 842560,
          totalOverdueAmount: 345680,
          overduePercentage: 41,
          agingBuckets: {
            labels: ['0-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
            datasets: [
              {
                label: 'Amount ($)',
                data: [352680, 245800, 156480, 87600],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
              }
            ]
          },
          statusDistribution: {
            labels: ['Current', 'Overdue', 'Disputed', 'Paid'],
            datasets: [
              {
                data: [55, 25, 10, 10],
                backgroundColor: [
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(99, 102, 241, 0.8)'
                ],
                borderWidth: 1,
              }
            ]
          },
          topCustomersByOverdue: {
            labels: ['ABC Corp', 'XYZ Industries', 'Acme Inc', 'Global Tech', 'Best Services'],
            datasets: [
              {
                label: 'Overdue Amount',
                data: [98500, 75680, 63400, 58200, 49900],
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
              }
            ]
          },
          worklist: [
            {
              "Customer Name": "ABC Corp",
              "Invoice number": "INV-10042",
              "Invoice Amount": 35800,
              "Invoice due date": "2023-08-15",
              "Days overdue": 45,
              "Invoice Status": "Overdue"
            },
            {
              "Customer Name": "XYZ Industries",
              "Invoice number": "INV-10078",
              "Invoice Amount": 42500,
              "Invoice due date": "2023-09-01",
              "Days overdue": 28,
              "Invoice Status": "Overdue"
            },
            {
              "Customer Name": "Acme Inc",
              "Invoice number": "INV-10103",
              "Invoice Amount": 18750,
              "Invoice due date": "2023-09-20",
              "Days overdue": 9,
              "Invoice Status": "Overdue"
            },
            {
              "Customer Name": "Global Tech",
              "Invoice number": "INV-10054",
              "Invoice Amount": 28400,
              "Invoice due date": "2023-08-25",
              "Days overdue": 35,
              "Invoice Status": "Disputed"
            },
            {
              "Customer Name": "Best Services",
              "Invoice number": "INV-10089",
              "Invoice Amount": 15200,
              "Invoice due date": "2023-09-10",
              "Days overdue": 19,
              "Invoice Status": "Overdue"
            }
          ]
        });
      });
  }, [collectorName])

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
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
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

  const horizontalBarOptions = { ...chartOptions, indexAxis: 'y' as const };
  const pieOptions = { ...chartOptions, scales: {} }; // Remove scales for pie/doughnut

  return (
    <div className="space-y-4 p-4 bg-gray-100/50 min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-100" />
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
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalOverdueAmount)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Overdue</CardTitle>
            <Percent className="h-4 w-4 text-red-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overduePercentage}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="text-sm font-medium">
            {collectorName ? `Collector: ${collectorName}` : "All Collectors"}
          </div>
          <Button size="sm" className="h-8 text-xs bg-slate-700 hover:bg-slate-800">Refresh Data</Button>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Aging Buckets */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Aging Buckets</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)]">
            <Bar data={dashboardData.agingBuckets} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Invoice Status */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)] flex items-center justify-center">
            <Doughnut data={dashboardData.statusDistribution} options={pieOptions} />
          </CardContent>
        </Card>

        {/* Top Customers by Overdue */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Top 5 Customers by Overdue</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)]">
            <Bar data={dashboardData.topCustomersByOverdue} options={horizontalBarOptions} />
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
