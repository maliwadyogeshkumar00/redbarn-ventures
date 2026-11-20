import services from '../data/services.json'
import { getPosts } from '../posts'

export function GET() {
  const base = 'https://redbarn.ventures'
  const today = '2026-11-20'
  const core: [string, string, string][] = [
    ['/', '1.0', 'weekly'], ['/services/', '0.9', 'monthly'], ['/ai/', '0.9', 'monthly'],
    ['/industries/', '0.8', 'monthly'], ['/process/', '0.7', 'monthly'], ['/insights/', '0.8', 'weekly'],
    ['/about/', '0.7', 'monthly'], ['/contact/', '0.8', 'monthly'], ['/sitemap/', '0.3', 'monthly'],
    ['/privacy/', '0.2', 'yearly'], ['/cookies/', '0.2', 'yearly'], ['/terms/', '0.2', 'yearly'],
    ['/disclaimer/', '0.2', 'yearly'], ['/accessibility/', '0.2', 'yearly'],
  ]
  const rows = [
    ...core.map(([p, pr, cf]) => ({ loc: base + p, lastmod: today, pr, cf })),
    ...services.map((s) => ({ loc: `${base}/services/${s.slug}/`, lastmod: today, pr: '0.9', cf: 'monthly' })),
    ...getPosts().map((p) => ({ loc: `${base}/insights/${p.slug}/`, lastmod: String(p.date).slice(0, 10), pr: '0.6', cf: 'yearly' })),
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.map((r) => `  <url><loc>${r.loc}</loc><lastmod>${r.lastmod}</lastmod><changefreq>${r.cf}</changefreq><priority>${r.pr}</priority></url>`).join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
