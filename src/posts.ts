export type Post = { slug: string; title: string; description: string; date: string; category: string; art: string; excerpt: string; minutes: number; Content: any; headings: { depth: number; slug: string; text: string }[] }
export function getPosts(): Post[] {
  const mods = import.meta.glob('./posts/*.md', { eager: true }) as Record<string, any>
  return Object.entries(mods).map(([path, m]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const words = (m.rawContent?.() || '').split(/\s+/).length
    return { slug, ...m.frontmatter, minutes: Math.max(1, Math.round(words / 230)), Content: m.Content, headings: m.getHeadings() }
  }).sort((a, b) => (a.date < b.date ? 1 : -1))
}
