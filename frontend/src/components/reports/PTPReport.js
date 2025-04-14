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
  Grid
} from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PTPReport = () => {
  const [data, setData] = useState({
    ptpMetrics: [],
    ptpTrends: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPTPData = async () => {
      try {
        const response = await axios.get('/api/reports/ptp');
        setData({
          ptpMetrics: response.data.metrics,
          ptpTrends: response.data.trends,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load PTP report data'
        }));
      }
    };

    fetchPTPData();
  }, []);

  if (data.loading) return <Typography>Loading...</Typography>;
  if (data.error) return <Typography color="error">{data.error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Promise-to-Pay (PTP) Report
      </Typography>

      <Grid container spacing={3}>
        {/* PTP Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                PTP Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.ptpMetrics}
                      dataKey="value"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.ptpMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* PTP Fulfillment Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                PTP Fulfillment Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.ptpTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fulfillmentRate" stroke="#8884d8" name="Fulfillment Rate" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* PTP Details Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent PTPs
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Promise Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Collector</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.ptpMetrics.map((ptp) => (
                      <TableRow key={ptp.id}>
                        <TableCell>{ptp.invoiceNumber}</TableCell>
                        <TableCell>{ptp.customer}</TableCell>
                        <TableCell>{new Date(ptp.promiseDate).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          ${ptp.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{ptp.status}</TableCell>
                        <TableCell>{ptp.collector}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PTPReport; 
