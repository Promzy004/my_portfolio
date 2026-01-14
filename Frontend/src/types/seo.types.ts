export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  image?: string;
  schema?: object;
}

export interface SEODataMap {
  [key: string]: SEOData;
}