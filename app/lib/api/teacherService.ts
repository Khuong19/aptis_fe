/**
 * Teacher Service
 * API calls related to teacher functionality
 */

import { fetchWithAuth } from '../auth/apiInterceptor';
import { ProfileService } from './profileService';

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
  recentTestResults: any[];
  chartData: any[];
  testTypeData: any[];
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
  bio?: string;
  avatar?: string;
  role: string;
  totalTests?: number;
  totalQuestions?: number;
  createdAt: string;
  updatedAt?: string;
}

class TeacherService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/teacher`;
  }

  /**
   * Get teacher statistics
   * @returns Promise with teacher statistics
   */
  async getStatistics(): Promise<TeacherStatistics> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/statistics`);
      
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
   * Get teacher profile
   * @returns Promise with teacher profile
   */
  async getProfile(): Promise<TeacherProfile> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/profile`);
      
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
   * Update teacher profile - now uses ProfileService
   * @param profileData Profile data to update
   * @returns Promise with updated profile
   */
  async updateProfile(profileData: { fullName?: string; email?: string; bio?: string; avatar?: string }): Promise<TeacherProfile> {
    try {
      const response = await ProfileService.updateProfile(profileData);
      return response.user as TeacherProfile;
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      throw new Error('Failed to update teacher profile');
    }
  }

  /**
   * Get teacher tests
   * @returns Promise with teacher tests
   */
  async getTests(): Promise<any[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/tests`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching teacher tests:', error);
      throw new Error('Failed to fetch teacher tests');
    }
  }

  /**
   * Create a new test
   * @param testData Test data to create
   * @returns Promise with created test
   */
  async createTest(testData: any): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating test:', error);
      throw new Error('Failed to create test');
    }
  }

  /**
   * Update a test
   * @param testId Test ID to update
   * @param testData Test data to update
   * @returns Promise with updated test
   */
  async updateTest(testId: string, testData: any): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating test:', error);
      throw new Error('Failed to update test');
    }
  }

  /**
   * Delete a test
   * @param testId Test ID to delete
   * @returns Promise with deletion result
   */
  async deleteTest(testId: string): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/tests/${testId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting test:', error);
      throw new Error('Failed to delete test');
    }
  }
}

export const teacherService = new TeacherService();