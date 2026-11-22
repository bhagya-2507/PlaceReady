import api from './api';

const normalizeResponse = (response) => ({
  data: response?.data ?? response,
});

export const authService = {
  login: async (credentials) => {
    const res = normalizeResponse(await api.post('/auth/login', credentials));
    if (res.data?.token) {
      localStorage.setItem('placeready_jwt', res.data.token);
      localStorage.setItem('placeready_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  register: async (userData) => {
    const res = normalizeResponse(await api.post('/auth/register', userData));
    if (res.data?.token) {
      localStorage.setItem('placeready_jwt', res.data.token);
      localStorage.setItem('placeready_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  getMe: async () => {
    const res = normalizeResponse(await api.get('/auth/me'));
    if (res.data?.user) {
      localStorage.setItem('placeready_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('placeready_jwt');
      localStorage.removeItem('placeready_user');
    }
  },

  getCurrentUser: () => {
    try {
      const data = localStorage.getItem('placeready_user');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  getToken: () => localStorage.getItem('placeready_jwt'),
};
