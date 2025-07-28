'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  storeTokens, 
  getTokens, 
  isTokenExpired, 
  hasValidRefreshToken,
  handleLogout 
} from '../auth/tokenManager';
import { fetchWithAuth, fetchWithoutAuth } from '../auth/apiInterceptor';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const checkUser = async () => {
    try {
      const { accessToken } = getTokens();
      
      if (!accessToken) {
        setAuthState({ user: null, isLoading: false, error: null });
        return;
      }

      // For client-side navigation, trust the token and avoid unnecessary backend validation
      // This prevents logout during navigation between pages
      if (authState.user && !isTokenExpired()) {
        // User is already authenticated and token is still valid, no need to revalidate during navigation
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Only validate with backend when we don't have a user in state or token is expired
      // This happens on initial page load or after a hard refresh
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetchWithAuth(`${API_URL}/auth/user`);

        if (!response.ok) {
          console.warn('Token validation failed');
          setAuthState({
            user: null,
            isLoading: false,
            error: 'Token validation failed',
          });
          return;
        }

        const data = await response.json();
        setAuthState({
          user: data.user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Auth check error:', error);
        // If there's a refresh token, try to use it
        if (hasValidRefreshToken()) {
          setAuthState({
            user: null,
            isLoading: false,
            error: 'Token refresh in progress',
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            error: 'Failed to authenticate',
          });
        }
      }
    } catch (error) {
      console.error('Auth check outer error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        error: 'Failed to authenticate',
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const signUp = async (userData: { fullName: string; email: string; password: string; role: string }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetchWithoutAuth(`${API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store tokens using the new token manager
      storeTokens(data.accessToken, data.refreshToken);

      // Update auth state
      setAuthState({
        user: data.user,
        isLoading: false,
        error: null,
      });

      // Redirect based on role
      redirectBasedOnRole(data.role);

      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const signIn = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetchWithoutAuth(`${API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store tokens using the new token manager
      storeTokens(data.accessToken, data.refreshToken);

      // Update auth state
      setAuthState({
        user: data.user,
        isLoading: false,
        error: null,
      });

      // Redirect based on role
      redirectBasedOnRole(data.role);

      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Use the handleLogout function which will call the backend and clear tokens
      await handleLogout();
      
      // Reset auth state
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    }
  };

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role: string) => {
    console.log('Redirecting based on role:', role);

    let targetUrl: string;
    switch (role.toLowerCase()) {
      case 'admin':
        targetUrl = '/admin/dashboard';
        break;
      case 'teacher':
        targetUrl = '/teacher/dashboard';
        break;
      case 'student':
        targetUrl = '/learner/dashboard';
        break;
      default:
        console.error('Unknown role:', role);
        targetUrl = '/login'; // Fallback to login for safety
        break;
    }
    // Use a hard redirect to ensure the page reloads and auth state is correctly applied
    window.location.href = targetUrl;
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    checkUser,
  };
}; 