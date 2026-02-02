import { create } from 'zustand';
import api, { getErrorMessage } from '../utils/api';
import type { Blog, BlogCreateRequest, BlogUpdateRequest, ApiResponse } from '../types/api';

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  fetchBlogBySlug: (slug: string) => Promise<void>;
  createBlog: (data: BlogCreateRequest) => Promise<Blog>;
  updateBlog: (id: string, data: BlogUpdateRequest) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentBlog: () => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse<Blog[]>>('/api/blogs');
      
      if (response.data.success && response.data.data) {
        set({ blogs: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchBlogById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse<Blog>>(`/api/blogs/${id}`);
      
      if (response.data.success && response.data.data) {
        set({ currentBlog: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch blog');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchBlogBySlug: async (slug: string) => {
    set({ loading: true, error: null });
    
    try {
      // Note: You'll need to add a GET /api/blogs/slug/:slug endpoint in backend
      // Or fetch all and filter by slug
      const response = await api.get<ApiResponse<Blog[]>>('/api/blogs');
      
      if (response.data.success && response.data.data) {
        const blog = response.data.data.find(b => b.slug === slug);
        
        if (blog) {
          set({ currentBlog: blog, loading: false });
        } else {
          throw new Error('Blog not found');
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch blog');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createBlog: async (data: BlogCreateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post<ApiResponse<Blog>>('/api/blogs', data);
      
      if (response.data.success && response.data.data) {
        const newBlog = response.data.data;
        
        set((state) => ({
          blogs: [newBlog, ...state.blogs],
          loading: false,
        }));
        
        return newBlog;
      } else {
        throw new Error(response.data.message || 'Failed to create blog');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateBlog: async (id: string, data: BlogUpdateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put<ApiResponse<Blog>>(`/api/blogs/${id}`, data);
      
      if (response.data.success && response.data.data) {
        const updatedBlog = response.data.data;
        
        set((state) => ({
          blogs: state.blogs.map((blog) => (blog.id === id ? updatedBlog : blog)),
          currentBlog: state.currentBlog?.id === id ? updatedBlog : state.currentBlog,
          loading: false,
        }));
        
        return updatedBlog;
      } else {
        throw new Error(response.data.message || 'Failed to update blog');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteBlog: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete<ApiResponse>(`/api/blogs/${id}`);
      
      if (response.data.success) {
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog.id !== id),
          currentBlog: state.currentBlog?.id === id ? null : state.currentBlog,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete blog');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentBlog: () => set({ currentBlog: null }),
}));