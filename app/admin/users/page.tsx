'use client';

import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import UserTable from '../../components/admin/users/UserTable';
import UserFilters from '../../components/admin/users/UserFilters';
import { dummyUsers, getUserStats } from '../../lib/data/users';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const { total, students, teachers } = getUserStats();

  const filteredUsers = useMemo(() => {
    let filtered = dummyUsers;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getFullYear(), now.getMonth() - 1, now.getDate());
      
      filtered = filtered.filter(user => {
        const userDate = new Date(user.createdAt);
        switch (dateFilter) {
          case 'today':
            return userDate >= today;
          case 'week':
            return userDate >= weekAgo;
          case 'month':
            return userDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [searchTerm, roleFilter, statusFilter, dateFilter]);

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="mt-1 text-gray-600">Manage, search, and sort user lists</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg 
                className="-ml-1 mr-2 h-5 w-5" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Add User
            </button>
          </div>
        </div>
        
        {/* User filters */}
        <div className="mt-6">
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            totalUsers={dummyUsers.length}
            filteredCount={filteredUsers.length}
          />
        </div>
        
        {/* User table */}
        <div className="mt-4">
          <UserTable users={filteredUsers} currentRole={roleFilter} />
        </div>
      </div>
    </AdminLayout>
  );
} 