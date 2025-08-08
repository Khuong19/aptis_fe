'use client';

import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import ResultsTable from '@/app/components/learner/results/ResultsTable';
import ResultsFilters from '@/app/components/learner/results/ResultsFilters';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';
import { useState, useMemo, useEffect } from 'react';
import { TestResult } from '@/app/types';

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'reading' | 'listening'>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'excellent' | 'good' | 'needs-improvement'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        console.log('Starting to fetch test results...');
        
        const response = await LearnerTestsService.getTestResults();
        console.log('Raw response:', response);
        
        // Handle response format - backend returns { data: results[] }
        const results = response.data || response;
        console.log('Extracted results:', results);
        
        // Transform the data to match frontend expectations
        // Handle empty results
        if (!Array.isArray(results) || results.length === 0) {
          console.log('No test results found');
          setTestResults([]);
          return;
        }
        
        const transformedResults: TestResult[] = results.map((result: any) => ({
          id: result.id,
          testId: result.testId,
          testTitle: result.testTitle || result.title || 'Unnamed Test',
          type: result.testType || result.type,
          score: result.score || Math.round(result.accuracy || 0),
          accuracy: result.accuracy || 0,
          dateTaken: result.submittedAt || result.dateTaken,
          timeSpent: result.timeSpent || 0,
          correctAnswers: result.correctAnswers || 0,
          totalQuestions: result.totalQuestions || 0,
          level: result.level,
          levelScore: result.levelScore
        }));
        
        console.log('Transformed results:', transformedResults);
        setTestResults(transformedResults);
      } catch (err: any) {
        console.error('Error fetching test results:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          response: err.response
        });
        
        // Handle specific error cases
        if (err.message?.includes('Unauthorized') || err.message?.includes('not authenticated')) {
          setError('Please log in to view your test results');
        } else if (err.message?.includes('Test not found')) {
          setError('No test results found. Try taking a test first.');
        } else {
          setError(err.message || 'Failed to load test results');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);
  
  const filteredResults = useMemo(() => {
    let filtered = testResults;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(result => result.type?.toLowerCase() === typeFilter);
    }
    
    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(result => {
        switch (scoreFilter) {
          case 'excellent':
            return result.score >= 80;
          case 'good':
            return result.score >= 60 && result.score < 80;
          case 'needs-improvement':
            return result.score < 60;
          default:
            return true;
        }
      });
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getFullYear(), now.getMonth() - 1, now.getDate());
      
      filtered = filtered.filter(result => {
        const resultDate = new Date(result.dateTaken);
        switch (dateFilter) {
          case 'today':
            return resultDate >= today;
          case 'week':
            return resultDate >= weekAgo;
          case 'month':
            return resultDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [searchTerm, typeFilter, scoreFilter, dateFilter, testResults]);

  if (isLoading) {
    return (
      <LearnerLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and analyze your test results
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading your results...</span>
        </div>
      </LearnerLayout>
    );
  }

  if (error) {
    return (
      <LearnerLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and analyze your test results
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading results
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 px-2 py-1 rounded-md text-red-800 hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </LearnerLayout>
    );
  }
  
  return (
    <LearnerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and analyze your test results
        </p>
      </div>
      
      <div className="mb-6">
        <ResultsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          scoreFilter={scoreFilter}
          setScoreFilter={setScoreFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          totalResults={testResults.length}
          filteredCount={filteredResults.length}
        />
      </div>
      
      <ResultsTable results={filteredResults} />
    </LearnerLayout>
  );
} 