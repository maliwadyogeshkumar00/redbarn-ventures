import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../content/site'

export function usePageMeta(title: string, description: string, path = '') {
  useEffect(() => {
    document.title = title.includes('Redbarn') ? title : `${title} — Redbarn Ventures`
    let m = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = description
    let c = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = SITE_URL + path
  }, [title, description, path])
}

export function PageHero({ label, title, children }: { label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="phero">
      <span className="lab">{label}</span>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

export const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h15M13 6l6 6-6 6" /></svg>

export function CtaBand({ title = 'The door is always open.', text = 'Tell us what you are building, or what is not working. A real person reads every message and replies within two business days.', cta = 'Start a conversation', to = '/contact' }: { title?: string; text?: string; cta?: string; to?: string }) {
  return (
    <section className="ctab">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link to={to} className="rb-btn"><span>{cta}</span><Arrow /></Link>
    </section>
  )
}
