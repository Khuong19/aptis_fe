'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { teacherNavItems } from './teacherNavConfig';
import SessionMonitor from '@/app/components/auth/SessionMonitor';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Using shared navigation config with unified naming
  const navigation = teacherNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-[#152C61] transform transition-transform duration-300 ease-in-out z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-[#2A4173]">
            <Link href="/teacher/dashboard" className="text-white font-bold text-xl">
              APTIS Teacher
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <SessionMonitor />
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-3 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-[#2A4173] text-white' 
                          : 'text-gray-300 hover:bg-[#2A4173] hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name || item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#2A4173]">
            <Link
              href="/login"
              onClick={async (e) => {
                e.preventDefault();
                console.log('Teacher logout link clicked');
                // Use the proper logout function
                const { handleLogout } = await import('@/app/lib/auth/tokenManager');
                await handleLogout();
              }}
              className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white"
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative md:ml-64 transition-all duration-300 z-0">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-500" />
              </div>
              <span className="ml-2 text-gray-700 font-medium">Teacher Name</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
} 