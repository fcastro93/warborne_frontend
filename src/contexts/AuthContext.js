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
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const result = await authService.verifyToken();
          if (result.success) {
            setUser(result.user);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        } catch (error) {
          console.error('Token verification error:', error);
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
      // For now, we'll use a simple mock authentication
      // TODO: Replace with real API call when backend is ready
      if (username === 'admin' && password === 'admin') {
        const userData = {
          id: 1,
          username: 'admin',
          name: 'Administrator',
          role: 'admin'
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
      
      // Real API call (uncomment when backend is ready):
      // const result = await authService.login(username, password);
      // if (result.success) {
      //   localStorage.setItem('authToken', result.token);
      //   localStorage.setItem('userData', JSON.stringify(result.user));
      //   setUser(result.user);
      // }
      // return result;
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
