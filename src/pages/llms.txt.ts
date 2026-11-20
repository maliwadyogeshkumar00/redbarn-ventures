// Plain-text summary for AI assistants and LLM-based search (llmstxt.org format).
// Optional resource only - it is not a ranking or indexing factor.
import site from '../data/site.json'
import services from '../data/services.json'
import { getPosts } from '../posts'

export function GET() {
  const base = 'https://redbarn.ventures'
  const lines = [
    '# Redbarn Ventures',
    '',
    `> ${site.description}`,
    '',
    `Redbarn Ventures is a global agency established in ${site.since}. A senior team plans, designs, builds and markets for companies, then stays on for long-term support. Contact: ${site.email}. LinkedIn: ${site.linkedin}. X: ${site.x}`,
    '',
    '## Services',
    '',
    ...services.map((s) => `- [${s.title}](${base}/services/${s.slug}/): ${s.meta}`),
    '',
    '## Company',
    '',
    `- [About](${base}/about/): Mission, vision, principles and how the senior team works`,
    `- [Process](${base}/process/): Discovery, written plan and fixed quote, design and build, launch, long-term growth support`,
    `- [Industries](${base}/industries/): Sectors Redbarn Ventures works with`,
    `- [AI agents and automation](${base}/ai/): How AI agents are scoped and built around company data`,
    `- [Contact](${base}/contact/): Project form and email; a senior person replies`,
    '',
    '## Insights',
    '',
    ...getPosts().map((p) => `- [${p.title}](${base}/insights/${p.slug}/): ${p.description}`),
    '',
    '## Optional',
    '',
    `- [Privacy policy](${base}/privacy/)`,
    `- [Terms of use](${base}/terms/)`,
    `- [Sitemap](${base}/sitemap.xml)`,
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
