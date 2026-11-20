import { execSync } from 'node:child_process'
import services from '../data/services.json'
import { getPosts } from '../posts'

// Last commit date per file, read from one git log call; falls back to the build date.
let dates: Map<string, string> | null = null
const loadDates = () => {
  const m = new Map<string, string>()
  try {
    const out = execSync('git log --format=@%cs --name-only -- src', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 })
    let cur = ''
    for (const line of out.split('\n')) { if (line.startsWith('@')) cur = line.slice(1); else if (line && !m.has(line)) m.set(line, cur) }
  } catch {}
  return m
}
const lastmod = (...files: string[]) => {
  dates ??= loadDates()
  const hits = [...dates].filter(([f]) => files.some((x) => f === x || f.startsWith(x + '/'))).map(([, d]) => d).sort()
  return hits.at(-1) || new Date().toISOString().slice(0, 10)
}

export function GET() {
  const base = 'https://redbarn.ventures'
  const pg = (n: string) => `src/pages/${n}.astro`
  const core: [string, string[]][] = [
    ['/', [pg('index'), 'src/data/home.json']], ['/services/', [pg('services/index'), 'src/data/services.json']], ['/ai/', [pg('ai')]],
    ['/industries/', [pg('industries')]], ['/process/', [pg('process')]], ['/insights/', [pg('insights/index'), 'src/posts']],
    ['/about/', [pg('about')]], ['/contact/', [pg('contact')]], ['/sitemap/', [pg('sitemap')]],
    ['/privacy/', [pg('privacy')]], ['/cookies/', [pg('cookies')]], ['/terms/', [pg('terms')]],
    ['/disclaimer/', [pg('disclaimer')]], ['/accessibility/', [pg('accessibility')]],
  ]
  const svcMod = lastmod('src/data/services.json', 'src/pages/services/[slug].astro')
  const rows = [
    ...core.map(([p, f]) => ({ loc: base + p, lastmod: lastmod(...f) })),
    ...services.map((s) => ({ loc: `${base}/services/${s.slug}/`, lastmod: svcMod })),
    ...getPosts().map((p) => ({ loc: `${base}/insights/${p.slug}/`, lastmod: String(p.date).slice(0, 10) })),
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.map((r) => `  <url><loc>${r.loc}</loc><lastmod>${r.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
