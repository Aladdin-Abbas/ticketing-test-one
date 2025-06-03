
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual Xano API call
          console.log('Login attempt:', { email, password });
          
          // Mock successful login for demo
          const mockUser: User = {
            id: '1',
            email,
            name: 'Demo User',
          };
          
          set({ 
            user: mockUser, 
            token: 'mock-jwt-token',
            isLoading: false 
          });
        } catch (error) {
          console.error('Login failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual Xano API call
          console.log('Register attempt:', { email, password, name });
          
          // Mock successful registration for demo
          const mockUser: User = {
            id: '1',
            email,
            name,
          };
          
          set({ 
            user: mockUser, 
            token: 'mock-jwt-token',
            isLoading: false 
          });
        } catch (error) {
          console.error('Registration failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
