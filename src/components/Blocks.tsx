import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../content/site'

export const img = (slug: string) => `/img/${slug}.jpg`

export function usePageMeta(title: string, description: string, path = '') {
  useEffect(() => {
    document.title = title.includes('Redbarn') ? title : `${title} — Redbarn Ventures`
    const set = (sel: string, make: () => HTMLElement, attr: string, val: string) => {
      let el = document.head.querySelector<HTMLElement>(sel)
      if (!el) { el = make(); document.head.appendChild(el) }
      el.setAttribute(attr, val)
    }
    const meta = (k: string, v: string, prop = false) => set(`meta[${prop ? 'property' : 'name'}="${k}"]`, () => { const m = document.createElement('meta'); m.setAttribute(prop ? 'property' : 'name', k); return m }, 'content', v)
    meta('description', description)
    meta('og:title', document.title, true)
    meta('og:description', description, true)
    meta('og:url', SITE_URL + path, true)
    set('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l }, 'href', SITE_URL + path)
  }, [title, description, path])
}

/** Cinematic page hero: graded image, slow drift, eased cursor light. Falls back to a gradient hero with no image. */
export function PageHero({ label, title, children, image, compact }: { label: ReactNode; title: ReactNode; children?: ReactNode; image?: string; compact?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    if (!image) { const r = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(r) }
    let alive = true
    const im = new Image()
    im.onload = () => { if (alive) { setLoaded(true); setReady(true) } }
    im.onerror = () => { if (alive) setReady(true) }
    im.src = image
    const t = setTimeout(() => alive && setReady(true), 1200)
    return () => { alive = false; clearTimeout(t) }
  }, [image])

  useEffect(() => {
    const el = ref.current, spot = spotRef.current, bg = bgRef.current
    if (!el || !spot || !bg || !image) return
    if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    let tx = 0.66, ty = 0.4, cx = tx, cy = ty, raf = 0
    const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height }
    const loop = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07
      spot.style.setProperty('--mx', (cx * 100).toFixed(2) + '%'); spot.style.setProperty('--my', (cy * 100).toFixed(2) + '%')
      bg.style.transform = `translate(${((cx - 0.5) * -18).toFixed(2)}px,${((cy - 0.5) * -12).toFixed(2)}px)`
      raf = requestAnimationFrame(loop)
    }
    el.addEventListener('mousemove', move); raf = requestAnimationFrame(loop)
    return () => { el.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [image])

  return (
    <section ref={ref} className={`phero${image ? ' cine' : ''}${compact ? ' compact' : ''}${ready ? ' ready' : ''}`}>
      {image && (
        <>
          <div className="pbgw" ref={bgRef}><div className={`pbg${loaded ? ' on' : ''}`} style={loaded ? { backgroundImage: `url(${image})` } : undefined} /></div>
          <div className="tone" />
          <div className="pgrade" />
          <div className="spot" ref={spotRef} />
        </>
      )}
      <div className="pin">
        <span className="lab">{label}</span>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  )
}

export const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h15M13 6l6 6-6 6" /></svg>

export function CtaBand({ title = 'The door is always open.', text = 'Tell us what you are building, or what is not working. A real person reads every message and replies within two business days.', cta = 'Start a conversation', to = '/contact' }: { title?: string; text?: string; cta?: string; to?: string }) {
  return (
    <section className="ctab">
      <div className="ctab-bg" style={{ backgroundImage: `url(${img('about')})` }} />
      <div className="ctab-in">
        <h2>{title}</h2>
        <p>{text}</p>
        <Link to={to} className="rb-btn"><span>{cta}</span><Arrow /></Link>
      </div>
    </section>
  )
}

/** Verifiable commitments rather than invented statistics. */
export const PROMISES = [
  { k: '2 days', v: 'Every serious enquiry answered by a person within two business days.' },
  { k: 'Yours', v: 'You own everything we make: code, accounts, files, brand assets. From day one.' },
  { k: 'Fixed', v: 'Scope, price and outcome agreed in writing before any work starts.' },
  { k: 'Invested', v: 'We put our own capital behind the companies we believe in. Advice with skin in the game.' },
]

export function Promises() {
  return (
    <section className="promises">
      {PROMISES.map((p) => <div className="prom" key={p.k}><b>{p.k}</b><p>{p.v}</p></div>)}
    </section>
  )
}
