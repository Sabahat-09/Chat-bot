import { create } from 'zustand';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: 'admin' | 'user') => Promise<void>;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    try {
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    set({
      user,
      token: access_token,
      isAuthenticated: true,
    });
  },

  register: async (email: string, password: string, role: 'admin' | 'user' = 'user') => {
    const response = await api.post('/auth/register', { email, password, role });
    const { access_token, user } = response.data;
    try {
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    set({
      user,
      token: access_token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

