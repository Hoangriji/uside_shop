import React, { useState, useEffect } from 'react';
import { AdminAuthService } from '../services/firebaseService';
import type { AuthContextType } from '../types/auth';
import { SESSION_KEY, SESSION_DURATION } from '../types/auth';
import { AuthContext } from './AuthContextProvider';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          const now = new Date().getTime();
          
          // Check if session is still valid
          if (sessionData.expires > now) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch {
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const isValid = await AdminAuthService.validateCredentials(username, password);
      
      if (isValid) {
        // Update last login
        await AdminAuthService.updateLastLogin();
        
        // Create session
        const sessionData = {
          username,
          loginTime: new Date().getTime(),
          expires: new Date().getTime() + SESSION_DURATION
        };
        
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          const now = new Date().getTime();
          
          // Check if session is still valid
          if (sessionData.expires > now) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch {
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Đang xác thực...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The route guard will handle redirection
  }

  return <>{children}</>;
};