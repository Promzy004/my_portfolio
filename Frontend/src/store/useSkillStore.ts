import { create } from 'zustand';
import api, { getErrorMessage } from '../utils/api';
import type { Skill, SkillCreateRequest, SkillUpdateRequest, ApiResponse } from '../types/api';

interface SkillState {
  skills: Skill[];
  currentSkill: Skill | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSkills: (category?: string) => Promise<void>;
  fetchSkillById: (id: string) => Promise<void>;
  createSkill: (data: SkillCreateRequest) => Promise<Skill>;
  updateSkill: (id: string, data: SkillUpdateRequest) => Promise<Skill>;
  deleteSkill: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentSkill: () => void;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  skills: [],
  currentSkill: null,
  loading: false,
  error: null,

  fetchSkills: async (category?: string) => {
    set({ loading: true, error: null });
    
    try {
      const url = category ? `/api/skills?category=${category}` : '/api/skills';
      const response = await api.get<ApiResponse<Skill[]>>(url);
      
      if (response.data.success && response.data.data) {
        set({ skills: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch skills');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchSkillById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse<Skill>>(`/api/skills/${id}`);
      
      if (response.data.success && response.data.data) {
        set({ currentSkill: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch skill');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createSkill: async (data: SkillCreateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post<ApiResponse<Skill>>('/api/skills', data);
      
      if (response.data.success && response.data.data) {
        const newSkill = response.data.data;
        
        set((state) => ({
          skills: [newSkill, ...state.skills],
          loading: false,
        }));
        
        return newSkill;
      } else {
        throw new Error(response.data.message || 'Failed to create skill');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateSkill: async (id: string, data: SkillUpdateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put<ApiResponse<Skill>>(`/api/skills/${id}`, data);
      
      if (response.data.success && response.data.data) {
        const updatedSkill = response.data.data;
        
        set((state) => ({
          skills: state.skills.map((skill) => (skill.id === id ? updatedSkill : skill)),
          currentSkill: state.currentSkill?.id === id ? updatedSkill : state.currentSkill,
          loading: false,
        }));
        
        return updatedSkill;
      } else {
        throw new Error(response.data.message || 'Failed to update skill');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteSkill: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete<ApiResponse>(`/api/skills/${id}`);
      
      if (response.data.success) {
        set((state) => ({
          skills: state.skills.filter((skill) => skill.id !== id),
          currentSkill: state.currentSkill?.id === id ? null : state.currentSkill,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete skill');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentSkill: () => set({ currentSkill: null }),
}));