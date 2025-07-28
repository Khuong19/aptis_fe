import { 
  isTokenExpired, 
  handleLogout, 
  refreshAccessToken, 
  hasValidRefreshToken,
  getTokens 
} from './tokenManager';
import Cookies from 'js-cookie';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Fetch API wrapper with automatic token refresh
 * Automatically checks token expiration before making requests
 * and attempts to refresh if needed
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Check if token is expired or about to expire
  if (isTokenExpired()) {
    // If we have a refresh token, try to refresh
    if (hasValidRefreshToken()) {
      // Prevent multiple simultaneous refresh attempts
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }
      
      // Wait for refresh to complete
      const refreshSuccess = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;
      
      if (!refreshSuccess) {
        console.warn('Token refresh failed, logging out...');
        handleLogout();
        throw new Error('Authentication token expired and refresh failed');
      }
    } else {
      console.warn('No refresh token available, logging out...');
      handleLogout();
      throw new Error('Authentication token expired');
    }
  }

  // Add authorization header if token exists
  const { accessToken } = getTokens();
  const headers = {
    ...options.headers,
    'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized response
    if (response.status === 401) {
      // Try to refresh token once more if we get 401
      if (hasValidRefreshToken() && !isRefreshing) {
        console.log('Received 401, attempting token refresh...');
        
        isRefreshing = true;
        const refreshSuccess = await refreshAccessToken();
        isRefreshing = false;
        
        if (refreshSuccess) {
          // Retry the original request with new token
          const { accessToken: newToken } = getTokens();
          const retryHeaders = {
            ...options.headers,
            'Authorization': newToken ? `Bearer ${newToken}` : '',
            'Content-Type': 'application/json',
          };
          
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });
          
          // If still 401 after refresh, logout
          if (retryResponse.status === 401) {
            console.warn('Still unauthorized after token refresh, logging out...');
            handleLogout();
            throw new Error('Authentication failed after token refresh');
          }
          
          return retryResponse;
        }
      }
      
      // If refresh failed or no refresh token, logout
      console.warn('Unauthorized request, logging out...');
      handleLogout();
      throw new Error('Authentication failed');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Simple fetch wrapper for requests that don't require authentication
 * @param url - Request URL
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export const fetchWithoutAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
