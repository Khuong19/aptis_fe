'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import TestCreationForm from '@/app/components/teacher/tests/TestCreationForm';
import ListeningTestCreationForm from '@/app/components/teacher/tests/ListeningTestCreationForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function CreateTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const testType = searchParams.get('type') || 'reading';

  const handleTestCreationSuccess = (testData: any) => {
    router.push('/teacher/tests');
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/teacher/tests" 
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New {testType === 'listening' ? 'Listening' : 'Reading'} Test
            </h1>
          </div>
        </div>
        <p className="mt-2 text-gray-600">
          Create a new {testType === 'listening' ? 'listening' : 'reading'} test by selecting question sets from the question bank.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {testType === 'listening' ? (
          <ListeningTestCreationForm onSuccess={handleTestCreationSuccess} />
        ) : (
          <TestCreationForm onSuccess={handleTestCreationSuccess} />
        )}
      </div>
    </>
  );
}

export default function CreateTestPage() {
  return (
    <TeacherLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <CreateTestContent />
      </Suspense>
    </TeacherLayout>
  );
}
