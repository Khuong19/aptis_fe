import { TestResult } from '@/app/types';
import Link from 'next/link';
import { Clock, CheckCircle, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import ClientOnly from '@/app/components/ui/ClientOnly';
import { formatDate } from '@/app/lib/utils/dateUtils';

interface RecentResultsProps {
  results: TestResult[];
}

export default function RecentResults({ results }: RecentResultsProps) {
  const recentResults = results.slice(0, 5); // Show only 5 most recent results

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp size={16} className="text-green-600" />;
    if (score >= 60) return <TrendingUp size={16} className="text-yellow-600" />;
    return <TrendingDown size={16} className="text-red-600" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Reading':
        return 'bg-blue-100 text-blue-800';
      case 'Listening':
        return 'bg-purple-100 text-purple-800';
      case 'Grammar':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your latest test performance and progress
        </p>
      </div>
      
      {recentResults.length > 0 ? (
        <>
          <div className="divide-y divide-gray-200">
            {recentResults.map((result) => (
              <div key={result.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-md font-medium text-gray-900 truncate">
                        {result.testTitle}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getScoreColor(result.score)}`}>
                          {getScoreIcon(result.score)}
                          <span className="ml-1">{result.score}%</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mb-2">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{result.timeSpent} min</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        <span>{result.correctAnswers}/{result.totalQuestions} correct</span>
                      </div>
                    </div>
                    
                    <ClientOnly fallback={<span className="text-xs text-gray-400">Loading...</span>}>
                      <p className="text-xs text-gray-500">
                        Completed: {formatDate(result.dateTaken)}
                      </p>
                    </ClientOnly>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link 
                      href={`/learner/results/${result.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <Link 
              href="/learner/results"
              className="inline-flex justify-center w-full items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
            >
              View All Results
            </Link>
          </div>
        </>
      ) : (
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-500 mb-6">
            Start taking practice tests to see your results and track your progress.
          </p>
          <Link 
            href="/learner/practice"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#152C61] hover:bg-[#0f1f45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
          >
            Start Practice Test
          </Link>
        </div>
      )}
    </div>
  );
} 