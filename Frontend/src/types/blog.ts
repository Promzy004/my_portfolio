export type BlogBlockType = "paragraph" | "heading" | "list" | "code" | "callout"

export interface BlogBlock {
  id: string
  type: BlogBlockType
  data: {
    text?: string
    level?: 2 | 3
    items?: string[]
    code?: string
    language?: string
  }
}

// types/blog.ts
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  blocks: BlogBlock[];
  
  // SEO Metadata (optional)
  meta_title?: string;
  meta_description?: string;
  meta_image?: string;
  meta_keywords?: string[];
  
  created_at?: string;
  updated_at?: string;
}
