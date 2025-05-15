'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      // Check for Firebase-specific errors
      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      const isFirebaseError = errorMessage.includes('Firebase') || errorMessage.includes('firestore') || errorMessage.includes('database');
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {errorMessage}
              </p>
              {isFirebaseError && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md text-left">
                  <p className="text-sm text-yellow-800 font-medium">Firebase connection issue detected</p>
                  <ul className="mt-2 text-xs list-disc pl-5 text-yellow-700">
                    <li>Check if your Firestore database 'radiusdb' exists and is accessible</li>
                    <li>Verify your API endpoints are correctly configured</li>
                    <li>Make sure your Firebase Functions are deployed properly</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-8 space-y-4">
              <Button
                onClick={() => {
                  // Clear cache and reload
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => {
                        caches.delete(name);
                      });
                    });
                  }
                  window.location.reload();
                }}
                className="w-full bg-highradius-600 hover:bg-highradius-700"
              >
                Clear Cache & Refresh Page
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 
