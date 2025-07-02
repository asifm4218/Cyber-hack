'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { mockUsers, mockCredentials } from '../utils/mockData';
import { BehaviorAuthenticator } from '../utils/behaviorAuth';
import { BBCAEngine } from '../utils/bbcaEngine';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresReAuth: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    requiresReAuth: false,
  });

  const [lastActivity, setLastActivity] = useState(Date.now());
  const TIMEOUT_DURATION = 120000; // 120 seconds

  // Activity tracking
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Auto logout on inactivity
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > TIMEOUT_DURATION) {
        logout();
        alert('Session expired due to inactivity. Please login again.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, lastActivity]);

  // Activity listeners
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [authState.isAuthenticated, updateActivity]);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const username = localStorage.getItem('auth_username');
        
        if (token && username && BehaviorAuthenticator.validateSecurityToken(token)) {
          const user = mockUsers[username];
          if (user) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              requiresReAuth: false,
            });
            
            // Initialize session start time for BBCA
            if (!localStorage.getItem('session_start')) {
              localStorage.setItem('session_start', Date.now().toString());
            }
            
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        requiresReAuth: false,
      });
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('Login attempt:', { username, password });
      console.log('Expected credentials:', mockCredentials);
      
      // Trim whitespace and validate credentials
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      // Check credentials exactly
      if (trimmedUsername !== mockCredentials.username || trimmedPassword !== mockCredentials.password) {
        console.log('Credential mismatch:', {
          provided: { username: trimmedUsername, password: trimmedPassword },
          expected: mockCredentials
        });
        return { 
          success: false, 
          error: 'Invalid username or password. Please use the demo credentials provided.' 
        };
      }

      const user = mockUsers[trimmedUsername];
      if (!user) {
        console.log('User not found for username:', trimmedUsername);
        return { 
          success: false, 
          error: 'User account not found' 
        };
      }

      // Collect behavior data for BBCA
      const behaviorData = await BBCAEngine.collectBehaviorData();
      const riskAssessment = BBCAEngine.analyzeBehavior(behaviorData, trimmedUsername);

      // Generate security token
      const token = BehaviorAuthenticator.generateSecurityToken();
      
      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_username', trimmedUsername);
      localStorage.setItem('session_start', Date.now().toString());
      
      // Update user's last login
      user.lastLogin = new Date().toISOString();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        requiresReAuth: false,
      });

      setLastActivity(Date.now());
      
      // Log behavior data for BBCA
      BehaviorAuthenticator.recordLoginAttempt(
        trimmedUsername, 
        true, 
        behaviorData, 
        riskAssessment.score
      );
      
      console.log('Login successful for user:', user.fullName);
      return { success: true, riskAssessment };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    const username = localStorage.getItem('auth_username');
    
    // Clear BBCA data if needed
    if (username) {
      // Optionally clear behavior data (GDPR compliance)
      // BBCAEngine.clearUserData(username);
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    localStorage.removeItem('session_start');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      requiresReAuth: false,
    });
  };

  const triggerReAuth = () => {
    setAuthState(prev => ({
      ...prev,
      requiresReAuth: true
    }));
  };

  const handleReAuthSuccess = () => {
    setAuthState(prev => ({
      ...prev,
      requiresReAuth: false
    }));
    setLastActivity(Date.now());
  };

  const getTimeUntilLogout = () => {
    if (!authState.isAuthenticated) return 0;
    const remaining = TIMEOUT_DURATION - (Date.now() - lastActivity);
    return Math.max(0, remaining);
  };

  return {
    ...authState,
    login,
    logout,
    triggerReAuth,
    handleReAuthSuccess,
    getTimeUntilLogout,
    updateActivity,
  };
}