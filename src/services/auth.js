import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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
  // Login with username and password using JWT authentication
  async login(username, password) {
    try {
      const response = await authAPI.post('/auth/login/', {
        username,
        password,
      });
      
      if (response.data.success && response.data.tokens) {
        // Store JWT tokens in localStorage
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        
        // Set default authorization header for future requests
        authAPI.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
      }
      
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

  // Refresh JWT token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.post('/auth/refresh/', {
        refresh: refreshToken,
      });
      
      if (response.data.success && response.data.tokens) {
        // Update stored tokens
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        
        // Update authorization header
        authAPI.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
        
        return {
          success: true,
          tokens: response.data.tokens,
        };
      }
      
      return { success: false };
    } catch (error) {
      // If refresh fails, clear tokens and redirect to login
      this.clearTokens();
      return { success: false };
    }
  },

  // Logout
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  },

  // Verify JWT token and get user info
  async verifyToken() {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // Set authorization header
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await authAPI.get('/auth/verify/');
      return {
        success: response.data.success || false,
        user: response.data.user,
      };
    } catch (error) {
      // If token is expired, try to refresh
      if (error.response?.status === 401) {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          // Retry the verification with new token
          return await this.verifyToken();
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.error || 'Token verification failed',
      };
    }
  },

  // Clear stored tokens
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete authAPI.defaults.headers.common['Authorization'];
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
