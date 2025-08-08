'use client';

import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';

export default function UsersPage() {
  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="mt-1 text-gray-600">Manage, search, and sort user lists</p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6 text-center text-gray-500">
          no data available
        </div>
      </div>
    </AdminLayout>
  );
} 