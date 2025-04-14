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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DisputeReport = () => {
  const [data, setData] = useState({
    disputeMetrics: [],
    disputeTrends: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchDisputeData = async () => {
      try {
        const response = await axios.get('/api/reports/disputes');
        setData({
          disputeMetrics: response.data.metrics,
          disputeTrends: response.data.trends,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dispute report data'
        }));
      }
    };

    fetchDisputeData();
  }, []);

  if (data.loading) return <Typography>Loading...</Typography>;
  if (data.error) return <Typography color="error">{data.error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dispute Report
      </Typography>

      <Grid container spacing={3}>
        {/* Dispute Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dispute Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.disputeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Dispute Resolution Time */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Resolution Time by Category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.disputeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgResolutionDays" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Dispute Details Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Disputes
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Days Open</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.disputeMetrics.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell>{dispute.invoiceNumber}</TableCell>
                        <TableCell>{dispute.customer}</TableCell>
                        <TableCell>{dispute.category}</TableCell>
                        <TableCell>{dispute.status}</TableCell>
                        <TableCell align="right">
                          ${dispute.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{dispute.daysOpen}</TableCell>
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

export default DisputeReport; 
