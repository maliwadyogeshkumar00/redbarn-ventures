// Writes a per-route HTML shell with correct <title>, description, canonical, Open Graph and JSON-LD,
// so crawlers, AI engines and link previews (LinkedIn, WhatsApp, Slack) see real metadata for every page.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DOMAINS, STAGES, INDUSTRIES, EMAIL, SITE_URL, CITIES } from '../src/content/site.ts'
import { ARTICLES } from '../src/content/insights.ts'

type M = { path: string; title: string; desc: string; img?: string; ld?: object }
const T = (t: string) => (t.includes('Redbarn') ? t : `${t} — Redbarn Ventures`)
const routes: M[] = [
  { path: '/', title: 'Redbarn Ventures — Consulting, Ownership & Investment under one roof', desc: 'Redbarn Ventures brings design, technology, marketing, business and finance consultancy together with long-term ownership and investment, across Ahmedabad, Oslo, London and Amsterdam.' },
  { path: '/consultancy', title: 'Consultancy: Design, Technology, Marketing, Business & Finance', desc: 'Brand and web design, software development, digital marketing, Six Sigma business consulting and accounting, delivered by one team.', img: 'consultancy' },
  { path: '/investment', title: 'Investment: Pre-seed to Growth', desc: 'Redbarn Ventures invests from first cheque to growth capital, and every investment comes with the full consultancy bench.', img: 'investment' },
  { path: '/industry', title: 'Industries we serve', desc: 'Technology and SaaS, fintech, healthcare, consumer and retail, energy and climate, media, real estate and industrial manufacturing.', img: 'industry' },
  { path: '/about', title: 'About Redbarn Ventures', desc: 'Consulting, long-term ownership and investing under one roof, working with founders and companies across Ahmedabad, Oslo, London and Amsterdam.', img: 'about' },
  { path: '/careers', title: 'Careers', desc: 'Design, technology, marketing, business and finance roles at Redbarn Ventures, with real ownership and range.', img: 'careers' },
  { path: '/insights', title: 'Insights', desc: 'Practical writing on building, running and backing companies.', img: 'insights' },
  { path: '/contact', title: 'Contact', desc: 'Tell us what you are building. A real person reads every message and replies within two business days.' },
  { path: '/privacy', title: 'Privacy policy', desc: 'How Redbarn Ventures collects, uses and protects personal data.' },
  { path: '/terms', title: 'Terms of use', desc: 'Terms of use for the Redbarn Ventures website.' },
  { path: '/cookies', title: 'Cookie policy', desc: 'No advertising, analytics or tracking cookies are used on redbarn.ventures.' },
  ...DOMAINS.map((d) => ({ path: `/consultancy/${d.slug}`, title: `${d.name} Consultancy`, desc: `${d.tagline} ${d.intro}`, img: d.slug,
    ld: { '@context': 'https://schema.org', '@type': 'Service', name: `${d.name} consultancy`, provider: { '@type': 'Organization', name: 'Redbarn Ventures', url: SITE_URL }, description: d.intro, hasOfferCatalog: { '@type': 'OfferCatalog', name: d.name, itemListElement: d.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.desc } })) } } })),
  ...STAGES.map((s) => ({ path: `/investment/${s.slug}`, title: `${s.name} investment`, desc: s.desc, img: s.slug })),
  ...INDUSTRIES.map((i) => ({ path: `/industry/${i.slug}`, title: `${i.name}: consultancy & investment`, desc: i.desc, img: i.slug })),
  ...ARTICLES.map((a) => ({ path: `/insights/${a.slug}`, title: a.title, desc: a.excerpt, img: 'insights',
    ld: { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, datePublished: a.date, dateModified: a.date, author: { '@type': 'Organization', name: 'Redbarn Ventures', url: SITE_URL }, publisher: { '@type': 'Organization', name: 'Redbarn Ventures', logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } }, mainEntityOfPage: `${SITE_URL}/insights/${a.slug}` } })),
]

const org = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Redbarn Ventures', url: SITE_URL, email: EMAIL, logo: `${SITE_URL}/favicon.svg`,
  description: 'Consulting, long-term ownership and investing under one roof.', areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name })),
  knowsAbout: DOMAINS.flatMap((d) => d.services.map((s) => s.name)) }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const shell = readFileSync('dist/index.html', 'utf8')
for (const r of routes) {
  const url = SITE_URL + (r.path === '/' ? '/' : r.path)
  const image = `${SITE_URL}/${r.img ? `img/${r.img}.jpg` : 'og.jpg'}`
  const head = [
    `<title>${esc(T(r.title))}</title>`,
    `<meta name="description" content="${esc(r.desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${r.path.startsWith('/insights/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="Redbarn Ventures" />`,
    `<meta property="og:title" content="${esc(T(r.title))}" />`,
    `<meta property="og:description" content="${esc(r.desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="theme-color" content="#0b0708" />`,
    `<script type="application/ld+json">${JSON.stringify(r.path === '/' ? org : (r.ld ?? org))}</script>`,
  ].join('\n    ')
  const html = shell.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*>/, '').replace('</head>', `    ${head}\n  </head>`)
  const out = r.path === '/' ? 'dist/index.html' : `dist${r.path}.html`
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}
console.log(`prerendered ${routes.length} route shells`)
