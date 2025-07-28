'use client';

import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import ResultsTable from '@/app/components/learner/results/ResultsTable';
import ResultsFilters from '@/app/components/learner/results/ResultsFilters';
import { testResults } from '@/app/lib/data/learner/results';
import { useState, useMemo } from 'react';

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Reading' | 'Listening' | 'Grammar'>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'excellent' | 'good' | 'needs-improvement'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const filteredResults = useMemo(() => {
    let filtered = testResults;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(result => result.type === typeFilter);
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
  }, [searchTerm, typeFilter, scoreFilter, dateFilter]);
  
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