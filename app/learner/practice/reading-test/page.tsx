'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import LearnerTestView from '@/app/components/learner/tests/LearnerTestView';
import { TestResult } from '@/app/types';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';
import { Button } from '@/app/components/ui/basic';
import Link from 'next/link';

export default function ReadingTestPage() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const fetchReadingTests = async () => {
      try {
        setIsLoading(true);
        const allTests = await LearnerTestsService.getAvailableTests();
        // Filter only reading tests
        const readingTests = allTests.filter(test => 
          test.type === 'reading' || test.title?.toLowerCase().includes('reading')
        );
        setTests(readingTests);
      } catch (error) {
        console.error('Failed to fetch reading tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadingTests();
  }, []);

  const handleTestSelect = (testId: string) => {
    const selectedTest = tests.find(test => test.id === testId);
    
    // Log the selected test structure for debugging
    console.log('Selected test:', selectedTest);
    
    setSelectedTest(selectedTest || null);
  };

  const handleStartTest = () => {
    setIsStarted(true);
  };

  const [isCompleted, setIsCompleted] = useState(false);

  const handleTestComplete = async (answers: Record<string, string>, timeSpent: number) => {
    if (!selectedTest) return;
    
    try {
      // Create test result object
      const result: TestResult = {
        id: `result-${Date.now()}`,
        testId: selectedTest.id,
        testTitle: selectedTest.title,
        type: 'Reading',
        score: 0, // Will be calculated on the server
        dateTaken: new Date().toISOString(),
        timeSpent: timeSpent,
        correctAnswers: 0, // Will be calculated on the server
        totalQuestions: 0, // Will be calculated on the server
      };

      // Only pass the result object as per the service method signature
      await LearnerTestsService.saveTestResult(result);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  if (isStarted && selectedTest) {
    return (
      <div className="mt-8">
        <LearnerTestView 
          test={selectedTest} 
          onTestComplete={handleTestComplete} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">APTIS Reading Tests</h1>
        <Link href="/learner/practice">
          <Button variant="outline">Back to Practice</Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#152C61]"></div>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Reading Tests Available</h2>
            <p className="text-gray-600 mb-6">There are currently no reading tests available for practice.</p>
            <Link href="/learner/practice">
              <Button>Back to Practice</Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Available Reading Tests</h2>
            <p className="text-gray-700 mb-6">
              Select a reading test to practice your skills. Each test contains different parts that will help you improve your reading comprehension.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {tests.map((test) => (
                <div 
                  key={test.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTest?.id === test.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleTestSelect(test)}
                >
                  <h3 className="font-medium">{test.title}</h3>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Duration: {test.duration ? `${Math.floor(test.duration / 60)} minutes` : 'Not specified'}</span>
                    <span>Parts: {test.questionSets?.length || 'Not specified'}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button 
                disabled={!selectedTest} 
                onClick={handleStartTest}
                className={!selectedTest ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Start Test
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
