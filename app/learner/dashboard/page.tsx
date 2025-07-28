'use client';

import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import StatsSummary from '@/app/components/learner/dashboard/StatsSummary';
import RecentResults from '@/app/components/learner/dashboard/RecentResults';
import { learnerProfile } from '@/app/lib/data/learner/profile';
import { testResults } from '@/app/lib/data/learner/results';

export default function LearnerDashboard() {
  // Calculate average score from test results
  const averageScore = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)
    : 0;

  return (
    <LearnerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {learnerProfile.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your progress and continue your APTIS practice
        </p>
      </div>
      
      <div className="mb-8">
        <StatsSummary 
          profile={learnerProfile} 
          totalResults={testResults.length}
          averageScore={averageScore}
        />
      </div>
      
      <div className="mb-8">
        <RecentResults results={testResults} />
      </div>
    </LearnerLayout>
  );
} 