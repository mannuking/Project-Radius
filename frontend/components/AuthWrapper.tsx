'use client';

import dynamic from 'next/dynamic';

const AuthCheck = dynamic(() => import('./AuthCheck'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthCheck>{children}</AuthCheck>;
} 
