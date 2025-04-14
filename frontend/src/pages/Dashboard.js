import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  Assessment,
  Timeline,
  AccountBalance,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data - Replace with actual API calls
const arTrendData = [
  { month: 'Jan', amount: 2100000 },
  { month: 'Feb', amount: 2300000 },
  { month: 'Mar', amount: 1950000 },
  { month: 'Apr', amount: 2450000 },
  { month: 'May', amount: 2200000 },
  { month: 'Jun', amount: 2400000 },
];

const agingData = [
  { name: '0-30', value: 1200000 },
  { name: '31-60', value: 800000 },
  { name: '61-90', value: 300000 },
  { name: '90+', value: 150000 },
];

const topOverdueCustomers = [
  { name: 'Tech Corp', amount: 450000, aging: 75 },
  { name: 'Global Industries', amount: 380000, aging: 45 },
  { name: 'Acme Solutions', amount: 320000, aging: 92 },
  { name: 'Mega Corp', amount: 290000, aging: 62 },
  { name: 'Innovation Ltd', amount: 250000, aging: 88 },
];

const disputeTrendData = [
  { month: 'Jan', amount: 180000, count: 12 },
  { month: 'Feb', amount: 220000, count: 15 },
  { month: 'Mar', amount: 150000, count: 10 },
  { month: 'Apr', amount: 280000, count: 18 },
  { month: 'May', amount: 200000, count: 14 },
  { month: 'Jun', amount: 240000, count: 16 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const KPICard = ({ title, value, trend, icon, riskLevel }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
      {trend && (
        <Typography
          variant="body2"
          color={trend.startsWith('+') ? 'success.main' : 'error.main'}
        >
          {trend} vs Last Month
        </Typography>
      )}
      {riskLevel && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Risk Level
          </Typography>
          <LinearProgress
            variant="determinate"
            value={riskLevel}
            color={riskLevel > 70 ? 'error' : riskLevel > 40 ? 'warning' : 'success'}
          />
        </Box>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isDirector = currentUser?.role === 'director';

  const totalAR = agingData.reduce((sum, item) => sum + item.value, 0);
  const over90Percentage = (agingData[3].value / totalAR) * 100;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Director Dashboard
        </Typography>
        <Box>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => navigate('/reports')}
            startIcon={<Assessment />}
          >
            View Reports
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/invoices')}
          >
            View All Invoices
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* KPIs */}
        <Grid item xs={12} md={3}>
          <KPICard
            title="Total Open AR"
            value={`$${(totalAR / 1000000).toFixed(2)}M`}
            trend="+2.5%"
            icon={<AccountBalance color="primary" />}
            riskLevel={45}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KPICard
            title="Over 90 Days"
            value={`${over90Percentage.toFixed(1)}%`}
            trend="-0.8%"
            icon={<Warning color="error" />}
            riskLevel={over90Percentage}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KPICard
            title="Total Disputed"
            value="$1.27M"
            trend="+5.2%"
            icon={<Timeline color="warning" />}
            riskLevel={65}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KPICard
            title="Collection Rate"
            value="92.5%"
            trend="-1.2%"
            icon={<TrendingUp color="success" />}
            riskLevel={25}
          />
        </Grid>

        {/* AR Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Total Open AR Trend
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={arTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, 'Amount']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#1976d2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Aging Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              AR Aging Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={agingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Overdue Customers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Overdue Customers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Aging (Days)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topOverdueCustomers.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        '& td': { color: row.aging > 90 ? 'error.main' : 'inherit' }
                      }}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">
                        ${row.amount.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">{row.aging}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Dispute Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dispute Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={disputeTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  name="Disputed Amount"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="count"
                  stroke="#82ca9d"
                  name="Number of Disputes"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 
