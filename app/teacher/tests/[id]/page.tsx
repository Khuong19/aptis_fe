'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import TestView from '@/app/components/teacher/tests/TestView';
import TeacherListeningTestView from '@/app/components/teacher/tests/TeacherListeningTestView';
import { TestsService } from '@/app/lib/api/testsService';

export default function ViewTestPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await TestsService.getTestById(id);
        setTest(data);
      } catch (error) {
        console.error('Failed to fetch test:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="p-6 text-center text-gray-500">Loading test...</div>
      </TeacherLayout>
    );
  }

  if (!test) {
    return (
      <TeacherLayout>
        <div className="p-6 text-center text-gray-500">Test not found</div>
      </TeacherLayout>
    );
  }

  // Render different components based on test type
  const renderTestView = () => {
    if (test.type === 'listening') {
      return <TeacherListeningTestView test={test} />;
    } else {
      return <TestView test={test} />;
    }
  };

  return (
    <TeacherLayout>
      {renderTestView()}
    </TeacherLayout>
  );
} 