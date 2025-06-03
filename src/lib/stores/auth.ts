import { create } from 'zustand';
import { User } from '../api/types';
import * as authApi from '../api/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.login(email, password);
      set({ user, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  logout: async () => {
    await authApi.logout();
    set({ user: null });
  },
  refresh: async () => {
    set({ loading: true });
    try {
      const user = await authApi.refresh();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  checkSession: async () => {
    set({ loading: true });
    try {
      const user = await authApi.getCurrentUser();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
