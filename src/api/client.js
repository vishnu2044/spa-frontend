import axios from 'axios';
import { storage } from '../utils/storage';

let base = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'http://localhost:8000/api/v1';
if (base && !base.endsWith('/api/v1')) {
  base = base.replace(/\/$/, '') + '/api/v1';
}

const apiClient = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Assuming auth token is saved in localStorage as 'aura_token'
    const token = localStorage.getItem('aura_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
