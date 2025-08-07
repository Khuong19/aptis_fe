import { fetchWithAuth } from '../auth/apiInterceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ProfileUpdateData {
  fullName?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export class ProfileService {
  /**
   * Update user profile (for all roles)
   * @param profileData Profile data to update
   * @returns Promise with updated profile
   */
  static async updateProfile(profileData: ProfileUpdateData): Promise<{ user: UserProfile }> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns Promise with user profile
   */
  static async getProfile(): Promise<{ user: UserProfile }> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/user`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
} 