// API Configuration file for Project Radius
// This file handles API endpoint configuration for different environments

// Check if we're in development or production
const isDevelopment = process.env.NODE_ENV === 'development';

// Base URLs - configured to work with radiusdb database in Firebase
const devBaseUrl = 'http://127.0.0.1:5001/api';
const prodBaseUrl = '/api'; // In production, we use relative URLs because our Firebase Functions are served from the same domain

// Export the API configuration
const apiConfig = {
  baseUrl: isDevelopment ? devBaseUrl : prodBaseUrl,
  
  // Define API endpoints
  endpoints: {
    arData: '/ar-data',
    // Add more endpoints as your application grows
  },
    // Helper function to get full URL for an endpoint
  getUrl: (endpoint: string, queryParams: Record<string, string> = {}) => {
    const baseUrl = isDevelopment ? devBaseUrl : prodBaseUrl;
    const url = `${baseUrl}${endpoint}`;
    
    // Add query parameters if any
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    // Add a timestamp to prevent caching issues in production
    if (!isDevelopment) {
      params.append('_t', Date.now().toString());
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }
};

export default apiConfig;
