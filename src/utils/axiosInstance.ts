// src/utils/axiosInstance.ts
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

// Create a single Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // environment-specific base URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// === Request Interceptor ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error.message);
    return Promise.reject(error);
  },
);

// === Response Interceptor ===
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          console.error('Unauthorized! Redirecting to login...');
          // Optionally: window.location.href = '/login'
          break;
        case 500:
          console.error('Server error! Please try again later.');
          break;
        default:
          console.error(`Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      console.error('No response received – check your network connection.');
    } else {
      console.error('Axios setup error:', error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
