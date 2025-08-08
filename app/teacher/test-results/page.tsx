'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  DocumentTextIcon, 
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import { teacherDashboardService } from '../../lib/api/teacherDashboardService';

interface TestResult {
  id: string;
  testId: string;
  userId: string;
  studentName: string;
  testName: string;
  testType: string;
  score: number;
  level: string;
  levelScore: number;
  completionRate: number;
  submittedAt: string;
  timeSpent: number;
}

export default function TeacherTestResultsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await teacherDashboardService.getTestResults(100, sortBy);
      setTestResults(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch test results';
      setError(errorMessage);
      console.error('Test results error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestResults();
  }, [sortBy]);

  // Filter and search results
  const filteredResults = testResults.filter(result => {
    const matchesSearch = 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || result.testType.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'a1': return 'bg-blue-100 text-blue-800';
      case 'a2': return 'bg-green-100 text-green-800';
      case 'b1': return 'bg-yellow-100 text-yellow-800';
      case 'b2': return 'bg-orange-100 text-orange-800';
      case 'c1': return 'bg-red-100 text-red-800';
      case 'c2': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
          <button 
            onClick={fetchTestResults}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student or test name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter by type */}
            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Test Results ({filteredResults.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="px-6 py-8 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-500">Loading test results...</span>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center">
              <div className="text-red-600">
                <p>Error loading test results</p>
                <button 
                  onClick={fetchTestResults}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
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
                        <div className={`text-sm font-medium ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.completionRate}% completed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.level && (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(result.level)}`}>
                            {result.level}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(result.timeSpent / 60)} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a 
                          href={`/teacher/test-results/${result.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No test results found</p>
              {searchTerm || filterType !== 'all' ? (
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
              ) : (
                <p className="text-sm mt-2">Test results will appear here once students complete your tests</p>
              )}
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
