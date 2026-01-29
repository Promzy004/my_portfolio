// Admin Dashboard Type Definitions

export interface Project {
    id: number
    name: string
    date: string
    link: string
    tags: string[]
    desc: string
    image: string
    category: 'web' | 'mobile' | 'desktop' | 'other'
  }
  
  export interface Skill {
    id: string
    name: string
    icon: string // SVG string
    category?: string
  }
  
  export interface Social {
    id: string
    name: string
    url: string
    icon: string // SVG string
    platform: 'github' | 'linkedin' | 'twitter' | 'tiktok' | 'email' | 'other'
  }
  
  export interface Experience {
    id: string
    company: string
    position: string
    startDate: string
    endDate: string | 'Present'
    description: string
    technologies: string[]
    location?: string
  }
  
  export interface User {
    id: string
    email: string
    name: string
  }