'use client';

import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import TestLibraryManager from '../../components/admin/tests/TestLibraryManager';
import { dummyTests } from '../../lib/data/tests';

export default function TestsPage() {
  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Test Management</h1>
            <p className="mt-1 text-gray-600">Publish and manage tests</p>
          </div>
        </div>
        
        <div className="mt-6">
          <TestLibraryManager tests={dummyTests} />
        </div>
      </div>
    </AdminLayout>
  );
} 