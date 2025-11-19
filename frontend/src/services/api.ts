import axios from 'axios';

// API base URL - DefinePlugin will replace this at build time
// Using a simple constant to avoid process.env issues
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove default Content-Type for FormData - browser will set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
  } catch (e) {
    // localStorage not available, continue without token
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        // localStorage not available
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

