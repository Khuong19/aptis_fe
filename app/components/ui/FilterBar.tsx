'use client';

import { Input } from '@/app/components/ui/basic';
import { Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: any) => void;
}

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: FilterConfig[];
  searchPlaceholder?: string;
}

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  filters,
  searchPlaceholder = "Search..."
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[240px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-[#152C61] focus:outline-none focus:ring-1 focus:ring-[#152C61]"
          />
        </div>
      </div>
      
      {filters.map((filter) => (
        <div key={filter.key} className="w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {filter.label}
          </label>
          <select 
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-[#152C61] focus:outline-none focus:ring-1 focus:ring-[#152C61]"
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar; 