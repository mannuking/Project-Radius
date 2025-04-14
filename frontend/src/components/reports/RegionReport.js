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
  Grid,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RegionReport = () => {
  const [data, setData] = useState({
    regionMetrics: [],
    trendData: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        const response = await axios.get('/api/reports/regions');
        setData({
          regionMetrics: response.data.metrics,
          trendData: response.data.trends,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load region report data'
        }));
      }
    };

    fetchRegionData();
  }, []);

  if (data.loading) return <Typography>Loading...</Typography>;
  if (data.error) return <Typography color="error">{data.error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Region Report
      </Typography>

      <Grid container spacing={3}>
        {/* Revenue Distribution by Region */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Distribution by Region
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.regionMetrics}
                      dataKey="revenue"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.regionMetrics.map((entry, index) => (
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

        {/* Collection Performance Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collection Performance Trend
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={data.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="collectionRate" stroke="#8884d8" name="Collection Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Region Performance Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Region Performance Metrics
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Region</TableCell>
                      <TableCell align="right">Total Revenue</TableCell>
                      <TableCell align="right">Outstanding Balance</TableCell>
                      <TableCell align="right">Collection Rate</TableCell>
                      <TableCell align="right">Average Days to Pay</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.regionMetrics.map((region) => (
                      <TableRow key={region.id}>
                        <TableCell>{region.region}</TableCell>
                        <TableCell align="right">
                          ${region.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${region.outstandingBalance.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {region.collectionRate}%
                        </TableCell>
                        <TableCell align="right">
                          {region.avgDaysToPay}
                        </TableCell>
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

export default RegionReport; 
