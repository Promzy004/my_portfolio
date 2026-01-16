import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  image?: string;
  schema?: object;
}

const baseUrl = 'https://edwin-promise.vercel.app';
const defaultImage = `${baseUrl}/images/default-preview.jpg`;
const siteName = 'Edwin Promise Portfolio';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  path, 
  image, 
  schema 
}: SEOProps) {
  const canonicalUrl = `${baseUrl}${path}`;
  const fullTitle = path === '/' ? title : `${title} - Edwin Promise`;
  const ogImage = image || defaultImage;
  const keywordsString = keywords.join(', ');

  return (
    <Helmet>
        {/* ========================================
        PRIMARY META TAGS
        ======================================== */}
        <title>{fullTitle}</title>
        <meta name="title" content={fullTitle} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywordsString} />
        <meta name="author" content="Edwin Promise" />
        <meta name="robots" content="index, follow" />
        
        {/* ========================================
            CANONICAL URL
            ======================================== */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* ========================================
            OPEN GRAPH / FACEBOOK
            ======================================== */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:image:alt" content={fullTitle} />
        <meta property="og:locale" content="en_US" />
        
        {/* ========================================
            TWITTER CARD
            ======================================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:creator" content="@promzy_004" />
        
        {/* ========================================
            ADDITIONAL META
            ======================================== */}
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* ========================================
            JSON-LD STRUCTURED DATA
            ======================================== */}
        {schema && (
            <script type="application/ld+json">
            {JSON.stringify(schema)}
            </script>
            // <script
            //     type="application/ld+json"
            //     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            // />
        )}
    </Helmet>
  );
}