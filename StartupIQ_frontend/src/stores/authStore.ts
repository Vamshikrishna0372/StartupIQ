import { create } from 'zustand';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      set({ isLoading: true });
      const response = await authApi.getMe();
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('token', data.access_token);
      const userResponse = await authApi.getMe();
      set({ user: userResponse.data, isAuthenticated: true });
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      await authApi.register({ name, email, password });
      // Automatically login after registration
      await useAuthStore.getState().login(email, password);
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (name: string, email: string) => {
    set({ isLoading: true });
    try {
      await authApi.updateProfile({ name, email });
      const userResponse = await authApi.getMe();
      set({ user: userResponse.data });
    } catch (error) {
      console.error("Update Profile Error:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));

