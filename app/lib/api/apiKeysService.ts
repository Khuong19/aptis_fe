import { fetchWithAuth } from '../auth/apiInterceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiKeys {
  elevenlabs?: string;
  gemini?: string;
}

export class ApiKeysService {
  /**
   * Get user's API keys
   */
  static async getUserApiKeys(): Promise<ApiKeys> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/api-keys`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch API keys');
      }

      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('ApiKeysService.getUserApiKeys error:', error);
      throw error;
    }
  }

  /**
   * Update user's API keys
   */
  static async updateUserApiKeys(apiKeys: ApiKeys): Promise<void> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/api-keys`, {
        method: 'PUT',
        body: JSON.stringify(apiKeys),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update API keys');
      }
    } catch (error) {
      console.error('ApiKeysService.updateUserApiKeys error:', error);
      throw error;
    }
  }

  /**
   * Validate an API key
   */
  static async validateApiKey(type: 'elevenlabs' | 'gemini', apiKey: string): Promise<boolean> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/api-keys/validate`, {
        method: 'POST',
        body: JSON.stringify({ type, apiKey }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.valid || false;
    } catch (error) {
      console.error('ApiKeysService.validateApiKey error:', error);
      return false;
    }
  }

  /**
   * Check if API key is valid format (client-side validation)
   */
  static isValidApiKeyFormat(type: 'elevenlabs' | 'gemini', apiKey: string): boolean {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }

    switch (type) {
      case 'elevenlabs':
        return apiKey.startsWith('sk_') && apiKey.length >= 32;
      case 'gemini':
        return apiKey.length >= 32;
      default:
        return false;
    }
  }
}