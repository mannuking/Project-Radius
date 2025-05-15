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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { DollarSign, Percent, TrendingUp, FileText, Users, BarChartHorizontal } from "lucide-react"

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

import apiConfig from "@/lib/api-config"

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState("2023") // Matching screenshot year
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    // Use the API configuration to get the URL
    const apiUrl = apiConfig.getUrl(apiConfig.endpoints.arData, { role: 'admin' });
    console.log("Fetching admin data from:", apiUrl);
    
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Admin data received:", data);
        setDashboardData(data);
      })
      .catch(error => {
        console.error("Error fetching admin data:", error);
        alert("Error fetching data from API: " + error.message);
      });
  }, [])

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
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-teal-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalSales)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
            <FileText className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.accountsReceivable)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Receivables</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.overdueReceivables)}</div>
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
        <div className="flex flex-wrap gap-2 items-center justify-end">
          {/* Filters mimicking screenshot - Need actual Select components */}
          <div className="text-xs font-medium p-2 border rounded bg-gray-50 w-24 text-center">Ella</div>
          <div className="text-xs font-medium p-2 border rounded bg-gray-50 w-24 text-center">January</div>
          <div className="text-xs font-medium p-2 border rounded bg-gray-50 w-24 text-center">A</div>
          <div className="text-xs font-medium p-2 border rounded bg-gray-50 w-24 text-center">2023</div>
          {/* Actual Selects - Uncomment and implement data fetching */}
          {/* <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="2023">2023</SelectItem><SelectItem value="2024">2024</SelectItem></SelectContent>
          </Select> */}
          <Button size="sm" className="h-8 text-xs bg-slate-700 hover:bg-slate-800">Refresh All</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs">PDF</Button>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Monthly Performance - Spanning 2 columns */}
        <Card className="bg-white p-4 shadow-sm lg:col-span-2 h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)]">
            <Bar data={dashboardData.monthlyPerformance} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Invoice Status */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Invoice Status Tracker</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)] flex items-center justify-center">
            <Doughnut data={dashboardData.invoiceStatus} options={pieOptions} />
          </CardContent>
        </Card>

        {/* Top 5 Customers by Sales */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Top 5 Customers by Sales</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)]">
            <Bar data={dashboardData.topCustomersBySales} options={horizontalBarOptions} />
          </CardContent>
        </Card>

        {/* Top 5 Customers by Receivables */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
            <CardHeader className="p-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Top 5 Customers by Receivables</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-50px)] flex items-center justify-center">
                <Doughnut data={dashboardData.topCustomersByReceivables} options={pieOptions} />
            </CardContent>
        </Card>

        {/* Aging Buckets */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Aging Buckets by Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-50px)]">
            <Bar data={dashboardData.agingBuckets} options={horizontalBarOptions} />
          </CardContent>
        </Card>

         {/* Overdue Balance by Collector - Added */}
        <Card className="bg-white p-4 shadow-sm h-[350px]">
            <CardHeader className="p-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Overdue Balance by Collector</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-50px)] flex items-center justify-center">
                <Doughnut data={dashboardData.overdueBalanceByCollector} options={pieOptions} />
            </CardContent>
        </Card>

      </div>
    </div>
  )
} 
