import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { getErrorMessage } from '../utils/api';
import type { User, LoginRequest, LoginResponse, ApiResponse } from '../types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
          
          if (response.data.success && response.data.data) {
            const { user, access_token, refresh_token } = response.data.data;
            
            // Store tokens in localStorage (for axios interceptor)
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            
            set({
              user,
              accessToken: access_token,
              refreshToken: refresh_token,
              loading: false,
              error: null,
            });
          } else {
            throw new Error(response.data.message || 'Login failed');
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          set({ loading: false, error: errorMessage });
          throw error;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        
        try {
          if (refreshToken) {
            await api.post('/api/auth/logout', { refresh_token: refreshToken });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear all auth data
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: null,
          });
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await api.post<ApiResponse<{ access_token: string; expires_in: number }>>(
            '/api/auth/refresh',
            { refresh_token: refreshToken }
          );

          if (response.data.success && response.data.data) {
            const { access_token } = response.data.data;
            
            localStorage.setItem('access_token', access_token);
            
            set({ accessToken: access_token });
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);