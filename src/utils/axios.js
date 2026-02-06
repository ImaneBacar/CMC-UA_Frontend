import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5014/api'
});

// Intercepteur pour ajouter le token ET le rôle actif
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const currentRole = localStorage.getItem('currentRole'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (currentRole) {
      config.headers['x-current-role'] = currentRole; 
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;