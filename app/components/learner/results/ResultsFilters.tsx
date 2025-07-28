'use client';

import FilterBar from '@/app/components/ui/FilterBar';

interface ResultsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: 'all' | 'Reading' | 'Listening' | 'Grammar';
  setTypeFilter: (value: 'all' | 'Reading' | 'Listening' | 'Grammar') => void;
  scoreFilter: 'all' | 'excellent' | 'good' | 'needs-improvement';
  setScoreFilter: (value: 'all' | 'excellent' | 'good' | 'needs-improvement') => void;
  dateFilter: 'all' | 'today' | 'week' | 'month';
  setDateFilter: (value: 'all' | 'today' | 'week' | 'month') => void;
  totalResults: number;
  filteredCount: number;
}

const ResultsFilters = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  scoreFilter,
  setScoreFilter,
  dateFilter,
  setDateFilter,
  totalResults,
  filteredCount
}: ResultsFiltersProps) => {
  const filters = [
    {
      key: 'type',
      label: 'Test Type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'Reading', label: 'Reading' },
        { value: 'Listening', label: 'Listening' },
        { value: 'Grammar', label: 'Grammar' }
      ],
      value: typeFilter,
      onChange: setTypeFilter
    },
    {
      key: 'score',
      label: 'Score Range',
      options: [
        { value: 'all', label: 'All Scores' },
        { value: 'excellent', label: 'Excellent (80%+)' },
        { value: 'good', label: 'Good (60-79%)' },
        { value: 'needs-improvement', label: 'Needs Improvement (<60%)' }
      ],
      value: scoreFilter,
      onChange: setScoreFilter
    },
    {
      key: 'date',
      label: 'Date Range',
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
      ],
      value: dateFilter,
      onChange: setDateFilter
    }
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        searchPlaceholder="Search test results..."
      />
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredCount} of {totalResults} results
          {filteredCount !== totalResults && (
            <span className="ml-2 text-gray-500">
              (filtered)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ResultsFilters; 