import Cookies from 'js-cookie';

interface DecodedToken {
  exp: number;
  iat: number;
  id: string;
  role: string;
  email?: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
}

/**
 * Simple JWT decoder function
 * @param token - JWT token string
 * @returns Decoded token object
 */
function decodeJwt(token: string): DecodedToken {
  try {
    // JWT tokens are made of three parts: header.payload.signature
    // We only need the payload part (second part)
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    
    // Base64 decode the payload
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    throw error;
  }
}

/**
 * Store tokens in cookies
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  // Store access token with shorter expiry (1 hour)
  Cookies.set('token', accessToken, { 
    expires: 1/24, // 1 hour
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  // Store refresh token with longer expiry (30 days)
  Cookies.set('refreshToken', refreshToken, { 
    expires: 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

/**
 * Get stored tokens
 * @returns Object with access and refresh tokens
 */
export const getTokens = (): { accessToken: string | null, refreshToken: string | null } => {
  return {
    accessToken: Cookies.get('token') || null,
    refreshToken: Cookies.get('refreshToken') || null
  };
};

/**
 * Check if the token is expired
 * @returns boolean
 */
export const isTokenExpired = (): boolean => {
  try {
    const token = Cookies.get('token');
    if (!token) return true;

    const decodedToken = decodeJwt(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired or about to expire in the next 10 seconds
    return decodedToken.exp < currentTime + 10;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, assume token is expired
  }
};

/**
 * Check if refresh token exists and is valid
 * @returns boolean
 */
export const hasValidRefreshToken = (): boolean => {
  const refreshToken = Cookies.get('refreshToken');
  return !!refreshToken;
};

/**
 * Refresh access token using refresh token
 * @returns Promise<boolean> - true if refresh successful, false otherwise
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      // If refresh fails, clear all tokens
      clearAuthData();
      return false;
    }

    const data: RefreshResponse = await response.json();
    
    // Store new tokens
    storeTokens(data.accessToken, data.refreshToken);
    
    console.log('Token refreshed successfully');
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearAuthData();
    return false;
  }
};

/**
 * Get the remaining time in seconds before the token expires
 * @returns number - seconds until expiration, or 0 if expired/invalid
 */
export const getTokenRemainingTime = (): number => {
  try {
    const token = Cookies.get('token');
    if (!token) return 0;

    const decodedToken = decodeJwt(token);
    const currentTime = Date.now() / 1000;
    
    const remainingTime = decodedToken.exp - currentTime;
    return remainingTime > 0 ? Math.floor(remainingTime) : 0;
  } catch (error) {
    console.error('Error getting token remaining time:', error);
    return 0;
  }
};

/**
 * Clear all auth-related cookies and storage
 */
export const clearAuthData = (): void => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

/**
 * Handle logout process
 */
export const handleLogout = async (): Promise<void> => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    
    // Call backend logout endpoint to invalidate refresh token
    if (refreshToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear local auth data
    clearAuthData();
    
    // Clear all authentication cookies explicitly
    Cookies.remove('token', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('role', { path: '/' });
    
    // Also clear cookies using document.cookie for better browser compatibility
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Force a hard redirect to login page to bypass middleware issues
    window.location.replace('/login');
  }
};

/**
 * Handle immediate logout without backend call (for emergency situations)
 */
export const forceLogout = (): void => {
  // Clear all authentication cookies
  Cookies.remove('token', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
  Cookies.remove('role', { path: '/' });
  
  // Also clear cookies using document.cookie
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Clear local storage
  clearAuthData();
  
  // Force redirect to login
  window.location.replace('/login');
};
