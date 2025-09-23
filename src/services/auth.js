import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://violenceguild.duckdns.org';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  timeout: 10000,
  withCredentials: true, // Include cookies for Django session authentication
});

// Request interceptor to add CSRF token
authAPI.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookies for Django
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
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
      // Session expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login with username and password using Django's built-in authentication
  async login(username, password) {
    try {
      const response = await authAPI.post('/auth/login/', {
        username,
        password,
      });
      
      return {
        success: response.data.success || false,
        user: response.data.user,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Logout
  async logout() {
    try {
      await authAPI.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Verify token and get user info
  async verifyToken() {
    try {
      const response = await authAPI.get('/auth/verify/');
      return {
        success: response.data.success || false,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Token verification failed',
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
