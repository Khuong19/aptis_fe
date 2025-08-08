'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import LearnerTestView from '@/app/components/learner/tests/LearnerTestView';
import LearnerReadingTestResult from '@/app/components/learner/tests/LearnerReadingTestResult';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';

export default function TakeTestPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testTimeSpent, setTestTimeSpent] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await LearnerTestsService.getTestById(id);
        setTest(data.data);
      } catch (error) {
        console.error('Failed to fetch test:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleTestComplete = (answers: Record<string, string>, timeSpent: number) => {
    console.log('Test completed!');
    console.log('Answers:', answers);
    console.log('Time spent:', timeSpent, 'seconds');
    
    setTestAnswers(answers);
    setTestTimeSpent(timeSpent);
    setIsTestComplete(true);
  };

  const handleRetake = () => {
    setIsTestComplete(false);
    setTestAnswers({});
    setTestTimeSpent(0);
  };

  const handleBackToTests = () => {
    router.push('/learner/practice');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#152C61] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Not Found</h2>
          <p className="text-gray-600 mb-6">The test you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/learner/practice')}
            className="px-6 py-2 bg-[#152C61] text-white rounded-lg hover:bg-[#0f1f45]"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  if (isTestComplete) {
    return (
      <LearnerReadingTestResult
        test={test}
        answers={testAnswers}
        timeSpent={testTimeSpent}
        onRetake={handleRetake}
        onBackToTests={handleBackToTests}
      />
    );
  }

  return (
    <LearnerTestView 
      test={test} 
      onTestComplete={handleTestComplete}
    />
  );
}