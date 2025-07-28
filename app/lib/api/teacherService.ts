/**
 * Teacher Service
 * API calls related to teacher functionality
 */

import { fetchWithAuth } from '../auth/apiInterceptor';

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

export interface TeacherStatistics {
  totalStudents: number;
  totalTests: number;
  totalQuestionSets: number;
  averageCompletion: number;
  averageScore: number;
  recentTestResults: RecentTestResult[];
  chartData?: ChartData[];
  testTypeData?: TestTypeData[];
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

export interface TeacherProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  totalTests: number;
  createdAt: string;
  updatedAt: string;
}

class TeacherService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  /**
   * Get teacher dashboard statistics
   * @returns Promise with teacher statistics
   */
  async getStatistics(): Promise<TeacherStatistics> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/teacher/statistics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching teacher statistics:', error);
      throw new Error('Failed to fetch teacher statistics');
    }
  }

  /**
   * Get teacher profile information
   * @returns Promise with teacher profile
   */
  async getProfile(): Promise<TeacherProfile> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/teacher/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      throw new Error('Failed to fetch teacher profile');
    }
  }

  /**
   * Update teacher profile
   * @param profileData Profile data to update
   * @returns Promise with updated profile
   */
  async updateProfile(profileData: { fullName: string; email: string }): Promise<TeacherProfile> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/teacher/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      throw new Error('Failed to update teacher profile');
    }
  }
}

export const teacherService = new TeacherService();