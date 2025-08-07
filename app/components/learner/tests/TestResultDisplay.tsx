import React from 'react';
import { Badge } from '@/app/components/ui/basic';
import { CheckCircle, XCircle, Clock, Award, BarChart3, BookOpen, Headphones, Star } from 'lucide-react';

interface TestResultDisplayProps {
  result: {
    testId: string;
    testTitle: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    accuracy: number;
    levelScore?: number;
    level?: string;
    testType?: 'reading' | 'listening';
  };
  showDetails?: boolean;
}

const TestResultDisplay: React.FC<TestResultDisplayProps> = ({ result, showDetails = true }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  const getAPTISLevelColor = (level?: string) => {
    switch (level) {
      case 'A1': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'A2': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'B1': return 'bg-green-100 text-green-700 border-green-300';
      case 'B2': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'C1': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTestTypeIcon = (type?: string) => {
    return type === 'listening' ? <Headphones className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />;
  };

  const getTestTypeColor = (type?: string) => {
    return type === 'listening' 
      ? 'bg-purple-100 text-purple-700 border-purple-300'
      : 'bg-blue-100 text-blue-700 border-blue-300';
  };

  const scoreColor = getScoreColor(result.score);
  const scoreLevel = getScoreLevel(result.score);
  const aptisLevelColor = getAPTISLevelColor(result.level);
  const testTypeColor = getTestTypeColor(result.testType);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${scoreColor} mb-4`}>
          <Award className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{result.score}%</h2>
        <p className="text-lg font-medium text-gray-600 mb-1">{scoreLevel}</p>
        <p className="text-sm text-gray-500">
          {result.correctAnswers} out of {result.totalQuestions} correct
        </p>
      </div>

      {showDetails && (
        <div className="space-y-3">
          {/* Score */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Score</span>
            </div>
            <span className="font-semibold">{result.correctAnswers}/{result.totalQuestions}</span>
          </div>

          {/* Time Spent */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Time Spent</span>
            </div>
            <span className="font-semibold">{formatTime(result.timeSpent)}</span>
          </div>

          {/* Test Type */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getTestTypeIcon(result.testType)}
              <span className="text-gray-700">Test Type</span>
            </div>
            <Badge variant="outline" className={testTypeColor}>
              {result.testType === 'listening' ? 'Listening' : 'Reading'}
            </Badge>
          </div>

          {/* APTIS Level Score */}
          {result.levelScore && result.level && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">APTIS Level</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={aptisLevelColor}>
                  {result.level}
                </Badge>
                <span className="font-semibold text-sm">({result.levelScore}/50)</span>
              </div>
            </div>
          )}

          {/* Accuracy */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Accuracy</span>
            </div>
            <span className="font-semibold">{result.accuracy.toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* APTIS Level Explanation */}
      {result.level && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">APTIS Level {result.level}</h3>
          <p className="text-sm text-blue-700">
            {result.level === 'A1' && 'Basic user - Can understand and use familiar everyday expressions.'}
            {result.level === 'A2' && 'Elementary user - Can communicate in simple and routine tasks.'}
            {result.level === 'B1' && 'Independent user - Can deal with most situations while travelling.'}
            {result.level === 'B2' && 'Upper intermediate user - Can interact with fluency and spontaneity.'}
            {result.level === 'C1' && 'Advanced user - Can express ideas fluently and spontaneously.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestResultDisplay;
