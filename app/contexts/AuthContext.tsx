'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  savedArticles?: string[];
  savedScholarships?: string[];
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage (safely for SSR)
  useEffect(() => {
    // This prevents hydration errors as localStorage is only accessed client-side
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('authToken');
          
          if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken);
          } else {
            setIsLoading(false);
            console.log('No auth token found in localStorage');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fetch user data with token
  const fetchUserData = async (authToken: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get('/direct-api/auth/user', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/direct-api/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
      setToken(token);
      setUser(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Google login function
  const googleLogin = async (googleToken: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/direct-api/auth/google', { token: googleToken });
      
      const { token, user } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
      setToken(token);
      setUser(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Register function
  const register = async (fullName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/direct-api/auth/register', { 
        fullName, 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
      setToken(token);
      setUser(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, 
        googleLogin,
        register, 
        logout,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}