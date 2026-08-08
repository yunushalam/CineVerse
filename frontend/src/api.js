import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMovies = () => api.get('/movies');
export const login = (username, password) => api.post('/auth/login', { username, password });
export const register = (username, password, email) => api.post('/auth/register', { username, password, email, role: 'USER' });
export const uploadMovie = (formData) => api.post('/movies/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export default api;
