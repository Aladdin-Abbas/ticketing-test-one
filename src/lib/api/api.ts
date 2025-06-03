import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies (JWT) with every request
  timeout: 10000,
});

// Interceptor: handle 401 (unauthorized) globally
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Optionally: trigger Zustand logout or refresh here
      // e.g. useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;