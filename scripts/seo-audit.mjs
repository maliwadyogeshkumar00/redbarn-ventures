// Repeatable SEO audit over the built site (dist/). Usage: npm run build && node scripts/seo-audit.mjs
import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve(process.argv[2] || 'dist')
const SITE = 'https://redbarn.ventures'
const issues = []
const add = (severity, url, issue, fix) => issues.push({ severity, url, issue, fix })

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
const files = walk(DIST)
const htmlFiles = files.filter((f) => f.endsWith('.html'))
const toRoute = (f) => { let r = '/' + path.relative(DIST, f).replace(/\\/g, '/'); r = r.replace(/index\.html$/, ''); return r }
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')); return m ? decode(m[2] ?? m[3] ?? m[4] ?? '') : null }
const text = (h) => decode(h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())

// redirects
const redirects = fs.existsSync(path.join(DIST, '_redirects')) ? fs.readFileSync(path.join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/)) : []
const redirected = (p) => redirects.some(([from]) => from.endsWith('*') ? p.startsWith(from.slice(0, -1)) : p.replace(/\/$/, '') === from.replace(/\/$/, ''))
const exists = (p) => {
  p = decodeURIComponent(p.split('#')[0].split('?')[0])
  if (!p || p === '/') return fs.existsSync(path.join(DIST, 'index.html'))
  const f = path.join(DIST, p)
  return (fs.existsSync(f) && fs.statSync(f).isFile()) || fs.existsSync(path.join(f, 'index.html')) || fs.existsSync(f + '.html')
}

const pages = []
const titles = new Map(), descs = new Map()
for (const f of htmlFiles) {
  const route = toRoute(f)
  const html = fs.readFileSync(f, 'utf8')
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [, ''])[1]
  const robots = (head.match(/<meta[^>]+name=["']robots["'][^>]*>/i) || [''])[0]
  const noindex = /noindex/i.test(attr(robots, 'content') || '')
  const is404 = route === '/404.html'
  const page = { route, noindex, html, size: Buffer.byteLength(html) }
  pages.push(page)
  const skipMeta = noindex || is404
  const title = text((head.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1])
  const descTag = (head.match(/<meta[^>]+name=["']description["'][^>]*>/i) || [''])[0]
  const desc = attr(descTag, 'content') || ''
  const canonTag = (head.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [''])[0]
  const canon = attr(canonTag, 'href')
  if (!title) add('High', route, 'Missing <title>', 'Pass a title prop to Base layout')
  else if (!skipMeta) { titles.set(title, [...(titles.get(title) || []), route]); if (title.length > 65) add('Low', route, `Title ${title.length} chars (may truncate): "${title}"`, 'Shorten to ~60 chars') ; if (title.length < 20) add('Low', route, `Title short (${title.length})`, 'Make title more descriptive') }
  if (!desc && !skipMeta) add('High', route, 'Missing meta description', 'Add description prop')
  else if (!skipMeta) { descs.set(desc, [...(descs.get(desc) || []), route]); if (desc.length > 165) add('Low', route, `Description ${desc.length} chars`, 'Trim to 120-160 chars'); if (desc.length < 70) add('Low', route, `Description short (${desc.length})`, 'Expand to 120-160 chars') }
  if (!skipMeta) {
    if (!canon) add('High', route, 'Missing canonical', 'Add rel=canonical')
    else { const expect = SITE + route; if (canon !== expect) add('Medium', route, `Canonical ${canon} != ${expect}`, 'Canonical should be the trailing-slash URL served by Cloudflare') }
    for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!new RegExp(`property=["']${p}["']`).test(head)) add('Medium', route, `Missing ${p}`, 'Add Open Graph tag')
    if (!/name=["']twitter:card["']/.test(head)) add('Low', route, 'Missing twitter:card', 'Add twitter card')
    const ogimg = attr((head.match(/<meta[^>]+property=["']og:image["'][^>]*>/i) || [''])[0], 'content')
    if (ogimg && ogimg.startsWith(SITE) && !exists(ogimg.slice(SITE.length))) add('High', route, `og:image not found: ${ogimg}`, 'Point to an existing image')
  }
  if (!/<html[^>]+lang=/i.test(html)) add('Medium', route, 'Missing html lang', 'Add lang attribute')
  // headings
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, html])[1]
  const h1s = body.match(/<h1[\s>][\s\S]*?<\/h1>/gi) || []
  if (!skipMeta || is404) { if (h1s.length === 0) add('High', route, 'No H1', 'Add one H1'); if (h1s.length > 1) add('Medium', route, `${h1s.length} H1s`, 'Use one H1') }
  const levels = [...body.matchAll(/<h([1-6])[\s>]/gi)].map((m) => +m[1])
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { add('Low', route, `Heading skip h${levels[i - 1]} -> h${levels[i]}`, 'Keep heading levels sequential'); break }
  // links
  for (const m of body.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(m[0], 'href')
    if (href === null) continue
    if (!href || href === '#') { add('Low', route, `Empty/placeholder link href="${href}"`, 'Point to a real URL or use a button'); continue }
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) continue
    let p = href
    if (p.startsWith(SITE)) p = p.slice(SITE.length) || '/'
    if (/^https?:/i.test(p) || p.startsWith('//')) continue
    if (!p.startsWith('/')) p = path.posix.join(route.endsWith('/') ? route : path.posix.dirname(route), p)
    if (!exists(p)) add(redirected(p) ? 'Medium' : 'High', route, `${redirected(p) ? 'Link goes through redirect' : 'Broken internal link'}: ${href}`, redirected(p) ? 'Link to final URL' : 'Fix or remove link')
  }
  // images
  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])
  imgs.forEach((t, i) => {
    const src = attr(t, 'src')
    const alt = attr(t, 'alt')
    if (alt === null) add('High', route, `Image missing alt: ${src}`, 'Add descriptive alt (or alt="" if decorative)')
    if (src && src.startsWith('/') && !exists(src)) add('High', route, `Broken image: ${src}`, 'Fix image path')
    if (!attr(t, 'width') || !attr(t, 'height')) add('Low', route, `Image without width/height (CLS risk): ${src}`, 'Set intrinsic dimensions')
  })
  // css bg images & other asset refs
  for (const m of html.matchAll(/url\((['"]?)(\/[^)'"]+)\1\)/g)) if (!exists(m[2])) add('High', route, `Broken CSS url(): ${m[2]}`, 'Fix asset path')
  for (const m of head.matchAll(/<(?:link|script)\b[^>]*(?:href|src)=["'](\/[^"']+)["'][^>]*>/gi)) if (!exists(m[1])) add('High', route, `Broken head asset: ${m[1]}`, 'Fix asset path')
  // JSON-LD
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]); const arr = Array.isArray(data) ? data : (data['@graph'] || [data])
      for (const n of arr) { if (!n['@type']) add('Medium', route, 'JSON-LD node without @type', 'Add @type')
        if (n['@type'] === 'BreadcrumbList') (n.itemListElement || []).forEach((it) => { const u = it.item && (it.item['@id'] || it.item); if (typeof u === 'string' && u.startsWith(SITE) && !exists(u.slice(SITE.length))) add('Medium', route, `Breadcrumb item 404: ${u}`, 'Fix breadcrumb URL') })
        if (n['@type'] === 'FAQPage') { const q = n.mainEntity || []; q.forEach((x) => { if (!body.includes(decode(x.name).slice(0, 25).replace(/&/g, '&amp;')) && !text(body).includes(x.name.slice(0, 25))) add('High', route, `FAQ schema question not visible on page: ${x.name.slice(0, 50)}`, 'Schema must match visible content') }) }
      }
      page.types = [...(page.types || []), ...arr.map((n) => n['@type'])]
    } catch (e) { add('High', route, 'Invalid JSON-LD: ' + e.message, 'Fix JSON') }
  }
  if (!skipMeta && !(page.types || []).length) add('Low', route, 'No structured data', 'Add WebPage/BreadcrumbList')
  if (/http:\/\/(?!www\.w3\.org|localhost)/.test(html.replace(/xmlns(:\w+)?="[^"]+"/g, ''))) add('Medium', route, 'Insecure http:// reference', 'Use https')
  if (page.size > 200000) add('Low', route, `HTML is ${Math.round(page.size / 1024)} KB`, 'Reduce inline payload')
}
for (const [t, r] of titles) if (r.length > 1) add('High', r.join(', '), `Duplicate title: "${t}"`, 'Make titles unique')
for (const [d, r] of descs) if (r.length > 1) add('Medium', r.join(', '), `Duplicate description: "${d.slice(0, 60)}..."`, 'Make descriptions unique')

// sitemap & robots
const sm = path.join(DIST, 'sitemap.xml')
if (!fs.existsSync(sm)) add('High', '/sitemap.xml', 'Missing sitemap', 'Generate sitemap')
else {
  const locs = [...fs.readFileSync(sm, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const inSm = new Set(locs.map((l) => l.slice(SITE.length)))
  for (const l of locs) { const p = l.slice(SITE.length); const pg = pages.find((x) => x.route === p); if (!pg) add('High', '/sitemap.xml', `Sitemap URL has no page: ${l}`, 'Remove from sitemap'); else if (pg.noindex) add('High', '/sitemap.xml', `Sitemap lists noindex page: ${l}`, 'Remove from sitemap') }
  for (const pg of pages) if (!pg.noindex && pg.route !== '/404.html' && !inSm.has(pg.route)) add('Medium', pg.route, 'Indexable page missing from sitemap', 'Add to sitemap or noindex')
}
const robotsTxt = fs.existsSync(path.join(DIST, 'robots.txt')) ? fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8') : ''
if (!robotsTxt) add('High', '/robots.txt', 'Missing robots.txt', 'Add robots.txt')
else { if (!/Sitemap:/i.test(robotsTxt)) add('Medium', '/robots.txt', 'No Sitemap line', 'Add Sitemap'); if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) add('High', '/robots.txt', 'Disallow: / blocks whole site', 'Remove'); if (/Disallow:\s*\/(_astro|assets)/m.test(robotsTxt)) add('High', '/robots.txt', 'Blocks render resources', 'Allow CSS/JS') }
// orphan check: indexable pages with no inbound internal link
const inbound = new Map(pages.map((p) => [p.route, 0]))
for (const p of pages) for (const m of p.html.matchAll(/<a\b[^>]*href=["']([^"'#?]+)/gi)) { let h = m[1]; if (h.startsWith(SITE)) h = h.slice(SITE.length); if (!h.startsWith('/')) continue; if (!h.endsWith('/') && !path.extname(h)) h += '/'; if (h !== p.route && inbound.has(h)) inbound.set(h, inbound.get(h) + 1) }
for (const [r, n] of inbound) { const pg = pages.find((p) => p.route === r); if (n === 0 && !pg.noindex && r !== '/' && r !== '/404.html') add('Medium', r, 'Orphan page (no internal links point here)', 'Link from a hub page') }

// unused images
const allText = files.filter((f) => /\.(html|css|js|xml|webmanifest|json)$/.test(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n')
for (const f of files.filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f) && !f.includes(`${path.sep}_astro${path.sep}`))) { const rel = '/' + path.relative(DIST, f).replace(/\\/g, '/'); if (!allText.includes(rel) && !/(favicon|apple-touch|icon-512|og\.jpg|logo|bimi|brand|email)/.test(rel)) add('Low', rel, 'Image asset not referenced by any page', 'Remove unused asset') }

const order = { High: 0, Medium: 1, Low: 2 }
issues.sort((a, b) => order[a.severity] - order[b.severity] || a.url.localeCompare(b.url))
const count = (s) => issues.filter((i) => i.severity === s).length
const out = [`# SEO audit - ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`, '', `Pages scanned: ${pages.length} (${pages.filter((p) => p.noindex).length} noindex). Issues: ${issues.length} - High ${count('High')}, Medium ${count('Medium')}, Low ${count('Low')}`, '', '| Severity | URL | Issue | Recommended correction |', '|---|---|---|---|', ...issues.map((i) => `| ${i.severity} | ${i.url} | ${i.issue.replace(/\|/g, '\\|')} | ${i.fix} |`)]
fs.writeFileSync('seo-audit-report.md', out.join('\n') + '\n')
console.log(out.slice(0, 3).join('\n'))
const summary = {}; for (const i of issues) { const k = i.severity + ' | ' + i.issue.replace(/:.*$/, '').replace(/\d+/g, 'N'); summary[k] = (summary[k] || 0) + 1 }
console.log(Object.entries(summary).sort().map(([k, v]) => `${v}x ${k}`).join('\n'))
process.exitCode = count('High') ? 1 : 0
