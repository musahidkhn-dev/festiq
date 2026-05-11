import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Axios Instance Configuration
 * Standardized to hit the backend port 8080 directly with CORS credentials.
 */
const API_BASE_URL = import.meta.env.PROD
  ? `${window.location.origin}/api`
  : 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT token if it exists in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // If sending FormData, let the browser set the Content-Type with boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);

        if (user && user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }

      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors and 401s
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the response exists and has a 401 status
    if (error.response && error.response.status === 401) {
      if (!window.__authExpiredToastFired) {
        // Only show session expired if there was actually a user session
        if (localStorage.getItem('user')) {
          window.__authExpiredToastFired = true;
          toast.dismiss();
          toast.error("Session expired. Please log in again.");

          setTimeout(() => {
            window.__authExpiredToastFired = false;
          }, 5000);
        }
      }

      localStorage.removeItem('user');
      // Removed: window.location.href = '/login'; 
      // Let PrivateComponent or individual components handle redirects
    } else {
      // Improved error reporting
      const message = error.response?.data?.message || error.message || "Network Error: Could not connect to backend.";

      // Don't show toast for chat specific errors to allow component-level handling
      if (error.config && error.config.url && !error.config.url.includes('/chat')) {
        toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
