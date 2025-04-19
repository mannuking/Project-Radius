import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import AgingReport from './pages/AgingReport';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
            <Route path="invoices/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
            
            <Route path="users" element={
              <ProtectedRoute roles={['Operations', 'Director']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            
            <Route path="reports" element={
              <ProtectedRoute roles={['Director']}>
                <Reports />
              </ProtectedRoute>
            } />
            
            <Route path="reports/aging" element={
              <ProtectedRoute>
                <AgingReport />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 
