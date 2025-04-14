import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { hasRouteAccess } from './utils/roleConfig';

// Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

// Layout
import Layout from './components/Layout';

const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If user is logged in but hasn't selected a role, redirect to landing
  if (!currentUser.role && location.pathname !== '/') {
    return <Navigate to="/" />;
  }

  // Check if user has access to this route
  if (requiredRole && !hasRouteAccess(currentUser.role, requiredRole)) {
    return <Navigate to="/dashboard" />;
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If user is logged in and has a role, redirect to dashboard or the page they tried to access
  if (currentUser?.role) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} />;
  }

  // If user is logged in but hasn't selected a role, redirect to landing
  if (currentUser && !currentUser.role && location.pathname !== '/') {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />

            {/* Role Selection */}
            <Route path="/" element={
              <PrivateRoute>
                <Landing />
              </PrivateRoute>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute requiredRole="dashboard">
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/invoices" element={
              <PrivateRoute requiredRole="invoices">
                <InvoiceList />
              </PrivateRoute>
            } />
            <Route path="/invoices/:id" element={
              <PrivateRoute requiredRole="invoices">
                <InvoiceDetail />
              </PrivateRoute>
            } />
            <Route path="/reports" element={
              <PrivateRoute requiredRole="reports">
                <Reports />
              </PrivateRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App; 
