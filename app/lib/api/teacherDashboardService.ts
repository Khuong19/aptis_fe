/**
 * Teacher Dashboard Service
 * API calls for teacher dashboard functionality
 */

import { fetchWithAuth } from '../auth/apiInterceptor';

export interface TeacherDashboardStats {
  totalStudents: number;
  totalTests: number;
  totalQuestionSets: number;
  averageCompletion: number;
  averageScore: number;
  recentTestResults: RecentTestResult[];
  chartData: ChartData[];
  testTypeData: TestTypeData[];
}

export interface RecentTestResult {
  id: string;
  studentName: string;
  testName: string;
  testType: string;
  score: number;
  completionRate: number;
  completedAt: string;
  timeSpent: number;
}

export interface ChartData {
  month: string;
  averageScore: number;
  completionRate: number;
  totalTests: number;
}

export interface TestTypeData {
  type: string;
  count: number;
  color: string;
}

class TeacherDashboardService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/teacher`;
  }

  /**
   * Get teacher dashboard statistics
   * @returns Promise with teacher dashboard statistics
   */
  async getDashboardStats(): Promise<TeacherDashboardStats> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/statistics`);
      
      if (!response.ok) {
        console.warn('Teacher statistics API failed, using fallback data');
        return this.getFallbackData();
      }
      
      const data = await response.json();
      return this.validateAndTransformData(data);
    } catch (error) {
      console.error('Error fetching teacher dashboard stats:', error);
      console.log('Using fallback data for teacher dashboard');
      return this.getFallbackData();
    }
  }

  /**
   * Get teacher test results
   * @param limit Number of results to return
   * @param sort Sort order ('recent' or 'oldest')
   * @returns Promise with teacher test results
   */
  async getTestResults(limit?: number, sort?: string, testId?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (sort) params.append('sort', sort);
      if (testId) params.append('testId', testId);

      const response = await fetchWithAuth(`${this.baseUrl}/tests/results?${params}`);
      
      if (!response.ok) {
        console.warn('Teacher test results API failed');
        return [];
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching teacher test results:', error);
      return [];
    }
  }

  /**
   * Validate and transform API data
   */
  private validateAndTransformData(data: any): TeacherDashboardStats {
    return {
      totalStudents: data.totalStudents || 0,
      totalTests: data.totalTests || 0,
      totalQuestionSets: data.totalQuestionSets || 0,
      averageCompletion: data.averageCompletion || 0,
      averageScore: data.averageScore || 0,
      recentTestResults: Array.isArray(data.recentTestResults) ? data.recentTestResults : [],
      chartData: Array.isArray(data.chartData) ? data.chartData : this.getDefaultChartData(),
      testTypeData: Array.isArray(data.testTypeData) ? data.testTypeData : this.getDefaultTestTypeData()
    };
  }

  /**
   * Get fallback data when API fails
   */
  private getFallbackData(): TeacherDashboardStats {
    return {
      totalStudents: 0,
      totalTests: 0,
      totalQuestionSets: 0,
      averageCompletion: 0,
      averageScore: 0,
      recentTestResults: [],
      chartData: this.getDefaultChartData(),
      testTypeData: this.getDefaultTestTypeData()
    };
  }

  /**
   * Get default chart data
   */
  private getDefaultChartData(): ChartData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      averageScore: 0,
      completionRate: 0,
      totalTests: 0
    }));
  }

  /**
   * Get default test type data
   */
  private getDefaultTestTypeData(): TestTypeData[] {
    return [
      { type: 'Reading', count: 0, color: '#152C61' },
      { type: 'Listening', count: 0, color: '#AC292D' },
      { type: 'Speaking', count: 0, color: '#4F46E5' },
      { type: 'Writing', count: 0, color: '#059669' }
    ];
  }
}

// Export singleton instance
export const teacherDashboardService = new TeacherDashboardService();
