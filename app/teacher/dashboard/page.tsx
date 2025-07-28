'use client';

import React from 'react';
import { 
  UserIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import { useTeacherDashboard } from '../../hooks/useTeacherDashboard';
import TestPerformanceChart from '@/app/components/teacher/dashboard/TestPerformanceChart';

function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-200 mr-4">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
          <ExclamationTriangleIcon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-red-800">Error Loading Data</p>
          <p className="text-sm text-red-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboardPage() {
  const { statistics, loading, error, refetch } = useTeacherDashboard();

  return (
    <TeacherLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : error ? (
          <div className="col-span-full">
            <ErrorCard message={error} />
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <h3 className="text-2xl font-bold text-gray-900">{statistics?.totalStudents || 0}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Tests</p>
                  <h3 className="text-2xl font-bold text-gray-900">{statistics?.totalTests || 0}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Completion Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900">{statistics?.averageCompletion || 0}%</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                  <h3 className="text-2xl font-bold text-gray-900">{statistics?.averageScore || 0}%</h3>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Performance Analytics</h2>
        <TestPerformanceChart 
          loading={loading} 
          data={statistics?.chartData}
          testTypeData={statistics?.testTypeData}
        />
      </div>

      {/* Recent Test Results */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Test Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Loading recent test results...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="text-red-600">
                      <p>Error loading test results</p>
                      <button 
                        onClick={refetch}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : statistics?.recentTestResults && statistics.recentTestResults.length > 0 ? (
                statistics.recentTestResults.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.testName}</div>
                      <div className="text-xs text-gray-500 capitalize">{result.testType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.score}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round(result.timeSpent / 60)} min
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No recent test results available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <a href="#" className="text-[#152C61] font-medium hover:text-[#AC292D] transition-colors">
            View all results →
          </a>
        </div>
      </div>
    </TeacherLayout>
  );
} 