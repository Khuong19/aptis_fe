'use client';

import React, { useState, useMemo } from 'react';
import { Trash2, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TestStatus = 'Published' | 'Draft';

interface AdminTest {
  id: string;
  title: string;
  description: string;
  status: TestStatus;
  duration: number; // minutes
  questions: number; // total questions
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface TestLibraryManagerProps {
  tests?: AdminTest[];
  onStatusChange?: (testId: string, newStatus: TestStatus) => Promise<void>;
  onDelete?: (testId: string) => Promise<void>;
}

const TestLibraryManager: React.FC<TestLibraryManagerProps> = ({ 
  tests = [],
  onStatusChange = async () => {}, 
  onDelete = async () => {} 
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all');
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Filter tests
  const filteredTests = useMemo(() => {
    return tests.filter((test: any) => {
      // Filter by search term
      const matchesSearch = 
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        test.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };
  
  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours} hr ${remainingMinutes} min` 
        : `${hours} hr`;
    }
  };

  // Handle status change
  const handleStatusChange = async (testId: string, currentStatus: 'Published' | 'Draft') => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    
    try {
      setIsLoading(prev => ({ ...prev, [testId]: true }));
      await onStatusChange(testId, newStatus);
      // Success notification can be added here
    } catch (error) {
      console.error('Error changing status:', error);
      // Error notification can be added here
    } finally {
      setIsLoading(prev => ({ ...prev, [testId]: false }));
    }
  };

  // Handle delete
  const handleDelete = async (testId: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [testId]: true }));
      await onDelete(testId);
      setShowDeleteConfirm(null);
      // Success notification can be added here
    } catch (error) {
      console.error('Error deleting test:', error);
      // Error notification can be added here
    } finally {
      setIsLoading(prev => ({ ...prev, [testId]: false }));
    }
  };

  // Handle view test
  const handleViewTest = (testId: string) => {
    router.push(`/admin/tests/${testId}`);
  };

  // Handle edit test
  const handleEditTest = (testId: string) => {
    router.push(`/admin/tests/edit/${testId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with search and filters */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
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
              type="search"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
              ${statusFilter === 'all' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('Published')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
              ${statusFilter === 'Published' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter('Draft')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
              ${statusFilter === 'Draft' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
          >
            Draft
          </button>
        </div>
      </div>
      
      {/* Test Library List */}
      <div className="overflow-hidden overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200">
          {filteredTests.length > 0 ? (
            filteredTests.map((test: any) => (
              <div key={test.id} className="p-6 flex flex-col lg:flex-row lg:items-center border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-gray-900">{test.title}</h3>
                    <span
                      className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${test.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                        {test.status === 'Published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{test.description}</p>
                  
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDuration(test.duration)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {test.questions} questions
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created: {formatDate(test.createdAt)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Updated: {formatDate(test.updatedAt)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-0 flex lg:ml-6 space-x-3">
                  <button 
                    onClick={() => handleViewTest(test.id)}
                    className="text-primary hover:text-primary-dark px-4 py-2 border border-primary rounded-md text-sm font-medium transition-colors hover:bg-primary-50 flex items-center"
                    disabled={isLoading[test.id]}
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </button>
                  
                  <button 
                    onClick={() => handleEditTest(test.id)}
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors hover:bg-gray-50 flex items-center"
                    disabled={isLoading[test.id]}
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(test.id, test.status)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors flex items-center ${
                      test.status === 'Draft'
                        ? 'text-green-700 hover:text-green-900 border-green-300 hover:bg-green-50'
                        : 'text-amber-700 hover:text-amber-900 border-amber-300 hover:bg-amber-50'
                    }`}
                    disabled={isLoading[test.id]}
                  >
                    {isLoading[test.id] ? (
                      <span className="inline-block animate-spin mr-1">⟳</span>
                    ) : test.status === 'Draft' ? (
                      <CheckCircle size={16} className="mr-1" />
                    ) : (
                      <XCircle size={16} className="mr-1" />
                    )}
                    {test.status === 'Draft' ? 'Publish' : 'Unpublish'}
                  </button>
                  
                  {showDeleteConfirm === test.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        disabled={isLoading[test.id]}
                      >
                        {isLoading[test.id] ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(test.id)}
                      className="text-red-600 hover:text-red-900 px-4 py-2 border border-red-300 rounded-md text-sm font-medium transition-colors hover:bg-red-50 flex items-center"
                      disabled={isLoading[test.id]}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No tests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestLibraryManager; 