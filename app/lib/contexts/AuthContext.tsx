'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

import { User } from '../hooks/useAuth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (userData: { fullName: string; email: string; password: string; role: string }) => Promise<any>;
  signIn: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<any>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  
  // Map isLoading to loading to match the AuthContextType interface
  const contextValue = {
    ...auth,
    loading: auth.isLoading,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}; 