'use client';

import FilterBar from '@/app/components/ui/FilterBar';

interface TestFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: 'all' | 'reading' | 'listening';
  setTypeFilter: (value: 'all' | 'reading' | 'listening') => void;
  statusFilter: 'all' | 'Published' | 'Draft';
  setStatusFilter: (value: 'all' | 'Published' | 'Draft') => void;
}

const TestFilters = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter
}: TestFiltersProps) => {
  const filters = [
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'reading', label: 'Reading' },
        { value: 'listening', label: 'Listening' }
      ],
      value: typeFilter,
      onChange: setTypeFilter
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'Published', label: 'Published' },
        { value: 'Draft', label: 'Draft' }
      ],
      value: statusFilter,
      onChange: setStatusFilter
    }
  ];

  return (
    <FilterBar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filters={filters}
      searchPlaceholder="Search tests..."
    />
  );
};

export default TestFilters; 