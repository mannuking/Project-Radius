import React, { useState, useEffect } from 'react';
import {
  Box,
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
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const CustomerReport = () => {
  const [data, setData] = useState({
    customerMetrics: [],
    topCustomers: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get('/api/reports/customers');
        setData({
          customerMetrics: response.data.metrics,
          topCustomers: response.data.topCustomers,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load customer report data'
        }));
      }
    };

    fetchCustomerData();
  }, []);

  if (data.loading) return <Typography>Loading...</Typography>;
  if (data.error) return <Typography color="error">{data.error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Customer Report
      </Typography>

      {/* Customer Metrics Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer Payment Performance
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <BarChart
              width={800}
              height={300}
              data={data.customerMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTimePayments" fill="#4caf50" name="On-time Payments" />
              <Bar dataKey="latePayments" fill="#ff9800" name="Late Payments" />
            </BarChart>
          </Box>
        </CardContent>
      </Card>

      {/* Top Customers Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 10 Customers by Revenue
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell align="right">Total Revenue</TableCell>
                  <TableCell align="right">Outstanding Balance</TableCell>
                  <TableCell align="right">On-time Payment %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell align="right">
                      ${customer.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ${customer.outstandingBalance.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {customer.onTimePaymentPercentage}%
                    </TableCell>
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

export default CustomerReport; 
