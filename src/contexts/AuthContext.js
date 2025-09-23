import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const verifyAuth = async () => {
      const userData = localStorage.getItem('userData');
      
      if (userData) {
        try {
          // Verify the session is still valid
          const result = await authService.verifyToken();
          if (result.success) {
            setUser(result.user);
          } else {
            // Session is invalid, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        } catch (error) {
          console.error('Session verification error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // Use Django's built-in authentication
      const result = await authService.login(username, password);
      if (result.success) {
        // Store user data in localStorage for persistence
        localStorage.setItem('authToken', 'django-session');
        localStorage.setItem('userData', JSON.stringify(result.user));
        setUser(result.user);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Call logout API if available
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
