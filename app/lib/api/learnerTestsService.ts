import { TestResult } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class LearnerTestsService {
  static async getTestById(id: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test:', error);
      throw error;
    }
  }

  static async saveTestResult(testResult: TestResult): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testResult)
      });

      if (!response.ok) {
        throw new Error('Failed to save test result');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  }

  static async getTestResults(): Promise<TestResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  }

  static async getTestResultById(id: string): Promise<TestResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-results/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test result');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  }

  static async getAvailableTests(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/available`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available tests');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available tests:', error);
      throw error;
    }
  }

  static async getTestProgress(testId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test progress:', error);
      throw error;
    }
  }

  static async saveTestProgress(testId: string, progress: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(progress)
      });

      if (!response.ok) {
        throw new Error('Failed to save test progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving test progress:', error);
      throw error;
    }
  }
}