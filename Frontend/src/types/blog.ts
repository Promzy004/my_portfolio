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

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  slug: string
  blocks?: BlogBlock[]
}
