import { TestResult } from '@/app/types';
import Link from 'next/link';
import { Eye, FileText } from 'lucide-react';

interface ResultsTableProps {
  results: TestResult[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Taken
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{result.testTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.type === 'Reading' 
                        ? 'bg-blue-100 text-blue-800' 
                        : result.type === 'Listening'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {result.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.dateTaken).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            result.score >= 80 ? 'bg-green-600' : 
                            result.score >= 60 ? 'bg-yellow-500' : 
                            'bg-red-600'
                          }`}
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        result.score >= 80 ? 'text-green-600' : 
                        result.score >= 60 ? 'text-yellow-500' : 
                        'text-red-600'
                      }`}>
                        {result.score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/learner/results/${result.id}`}
                      className="text-[#152C61] hover:text-[#0f1f45] flex items-center justify-end"
                    >
                      <Eye size={16} className="mr-1" />
                      <span>View Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or filters to find what you're looking for.
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