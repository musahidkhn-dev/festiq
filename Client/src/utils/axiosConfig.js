import axios from 'axios';
import { toast } from 'react-toastify';

// Create a configured Axios instance
const axiosInstance = axios.create({
  baseURL: '/api',
});

// Request Interceptor: Attach JWT token if it exists in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.token) {
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
      // Avoid firing duplicate toasts if many requests fail concurrently
      if (!window.__authExpiredToastFired) {
        window.__authExpiredToastFired = true;
        toast.error("Session expired. Please log in again.");
        setTimeout(() => { window.__authExpiredToastFired = false; }, 5000);
      }
      
      // Clean up localStorage and redirect
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    } else {
       // Global error toast for other API failures
       const message = (error.response && error.response.data && error.response.data.message) || error.message;
       toast.error(message || "An unexpected API error occurred.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
