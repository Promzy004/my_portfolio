import { create } from 'zustand';
import api, { getErrorMessage } from '@/utils/api';
import type { Social, SocialCreateRequest, SocialUpdateRequest, ApiResponse } from '../types/api';

interface SocialState {
  socials: Social[];
  currentSocial: Social | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSocials: (platform?: string) => Promise<void>;
  fetchSocialById: (id: string) => Promise<void>;
  createSocial: (data: SocialCreateRequest) => Promise<Social>;
  updateSocial: (id: string, data: SocialUpdateRequest) => Promise<Social>;
  deleteSocial: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentSocial: () => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  socials: [],
  currentSocial: null,
  loading: false,
  error: null,

  fetchSocials: async (platform?: string) => {
    set({ loading: true, error: null });
    
    try {
      const url = platform ? `/api/socials?platform=${platform}` : '/api/socials';
      const response = await api.get<ApiResponse<Social[]>>(url);
      
      if (response.data.success && response.data.data) {
        set({ socials: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch socials');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchSocialById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse<Social>>(`/api/socials/${id}`);
      
      if (response.data.success && response.data.data) {
        set({ currentSocial: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch social');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createSocial: async (data: SocialCreateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post<ApiResponse<Social>>('/api/socials', data);
      
      if (response.data.success && response.data.data) {
        const newSocial = response.data.data;
        
        set((state) => ({
          socials: [newSocial, ...state.socials],
          loading: false,
        }));
        
        return newSocial;
      } else {
        throw new Error(response.data.message || 'Failed to create social');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateSocial: async (id: string, data: SocialUpdateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put<ApiResponse<Social>>(`/api/socials/${id}`, data);
      
      if (response.data.success && response.data.data) {
        const updatedSocial = response.data.data;
        
        set((state) => ({
          socials: state.socials.map((social) => (social.id === id ? updatedSocial : social)),
          currentSocial: state.currentSocial?.id === id ? updatedSocial : state.currentSocial,
          loading: false,
        }));
        
        return updatedSocial;
      } else {
        throw new Error(response.data.message || 'Failed to update social');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteSocial: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete<ApiResponse>(`/api/socials/${id}`);
      
      if (response.data.success) {
        set((state) => ({
          socials: state.socials.filter((social) => social.id !== id),
          currentSocial: state.currentSocial?.id === id ? null : state.currentSocial,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete social');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentSocial: () => set({ currentSocial: null }),
}));