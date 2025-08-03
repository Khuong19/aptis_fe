'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusCircleIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import TestFilters from '@/app/components/teacher/tests/TestFilters';
import { TestsService } from '@/app/lib/api/testsService';
import { showToast } from '@/app/components/ui/ToastContainer';

interface TestItem {
  id: string;
  title: string;
  description?: string;
  questionSets: any[];
  totalQuestions: number;
  createdAt: string;
  status: 'Draft' | 'Published' | 'Public' | 'Archived';
  duration?: number; // optional until we store it
  type?: string; // reading/listening; derive later
}

// Fetch tests from API

export default function TestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'reading' | 'listening'>('all');
  const [tests, setTests] = useState<TestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const data = await TestsService.getTeacherTests();
        console.log('Raw API response:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Data keys:', Object.keys(data || {}));
        // Map to ensure required fields exist
        const mapped: TestItem[] = data
          .filter((t: any) => t.id && String(t.id).trim() !== '')
          .map((t: any) => {
            // console.log('Processing test item:', t);
            return {
            id: t.id,
            title: t.title,
            description: t.description,
            questionSets: t.questionSets || [],
            totalQuestions: t.totalQuestions || (t.questionSets ? t.questionSets.reduce((sum: number, qs: any) => sum + (qs.questions?.length || 0), 0) : 0),
            createdAt: t.createdAt,
            status: t.status || 'Draft',
            duration: t.duration,
            type: t.type || (t.questionSets && t.questionSets[0]?.type) || 'reading',
          };
          });
        console.log('Mapped tests:', mapped);
        console.log('Filtered tests count:', mapped.length);
        setTests(mapped);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
        setTests([]); // Ensure empty state on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'Published' && (test.status === 'Public' || test.status === 'Published')) ||
      (statusFilter === 'Draft' && test.status === 'Draft');
    const matchesType = typeFilter === 'all' || test.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
 
  console.log('Total tests in state:', tests.length);
  console.log('Search term:', searchTerm);
  console.log('Status filter:', statusFilter);
  console.log('Filtered tests:', filteredTests.length);
 
  // Tạm thời bỏ filter để kiểm tra
  // const filteredTests = tests;
 
  const handleToggleStatus = async (test: TestItem) => {
    const newStatus: 'Draft' | 'Published' = test.status === 'Draft' ? 'Published' : 'Draft';
    try {
      const updated = await TestsService.updateTest(test.id, { status: newStatus });
      // Update local state
      setTests(prev => prev.map(t => t.id === test.id ? { ...t, status: updated.status || newStatus } : t));
      showToast(`Test ${newStatus === 'Published' ? 'published' : 'unpublished'} successfully`, 'success');
    } catch (error) {
      console.error('Failed to update test status:', error);
      showToast('Failed to update test status', 'error');
    }
  };

  const handleDeleteTest = async (test: TestItem) => {
    if (!confirm(`Are you sure you want to delete "${test.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await TestsService.deleteTest(test.id);
      // Remove from local state
      setTests(prev => prev.filter(t => t.id !== test.id));
      showToast('Test deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete test:', error);
      showToast('Failed to delete test', 'error');
    }
  };

  return (
    <TeacherLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Test Library</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link 
            href="/teacher/tests/create?type=reading"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            <BookOpenIcon className="h-5 w-5 mr-2" />
            Create Reading Test
          </Link>
          <Link 
            href="/teacher/tests/create?type=listening"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
          >
            <SpeakerWaveIcon className="h-5 w-5 mr-2" />
            Create Listening Test
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <TestFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Tests List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading && (
          <div className="p-6 text-center text-gray-500">Loading tests...</div>
        )}
        {!isLoading && (
          filteredTests.map((test) => {
            console.log('Rendering individual test:', test.id, test.title);
            return (
          <div key={test.id} className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {test.title}
                  </h2>
                  <span
                    className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      test.status === 'Public' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {test.status === 'Public' ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    {test.type === 'listening' ? (
                      <SpeakerWaveIcon className="h-4 w-4 mr-1.5 text-purple-600" />
                    ) : (
                      <BookOpenIcon className="h-4 w-4 mr-1.5 text-blue-600" />
                    )}
                    <span className="capitalize">{test.type}</span>
                  </span>
                  <span>{test.totalQuestions} questions</span>
                  <span>{test.duration ? Math.floor(test.duration / 60) : 35} min</span>
                  <span>{new Date(test.createdAt).toLocaleDateString('en-US')}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Link
                  href={`/teacher/tests/${encodeURIComponent(test.id)}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
                >
                  View
                </Link>
                <Link
                  href={`/teacher/tests/edit/${encodeURIComponent(test.id)}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleToggleStatus(test)}
                  className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61] disabled:opacity-50 disabled:cursor-not-allowed ${
                    test.status === 'Draft'
                      ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                      : 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  {test.status === 'Draft' ? 'Publish' : 'Unpublish'}
                </button>
                {(test.status === 'Draft' || test.status === 'Archived') && (
                  <button
                    onClick={() => handleDeleteTest(test)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
            );
          })
        )}
        
        {!isLoading && filteredTests.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No tests found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </TeacherLayout>
  );
} 