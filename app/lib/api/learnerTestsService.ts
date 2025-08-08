import { TestResult } from '@/app/types';
import { fetchWithAuth } from '../auth/apiInterceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class LearnerTestsService {
  static async getAvailableTests() {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/learner/tests`);
      if (!response.ok) {
        throw new Error('Failed to fetch tests');
      }
      return await response.json();
    } catch (error) {
      console.error('LearnerTestsService.getAvailableTests error:', error);
      throw error;
    }
  }

  static async getTestById(id: string) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/learner/tests/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch test');
      }
      return await response.json();
    } catch (error) {
      console.error('LearnerTestsService.getTestById error:', error);
      throw error;
    }
  }

  static async submitTest(testId: string, answers: Record<string, string>, timeSpent: number, testType: string) {
    try {
      const payload = {
        testId,
        answers,
        timeSpent,
        testType,
      };
      
      const response = await fetchWithAuth(`${API_BASE_URL}/learner/tests/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit test');
      }

      return await response.json();
    } catch (error) {
      console.error('LearnerTestsService.submitTest error:', error);
      throw error;
    }
  }

  static async getTestResults(testId?: string) {
    try {
      const url = testId 
        ? `${API_BASE_URL}/learner/tests/results?testId=${testId}`
        : `${API_BASE_URL}/learner/tests/results`;
      
      
      const response = await fetchWithAuth(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch test results');
      }
      
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      console.error('LearnerTestsService.getTestResults error:', error);
      throw error;
    }
  }

  static async getTestResultById(id: string): Promise<TestResult> {
    try {
      const response = await LearnerTestsService.getTestResults();
      const results = response.data || response;
      
      const result = results.find((r: any) => r.id === id);
      
      if (!result) {
        throw new Error('Test result not found');
      }

      return {
        id: result.id,
        testId: result.testId,
        testTitle: result.testTitle || result.title || 'Unnamed Test',
        type: result.testType || result.type,
        score: result.score || Math.round(result.accuracy || 0),
        accuracy: result.accuracy || 0,
        dateTaken: result.submittedAt || result.dateTaken,
        timeSpent: result.timeSpent || 0,
        correctAnswers: result.correctAnswers || 0,
        totalQuestions: result.totalQuestions || 0,
        level: result.level,
        levelScore: result.levelScore
      };
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  }

  static async getTestProgress(testId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/learner/tests/${testId}/progress`, {
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
      const response = await fetch(`${API_BASE_URL}/learner/tests/${testId}/progress`, {
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

  static async saveTestResult(testResult: TestResult): Promise<any> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/learner/tests/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResult),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save test result');
      }

      return await response.json();
    } catch (error) {
      console.error('LearnerTestsService.saveTestResult error:', error);
      throw error;
    }
  }
}