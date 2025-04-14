import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardOverview from '../components/reports/DashboardOverview';
import AgingReport from '../components/reports/AgingReport';
import CustomerReport from '../components/reports/CustomerReport';
import DisputeReport from '../components/reports/DisputeReport';
import PerformanceReport from '../components/reports/PerformanceReport';
import PTPReport from '../components/reports/PTPReport';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Reports = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [agingData, setAgingData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [disputeData, setDisputeData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [ptpData, setPtpData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all dashboard data in parallel
      const [
        dashboardResponse,
        agingResponse,
        customerResponse,
        disputeResponse,
        performanceResponse,
        ptpResponse
      ] = await Promise.all([
        axios.get('/api/reports/dashboard'),
        axios.get('/api/reports/aging'),
        axios.get('/api/reports/customers'),
        axios.get('/api/reports/disputes'),
        axios.get('/api/reports/performance'),
        axios.get('/api/reports/ptp')
      ]);
      
      setDashboardData(dashboardResponse.data);
      setAgingData(agingResponse.data);
      setCustomerData(customerResponse.data);
      setDisputeData(disputeResponse.data);
      setPerformanceData(performanceResponse.data);
      setPtpData(ptpResponse.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleExport = async (reportType) => {
    try {
      const response = await axios.get(`/api/reports/export/${reportType}`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
      setError('Failed to export report. Please try again later.');
    }
  };

  if (loading && !dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleExport(tabValue === 0 ? 'dashboard' : 
                                      tabValue === 1 ? 'aging' : 
                                      tabValue === 2 ? 'customers' : 
                                      tabValue === 3 ? 'disputes' : 
                                      tabValue === 4 ? 'performance' : 'ptp')}
          >
            Export
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<TrendingUpIcon />} label="Aging Report" />
          <Tab icon={<PeopleIcon />} label="Customer Report" />
          <Tab icon={<AssessmentIcon />} label="Dispute Report" />
          <Tab icon={<PeopleIcon />} label="Performance Report" />
          <Tab icon={<AssessmentIcon />} label="PTP Report" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <DashboardOverview data={dashboardData} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AgingReport data={agingData} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <CustomerReport data={customerData} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <DisputeReport data={disputeData} />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <PerformanceReport data={performanceData} />
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <PTPReport data={ptpData} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Reports; 
