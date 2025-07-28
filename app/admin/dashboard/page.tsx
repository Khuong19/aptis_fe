'use client';

import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import StatsCard from '../../components/admin/dashboard/StatsCard';
import UserRoleChart from '../../components/admin/dashboard/UserRoleChart';
import { getStatsCards, getUserRoleChartData, getTestStatusChartData } from '../../lib/data/stats';
import { dummyUsers } from '../../lib/data/users';
import { dummyTests } from '../../lib/data/tests';
import type { Metadata } from 'next';

// This doesn't work in client components, moved to layout
// export const metadata: Metadata = {
//   title: 'Dashboard | Admin',
//   description: 'Admin dashboard for APTIS Learning Platform',
// };

export default function Dashboard() {
  const statsCards = getStatsCards();
  const userRoleChartData = getUserRoleChartData();
  const testStatusChartData = getTestStatusChartData();
  
  // Get recent users
  const recentUsers = [...dummyUsers]
    .sort((a, b) => {
      if (!a.lastLogin) return 1;
      if (!b.lastLogin) return -1;
      return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
    })
    .slice(0, 5);
  
  // Get recent tests
  const recentTests = [...dummyTests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Hello, Admin! Here is an overview of the system's activity.</p>
        
        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </div>
        
        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* User Role Distribution */}
          <UserRoleChart chartData={userRoleChartData} />
          
          {/* Test Status Chart - Simplified implementation */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tests</h3>
              <p className="text-sm text-gray-500">Test status</p>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Test status bars */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Published</span>
                    <span className="text-sm font-medium text-gray-700">
                      {testStatusChartData.datasets[0].data[0]} tests
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.round((testStatusChartData.datasets[0].data[0] / (testStatusChartData.datasets[0].data[0] + testStatusChartData.datasets[0].data[1])) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Draft</span>
                    <span className="text-sm font-medium text-gray-700">
                      {testStatusChartData.datasets[0].data[1]} tests
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-amber-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.round((testStatusChartData.datasets[0].data[1] / (testStatusChartData.datasets[0].data[0] + testStatusChartData.datasets[0].data[1])) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                {user.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'student' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary/10 text-secondary'}`}>
                          {user.role === 'student' ? 'Student' : 'Teacher'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <a href="/users" className="text-sm font-medium text-primary hover:text-primary-dark">
                View all users →
              </a>
            </div>
          </div>
          
          {/* Recent Tests */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recently Updated Tests</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentTests.map((test) => (
                <li key={test.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <a href={`/tests/${test.id}`} className="text-sm font-medium text-primary hover:text-primary-dark truncate">
                        {test.title}
                      </a>
                      <p className="mt-1 text-xs text-gray-500 truncate">{test.description}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        Updated: {new Date(test.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </div>
                    </div>
                    <span
                      className={`ml-3 px-2 py-1 text-xs rounded-full font-medium 
                      ${test.status === 'Public' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {test.status === 'Public' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <a href="/tests" className="text-sm font-medium text-primary hover:text-primary-dark">
                View all tests →
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 