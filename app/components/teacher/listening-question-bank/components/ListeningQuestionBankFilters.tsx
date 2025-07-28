'use client';

import FilterBar from '@/app/components/ui/FilterBar';

interface ListeningQuestionBankFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: 'all' | 'reading' | 'listening';
  setTypeFilter: (filter: 'all' | 'reading' | 'listening') => void;
  visibilityFilter: 'all' | 'my' | 'public';
  setVisibilityFilter: (filter: 'all' | 'my' | 'public') => void;
  partFilter: 'all' | '1' | '2' | '3' | '4';
  setPartFilter: (filter: 'all' | '1' | '2' | '3' | '4') => void;
  accessFilter: 'all' | 'public' | 'private';
  setAccessFilter: (filter: 'all' | 'public' | 'private') => void;
}

export default function ListeningQuestionBankFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  visibilityFilter,
  setVisibilityFilter,
  partFilter,
  setPartFilter,
  accessFilter,
  setAccessFilter,
}: ListeningQuestionBankFiltersProps) {
  const filters = [
    {
      key: 'part',
      label: 'Part',
      options: [
        { value: 'all', label: 'All Parts' },
        { value: '1', label: 'Part 1' },
        { value: '2', label: 'Part 2' },
        { value: '3', label: 'Part 3' },
        { value: '4', label: 'Part 4' }
      ],
      value: partFilter,
      onChange: setPartFilter
    },
    {
      key: 'access',
      label: 'Access Type',
      options: [
        { value: 'all', label: 'All Access Types' },
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' }
      ],
      value: accessFilter,
      onChange: setAccessFilter
    }
  ];

  return (
    <FilterBar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filters={filters}
      searchPlaceholder="Search question sets..."
    />
  );
} 