// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  }
  
  // Auth Types
  export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }
  
  export interface RefreshTokenRequest {
    refresh_token: string;
  }
  
  export interface RefreshTokenResponse {
    access_token: string;
    expires_in: number;
  }
  
  // Blog Types
  export interface BlogBlock {
    id: string;
    type: 'paragraph' | 'heading' | 'list' | 'code' | 'callout';
    data: {
      text?: string;
      level?: 2 | 3;
      items?: string[];
      code?: string;
      language?: string;
    };
  }
  
  export interface Blog {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    meta_title?: string;
    meta_description?: string;
    meta_image?: string;
    meta_keywords?: string[];
    blocks: BlogBlock[];
    created_at: string;
    updated_at: string;
  }
  
  export interface BlogCreateRequest {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    meta_title?: string;
    meta_description?: string;
    meta_image?: string;
    meta_keywords?: string[];
    blocks: BlogBlock[];
  }
  
  export interface BlogUpdateRequest extends BlogCreateRequest {}
  
  // Project Types
  export interface Project {
    id: number;
    name: string;
    date: string;
    link: string;
    tags: string[];
    desc: string;
    image: string;
    category: 'web' | 'mobile' | 'desktop' | 'other';
    created_at: string;
    updated_at: string;
  }
  
  export interface ProjectCreateRequest {
    name: string;
    date: string;
    link: string;
    tags: string[];
    desc: string;
    image: string;
    category: 'web' | 'mobile' | 'desktop' | 'other';
  }
  
  export interface ProjectUpdateRequest extends ProjectCreateRequest {}
  
  // Skill Types
  export interface Skill {
    id: string;
    name: string;
    icon: string;
    category?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface SkillCreateRequest {
    name: string;
    icon: string;
    category?: string;
  }
  
  export interface SkillUpdateRequest extends SkillCreateRequest {}
  
  // Social Types
  export interface Social {
    id: string;
    name: string;
    url: string;
    icon: string;
    platform: 'github' | 'linkedin' | 'twitter' | 'tiktok' | 'email' | 'other';
    created_at: string;
    updated_at: string;
  }
  
  export interface SocialCreateRequest {
    name: string;
    url: string;
    icon: string;
    platform: 'github' | 'linkedin' | 'twitter' | 'tiktok' | 'email' | 'other';
  }
  
  export interface SocialUpdateRequest extends SocialCreateRequest {}
  
  // Experience Types
  export interface Experience {
    id: string;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
    technologies: string[];
    location?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ExperienceCreateRequest {
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
    technologies: string[];
    location?: string;
  }
  
  export interface ExperienceUpdateRequest extends ExperienceCreateRequest {}
  
  // Upload Types
  export interface UploadResponse {
    url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    size: number;
  }