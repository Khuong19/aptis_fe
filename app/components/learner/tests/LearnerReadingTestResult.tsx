import React, { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/basic';
import { CheckCircle, XCircle, Clock, Award, BarChart3, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';
import TestResultDisplay from './TestResultDisplay';

interface TestResult {
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: Record<string, string>;
  correctAnswersMap: Record<string, string>;
  questionDetails: any[];
  submittedAt: string;
  accuracy: number;
  levelScore?: number;
  level?: string;
  testType?: 'reading' | 'listening';
}

interface LearnerReadingTestResultProps {
  test: any;
  answers: Record<string, string>;
  timeSpent: number;
  onRetake?: () => void;
  onBackToTests?: () => void;
}

const LearnerReadingTestResult: React.FC<LearnerReadingTestResultProps> = ({
  test,
  answers,
  timeSpent,
  onRetake,
  onBackToTests,
}) => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const submitTestAndGetResult = async () => {
      try {
        setIsLoading(true);
        
        const resultData = await LearnerTestsService.submitTest(
          test.id,
          answers,
          timeSpent,
          'reading'
        );
        
        setResult(resultData);
      } catch (err) {
        console.error('Error submitting test:', err);
        setError('Failed to submit test. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    submitTestAndGetResult();
  }, [test.id, answers, timeSpent]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestionReview = (question: any, userAnswer: string, correctAnswer: string) => {
    const isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase();
    
    return (
      <div key={question.id} className="border rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900">{question.text}</h4>
          <div className="flex items-center space-x-2">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <Badge variant={isCorrect ? "default" : "destructive"}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Your Answer:</span>
            <span className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {userAnswer || 'No answer'}
            </span>
          </div>
          
          {!isCorrect && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Correct Answer:</span>
              <span className="text-sm text-green-600">{correctAnswer}</span>
            </div>
          )}

          {question.options && (
            <div className="mt-3">
              <span className="text-sm font-medium text-gray-700">Options:</span>
              <div className="mt-1 space-y-1">
                {Object.entries(question.options).map(([key, value]) => (
                  <div key={key} className="text-sm text-gray-600">
                    <span className="font-medium">{key}:</span> {value as string}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your test results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No results available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reading Test Results</h1>
                <p className="text-gray-600">{test.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToTests}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back to Tests
              </button>
              {onRetake && (
                <button
                  onClick={onRetake}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Retake Test
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Summary */}
          <div className="lg:col-span-1">
            <TestResultDisplay 
              result={{
                testId: result.testId,
                testTitle: result.testTitle,
                score: result.score,
                totalQuestions: result.totalQuestions,
                correctAnswers: result.correctAnswers,
                timeSpent: result.timeSpent,
                accuracy: result.accuracy,
                levelScore: result.levelScore,
                level: result.level,
                testType: 'reading'
              }}
            />
          </div>

          {/* Detailed Review */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Question Review</h3>
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showReview ? 'Hide Review' : 'Show Review'}
                </button>
              </div>
              
              {showReview && (
                <div className="space-y-4">
                  {result.questionDetails?.map((question: any) => {
                    const userAnswer = answers[question.id] || '';
                    const correctAnswer = result.correctAnswersMap[question.id] || '';
                    return renderQuestionReview(question, userAnswer, correctAnswer);
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerReadingTestResult;
