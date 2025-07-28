'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import TestCreationForm from '@/app/components/teacher/tests/TestCreationForm';
import { TestsService } from '@/app/lib/api/testsService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { showToast } from '@/app/components/ui/ToastContainer';

export default function EditTestPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [testData, setTestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await TestsService.getTestById(id);
        setTestData(data);
      } catch (error) {
        console.error('Failed to fetch test:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleSuccess = (updated: any) => {
    router.push('/teacher/tests');
    showToast('Test updated successfully', 'success');
  };

  if (isLoading || !testData) {
    return (
      <TeacherLayout>
        <div className="p-6 text-center text-gray-500">Loading...</div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="mb-6">
        <div className="flex items-center">
          <Link href="/teacher/tests" className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Test</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <TestCreationForm onSuccess={handleSuccess} initialData={testData} isEdit />
      </div>
    </TeacherLayout>
  );
} 