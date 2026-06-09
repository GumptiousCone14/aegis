'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface Session {
  token: string;
  user_id: string;
  created_at: number;
  expires_at: number;
}

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'aegis_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return false;

      const sessionData: Session = JSON.parse(stored);
      
      // Validate with backend
      const isValid = await invoke<boolean>('validate_session', { 
        token: sessionData.token 
      });
      
      if (isValid) {
        setSession(sessionData);
        return true;
      } else {
        // Session expired or invalid
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!email || !email.includes('@')) {
        return { error: 'Please enter a valid email address' };
      }
      if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      const result = await invoke<Session>('login', { 
        email, 
        password 
      });

      // Store session
      localStorage.setItem(SESSION_KEY, JSON.stringify(result));
      setSession(result);
      return {};
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: error?.message || 'Invalid credentials' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (session?.token) {
        await invoke('logout', { token: session.token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(SESSION_KEY);
      setSession(null);
    }
  };

  useEffect(() => {
    // Check existing session on mount
    const init = async () => {
      const valid = await checkAuth();
      setIsLoading(false);
      if (!valid) {
        // If no valid session, stay on sign-in page (handled by route guard)
      }
    };
    init();
  }, []);

  const value: AuthContextType = {
    session,
    isLoading,
    isAuthenticated: !!session,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
