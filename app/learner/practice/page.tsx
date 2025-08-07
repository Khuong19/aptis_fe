'use client';

import { useState, useEffect } from 'react';
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
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await LearnerTestsService.getAvailableTests();
        
        // Handle different response structures
        let availableTests: LearnerTest[] = [];
        
        if (Array.isArray(response)) {
          // If response is already an array
          availableTests = response;
        } else if (response && typeof response === 'object') {
          // If response is an object with a tests property or similar
          // Use type assertion to tell TypeScript this is a record with potential string keys
          const responseObj = response as Record<string, unknown>;
          
          if (responseObj.tests && Array.isArray(responseObj.tests)) {
            availableTests = responseObj.tests as LearnerTest[];
          } else if (responseObj.data && Array.isArray(responseObj.data)) {
            availableTests = responseObj.data as LearnerTest[];
          } else {
            // Try to extract any array property from the response
            const arrayProps = Object.values(responseObj).find(val => Array.isArray(val));
            if (arrayProps) {
              availableTests = arrayProps as LearnerTest[];
            }
          }
        }
        
        setTests(availableTests);
        if (availableTests.length === 0) {
          toast.error('No tests available at the moment');
        }
      } catch (err) {
        console.error('Error fetching tests:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load tests';
        toast.error(errorMessage);
        setTests([]); // Ensure tests is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);
  
  // Ensure tests is an array before filtering
  const testsArray = Array.isArray(tests) ? tests : [];
  
    const filteredAndSortedTests = testsArray
    .filter(test => {
      // Only show tests with status "Published" (from API response)
      const isPublic = test.status === 'Published';
      
      // Search filter
      const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter - compare with lowercase
      const matchesType = selectedType ? test.type?.toLowerCase() === selectedType.toLowerCase() : true;
      
      return isPublic && matchesSearch && matchesType;
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
              Showing {filteredAndSortedTests.length} test{filteredAndSortedTests.length !== 1 ? 's' : ''}
            </p>
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
          <p className="text-gray-500">
            {tests.length === 0 
              ? 'No published tests are currently available. Please check back later.'
              : 'No tests match your current search or filters. Try adjusting your criteria.'
            }
          </p>
        </div>
      )}
    </LearnerLayout>
  );
} 