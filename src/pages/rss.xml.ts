// RSS feed for Insights - lets feed readers and aggregators discover new articles.
import { getPosts } from '../posts'

const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export function GET() {
  const base = 'https://redbarn.ventures'
  const posts = getPosts()
  const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/insights/${p.slug}/</link>
      <guid isPermaLink="true">${base}/insights/${p.slug}/</guid>
      <description>${esc(p.description)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`).join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Redbarn Ventures Insights</title>
    <link>${base}/insights/</link>
    <description>Practical guides for CEOs and leadership teams on brand, websites, AI agents, growth and sales.</description>
    <language>en</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date(posts[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
