'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import LearnerTestView from '@/app/components/learner/tests/LearnerTestView';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';

export default function TakeTestPage() {
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
        const data = await LearnerTestsService.getTestById(id);
        setTest(data);
      } catch (error) {
        console.error('Failed to fetch test:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleTestComplete = async (answers: Record<string, string>, timeSpent: number) => {
    try {
      // Calculate score based on answers
      const totalQuestions = Object.keys(answers).length;
      const correctAnswers = Object.entries(answers).filter(([key, value]) => {
        // This is a simplified scoring logic - you'll need to implement proper scoring
        return value && value.trim() !== '';
      }).length;
      
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      // Create test result
      const testResult = {
        id: `result-${Date.now()}`, // Generate temporary ID
        testId: test.id,
        testTitle: test.title,
        type: test.type,
        score,
        dateTaken: new Date().toISOString(),
        timeSpent: Math.floor(timeSpent / 60), // Convert to minutes
        correctAnswers,
        totalQuestions
      };

      // Save the result to backend
      await LearnerTestsService.saveTestResult(testResult);
      
      // Redirect to results page
      router.push('/learner/results');
    } catch (error) {
      console.error('Failed to save test result:', error);
      // Still redirect even if save fails
      router.push('/learner/results');
    }
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

  return (
    <LearnerTestView 
      test={test} 
      onTestComplete={handleTestComplete}
    />
  );
}