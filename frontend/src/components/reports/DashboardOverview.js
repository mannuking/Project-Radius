import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage
const formatPercentage = (value) => {
  return `${(value * 100).toFixed(1)}%`;
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body2">{label}</Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

// COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardOverview = ({ data }) => {
  if (!data) return null;

  const {
    totalOpenAR,
    totalOverdueAR,
    totalDisputedAmount,
    openDisputesByType,
    openDisputesByRootCause,
    ptpStats,
    weeklyTrend,
    outcomeStatusBreakdown,
  } = data;

  // Calculate percentages for outcome status
  const outcomeStatusData = Object.entries(outcomeStatusBreakdown).map(([status, amount]) => ({
    name: status,
    value: amount,
    percentage: (amount / totalOpenAR) * 100,
  }));

  // Prepare data for weekly trend chart
  const weeklyTrendData = weeklyTrend.map(week => ({
    week: week.week,
    openAR: week.openAR,
    overdueAR: week.overdueAR,
  }));

  // Prepare data for dispute type pie chart
  const disputeTypeData = Object.entries(openDisputesByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Prepare data for root cause pie chart
  const rootCauseData = Object.entries(openDisputesByRootCause).map(([cause, count]) => ({
    name: cause,
    value: count,
  }));

  return (
    <Box>
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Open AR
                </Typography>
                <TrendingUpIcon color="primary" />
              </Box>
              <Typography variant="h4">{formatCurrency(totalOpenAR)}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="textSecondary">
                {Object.keys(weeklyTrend).length > 0 && (
                  <>
                    {weeklyTrend[weeklyTrend.length - 1].openAR > weeklyTrend[weeklyTrend.length - 2].openAR ? '↑' : '↓'} 
                    {formatPercentage(Math.abs(weeklyTrend[weeklyTrend.length - 1].openAR - weeklyTrend[weeklyTrend.length - 2].openAR) / weeklyTrend[weeklyTrend.length - 2].openAR)} from last week
                  </>
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Overdue AR
                </Typography>
                <WarningIcon color="warning" />
              </Box>
              <Typography variant="h4">{formatCurrency(totalOverdueAR)}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="textSecondary">
                {formatPercentage(totalOverdueAR / totalOpenAR)} of total AR
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Disputed Amount
                </Typography>
                <ErrorIcon color="error" />
              </Box>
              <Typography variant="h4">{formatCurrency(totalDisputedAmount)}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="textSecondary">
                {formatPercentage(totalDisputedAmount / totalOpenAR)} of total AR
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  PTP Fulfillment Rate
                </Typography>
                <TimelineIcon color="info" />
              </Box>
              <Typography variant="h4">{formatPercentage(ptpStats.fulfillmentRate)}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Tooltip title="Fulfilled PTPs">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{ptpStats.fulfilled}</Typography>
                  </Box>
                </Tooltip>
                <Tooltip title="Broken PTPs">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CancelIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{ptpStats.broken}</Typography>
                  </Box>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Weekly Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly AR Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Bar dataKey="openAR" name="Open AR" fill="#8884d8" />
                    <Bar dataKey="overdueAR" name="Overdue AR" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Outcome Status Breakdown */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AR by Outcome Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outcomeStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {outcomeStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Dispute Type Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Disputes by Type
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={disputeTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {disputeTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Root Cause Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Disputes by Root Cause
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rootCauseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rootCauseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 
