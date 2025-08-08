/**
 * useTeacherDashboard Hook
 * Custom hook for managing teacher dashboard data
 */

import { useState, useEffect } from 'react';
import { teacherDashboardService, TeacherDashboardStats } from '../lib/api/teacherDashboardService';

interface UseTeacherDashboardReturn {
  statistics: TeacherDashboardStats | null;
  testResults: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeacherDashboard = (): UseTeacherDashboardReturn => {
  const [statistics, setStatistics] = useState<TeacherDashboardStats | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both statistics and test results in parallel
      const [statsData, resultsData] = await Promise.all([
        teacherDashboardService.getDashboardStats(),
        teacherDashboardService.getTestResults(10, 'recent')
      ]);
      
      setStatistics(statsData);
      setTestResults(resultsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    statistics,
    testResults,
    loading,
    error,
    refetch: fetchData
  };
};