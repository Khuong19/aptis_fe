'use client';

import { useState } from 'react';
import LearnerSidebar from './LearnerSidebar';
import LearnerHeader from './LearnerHeader';
import SessionMonitor from '@/app/components/auth/SessionMonitor';

interface LearnerLayoutProps {
  children: React.ReactNode;
}

export default function LearnerLayout({ children }: LearnerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LearnerSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="relative md:pl-64 z-0">
        <LearnerHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <SessionMonitor />
          {children}
        </main>
      </div>
    </div>
  );
} 