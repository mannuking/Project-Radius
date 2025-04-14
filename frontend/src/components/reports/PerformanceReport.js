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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PerformanceReport = () => {
  const [data, setData] = useState({
    collectorMetrics: [],
    teamPerformance: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get('/api/reports/performance');
        setData({
          collectorMetrics: response.data.collectorMetrics,
          teamPerformance: response.data.teamPerformance,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load performance report data'
        }));
      }
    };

    fetchPerformanceData();
  }, []);

  if (data.loading) return <Typography>Loading...</Typography>;
  if (data.error) return <Typography color="error">{data.error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Performance Report
      </Typography>

      <Grid container spacing={3}>
        {/* Collection Performance Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collection Performance Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.teamPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="collectionRate" stroke="#8884d8" name="Collection Rate" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Individual Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Individual Performance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.collectorMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="collectionRate" fill="#8884d8" name="Collection Rate" />
                    <Bar dataKey="resolvedDisputes" fill="#82ca9d" name="Resolved Disputes" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Collector Performance Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collector Performance Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Collector Name</TableCell>
                      <TableCell align="right">Collection Rate</TableCell>
                      <TableCell align="right">Total Collected</TableCell>
                      <TableCell align="right">Resolved Disputes</TableCell>
                      <TableCell align="right">Active Cases</TableCell>
                      <TableCell align="right">Success Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.collectorMetrics.map((collector) => (
                      <TableRow key={collector.id}>
                        <TableCell>{collector.name}</TableCell>
                        <TableCell align="right">{collector.collectionRate}%</TableCell>
                        <TableCell align="right">
                          ${collector.totalCollected.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{collector.resolvedDisputes}</TableCell>
                        <TableCell align="right">{collector.activeCases}</TableCell>
                        <TableCell align="right">{collector.successRate}%</TableCell>
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

export default PerformanceReport; 
