import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Calculate days overdue
const calculateDaysOverdue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = Math.abs(today - due);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'NEW_DISPUTE':
      return 'error';
    case 'RESOLVED':
      return 'success';
    case 'PENDING_CLIENT_RESPONSE':
      return 'warning';
    case 'PAID':
      return 'info';
    case 'BLOCKED':
      return 'error';
    default:
      return 'default';
  }
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body2">{label}</Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const AgingReport = ({ data }) => {
  if (!data) return null;

  const { agingBuckets, topOverdueInvoices, weeklyTrend } = data;

  // Prepare data for aging buckets chart
  const agingData = [
    { name: '0-30', value: agingBuckets['0-30'] },
    { name: '31-60', value: agingBuckets['31-60'] },
    { name: '61-90', value: agingBuckets['61-90'] },
    { name: '91-120', value: agingBuckets['91-120'] },
    { name: '>120', value: agingBuckets['>120'] },
  ];

  // Calculate total AR
  const totalAR = Object.values(agingBuckets).reduce((sum, value) => sum + value, 0);

  // Prepare data for weekly trend chart
  const weeklyTrendData = weeklyTrend.map(week => ({
    week: week.week,
    '0-30': week.agingBuckets['0-30'],
    '31-60': week.agingBuckets['31-60'],
    '61-90': week.agingBuckets['61-90'],
    '91-120': week.agingBuckets['91-120'],
    '>120': week.agingBuckets['>120'],
  }));

  return (
    <Box>
      {/* Aging Buckets Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AR Aging Buckets
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={agingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aging Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {agingData.map((bucket, index) => {
                  const percentage = (bucket.value / totalAR) * 100;
                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{bucket.name} days</Typography>
                        <Typography variant="body2">
                          {formatCurrency(bucket.value)} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={index === 0 ? 'success' : index === 1 ? 'info' : index === 2 ? 'warning' : 'error'}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weekly Trend Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weekly Aging Trend
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                stackOffset="expand"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <ChartTooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="0-30" name="0-30 days" stackId="a" fill="#4caf50" />
                <Bar dataKey="31-60" name="31-60 days" stackId="a" fill="#2196f3" />
                <Bar dataKey="61-90" name="61-90 days" stackId="a" fill="#ff9800" />
                <Bar dataKey="91-120" name="91-120 days" stackId="a" fill="#f44336" />
                <Bar dataKey=">120" name=">120 days" stackId="a" fill="#9c27b0" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Top Overdue Invoices */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 10 Overdue Invoices
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Days Overdue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topOverdueInvoices.map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {calculateDaysOverdue(invoice.dueDate)}
                        <Tooltip title="Days overdue">
                          <WarningIcon color="warning" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.outcomeStatus.replace(/_/g, ' ')}
                        color={getStatusColor(invoice.outcomeStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{invoice.assignedTo?.username || 'Unassigned'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AgingReport; 
