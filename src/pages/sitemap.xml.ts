import services from '../data/services.json'
import { getPosts } from '../posts'
export function GET() {
  const base = 'https://redbarn.ventures'
  const paths = ['/', '/services', ...services.map((s) => `/services/${s.slug}`), '/ai', '/industries', '/process', '/insights', ...getPosts().map((p) => `/insights/${p.slug}`), '/about', '/contact', '/privacy', '/terms', '/imprint']
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${base}${p}</loc><lastmod>2026-11-20</lastmod></url>`).join('\n')}\n</urlset>\n`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
