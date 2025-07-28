import { LearnerProfile } from '@/app/types';
import { CheckCircle, TrendingUp, Award } from 'lucide-react';

interface StatsSummaryProps {
  profile: LearnerProfile;
  totalResults: number;
  averageScore?: number;
}

export default function StatsSummary({ profile, totalResults, averageScore = 0 }: StatsSummaryProps) {
  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Tests Completed</p>
          <h3 className="text-2xl font-semibold text-gray-900">{totalResults}</h3>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Average Score</p>
          <h3 className={`text-2xl font-semibold ${getScoreColor(averageScore)}`}>
            {averageScore > 0 ? `${averageScore}%` : 'N/A'}
          </h3>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
          <Award size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Performance Level</p>
          <h3 className={`text-2xl font-semibold ${getScoreColor(averageScore)}`}>
            {averageScore > 0 ? getScoreLevel(averageScore) : 'N/A'}
          </h3>
        </div>
      </div>
    </div>
  );
} 