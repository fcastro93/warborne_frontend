import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/auth/`,
  timeout: 10000,
});

// Request interceptor to add auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login with username and password
  async login(username, password) {
    try {
      const response = await authAPI.post('/login/', {
        username,
        password,
      });
      
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Logout
  async logout() {
    try {
      await authAPI.post('/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Verify token and get user info
  async verifyToken() {
    try {
      const response = await authAPI.get('/verify/');
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token verification failed',
      };
    }
  },

  // Register new user (for future use)
  async register(userData) {
    try {
      const response = await authAPI.post('/register/', userData);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },
};

export default authService;
