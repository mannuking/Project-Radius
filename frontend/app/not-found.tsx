import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mt-2 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
      <Link 
        href="/"
        className="mt-6 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
} 
