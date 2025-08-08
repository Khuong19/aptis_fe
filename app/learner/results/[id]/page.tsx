'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';
import { ArrowLeft, Clock, Award, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { TestResult } from '@/app/types';

export default function ResultDetail() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        const data = await LearnerTestsService.getTestResultById(params.id as string);
        setResult(data);
      } catch (err: any) {
        console.error('Error fetching result detail:', err);
        setError(err.message || 'Failed to load result details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [params.id]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <LearnerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading result details...</span>
        </div>
      </LearnerLayout>
    );
  }

  if (error || !result) {
    return (
      <LearnerLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading result
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error || 'Result not found'}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.back()}
                  className="bg-red-100 px-2 py-1 rounded-md text-red-800 hover:bg-red-200"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Results
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{result.testTitle}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Taken on {new Date(result.dateTaken).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            result.type?.toLowerCase() === 'reading' 
              ? 'bg-blue-100 text-blue-800' 
              : result.type?.toLowerCase() === 'listening'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {result.type ? result.type.charAt(0).toUpperCase() + result.type.slice(1) : 'Unknown'} Test
          </span>
        </div>
      </div>

      {/* Score Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Final Score</p>
              <p className="text-2xl font-bold text-gray-900">{result.score}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Correct Answers</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.correctAnswers} / {result.totalQuestions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(result.timeSpent)}</p>
            </div>
          </div>
        </div>

        {result.level && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">APTIS Level</p>
                <p className="text-2xl font-bold text-gray-900">{result.level}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Score Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-800">Accuracy:</span>
                <span className="text-blue-900 font-medium">
                  {result.accuracy ? `${result.accuracy.toFixed(1)}%` : `${result.score}%`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Questions Attempted:</span>
                <span className="text-blue-900 font-medium">{result.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Correct Responses:</span>
                <span className="text-blue-900 font-medium">{result.correctAnswers}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Recommendations</h3>
            <div className="text-green-800 text-sm space-y-2">
              {result.score >= 80 ? (
                <>
                  <p>🎉 Excellent performance! You're ready for advanced materials.</p>
                  <p>Consider challenging yourself with higher-level tests.</p>
                </>
              ) : result.score >= 60 ? (
                <>
                  <p>✅ Good job! You're making solid progress.</p>
                  <p>Focus on areas where you made mistakes for improvement.</p>
                </>
              ) : (
                <>
                  <p>💪 Keep practicing! Every attempt helps you improve.</p>
                  <p>Review the fundamentals and try practice exercises.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/learner/practice')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Take Another Test
        </button>
        
        <button
          onClick={() => router.push('/learner/results')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          View All Results
        </button>
      </div>
    </LearnerLayout>
  );
}
