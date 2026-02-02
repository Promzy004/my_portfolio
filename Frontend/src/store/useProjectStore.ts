import { create } from 'zustand';
import api, { getErrorMessage } from '../utils/api';
import type { Project, ProjectCreateRequest, ProjectUpdateRequest, ApiResponse } from '../types/api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: (category?: string) => Promise<void>;
  fetchProjectById: (id: number) => Promise<void>;
  createProject: (data: ProjectCreateRequest) => Promise<Project>;
  updateProject: (id: number, data: ProjectUpdateRequest) => Promise<Project>;
  deleteProject: (id: number) => Promise<void>;
  clearError: () => void;
  clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetchProjects: async (category?: string) => {
    set({ loading: true, error: null });
    
    try {
      const url = category ? `/api/projects?category=${category}` : '/api/projects';
      const response = await api.get<ApiResponse<Project[]>>(url);
      
      if (response.data.success && response.data.data) {
        set({ projects: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchProjectById: async (id: number) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse<Project>>(`/api/projects/${id}`);
      
      if (response.data.success && response.data.data) {
        set({ currentProject: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch project');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createProject: async (data: ProjectCreateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post<ApiResponse<Project>>('/api/projects', data);
      
      if (response.data.success && response.data.data) {
        const newProject = response.data.data;
        
        set((state) => ({
          projects: [newProject, ...state.projects],
          loading: false,
        }));
        
        return newProject;
      } else {
        throw new Error(response.data.message || 'Failed to create project');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateProject: async (id: number, data: ProjectUpdateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put<ApiResponse<Project>>(`/api/projects/${id}`, data);
      
      if (response.data.success && response.data.data) {
        const updatedProject = response.data.data;
        
        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? updatedProject : project)),
          currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
          loading: false,
        }));
        
        return updatedProject;
      } else {
        throw new Error(response.data.message || 'Failed to update project');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete<ApiResponse>(`/api/projects/${id}`);
      
      if (response.data.success) {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete project');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentProject: () => set({ currentProject: null }),
}));