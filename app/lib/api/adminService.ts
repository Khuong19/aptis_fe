import { fetchWithAuth } from '../auth/apiInterceptor';
import { ProfileService } from './profileService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminStatistics {
  totalUsers: number;
  totalTests: number;
  totalTeachers: number;
  totalStudents: number;
  recentActivity: any[];
  chartData: any[];
}

class AdminService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin`;
  }

  /**
   * Get admin statistics
   * @returns Promise with admin statistics
   */
  async getStatistics(): Promise<AdminStatistics> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/statistics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      throw new Error('Failed to fetch admin statistics');
    }
  }

  /**
   * Get admin profile
   * @returns Promise with admin profile
   */
  async getProfile(): Promise<AdminProfile> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw new Error('Failed to fetch admin profile');
    }
  }

  /**
   * Update admin profile - uses ProfileService
   * @param profileData Profile data to update
   * @returns Promise with updated profile
   */
  async updateProfile(profileData: { fullName?: string; email?: string; bio?: string; avatar?: string }): Promise<AdminProfile> {
    try {
      const response = await ProfileService.updateProfile(profileData);
      return response.user as AdminProfile;
    } catch (error) {
      console.error('Error updating admin profile:', error);
      throw new Error('Failed to update admin profile');
    }
  }

  /**
   * Get all users
   * @returns Promise with all users
   */
  async getUsers(): Promise<any[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get user by ID
   * @param userId User ID to get
   * @returns Promise with user data
   */
  async getUserById(userId: string): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/users/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Update user
   * @param userId User ID to update
   * @param userData User data to update
   * @returns Promise with updated user
   */
  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete user
   * @param userId User ID to delete
   * @returns Promise with deletion result
   */
  async deleteUser(userId: string): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Get all tests
   * @returns Promise with all tests
   */
  async getTests(): Promise<any[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/tests`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw new Error('Failed to fetch tests');
    }
  }

  /**
   * Get system settings
   * @returns Promise with system settings
   */
  async getSettings(): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/settings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw new Error('Failed to fetch settings');
    }
  }

  /**
   * Update system settings
   * @param settingsData Settings data to update
   * @returns Promise with updated settings
   */
  async updateSettings(settingsData: any): Promise<any> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  }
}

export const adminService = new AdminService(); 