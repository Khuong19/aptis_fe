import { fetchWithAuth } from '../auth/apiInterceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface CreateTestPayload {
  title: string;
  description?: string;
  questionSets: any[];
  status?: 'Draft' | 'Published';
  duration?: number;
  type?: 'reading' | 'listening' | 'mixed';
}

export class TestsService {
  /**
   * Tạo bài test mới
   */
  static async createTest(payload: CreateTestPayload) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/teacher/tests`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create test');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('TestsService.createTest error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách test của giáo viên hiện tại
   */
  static async getTeacherTests() {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/teacher/tests`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tests');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('TestsService.getTeacherTests error:', error);
      throw error;
    }
  }

  static async updateTest(id: string, updates: Partial<any>) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/teacher/tests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update test');
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('TestsService.updateTest error:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một bài test
   */
  static async getTestById(id: string) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/teacher/tests/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch test');
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('TestsService.getTestById error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách test theo loại (reading/listening)
   */
  static async getTestsByType(type: 'reading' | 'listening' | 'mixed') {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/teacher/tests?type=${type}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tests');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('TestsService.getTestsByType error:', error);
      throw error;
    }
  }

  /**
   * Tạo listening test mới
   */
  static async createListeningTest(payload: CreateTestPayload) {
    const listeningPayload = {
      ...payload,
      type: 'listening' as const
    };
    return this.createTest(listeningPayload);
  }

  /**
   * Xóa test
   */
  static async deleteTest(id: string) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/teacher/tests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete test');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('TestsService.deleteTest error:', error);
      throw error;
    }
  }
} 