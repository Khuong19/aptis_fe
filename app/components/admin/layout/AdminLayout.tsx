'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SessionMonitor from '@/app/components/auth/SessionMonitor';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="relative flex-1 flex flex-col overflow-hidden z-0">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <SessionMonitor />
          {children}
        </div>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default AdminLayout; 