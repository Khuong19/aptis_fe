'use client';

import React, { useState, useEffect } from 'react';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import StatsSummary from '@/app/components/learner/dashboard/StatsSummary';
import RecentResults from '@/app/components/learner/dashboard/RecentResults';
import { LearnerDashboardService, type LearnerProfile, type DashboardStats, type RecentTestResult } from '@/app/lib/api/learnerDashboardService';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LearnerDashboard() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentResults, setRecentResults] = useState<RecentTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all dashboard data
        const data = await LearnerDashboardService.getDashboardData();
        
        setProfile(data.profile);
        setStats(data.stats);
        setRecentResults(data.recentResults);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Convert RecentTestResult to TestResult format for component compatibility
  const convertedResults = recentResults.map(result => ({
    id: result.id,
    testId: result.testId,
    testTitle: result.testTitle,
    type: (result.type === 'reading' ? 'Reading' : 'Listening') as 'Reading' | 'Listening',
    score: result.score,
    accuracy: result.accuracy,
    dateTaken: result.dateTaken,
    timeSpent: result.timeSpent,
    correctAnswers: result.correctAnswers,
    totalQuestions: result.totalQuestions,
    level: result.level || '',
    levelScore: result.levelScore || 0
  }));

  if (isLoading) {
    return (
      <LearnerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </LearnerLayout>
    );
  }

  if (error) {
    return (
      <LearnerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.name || 'Learner'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your progress and continue your APTIS practice
        </p>
        {profile?.level && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Current Level: {profile.level} ({profile.levelScore}/50)
            </span>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <StatsSummary 
          profile={profile || {
            id: '',
            name: 'Learner',
            email: '',
            completedTests: 0,
            inProgressTests: 0,
            averageScore: 0
          }} 
          totalResults={stats?.totalTestsCompleted || 0}
          averageScore={stats?.averageScore || 0}
        />
      </div>
      
      <div className="mb-8">
        <RecentResults results={convertedResults} />
      </div>

      {/* Additional stats section */}
      {stats && stats.testsByType && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.testsByType.reading}</div>
                <div className="text-sm text-gray-600">Reading Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.testsByType.listening}</div>
                <div className="text-sm text-gray-600">Listening Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalTimeSpent}</div>
                <div className="text-sm text-gray-600">Minutes Studied</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LearnerLayout>
  );
} 