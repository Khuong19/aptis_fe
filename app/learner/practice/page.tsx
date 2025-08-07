'use client';

import { useState, useEffect, useCallback } from 'react';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import TestCard from '@/app/components/learner/practice/TestCard';
import TestFilters from '@/app/components/learner/practice/TestFilters';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';
import { LearnerTest } from '@/app/types';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Practice() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [tests, setTests] = useState<LearnerTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'createdAt'>('title');

  // Fetch tests from API
  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await LearnerTestsService.getAvailableTests();
      
      // ✅ Simplified: Backend always returns { data: tests[] }
      let availableTests: LearnerTest[] = [];
      
      if (response && typeof response === 'object' && 'data' in response) {
        availableTests = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        availableTests = response;
      } else {
        console.warn('Unexpected response format:', response);
        availableTests = [];
      }
      
      setTests(availableTests);
      
      if (availableTests.length === 0) {
        console.log('No tests found, showing message');
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tests';
      toast.error(errorMessage);
      setTests([]); // Ensure tests is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTests();
  }, [fetchTests]);
  
  // ✅ Refresh data when page becomes visible (user returns from another tab/page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchTests();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchTests]);
  
  // ✅ Auto-refresh every 5 minutes to pick up new tests
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTests();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchTests]);
  
  // Ensure tests is an array before filtering
  const testsArray = Array.isArray(tests) ? tests : [];
  
    const filteredAndSortedTests = testsArray
    .filter(test => {
      // Only show tests with status "Published" (from API response)
      const isPublished = test.status === 'Published';
      
      // Search filter
      const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter - compare with lowercase
      const matchesType = selectedType ? test.type?.toLowerCase() === selectedType.toLowerCase() : true;
      
      return isPublished && matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          // Use string comparison instead of Date objects to avoid hydration issues
          const dateA = a.lastAttempt || '';
          const dateB = b.lastAttempt || '';
          return dateB.localeCompare(dateA);
        default:
          return a.title.localeCompare(b.title);
      }
    });
  
  return (
    <LearnerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Practice Tests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find and take practice tests to improve your APTIS skills
        </p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative max-w-md flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tests..."
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#152C61] focus:border-[#152C61]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'duration' | 'createdAt')}
            className="rounded-md border border-gray-300 py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#152C61] focus:border-[#152C61]"
          >
            <option value="title">Title</option>
            <option value="createdAt">Recently Added</option>
          </select>
        </div>
      </div>
      
      <TestFilters 
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedTests.length > 0 ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedTests.length} test{filteredAndSortedTests.length !== 1 ? 's' : ''} out of {tests.length} total
            </p>
            <button
              onClick={fetchTests}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tests.length === 0 ? 'No tests available' : 'No tests found'}
          </h3>
          <p className="text-gray-500 mb-4">
            {tests.length === 0 
              ? 'No published tests are currently available. Please check back later.'
              : 'No tests match your current search or filters. Try adjusting your criteria.'
            }
          </p>
          {tests.length === 0 && (
            <button
              onClick={fetchTests}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh Tests'}
            </button>
          )}
        </div>
      )}
    </LearnerLayout>
  );
} 