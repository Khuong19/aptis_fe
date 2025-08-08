'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LearnerTestView from '@/app/components/learner/tests/LearnerTestView';
import LearnerReadingTestResult from '@/app/components/learner/tests/LearnerReadingTestResult';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';

export default function TestReadingComponent() {
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testTimeSpent, setTestTimeSpent] = useState(0);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const fetchTest = async () => {
    try {
      setIsLoading(true);
      const tests = await LearnerTestsService.getAvailableTests();
      const foundTest = tests.find((t: any) => t.id === id);
      
      if (foundTest) {
        setTest(foundTest);
      } else {
        console.error(`Test with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestComplete = (answers: Record<string, string>, timeSpent: number) => {
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

  // Load test data
  useEffect(() => {
    fetchTest();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
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
