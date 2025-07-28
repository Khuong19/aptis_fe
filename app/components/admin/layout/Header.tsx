'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Search Bar */}
      <div className="flex-1 ml-4 lg:ml-0 lg:max-w-md hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right Side - Notifications, Help, Profile */}
      <div className="flex items-center">
        {/* Notification Button */}
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative ml-3" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-sm rounded-full focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 border border-gray-300">
              <span className="font-medium">AD</span>
            </div>
            <div className="hidden lg:block ml-2 text-left">
              <div className="text-sm font-medium text-gray-700">Admin User</div>
              <div className="text-xs text-gray-500">admin@example.com</div>
            </div>
            <svg className="ml-1 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <div className="border-t border-gray-200 my-1"></div>
              <Link 
                href="/login" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 