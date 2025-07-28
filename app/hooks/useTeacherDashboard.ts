/**
 * useTeacherDashboard Hook
 * Custom hook for managing teacher dashboard data
 */

import { useState, useEffect } from 'react';
import { teacherService, TeacherStatistics } from '../lib/api/teacherService';

interface UseTeacherDashboardReturn {
  statistics: TeacherStatistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeacherDashboard = (): UseTeacherDashboardReturn => {
  const [statistics, setStatistics] = useState<TeacherStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getStatistics();
      setStatistics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  };
};