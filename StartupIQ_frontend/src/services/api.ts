import axios from 'axios';

// Clean the base URL (e.g., removing any accidental trailing slashes)
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://startupiq-nkxn.onrender.com';
  // If the user accidentally sets VITE_API_URL with a trailing slash or an incorrect /api/v1 path, clean it up
  return envUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
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

// Interceptor to handle errors globally and implement auto-retry for Render cold starts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Retry logic for 502/503/504 or network errors (common during cold start)
    if (!config || !config.retry) config.retry = 0;
    const MAX_RETRIES = 2;
    
    if (config.retry < MAX_RETRIES && (!response || (response.status >= 500 && response.status <= 504))) {
      config.retry += 1;
      const delay = config.retry * 2000; // 2s, 4s delay
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Cold start detected. Retrying request (${config.retry}/${MAX_RETRIES})...`);
      return api(config);
    }

    const isAuthRequest = error.config?.url?.includes('/auth/login');
    if (error.response && error.response.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: any) => {
    const params = new URLSearchParams();
    params.append('username', data.email);
    params.append('password', data.password);
    return api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const ideaApi = {
  generate: (data: any) => api.post('/ideas/generate', data),
  getHistory: () => api.get('/ideas/history'),
  save: (ideaId: string) => api.post('/ideas/save', { idea_id: ideaId }),
  getSaved: () => api.get('/ideas/saved'),
  deleteSaved: (id: string) => api.delete(`/ideas/saved/${id}`),
};

export const chatApi = {
  sendMessage: (message: string) => api.post('/chat/', { message }),
  getHistory: () => api.get('/chat/history'),
};

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getTrends: () => api.get('/dashboard/trends'),
  getActivity: () => api.get('/dashboard/activity'),
};

export const settingsApi = {
  get: () => api.get('/settings/'),
  update: (data: any) => api.put('/settings/', data),
};

export const skillsApi = {
  suggest: (query: string) => api.post('/skills/suggest', { query }),
};

export const insightsApi = {
  analyze: (data: { idea_id: string; business_idea: string; description: string }) => 
    api.post('/insights/analyze', data),
};

export default api;
