import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Chev = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
)
const Plus = () => <span className="p" />

const CONSULTANCY = ['Design', 'Technology', 'Marketing', 'Business', 'Finance']
const STAGES = ['Pre-seed & Seed', 'Series A & B', 'Growth & Expansion', 'Strategic & Late stage']
const INDUSTRIES = ['Technology & SaaS', 'Fintech', 'Healthcare & Life Sciences', 'Consumer & Retail', 'Energy & Climate', 'Media & Entertainment', 'Real Estate', 'Industrial & Manufacturing']

type OvItem = { label: string; to?: string; subs?: string[] }
const OV_ITEMS: OvItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Consultancy', subs: CONSULTANCY },
  { label: 'Investment', subs: STAGES },
  { label: 'Industry', subs: INDUSTRIES },
  { label: 'Portfolio' },
  { label: 'About' },
  { label: 'Careers' },
  { label: 'Insights' },
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
          {item.subs.map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}</a>)}
        </div></div>
      </li>
    )
  }
  const inner = <><span className="idx">{idx}</span><span className="lbl">{item.label}</span></>
  return (
    <li className="ov-item">
      {item.to
        ? <Link className="ov-row" to={item.to} onClick={onNav}>{inner}</Link>
        : <a className="ov-row" href="#" onClick={(e) => e.preventDefault()}>{inner}</a>}
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
    if (!open) setAcc(null)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('menu-open') }
  }, [open])

  useEffect(() => { setOpen(false) }, [pathname])

  const here = (p: string) => (pathname === p ? 'here' : undefined)

  return (
    <>
      <header className={`hdr${scrolled ? ' scrolled' : ''}`}>
        <div className="util"><div className="util-in">
          <div className="util-l">
            <div className="util-item"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.4" /></svg><span>Building ventures worldwide</span></div>
            <div className="util-sep" />
            <div className="util-item"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M4 5c0 8 7 15 15 15l2-3-4-2-2 2c-3-1-6-4-7-7l2-2-2-4z" /></svg><span>Talk to the team</span></div>
          </div>
          <div className="util-r">
            <div className="util-item"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" /></svg><span>EN</span></div>
            <div className="socials"><span>Follow</span>
              <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-6.6L4.8 22H1.7l7.5-8.6L1.4 2h6.6l4.5 6.1L18.9 2zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3.5 9h3v11.5h-3zM9 9h2.9v1.6h.04c.4-.75 1.4-1.6 2.96-1.6 3.16 0 3.6 2 3.6 4.7v6.8h-3v-6c0-1.44-.03-3.3-2-3.3s-2.3 1.56-2.3 3.2v6.1H9z" /></svg></a>
            </div>
          </div>
        </div></div>

        <div className="main-in">
          <Link to="/" className="logo"><span className="mark"><span /><span /><span /></span><b>Redbarn</b></Link>
          <nav className="nav">
            <Link to="/" className={here('/')}>Home</Link>
            <div className="nav-item"><button className="nav-trig" type="button">Consultancy<Chev /></button>
              <div className="drop">{CONSULTANCY.map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}<Plus /></a>)}</div></div>
            <div className="nav-item"><button className="nav-trig" type="button">Investment<Chev /></button>
              <div className="drop invest"><p className="dtag">We back founders from first cheque to growth capital - pre-seed to scale.</p><h6>How we invest</h6>
                {STAGES.map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}<Plus /></a>)}</div></div>
            <div className="nav-item"><button className="nav-trig" type="button">Industry<Chev /></button>
              <div className="drop">{INDUSTRIES.map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}</a>)}</div></div>
            <a href="#" onClick={(e) => e.preventDefault()}>Portfolio</a>
            <a href="#" onClick={(e) => e.preventDefault()}>About</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Careers</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Insights</a>
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
        <button className="icon-btn ov-close" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="ov-watermark">Redbarn</div>
        <div className="ov-in">
          <ul className="ov-list">
            {OV_ITEMS.map((item, i) => (
              <OverlayRow key={item.label} item={item} index={i} open={acc === i} onToggle={() => setAcc(acc === i ? null : i)} onNav={() => setOpen(false)} />
            ))}
          </ul>
          <div className="ov-foot">
            <div className="col"><h4>Get in touch</h4><a href="mailto:hello@redbarn.ventures">hello@redbarn.ventures</a><p>By appointment, worldwide</p></div>
            <div className="col"><h4>New ventures</h4><a href="mailto:build@redbarn.ventures">build@redbarn.ventures</a><Link to="/contact" onClick={() => setOpen(false)}>Pitch us your idea</Link></div>
          </div>
        </div>
      </div>
    </>
  )
}
