import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/send', data),
  sendAnonymousMessage: (data) => api.post('/chat/anonymous', data),
  getChatHistory: () => api.get('/chat/history'),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllChats: () => api.get('/admin/chats'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  deleteChat: (chatId) => api.delete(`/admin/chats/${chatId}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getUserAnalytics: (userId) => api.get(`/admin/analytics/user/${userId}`),
};

export default api;