"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2"
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
import { useState } from "react"
import { DollarSign, Percent, Users, TrendingUp, TrendingDown, Landmark, Building, Hotel, UtensilsCrossed } from "lucide-react"

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

export default function ManagerDashboard() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [selectedCollector, setSelectedCollector] = useState("All")

  // Enhanced Sample Data - Replace with actual data
  const dashboardData = {
    totalBalance: 171258670,
    totalAccounts: 2156,
    balanceDistribution: {
      labels: ["Before Due", "Overdue", "Non-Active"],
      datasets: [{
        data: [34624182, 136634488, 36354830], // Before Due, Overdue, Non-Active
        backgroundColor: ["#4caf50", "#f44336", "#9e9e9e"],
        borderColor: "#ffffff",
        borderWidth: 2,
      }],
    },
    dsoAverage: 444,
    riskStatus: {
      high: 0.33,
      moderate: 0.41,
      inRange: 0.26,
    },
    monthlyTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Current",
          data: [49, 40, 37, 60, 49, 55, 40, 58, 155, 144, 140, 120].map(v => v * 1000000),
          borderColor: "#3f51b5",
          tension: 0.3,
          pointBackgroundColor: "#3f51b5",
          pointRadius: 3,
        },
        {
          label: "Previous Month",
          data: [40, 37, 60, 49, 55, 40, 58, 155, 144, 140, 120, 134].map(v => v * 1000000),
          borderColor: "#bdbdbd",
          tension: 0.3,
          borderDash: [5, 5],
          pointBackgroundColor: "#bdbdbd",
          pointRadius: 3,
        },
      ],
    },
    overdueChange: -24000000, // Example change
    overduePercentageChange: -17,
    beforeDueChange: 9000000,
    beforeDuePercentageChange: 23,
    overdueByCountry: {
      labels: ["UAE", "Egypt", "Cairo", "Dubai", "Alex", "Pakistan"],
      datasets: [{
        label: "Overdue Amount",
        data: [47, 41, 35, 28, 22, 18].map(v => v * 1000000),
        backgroundColor: "#3f51b5",
        barThickness: 15,
      }],
    },
    topOverdueCompanies: [
        { name: "The Private Exict of the OL -RD", amount: 12181668 },
        { name: "HOSSAM KAMAL KHALIL", amount: 7399750 },
        { name: "OL LIMITED VILLAGE", amount: 7235749 },
        { name: "Al-Raya For Templates Co.Ltd -JD", amount: 3767368 },
        { name: "Other Level\'s Retail Company", amount: 3661540 },
    ],
    overdueByCustomerGroup: {
        labels: ["Catering", "Supermarkets", "Sundry Debtors", "Restaurants", "Frozen Food", "Hotels", "Offices", "Convenience Stores"],
        datasets: [{
            label: "Overdue Amount",
            data: [68.2, 28.7, 16.5, 23.0, 12.6, 8.4, 338.0, 264.5, 3.5, 163.0, 10.5, 13.4].map(v => v * 1000), // Adjust units as needed
            backgroundColor: ["#3f51b5", "#4caf50", "#ff9800", "#f44336", "#9c27b0", "#00bcd4", "#8bc34a", "#ffeb3b"],
            barThickness: 15,
        }],
    },
  }

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Generally hide legends for cleaner look in this style
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            const value = context.parsed.y ?? context.parsed.x ?? context.parsed;
            if (value !== null) {
                label += formatCurrency(value);
            }
            return label;
          },
          title: function(context: any) {
              return context[0]?.label || '';
          }
        }
      }
    },
    scales: {
      y: { display: false, beginAtZero: true },
      x: { display: false, beginAtZero: true }
    }
  };

  const lineChartOptions = {
    ...commonChartOptions,
    plugins: { ...commonChartOptions.plugins, legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 12, padding: 15, font: { size: 10 } } } },
    scales: {
      y: { display: true, ticks: { font: { size: 10 }, callback: (value: any) => formatCurrency(value) }, grid: { drawTicks: false }, border: { display: false } },
      x: { display: true, ticks: { font: { size: 10 } }, grid: { display: false }, border: { display: false } }
    }
  };

  const barChartOptions = {
      ...commonChartOptions,
      scales: {
          y: { display: true, ticks: { font: { size: 10 }, callback: (value: any) => formatCurrency(value) }, grid: { drawTicks: false }, border: { display: false } },
          x: { display: true, ticks: { font: { size: 10 }, callback: (label: any) => label.length > 10 ? label.substring(0, 10) + '...' : label }, grid: { display: false }, border: { display: false } }
      }
  };
  const horizontalBarOptions = { ...barChartOptions, indexAxis: 'y' as const, scales: { x: barChartOptions.scales.y, y: barChartOptions.scales.x } };
  const pieOptions = { ...commonChartOptions, scales: {} }; // Remove scales for pie/doughnut

  return (
    <div className="space-y-4 p-4 bg-gray-100/50 min-h-screen">
        {/* Header Row 1: Key Stats & Balance Distribution */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-1 space-y-4">
                 <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Balance</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{formatCurrency(dashboardData.totalBalance)}</div></CardContent>
                </Card>
                 <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Accounts</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-indigo-600">{dashboardData.totalAccounts}</div></CardContent>
                </Card>
            </div>
            <Card className="bg-white shadow-sm md:col-span-2 flex flex-col items-center justify-center p-4 h-[200px]">
                 <CardTitle className="text-center text-sm font-semibold mb-2">Balance Distribution</CardTitle>
                 <div className="w-full h-full max-h-[150px]">
                    <Doughnut data={dashboardData.balanceDistribution} options={pieOptions} />
                 </div>
            </Card>
            <div className="md:col-span-1 space-y-4">
                <Card className="bg-white shadow-sm text-center p-3">
                    <div className="text-xs text-gray-500">Before Due</div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(dashboardData.balanceDistribution.datasets[0].data[0])}</div>
                </Card>
                 <Card className="bg-white shadow-sm text-center p-3">
                    <div className="text-xs text-gray-500">Overdue</div>
                    <div className="text-lg font-bold text-red-600">{formatCurrency(dashboardData.balanceDistribution.datasets[0].data[1])}</div>
                </Card>
                 <Card className="bg-white shadow-sm text-center p-3">
                    <div className="text-xs text-gray-500">Non-Active</div>
                    <div className="text-lg font-bold text-gray-500">{formatCurrency(dashboardData.balanceDistribution.datasets[0].data[2])}</div>
                </Card>
            </div>
        </div>

        {/* Header Row 2: DSO, Risk, Changes */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="bg-white shadow-sm text-center p-4 flex flex-col justify-center items-center h-[120px]">
                <CardTitle className="text-sm font-medium mb-1">Avg. DSO</CardTitle>
                <div className="text-3xl font-bold text-indigo-600">{dashboardData.dsoAverage}</div>
                <div className="text-xs text-gray-500">Days</div>
            </Card>
             <Card className="bg-white shadow-sm p-4 h-[120px]">
                <CardTitle className="text-sm font-medium mb-2 text-center">Risk Status</CardTitle>
                <div className="flex justify-around items-center h-full">
                    <div className="text-center">
                        <div className="text-red-500 font-bold">{(dashboardData.riskStatus.high * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">High</div>
                    </div>
                    <div className="text-center">
                        <div className="text-yellow-500 font-bold">{(dashboardData.riskStatus.moderate * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Moderate</div>
                    </div>
                    <div className="text-center">
                        <div className="text-green-500 font-bold">{(dashboardData.riskStatus.inRange * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">In Range</div>
                    </div>
                </div>
            </Card>
            <Card className="bg-white shadow-sm p-4 h-[120px]">
                <CardTitle className="text-sm font-medium mb-2">Overdue vs Prev. Month</CardTitle>
                 <div className={`text-xl font-bold ${dashboardData.overduePercentageChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dashboardData.overdueChange)}
                </div>
                <div className={`text-sm flex items-center ${dashboardData.overduePercentageChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.overduePercentageChange < 0 ? <TrendingDown className="h-4 w-4 mr-1"/> : <TrendingUp className="h-4 w-4 mr-1"/>}
                    {Math.abs(dashboardData.overduePercentageChange)}%
                </div>
            </Card>
            <Card className="bg-white shadow-sm p-4 h-[120px]">
                <CardTitle className="text-sm font-medium mb-2">Before Due vs Prev. Month</CardTitle>
                 <div className={`text-xl font-bold ${dashboardData.beforeDuePercentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {formatCurrency(dashboardData.beforeDueChange)}
                </div>
                <div className={`text-sm flex items-center ${dashboardData.beforeDuePercentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.beforeDuePercentageChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1"/> : <TrendingDown className="h-4 w-4 mr-1"/>}
                    {Math.abs(dashboardData.beforeDuePercentageChange)}%
                 </div>
            </Card>
        </div>

        {/* Filters Placeholder */}
        <Card className="bg-white p-3 shadow-sm">
            <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                     {/* Placeholder filters */}
                     <div className="text-xs font-medium p-2 border rounded bg-gray-50 min-w-[100px] text-center">Branch: All</div>
                     <div className="text-xs font-medium p-2 border rounded bg-gray-50 min-w-[100px] text-center">Customer Group: All</div>
                </div>
                 <div className="flex gap-2 flex-wrap">
                    <Button size="sm" className="h-8 text-xs bg-slate-700 hover:bg-slate-800">Refresh</Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs">Export</Button>
                 </div>
            </div>
        </Card>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Monthly Trend - Spanning 2 columns */}
            <Card className="bg-white p-4 shadow-sm lg:col-span-2 h-[350px]">
                <CardHeader className="p-0 pb-2"><CardTitle className="text-sm font-semibold text-gray-700">Current vs Previous Month</CardTitle></CardHeader>
                <CardContent className="p-0 h-[calc(100%-50px)]"><Line data={dashboardData.monthlyTrend} options={lineChartOptions} /></CardContent>
            </Card>

            {/* Top Overdue Companies List */}
            <Card className="bg-white p-4 shadow-sm h-[350px] overflow-y-auto">
                <CardHeader className="p-0 pb-2 sticky top-0 bg-white z-10"><CardTitle className="text-sm font-semibold text-gray-700">Top Overdue Companies</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <ul className="space-y-2">
                        {dashboardData.topOverdueCompanies.map((company, index) => (
                            <li key={index} className="flex justify-between items-center text-xs border-b pb-1">
                                <span className="truncate pr-2 text-gray-600">{index + 1}. {company.name}</span>
                                <span className="font-semibold text-red-600 whitespace-nowrap">{formatCurrency(company.amount)}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

             {/* Overdue by Country */}
            <Card className="bg-white p-4 shadow-sm h-[350px]">
                <CardHeader className="p-0 pb-2"><CardTitle className="text-sm font-semibold text-gray-700">Overdue & Before Due by Country</CardTitle></CardHeader>
                <CardContent className="p-0 h-[calc(100%-50px)]"><Bar data={dashboardData.overdueByCountry} options={barChartOptions} /></CardContent>
            </Card>

             {/* Overdue by Customer Group */}
            <Card className="bg-white p-4 shadow-sm h-[350px] lg:col-span-2">
                 <CardHeader className="p-0 pb-2"><CardTitle className="text-sm font-semibold text-gray-700">Overdue & Before Due by Customer Group Name</CardTitle></CardHeader>
                 <CardContent className="p-0 h-[calc(100%-50px)]"><Bar data={dashboardData.overdueByCustomerGroup} options={barChartOptions} /></CardContent>
            </Card>
        </div>
    </div>
  )
} 
