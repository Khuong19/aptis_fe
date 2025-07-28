'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart2, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  User 
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';

interface LearnerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LearnerSidebar({ isOpen, onClose }: LearnerSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/learner/dashboard', icon: BarChart2 },
    { name: 'Practice Tests', href: '/learner/practice', icon: FileText },
    { name: 'My Results', href: '/learner/results', icon: CheckSquare },
    { name: 'Profile', href: '/learner/profile', icon: User },
  ];
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-[#152C61] text-white transition-transform transform z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-[#2A4173]">
            <Link href="/learner/dashboard" className="flex items-center">
              <span className="text-xl font-bold">APTIS Practice</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-[#2A4173] text-white'
                      : 'text-gray-300 hover:bg-[#2A4173] hover:text-white'}
                  `}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-[#2A4173]">
            <Link
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white w-full"
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}