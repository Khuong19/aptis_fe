'use client';

import FilterBar from '@/app/components/ui/FilterBar';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: 'all' | 'student' | 'teacher';
  setRoleFilter: (value: 'all' | 'student' | 'teacher') => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (value: 'all' | 'active' | 'inactive') => void;
  dateFilter: 'all' | 'today' | 'week' | 'month';
  setDateFilter: (value: 'all' | 'today' | 'week' | 'month') => void;
  totalUsers: number;
  filteredCount: number;
}

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  totalUsers,
  filteredCount
}: UserFiltersProps) => {
  const filters = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'all', label: 'All Roles' },
        { value: 'student', label: 'Students' },
        { value: 'teacher', label: 'Teachers' }
      ],
      value: roleFilter,
      onChange: setRoleFilter
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      value: statusFilter,
      onChange: setStatusFilter
    },
    {
      key: 'date',
      label: 'Join Date',
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
        searchPlaceholder="Search users by name or email..."
      />
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredCount} of {totalUsers} users
          {filteredCount !== totalUsers && (
            <span className="ml-2 text-gray-500">
              (filtered)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default UserFilters; 