import axios from 'axios';

const api = axios.create({
  baseURL: 'https://safeflood-api-java.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const idToken = localStorage.getItem('idToken');
  if (idToken && config.headers) {
    config.headers.Authorization = `Bearer ${idToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('idToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 