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
        

        
        if (!test.id) {
          throw new Error('Test ID is missing from test object');
        }

        const testResult = await LearnerTestsService.submitTest(
          test.id,
          answers,
          timeSpent,
          'reading'
        );
        

        setResult(testResult);
      } catch (err: any) {
        console.error('Error submitting reading test:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          response: err.response
        });
        setError(err.message || 'Failed to submit test results');
      } finally {
        setIsLoading(false);
      }
    };

    if (test && answers) {
      submitTestAndGetResult();
    }
  }, [test, answers, timeSpent]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const renderQuestionDetail = (questionDetail: any, index: number) => {
    const { userAnswer, correctAnswer, isCorrect, text, options, part } = questionDetail;
    
    // Skip section 0 (example) for Reading Part 4
    if (part === 4 && text.includes('Section 0')) {
      return null;
    }
    
    return (
      <div key={`question-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {part === 4 ? `Section ${questionDetail.id.split('-').pop()}` : `Question ${index + 1}`}
              </h3>
              {part && <p className="text-sm text-gray-600">Reading Part {part}</p>}
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={isCorrect ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </Badge>
        </div>

        {/* Only show text description for non-Part 4 questions */}
        {part !== 4 && (
          <div className="mb-4">
            <p className="text-gray-900 leading-relaxed">{text}</p>
          </div>
        )}

        {/* Special handling for Reading Part 4 */}
        {part === 4 ? (
          <div className="space-y-3">
            {/* Show correct heading */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Correct Heading:</h4>
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">
                  {correctAnswer}. {options[correctAnswer] || correctAnswer}
                </span>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  Correct Answer
                </Badge>
              </div>
            </div>
            
            {/* Show user's answer if different from correct */}
            {userAnswer && userAnswer !== correctAnswer && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Your Answer:</h4>
                <div className="flex items-center justify-between">
                  <span className="text-red-800 font-medium">
                    {userAnswer}. {options[userAnswer] || userAnswer}
                  </span>
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    Your Answer
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Regular question display for other parts */
          <div className="space-y-2">
            {typeof options === 'object' && !Array.isArray(options) && Object.entries(options).map(([key, value]) => {
              const isUserAnswer = key === userAnswer;
              const isCorrectAnswer = key === correctAnswer;
              
              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border transition-colors ${
                    isCorrectAnswer
                      ? 'bg-green-50 border-green-200'
                      : isUserAnswer && !isCorrect
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{key}.</span>
                    <span>{value as string}</span>
                    <div className="flex items-center space-x-2">
                      {isCorrectAnswer && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                          Correct
                        </Badge>
                      )}
                      {isUserAnswer && !isCorrect && (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                          Your Answer
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
            <TestResultDisplay result={result} />
          </div>

          {/* Question Review */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Question Review</h2>
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  {showReview ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {showReview && (
                <div className="space-y-6">
                  {result.questionDetails
                    ?.filter((questionDetail: any) => {
                      // Filter out section 0 for Reading Part 4
                      if (questionDetail.part === 4 && questionDetail.text.includes('Section 0')) {
                        return false;
                      }
                      return true;
                    })
                    .map((questionDetail, index) => 
                      renderQuestionDetail(questionDetail, index)
                    )}
                </div>
              )}
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Reading Skills</h3>
                  </div>
                  <p className="text-blue-800 text-sm">
                    Your reading comprehension shows {result.accuracy >= 70 ? 'strong' : 'developing'} understanding of text structures and main ideas.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Next Steps</h3>
                  </div>
                  <p className="text-green-800 text-sm">
                    {result.accuracy >= 80 
                      ? 'Excellent work! Try more advanced reading materials.'
                      : 'Focus on reading strategies and vocabulary building.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerReadingTestResult;