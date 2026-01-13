import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;

const hostname = 'https://edwin-promise.vercel.app';

const routes = [
  { url: '/', lastmod: formattedDate, changefreq: 'monthly', priority: 1.0 },
  { url: '/about', lastmod: formattedDate, changefreq: 'monthly', priority: 0.8 },
  { url: '/web-projects', lastmod: formattedDate, changefreq: 'monthly', priority: 0.9 },
  { url: '/mobile-app-projects', lastmod: formattedDate, changefreq: 'monthly', priority: 0.9 },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes.map(route => `  <url>
    <loc>${hostname}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const writeStream = createWriteStream(join(__dirname, 'public', 'sitemap.xml'));
writeStream.write(xml);
writeStream.end();

writeStream.on('finish', () => {
  console.log('Sitemap generated!');
});