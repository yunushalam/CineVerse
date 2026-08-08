import axios from 'axios';

const api = axios.create({
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
export const login = (username, password) => api.post('/api/auth/login', { usernameOrEmail: username, password });
export const register = (username, password, email) => api.post('/api/auth/register', { username, password, email, role: 'USER' });
export const createMovie = (movieData) => api.post('/movies', movieData);
export const uploadFile = (formData) => api.post('/movies/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export default api;
