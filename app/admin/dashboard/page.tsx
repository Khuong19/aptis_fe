'use client';

import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';

// This doesn't work in client components, moved to layout
// export const metadata: Metadata = {
//   title: 'Dashboard | Admin',
//   description: 'Admin dashboard for APTIS Learning Platform',
// };

export default function Dashboard() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-6 bg-white rounded-lg shadow p-6 text-center text-gray-500">
          no data available
        </div>
      </div>
    </AdminLayout>
  );
}