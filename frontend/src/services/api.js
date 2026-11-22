import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('placeready_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors & token expiry
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // 401 Unauthorized -> Clear expired token
      if (error.response.status === 401 && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('placeready_jwt');
        localStorage.removeItem('placeready_user');
      }
      return Promise.reject(new Error(error.response.data?.message || 'Server error'));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check if the backend server is running on port 5000.'));
    }
    return Promise.reject(error);
  }
);

export default api;
