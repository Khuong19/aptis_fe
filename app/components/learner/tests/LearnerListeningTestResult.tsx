import React, { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/basic';
import { CheckCircle, XCircle, Clock, Award, BarChart3, Headphones } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LearnerTestsService } from '@/app/lib/api/learnerTestsService';

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
}

interface LearnerListeningTestResultProps {
  test: any;
  answers: Record<string, string>;
  timeSpent: number;
  onRetake?: () => void;
  onBackToTests?: () => void;
}

const LearnerListeningTestResult: React.FC<LearnerListeningTestResultProps> = ({
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
          'listening'
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

  const getScorePercentage = () => {
    if (!result) return 0;
    return Math.round((result.score / result.totalQuestions) * 100);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const renderQuestionReview = (question: any, userAnswer: string, correctAnswer: string) => {
    const isCorrect = userAnswer === correctAnswer;
    
    return (
      <div key={question.id} className="border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">{question.text}</h4>
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        
        <div className="space-y-2">
          {Object.entries(question.options || {}).map(([key, value]) => (
            <div
              key={key}
              className={`p-2 rounded border ${
                key === correctAnswer
                  ? 'bg-green-50 border-green-200'
                  : key === userAnswer && !isCorrect
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{key}.</span>
                <span>{value as string}</span>
                <div className="flex items-center space-x-2">
                  {key === correctAnswer && (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Correct
                    </Badge>
                  )}
                  {key === userAnswer && !isCorrect && (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                      Your Answer
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
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

  const scorePercentage = getScorePercentage();
  const scoreColor = getScoreColor(scorePercentage);
  const scoreLevel = getScoreLevel(scorePercentage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Headphones className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Listening Test Results</h1>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${scoreColor} mb-4`}>
                  <Award className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{scorePercentage}%</h2>
                <p className="text-lg font-medium text-gray-600 mb-1">{scoreLevel}</p>
                <p className="text-sm text-gray-500">
                  {result.correctAnswers} out of {result.totalQuestions} correct
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Score</span>
                  </div>
                  <span className="font-semibold">{result.score}/{result.totalQuestions}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Time Spent</span>
                  </div>
                  <span className="font-semibold">{formatTime(result.timeSpent)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Headphones className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Test Type</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    Listening
                  </Badge>
                </div>
              </div>


            </div>
          </div>

          {/* Detailed Review */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h3>
              
              <div className="space-y-4">
                {result.questionDetails?.map((question: any) => {
                  const userAnswer = answers[question.id] || '';
                  const correctAnswer = result.correctAnswersMap[question.id] || '';
                  return renderQuestionReview(question, userAnswer, correctAnswer);
                })}
              </div>

              {(!result.questionDetails || result.questionDetails.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No detailed review available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                </div>
                <p className="text-sm text-blue-700">Accuracy Rate</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {result.correctAnswers}
                </div>
                <p className="text-sm text-green-700">Correct Answers</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {formatTime(result.timeSpent)}
                </div>
                <p className="text-sm text-purple-700">Average Time per Question</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerListeningTestResult; 