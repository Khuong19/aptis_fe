'use client';

import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';

export default function ReportsPage() {
  // Dummy reports data
  const reports = [
    {
      id: '1',
      title: 'Test Results - June 2025',
      description: 'Summary report of test results for June 2025',
      createdBy: 'Admin',
      createdAt: '2025-06-14T10:30:00Z',
      type: 'test',
    },
    {
      id: '2',
      title: 'Active User Statistics',
      description: 'Analysis of active users in Q2 2025',
      createdBy: 'Admin',
      createdAt: '2025-06-10T08:45:00Z',
      type: 'user',
    },
    {
      id: '3',
      title: 'Learning Progress Report - Class A',
      description: 'Detailed report on learning progress of Class A students',
      createdBy: 'Tran Thi B',
      createdAt: '2025-06-05T14:15:00Z',
      type: 'performance',
    },
    {
      id: '4',
      title: 'Difficult Tests Analysis',
      description: 'Analysis of tests with the lowest success rates',
      createdBy: 'Pham Thi D',
      createdAt: '2025-06-01T11:20:00Z',
      type: 'test',
    }
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Get icon based on report type
  const getReportIcon = (type: string) => {
    switch (type) {
      case 'test':
        return (
          <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-6 h-6 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'performance':
        return (
          <svg className="w-6 h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="mt-1 text-gray-600">View and create reports about system activities</p>
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
              Create New Report
            </button>
          </div>
        </div>
        
        {/* Report filters */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white">
            All Reports
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
            Tests
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-secondary/10 text-secondary hover:bg-secondary/20">
            Users
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200">
            Learning Results
          </button>
        </div>
        
        {/* Reports list */}
        <div className="mt-6 space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col md:flex-row">
              <div className="p-5 flex items-center justify-center md:w-16 md:border-r border-gray-200">
                {getReportIcon(report.type)}
              </div>
              
              <div className="p-5 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{report.description}</p>
                <div className="mt-3 flex items-center">
                  <span className="text-xs text-gray-500">
                    Created by: {report.createdBy} | {formatDate(report.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex items-center justify-around md:justify-end md:space-x-4 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50">
                <button className="text-primary hover:text-primary-dark text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                
                <button className="text-secondary hover:text-secondary-dark text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
} 