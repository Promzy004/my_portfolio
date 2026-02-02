import { create } from 'zustand';
import api, { getErrorMessage } from '../utils/api';
import type { Experience, ExperienceCreateRequest, ExperienceUpdateRequest, ApiResponse } from '../types/api';

interface ExperienceState {
  experiences: Experience[];
  currentExperience: Experience | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchExperiences: () => Promise<void>;
  fetchExperienceById: (id: string) => Promise<void>;
  createExperience: (data: ExperienceCreateRequest) => Promise<Experience>;
  updateExperience: (id: string, data: ExperienceUpdateRequest) => Promise<Experience>;
  deleteExperience: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentExperience: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  experiences: [],
  currentExperience: null,
  loading: false,
  error: null,

  fetchExperiences: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse<Experience[]>>('/api/experiences');
      
      if (response.data.success && response.data.data) {
        set({ experiences: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch experiences');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchExperienceById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse<Experience>>(`/api/experiences/${id}`);
      
      if (response.data.success && response.data.data) {
        set({ currentExperience: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch experience');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createExperience: async (data: ExperienceCreateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post<ApiResponse<Experience>>('/api/experiences', data);
      
      if (response.data.success && response.data.data) {
        const newExperience = response.data.data;
        
        set((state) => ({
          experiences: [newExperience, ...state.experiences],
          loading: false,
        }));
        
        return newExperience;
      } else {
        throw new Error(response.data.message || 'Failed to create experience');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateExperience: async (id: string, data: ExperienceUpdateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put<ApiResponse<Experience>>(`/api/experiences/${id}`, data);
      
      if (response.data.success && response.data.data) {
        const updatedExperience = response.data.data;
        
        set((state) => ({
          experiences: state.experiences.map((exp) => (exp.id === id ? updatedExperience : exp)),
          currentExperience: state.currentExperience?.id === id ? updatedExperience : state.currentExperience,
          loading: false,
        }));
        
        return updatedExperience;
      } else {
        throw new Error(response.data.message || 'Failed to update experience');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteExperience: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete<ApiResponse>(`/api/experiences/${id}`);
      
      if (response.data.success) {
        set((state) => ({
          experiences: state.experiences.filter((exp) => exp.id !== id),
          currentExperience: state.currentExperience?.id === id ? null : state.currentExperience,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete experience');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentExperience: () => set({ currentExperience: null }),
}));