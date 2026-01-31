import type { BlogPost } from '../types/blog';
import type { SEOProps } from '../components/SEO/SEO';

const baseUrl = 'https://edwin-promise.vercel.app'; // Update with your actual URL
const defaultBlogImage = `${baseUrl}/images/blog-default.jpg`;

/**
 * Generates SEO metadata for a blog post
 * Follows the same pattern as seoData.ts for consistency
 * Falls back to auto-generated values when metadata is not provided
 */
export function generateBlogSEO(blog: BlogPost): SEOProps {
  // Extract first image from blocks if no meta_image is provided
  const extractedImage = extractFirstImageFromBlocks(blog.blocks);
  const blogImage = blog.meta_image || extractedImage || defaultBlogImage;

  // Auto-generate keywords from title and tags if not provided
  const keywords = blog.meta_keywords && blog.meta_keywords.length > 0
    ? blog.meta_keywords
    : generateKeywordsFromBlog(blog);

  // Use meta fields or fall back to default fields
  const title = blog.meta_title || blog.title;
  const description = blog.meta_description || blog.excerpt;

  return {
    title,
    description,
    keywords,
    path: `/blog/${blog.slug}`,
    image: blogImage,
    schema: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": blogImage,
      "datePublished": blog.date,
      "dateModified": blog.updated_at,
      "author": {
        "@type": "Person",
        "name": "Edwin Promise",
        "url": baseUrl,
        "jobTitle": "Full-Stack Web Developer",
        "sameAs": [
          "https://github.com/Promzy004",
          "https://www.linkedin.com/in/edwin-promise-a73b822b6/",
          "https://x.com/promzy_004"
        ]
      },
      "publisher": {
        "@type": "Person",
        "name": "Edwin Promise",
        "url": baseUrl
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${blog.slug}`
      },
      "url": `${baseUrl}/blog/${blog.slug}`,
      "keywords": keywords.join(', '),
      "articleBody": extractTextFromBlocks(blog.blocks),
      "wordCount": calculateWordCount(blog.blocks),
      "inLanguage": "en-US"
    }
  };
}

/**
 * Generates SEO for blog list page
 */
export function generateBlogListSEO(): SEOProps {
  return {
    title: 'Blog',
    description: 'Technical articles, tutorials, and insights on web development, React, TypeScript, Go, and modern software engineering practices by Edwin Promise.',
    keywords: [
      'Web Development Blog',
      'React Tutorials',
      'TypeScript Articles',
      'Go Programming',
      'Software Engineering',
      'Tech Blog Nigeria',
      'Edwin Promise Blog',
      'Full-Stack Development'
    ],
    path: '/blog',
    image: `${baseUrl}/images/blog-preview.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Edwin Promise's Blog",
      "description": "Technical articles and tutorials on modern web development",
      "url": `${baseUrl}/blog`,
      "author": {
        "@type": "Person",
        "name": "Edwin Promise",
        "url": baseUrl
      },
      "publisher": {
        "@type": "Person",
        "name": "Edwin Promise"
      },
      "inLanguage": "en-US"
    }
  };
}

/**
 * Extracts the first image URL from blog blocks
 * Looks for images in paragraph or specific image blocks
 */
function extractFirstImageFromBlocks(blocks: any[]): string | null {
  for (const block of blocks) {
    // Check if block contains image data
    if (block.type === 'image' && block.data?.url) {
      return block.data.url;
    }
    
    // Check if paragraph contains img tag
    if (block.type === 'paragraph' && block.data?.text) {
      const imgMatch = block.data.text.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        return imgMatch[1];
      }
    }
  }
  
  return null;
}

/**
 * Auto-generates keywords from blog content
 * Extracts important words from title and content
 */
function generateKeywordsFromBlog(blog: BlogPost): string[] {
  const keywords: string[] = [];
  
  // Add main topic keywords
  keywords.push('Blog Post', 'Edwin Promise');
  
  // Extract words from title (excluding common words)
  const titleWords = blog.title
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3)
    .filter(word => !commonWords.includes(word));
  
  keywords.push(...titleWords.slice(0, 3));
  
  // Add technical keywords if found in content
  const technicalKeywords = extractTechnicalKeywords(blog.blocks);
  keywords.push(...technicalKeywords);
  
  return keywords.slice(0, 10); // Limit to 10 keywords
}

/**
 * Extracts technical keywords from code blocks
 */
function extractTechnicalKeywords(blocks: any[]): string[] {
  const keywords = new Set<string>();
  const techStack = [
    'React', 'TypeScript', 'JavaScript', 'Go', 'Python', 'Laravel',
    'PHP', 'Node.js', 'Express', 'Next.js', 'TailwindCSS', 'CSS',
    'HTML', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes',
    'AWS', 'Git', 'API', 'REST', 'GraphQL'
  ];
  
  for (const block of blocks) {
    const blockText = JSON.stringify(block).toLowerCase();
    
    for (const tech of techStack) {
      if (blockText.includes(tech.toLowerCase())) {
        keywords.add(tech);
      }
    }
  }
  
  return Array.from(keywords);
}

/**
 * Extracts plain text from all blocks for schema.org articleBody
 */
function extractTextFromBlocks(blocks: any[]): string {
  const textParts: string[] = [];
  
  for (const block of blocks) {
    if (block.type === 'paragraph' && block.data?.text) {
      textParts.push(block.data.text);
    } else if (block.type === 'heading' && block.data?.text) {
      textParts.push(block.data.text);
    } else if (block.type === 'list' && block.data?.items) {
      textParts.push(...block.data.items);
    } else if (block.type === 'callout' && block.data?.text) {
      textParts.push(block.data.text);
    }
  }
  
  return textParts.join(' ').slice(0, 500); // Limit for schema
}

/**
 * Calculates approximate word count from blocks
 */
function calculateWordCount(blocks: any[]): number {
  const text = extractTextFromBlocks(blocks);
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Common words to exclude from auto-generated keywords
 */
const commonWords = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
  'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
  'more', 'most', 'other', 'some', 'such', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again'
];