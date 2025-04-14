import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import axios from 'axios';

const AgingReport = () => {
  const [data, setData] = useState({
    agingBuckets: {},
    topOverdueInvoices: [],
    weeklyTrend: []
  });

  useEffect(() => {
    fetchAgingReport();
  }, []);

  const fetchAgingReport = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports/aging`);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching aging report:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const agingBucketsData = Object.entries(data.agingBuckets).map(([key, value]) => ({
    name: key.replace('_', '-'),
    amount: value
  }));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Aging Report
      </Typography>

      <Grid container spacing={3}>
        {/* Aging Buckets Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Aging Buckets
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={agingBucketsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#1976d2" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Weekly Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Weekly Aging Trend
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekStarting" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line type="monotone" dataKey="current" stroke="#4caf50" name="Current" />
                <Line type="monotone" dataKey="1_30" stroke="#2196f3" name="1-30 Days" />
                <Line type="monotone" dataKey="31_60" stroke="#ff9800" name="31-60 Days" />
                <Line type="monotone" dataKey="61_90" stroke="#f44336" name="61-90 Days" />
                <Line type="monotone" dataKey="over_90" stroke="#9c27b0" name="Over 90 Days" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Overdue Invoices */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Overdue Invoices
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Days Overdue</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topOverdueInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {Math.floor(
                          (new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)
                        )}
                      </TableCell>
                      <TableCell>
                        {invoice.assignee
                          ? `${invoice.assignee.firstName} ${invoice.assignee.lastName}`
                          : 'Unassigned'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgingReport; 
