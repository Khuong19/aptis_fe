import { fetchWithAuth } from '../auth/apiInterceptor';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export interface LearnerProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  completedTests: number;
  inProgressTests: number;
  averageScore: number;
  level?: string;
  levelScore?: number;
}

export interface DashboardStats {
  totalTestsCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  recentLevel?: string;
  recentLevelScore?: number;
  testsByType: {
    reading: number;
    listening: number;
  };
}

export interface RecentTestResult {
  id: string;
  testId: string;
  testTitle: string;
  type: 'reading' | 'listening';
  score: number;
  accuracy: number;
  dateTaken: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
  level?: string;
  levelScore?: number;
}

export class LearnerDashboardService {
  /**
   * Get learner profile information
   */
  static async getLearnerProfile(): Promise<LearnerProfile> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/learner/profile`);
      if (!response.ok) {
        throw new Error('Failed to fetch learner profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching learner profile:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/learner/dashboard/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get recent test results (latest 5)
   */
  static async getRecentResults(limit: number = 5): Promise<RecentTestResult[]> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/learner/tests/results?limit=${limit}&sort=recent`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent results');
      }
      
      const data = await response.json();
      
      // Handle different response formats
      if (data && typeof data === 'object' && 'data' in data) {
        return Array.isArray(data.data) ? data.data : [];
      } else if (Array.isArray(data)) {
        return data;
      } else {
        console.warn('Unexpected response format for recent results:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching recent results:', error);
      throw error;
    }
  }

  /**
   * Get all learner dashboard data in one request
   */
  static async getDashboardData(): Promise<{
    profile: LearnerProfile;
    stats: DashboardStats;
    recentResults: RecentTestResult[];
  }> {
    try {
      // Make parallel requests for better performance
      const [profile, stats, recentResults] = await Promise.all([
        this.getLearnerProfile(),
        this.getDashboardStats(),
        this.getRecentResults(5)
      ]);

      return {
        profile,
        stats,
        recentResults
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}
