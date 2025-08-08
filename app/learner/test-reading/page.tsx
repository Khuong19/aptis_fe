'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';
import { Button } from '@/app/components/ui/basic';
import { BookOpen, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function ReadingTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReadingTests = async () => {
      try {
        setIsLoading(true);
        const allTests = await LearnerTestsService.getAvailableTests();
        // Filter only reading tests
        const readingTests = allTests.filter((test: any) => 
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

  if (isLoading) {
    return (
      <LearnerLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reading tests...</p>
          </div>
        </div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reading Tests</h1>
            <p className="mt-1 text-sm text-gray-500">
              Practice your reading comprehension skills with APTIS format tests
            </p>
          </div>
          <Link href="/learner/practice">
            <Button variant="outline">
              ← Back to Practice
            </Button>
          </Link>
        </div>

        {/* Tests Grid */}
        {tests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reading Tests Available</h3>
            <p className="text-gray-600">
              There are currently no reading tests available. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{test.title}</h3>
                      <p className="text-sm text-blue-600 font-medium">Reading Test</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{test.duration ? `${Math.floor(test.duration / 60)} minutes` : '35 minutes'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{test.questionSets?.length || test.data?.questionSets?.length || 4} parts</span>
                  </div>
                </div>

                {test.description && (
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                    {test.description}
                  </p>
                )}

                <div className="flex space-x-3">
                  <Button
                    onClick={() => router.push(`/learner/test-reading/${test.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LearnerLayout>
  );
}
