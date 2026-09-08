import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DOMAINS, STAGES, INDUSTRIES, CITIES } from '../content/site'

const Chev = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
const Plus = () => <span className="p" />

type OvItem = { label: string; to: string; subs?: { label: string; to: string }[] }
const OV_ITEMS: OvItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Consultancy', to: '/consultancy', subs: DOMAINS.map((d) => ({ label: d.name, to: `/consultancy#${d.slug}` })) },
  { label: 'Investment', to: '/investment', subs: STAGES.map((s) => ({ label: s.name, to: `/investment#${s.slug}` })) },
  { label: 'Industry', to: '/industry', subs: INDUSTRIES.map((i) => ({ label: i.name, to: `/industry#${i.slug}` })) },
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
]

function OverlayRow({ item, index, open, onToggle, onNav }: { item: OvItem; index: number; open: boolean; onToggle: () => void; onNav: () => void }) {
  const subRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!subRef.current || !innerRef.current) return
    subRef.current.style.maxHeight = open ? innerRef.current.offsetHeight + 'px' : '0px'
  }, [open])
  const idx = String(index + 1).padStart(2, '0')
  if (item.subs) {
    return (
      <li className={`ov-item${open ? ' open' : ''}`}>
        <div className="ov-row" onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onToggle() }}>
          <span className="idx">{idx}</span><span className="lbl">{item.label}</span><span className="plus" />
        </div>
        <div className="ov-sub" ref={subRef}><div className="ov-sub-in" ref={innerRef}>
          <Link to={item.to} onClick={onNav}>Overview</Link>
          {item.subs.map((s) => <Link key={s.to} to={s.to} onClick={onNav}>{s.label}</Link>)}
        </div></div>
      </li>
    )
  }
  return (
    <li className="ov-item">
      <Link className="ov-row" to={item.to} onClick={onNav}><span className="idx">{idx}</span><span className="lbl">{item.label}</span></Link>
    </li>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [acc, setAcc] = useState<number | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('menu-open') }
  }, [open])

  useEffect(() => { setOpen(false); setAcc(null) }, [pathname])

  const here = (p: string) => (pathname === p || (p !== '/' && pathname.startsWith(p)) ? 'here' : undefined)
  const close = () => setOpen(false)

  return (
    <>
      <header className={`hdr${scrolled ? ' scrolled' : ''}`}>
        <div className="util"><div className="util-in">
          <div className="util-l">
            <div className="util-item"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.4" /></svg><span>Consulting, ownership and investing under one roof</span></div>
            <div className="util-sep" />
            <Link to="/contact" className="util-item" style={{ color: 'inherit', textDecoration: 'none' }}><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M4 5c0 8 7 15 15 15l2-3-4-2-2 2c-3-1-6-4-7-7l2-2-2-4z" /></svg><span>Talk to the team</span></Link>
          </div>
          <div className="util-r">
            <div className="util-item cities-util"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" /></svg><span>{CITIES.map((c) => c.name).join(' · ')}</span></div>
          </div>
        </div></div>

        <div className="main-in">
          <Link to="/" className="logo"><span className="mark"><span /><span /><span /></span><b>Redbarn</b></Link>
          <nav className="nav">
            <Link to="/" className={here('/')}>Home</Link>
            <div className="nav-item"><Link to="/consultancy" className={`nav-trig ${here('/consultancy') ?? ''}`}>Consultancy<Chev /></Link>
              <div className="drop">{DOMAINS.map((d) => <Link key={d.slug} to={`/consultancy#${d.slug}`}>{d.name}<Plus /></Link>)}</div></div>
            <div className="nav-item"><Link to="/investment" className={`nav-trig ${here('/investment') ?? ''}`}>Investment<Chev /></Link>
              <div className="drop invest"><p className="dtag">We back founders from first cheque to growth capital - pre-seed to scale.</p><h6>How we invest</h6>
                {STAGES.map((s) => <Link key={s.slug} to={`/investment#${s.slug}`}>{s.name}<Plus /></Link>)}</div></div>
            <div className="nav-item"><Link to="/industry" className={`nav-trig ${here('/industry') ?? ''}`}>Industry<Chev /></Link>
              <div className="drop">{INDUSTRIES.map((i) => <Link key={i.slug} to={`/industry#${i.slug}`}>{i.name}</Link>)}</div></div>
            <Link to="/about" className={here('/about')}>About</Link>
            <Link to="/careers" className={here('/careers')}>Careers</Link>
            <Link to="/insights" className={here('/insights')}>Insights</Link>
            <Link to="/contact" className={here('/contact')}>Contact</Link>
          </nav>
          <div className="spacer" />
          <Link to="/contact" className="rb-btn"><span>Get in touch</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" /></svg></Link>
          <button className="icon-btn burger" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span className="lines"><i /><i /><i /></span>
          </button>
        </div>
      </header>

      <div className="overlay" role="dialog" aria-modal="true" aria-label="Main menu" aria-hidden={!open}>
        <button className="icon-btn ov-close" type="button" aria-label="Close menu" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="ov-watermark">Redbarn</div>
        <div className="ov-in">
          <ul className="ov-list">
            {OV_ITEMS.map((item, i) => (
              <OverlayRow key={item.label} item={item} index={i} open={acc === i} onToggle={() => setAcc(acc === i ? null : i)} onNav={close} />
            ))}
          </ul>
          <div className="ov-foot">
            <div className="col"><h4>Get in touch</h4><a href="mailto:admin@redbarn.ventures">admin@redbarn.ventures</a><p>Ahmedabad · Oslo · London · Amsterdam</p></div>
            <div className="col"><h4>New ventures</h4><Link to="/investment" onClick={close}>How we invest</Link><Link to="/contact" onClick={close}>Pitch us your idea</Link></div>
          </div>
        </div>
      </div>
    </>
  )
}
