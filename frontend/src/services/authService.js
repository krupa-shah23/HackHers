import api from './api';

const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Signup user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('careProfileId');
  },

  // Get default care profile
  getDefaultCareProfile: async () => {
      const response = await api.get('/care-profiles');
      // Return first profile if exists
      return response.data && response.data.length > 0 ? response.data[0] : null;
  }
};

export default authService;
