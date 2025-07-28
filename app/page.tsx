'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the learner dashboard
    router.push('/learner/dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#152C61]">APTIS Learning Platform</h1>
        <p className="mt-2 text-gray-500">Redirecting to dashboard...</p>
      </div>
    </div>
  );
} 