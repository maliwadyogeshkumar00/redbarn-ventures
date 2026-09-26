import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import Footer from '../components/Footer'
import { CITIES, DOMAINS, STAGES, EMAIL, mailto } from '../content/site'
import { usePageMeta, img } from '../components/Blocks'
import '../contact.css'

const CITY_IMAGE = '/city.png'
const WORDS = ['talk.', 'build.', 'invest.', 'scale.']

type Extra = { label: string; kind: 'chips'; options: string[] } | { label: string; kind: 'text'; placeholder: string; type?: string }
type Intent = { key: string; label: string; short?: string; blurb: string; image: string; subj: string; prompt: string; extra: Extra }

const INTENTS: Intent[] = [
  { key: 'venture', label: 'New venture', short: 'Venture', blurb: 'The one-line idea and what you need: capital, a co-builder, or both.', image: img('pre-seed'), subj: 'Pitch: [company name]', prompt: 'The one-line idea, and what you need from us.', extra: { label: 'Where you are', kind: 'chips', options: ['Idea', 'Prototype', 'Early revenue', 'Scaling'] } },
  { key: 'consulting', label: 'Consulting', blurb: 'Design, technology, marketing, business or finance. The problem and the timeline.', image: img('consultancy'), subj: 'Consulting enquiry', prompt: 'The problem, and when it needs solving.', extra: { label: 'Discipline', kind: 'chips', options: DOMAINS.map((d) => d.name) } },
  { key: 'investment', label: 'Investment', blurb: 'Pre-seed to growth. Your stage, round size and deck.', image: img('investment'), subj: 'Investment enquiry', prompt: 'Your stage, round size, and a link to the deck.', extra: { label: 'Stage', kind: 'chips', options: STAGES.map((s) => s.name) } },
  { key: 'press', label: 'Press', blurb: 'Quotes, data and introductions for your story.', image: img('insights'), subj: 'Press enquiry', prompt: 'The story, the angle, and what you need from us.', extra: { label: 'Deadline', kind: 'text', placeholder: 'e.g. Friday, 17:00 CET' } },
  { key: 'careers', label: 'Careers', blurb: 'Send your work, not just your CV.', image: img('careers'), subj: 'Application', prompt: 'The role, and the work you are proudest of.', extra: { label: 'Portfolio or LinkedIn', kind: 'text', placeholder: 'https://', type: 'url' } },
]

const STEPS = [
  { h: 'You write', p: 'A few honest lines beat a polished deck. Tell us what you are building and what you need.' },
  { h: 'A person reads it', p: 'Every message lands in one inbox and goes to the partner closest to the problem. No bots, no queue.' },
  { h: 'You hear back', p: 'A real reply within two business days. If it is time-sensitive, say so in the first line.' },
  { h: 'We talk', p: 'If there is a fit, a first conversation. We sign an NDA whenever the discussion needs one.' },
]

const FAQS = [
  { q: 'Do you only work with technology companies?', a: 'No. Most of our work is technology-led, but we back and advise strong teams across consumer, fintech, healthcare, energy and more. What matters is the founder and the problem.' },
  { q: 'What stage do you invest at?', a: 'Pre-seed to growth. Early conviction cheques when an idea is barely a deck, and follow-ons once we know the team.' },
  { q: 'Can I hire Redbarn for a one-off project?', a: "Yes. Short, focused engagements or longer partnerships. Tell us the scope and we'll say plainly whether we're the right team." },
  { q: 'How quickly will I hear back?', a: "Two business days for serious enquiries. If it's time-sensitive, say so in the first line." },
  { q: 'Do you sign NDAs?', a: 'For substantive conversations, yes. For a first-line pitch, a short non-confidential summary is usually enough.' },
]

const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
const motionOK = () => !matchMedia('(prefers-reduced-motion:reduce)').matches
const finePointer = () => matchMedia('(pointer:fine)').matches
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function replyBy(from = new Date()) {
  const d = new Date(from)
  let n = 0
  while (n < 2) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) n++ }
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

const chars = (w: string) => [...w].map((c, k) => <span className="ch" key={k} style={{ '--k': k } as CSSProperties}>{c === ' ' ? ' ' : c}</span>)

/* ---------- small pieces ---------- */

function Rotator({ on }: { on: boolean }) {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const cur = useRef(0)
  useEffect(() => {
    if (!on || !motionOK()) return
    const id = setInterval(() => { setPrev(cur.current); cur.current = (cur.current + 1) % WORDS.length; setI(cur.current) }, 2900)
    return () => clearInterval(id)
  }, [on])
  return (
    <span className="ct-rot" aria-hidden="true">
      {prev !== null && <span className="w out" key={`o${prev}-${i}`}>{chars(WORDS[prev])}</span>}
      <span className={`w in${prev === null ? ' first' : ''}`} key={`i${i}`}>{chars(WORDS[i])}</span>
    </span>
  )
}

function Clock({ name, tz, now }: { name: string; tz: string; now: Date }) {
  const fmt = useMemo(() => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short', hour12: false }), [tz])
  const p = fmt.formatToParts(now)
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? '--'
  const h = Number(g('hour')) % 24
  const wd = g('weekday')
  const open = h >= 9 && h < 18 && wd !== 'Sat' && wd !== 'Sun'
  return (
    <div className={`ct-clock${open ? ' open' : ''}`}>
      <div className="c"><i />{name}</div>
      <div className="t">{g('hour')}:{g('minute')}<s>:{g('second')}</s></div>
      <div className="st">{open ? 'In office' : 'After hours'}</div>
    </div>
  )
}

function Field({ id, label, value, set, type = 'text', error, multiline, inputRef, autoComplete, onBlur, hint }: {
  id: string; label: string; value: string; set: (v: string) => void; type?: string; error?: string; multiline?: boolean
  inputRef?: RefObject<HTMLInputElement | null>; autoComplete?: string; onBlur?: () => void; hint?: ReactNode
}) {
  const grow = (el: HTMLTextAreaElement) => { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 168) + 'px' }
  return (
    <div className={`ct-field${error ? ' bad' : ''}${value ? ' filled' : ''}`}>
      {multiline
        ? <textarea id={id} value={value} placeholder=" " rows={2} onChange={(e) => { set(e.target.value); grow(e.target) }} onBlur={onBlur} aria-invalid={!!error} />
        : <input id={id} ref={inputRef} type={type} value={value} placeholder=" " autoComplete={autoComplete} onChange={(e) => set(e.target.value)} onBlur={onBlur} aria-invalid={!!error} />}
      <label htmlFor={id}>{label}</label>
      <span className="ln" />
      {error ? <span className="msg err" role="alert">{error}</span> : hint ? <span className="msg">{hint}</span> : null}
    </div>
  )
}

function Faq({ q, a, open, onToggle, i }: { q: string; a: string; open: boolean; onToggle: () => void; i: number }) {
  return (
    <div className={`ct-faq${open ? ' open' : ''}`}>
      <button className="q" type="button" onClick={onToggle} aria-expanded={open}><span className="n">{String(i + 1).padStart(2, '0')}</span><span className="tx">{q}</span><span className="qp" /></button>
      <div className="a"><div><p>{a}</p></div></div>
    </div>
  )
}

/** Magnetic pull toward the cursor, for primary buttons. */
function useMagnet<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || !motionOK()) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * strength).toFixed(1) + 'px')
      el.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * strength * 1.4).toFixed(1) + 'px')
    }
    const leave = () => { el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px') }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return ref
}

/* ---------- page ---------- */

type Sent = { code: string; email: string; first: string; by: string }

export default function Contact() {
  usePageMeta('Contact', 'Contact Redbarn Ventures. Tell us what you are building; a real person reads every message and replies within two business days.', '/contact')

  const heroRef = useRef<HTMLElement>(null)
  const bgwrapRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const burstRef = useRef<{ t: number; pending: boolean }>({ t: -1e9, pending: false })
  const [ready, setReady] = useState(false)
  const [imgOn, setImgOn] = useState(false)
  const [now, setNow] = useState(() => new Date())

  // form
  const [intent, setIntent] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [extra, setExtra] = useState('')
  const [message, setMessage] = useState('')
  const [honey, setHoney] = useState('')
  const [errs, setErrs] = useState<{ name?: string; email?: string; message?: string }>({})
  const [sending, setSending] = useState(false)
  const [netErr, setNetErr] = useState('')
  const [sent, setSent] = useState<Sent | null>(null)
  const [shake, setShake] = useState(false)
  const [ping, setPing] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const segRef = useRef<HTMLDivElement>(null)
  const [ind, setInd] = useState<CSSProperties>({ opacity: 0 })
  const sendRef = useMagnet<HTMLButtonElement>(0.08)

  // below the fold
  const [door, setDoor] = useState(0)
  const [faq, setFaq] = useState<number | null>(0)
  const nextRef = useRef<HTMLElement>(null)
  const mqSkewRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const it = INTENTS[intent]
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  /* clocks: one shared tick */
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])

  /* image load + reveal, never blocked by a slow image */
  useEffect(() => {
    let alive = true
    const im = new Image()
    im.onload = () => { if (!alive) return; setImgOn(true); requestAnimationFrame(() => setReady(true)) }
    im.onerror = () => { if (alive) setReady(true) }
    im.src = CITY_IMAGE
    const t = setTimeout(() => { if (alive) setReady(true) }, 2200)
    return () => { alive = false; clearTimeout(t) }
  }, [])

  /* sliding indicator under the active intent */
  useLayoutEffect(() => {
    const place = () => {
      const el = segRef.current?.querySelector<HTMLElement>('[data-on="1"]')
      if (el) setInd({ width: el.offsetWidth, height: el.offsetHeight, transform: `translate(${el.offsetLeft}px,${el.offsetTop}px)`, opacity: 1 })
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [intent, sent])

  /* hero engine: eased cursor light, parallax, card tilt + sheen, city lights, success burst */
  useEffect(() => {
    const hero = heroRef.current, spot = spotRef.current, bgwrap = bgwrapRef.current, cv = canvasRef.current
    if (!hero || !spot || !bgwrap || !cv) return
    const fine = finePointer(), mok = motionOK()
    let raf = 0, visible = true, inside = false
    let tx = 0.62, ty = 0.45, cx = tx, cy = ty
    let krx = 0, kry = 0, rx = 0, ry = 0, gx = 50, gy = 0, tgx = 50, tgy = 0

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; inside = true
      const card = cardRef.current
      if (card) {
        const c = card.getBoundingClientRect()
        const kx = (e.clientX - c.left) / c.width, ky = (e.clientY - c.top) / c.height
        const clamp = (v: number) => Math.max(-0.4, Math.min(1.4, v))
        kry = (clamp(kx) - 0.5) * 7; krx = (0.5 - clamp(ky)) * 5
        tgx = kx * 100; tgy = ky * 100
      }
    }
    const onLeave = () => { inside = false; krx = 0; kry = 0 }
    if (fine && mok) { hero.addEventListener('pointermove', onMove); hero.addEventListener('pointerleave', onLeave) }

    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    type P = { x: number; y: number; r: number; a: number; s: number; v: number; warm: boolean }
    type S = { x: number; y: number; vx: number; vy: number; life: number; r: number; warm: boolean }
    let pts: P[] = []
    let sparks: S[] = []
    const size = () => {
      W = cv.width = hero.clientWidth * dpr; H = cv.height = hero.clientHeight * dpr
      const n = Math.round((W * H) / (dpr * dpr) / 8500)
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.9, r: (Math.random() * 1.4 + 0.6) * dpr, a: Math.random() * 6.28, s: Math.random() * 0.012 + 0.004, v: Math.random() * 0.06 + 0.02, warm: Math.random() > 0.35 }))
    }
    size()
    window.addEventListener('resize', size)

    const frame = (t: number) => {
      if (!visible) { raf = 0; return }
      if (fine && mok) {
        cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07
        spot.style.setProperty('--mx', (cx * 100).toFixed(2) + '%'); spot.style.setProperty('--my', (cy * 100).toFixed(2) + '%')
        bgwrap.style.transform = `translate3d(${((cx - 0.5) * -24).toFixed(2)}px,${((cy - 0.5) * -16).toFixed(2)}px,0)`
        const card = cardRef.current
        if (card) {
          rx += (krx - rx) * 0.08; ry += (kry - ry) * 0.08
          if (inside) { gx += (tgx - gx) * 0.12; gy += (tgy - gy) * 0.12 }
          card.style.setProperty('--rx', rx.toFixed(3) + 'deg'); card.style.setProperty('--ry', ry.toFixed(3) + 'deg')
          card.style.setProperty('--gx', gx.toFixed(1) + '%'); card.style.setProperty('--gy', gy.toFixed(1) + '%')
        }
      }
      if (ctx && mok) {
        const b = burstRef.current
        if (b.pending) {
          b.pending = false; b.t = t
          const card = cardRef.current
          const hr = hero.getBoundingClientRect()
          const c = card ? card.getBoundingClientRect() : hr
          const ox = (c.left - hr.left + c.width / 2) * dpr, oy = (c.top - hr.top + c.height * 0.3) * dpr
          for (let k = 0; k < 160; k++) {
            const a = Math.random() * Math.PI * 2, sp = (Math.random() * 4.5 + 1.2) * dpr
            sparks.push({ x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.4 * dpr, life: 1, r: (Math.random() * 1.8 + 0.8) * dpr, warm: Math.random() > 0.3 })
          }
        }
        const boost = Math.max(0, 1 - (t - b.t) / 2600)
        ctx.clearRect(0, 0, W, H)
        ctx.globalCompositeOperation = 'source-over'
        for (const p of pts) {
          p.a += p.s * (1 + boost * 3); p.y -= p.v * dpr * (1 + boost * 14); if (p.y < -4) { p.y = H * 0.9; p.x = Math.random() * W }
          const al = Math.min(1, 0.25 + Math.sin(p.a) * 0.25 + boost * 0.45)
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + boost * 0.6), 0, Math.PI * 2)
          ctx.fillStyle = p.warm ? `rgba(255,214,190,${al})` : `rgba(230,140,160,${al})`; ctx.fill()
        }
        if (sparks.length) {
          ctx.globalCompositeOperation = 'lighter'
          for (const s of sparks) {
            s.vx *= 0.965; s.vy = s.vy * 0.965 - 0.025 * dpr; s.x += s.vx; s.y += s.vy; s.life -= 0.0105
            if (s.life <= 0) continue
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
            ctx.fillStyle = s.warm ? `rgba(255,220,200,${s.life})` : `rgba(235,120,145,${s.life})`; ctx.fill()
          }
          sparks = sparks.filter((s) => s.life > 0)
        }
      }
      raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && (mok || fine)) raf = requestAnimationFrame(frame) })
    io.observe(hero)
    if (mok) raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); io.disconnect(); hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave); window.removeEventListener('resize', size) }
  }, [])

  /* scroll: reveal, process progress, marquee skew */
  useEffect(() => {
    const mok = motionOK()
    const els = document.querySelectorAll<HTMLElement>('[data-rv]')
    let io: IntersectionObserver | null = null
    if (mok) {
      io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io?.unobserve(e.target) } }), { threshold: 0.15, rootMargin: '0px 0px -60px 0px' })
      els.forEach((el) => io!.observe(el))
    } else els.forEach((el) => el.classList.add('in'))

    let raf = 0, lastY = window.scrollY, vel = 0, skew = 0
    const steps = nextRef.current?.querySelectorAll<HTMLElement>('.ct-step') ?? []
    const tick = () => {
      raf = 0
      const nx = nextRef.current
      if (nx) {
        const r = nx.getBoundingClientRect(), vh = window.innerHeight
        const p = mok ? Math.max(0, Math.min(1, (vh * 0.78 - r.top) / (vh * 0.5))) : 1
        nx.style.setProperty('--p', p.toFixed(4))
        steps.forEach((s, i) => s.classList.toggle('lit', p >= i / steps.length + 0.02 || p === 1 || (i === 0 && p > 0.02)))
      }
      if (mok && mqSkewRef.current) {
        const y = window.scrollY; vel = y - lastY; lastY = y
        skew += (Math.max(-12, Math.min(12, vel * 0.35)) - skew) * 0.2
        mqSkewRef.current.style.transform = `skewX(${(-skew).toFixed(2)}deg)`
        if (Math.abs(skew) > 0.05) raf = requestAnimationFrame(tick)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener('scroll', onScroll, { passive: true })
    tick()
    return () => { io?.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  /* ---------- form logic ---------- */
  const pickIntent = (i: number) => { if (i !== intent) { setIntent(i); setExtra('') } }

  const validate = () => {
    const e: typeof errs = {}
    if (!name.trim()) e.name = 'Who should we reply to?'
    if (!email.trim()) e.email = 'We need an email to reply.'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'That email looks incomplete.'
    if (message.trim().length < 10) e.message = 'A line or two, please. What do you need?'
    return e
  }

  const submit = async (ev?: FormEvent) => {
    ev?.preventDefault()
    if (sending) return
    const e = validate()
    setErrs(e)
    if (Object.keys(e).length) {
      setShake(true); setTimeout(() => setShake(false), 520)
      const first = e.name ? 'c-name' : e.email ? 'c-email' : 'c-msg'
      document.getElementById(first)?.focus()
      return
    }
    setNetErr(''); setSending(true)
    const code = 'RB-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    const done = () => {
      setSent({ code, email: email.trim(), first: name.trim().split(/\s+/)[0], by: replyBy() })
      burstRef.current.pending = true
    }
    try {
      if (honey) { done(); return }
      const r = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), company, topic: it.label, [it.extra.label]: extra, message: message.trim(), reference: code, _subject: `Website: ${it.label} from ${name.trim()} [${code}]`, _replyto: email.trim(), _template: 'table', _captcha: 'false' }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || j.success === 'false' || j.success === false) throw new Error(String(r.status))
      done()
    } catch { setNetErr(`Could not send just now. Email us directly at ${EMAIL}.`) } finally { setSending(false) }
  }

  const reset = () => { setSent(null); setName(''); setEmail(''); setCompany(''); setExtra(''); setMessage(''); setErrs({}); setTimeout(() => nameRef.current?.focus(), 60) }

  const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }

  const chooseDoor = (i: number) => {
    pickIntent(i)
    const card = cardRef.current
    const wide = window.innerWidth > 960
    const top = wide ? 0 : (card ? card.getBoundingClientRect().top + window.scrollY - 110 : 0)
    window.scrollTo({ top, behavior: motionOK() ? 'smooth' : 'auto' })
    setTimeout(() => { setPing(true); nameRef.current?.focus({ preventScroll: true }); setTimeout(() => setPing(false), 1200) }, wide ? 650 : 500)
  }

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2200) } catch { window.location.href = `mailto:${EMAIL}` }
  }

  const mqItems = [0, 1, 2]

  return (
    <div className="rb-page ct">
      <div className="rb-grain" />

      {/* ============ HERO ============ */}
      <section className={`ct-hero${ready ? ' ready' : ''}`} ref={heroRef}>
        <div className="bgwrap" ref={bgwrapRef}><div className={`bg${imgOn ? ' on' : ''}`} style={imgOn ? { backgroundImage: `url(${CITY_IMAGE})` } : undefined} /></div>
        <div className="tone" />
        <div className="grade" />
        <canvas className="lights" ref={canvasRef} />
        <div className="spot" ref={spotRef} />

        <div className="ui">
          <div className="ct-top">
            <div className="ct-lab">[ Contact ]<br /><b>Redbarn Ventures</b></div>
            <div className="ct-status"><span className="dot" />Replies within 2 business days</div>
          </div>

          <div className="ct-left">
            <h1 className="ct-hl" aria-label="Let's talk.">
              <span className="ln" aria-hidden="true"><span>Let's</span></span>
              <span className="ln" aria-hidden="true"><span><Rotator on={ready} /></span></span>
            </h1>
            <p className="ct-lede">Founders, operators and investors. Tell us what you are building and a partner will read it, not a bot.</p>
            <div className="ct-clocks">{CITIES.map((c) => <Clock key={c.tz} name={c.name} tz={c.tz} now={now} />)}</div>
          </div>

          <div className="ct-cardwrap">
            <div className={`ct-card${shake ? ' shake' : ''}${ping ? ' ping' : ''}${sent ? ' is-sent' : ''}`} ref={cardRef}>
              <div className="ct-card-in">
                {!sent ? (
                  <form onSubmit={submit} onKeyDown={onKey} noValidate>
                    <div className="ct-card-lab"><span>/ Send a message</span><span>{String(intent + 1).padStart(2, '0')} / {String(INTENTS.length).padStart(2, '0')}</span></div>
                    <h2>Tell us what you're building.</h2>

                    <div className="ct-seg" ref={segRef} role="radiogroup" aria-label="What is this about?">
                      <span className="ct-ind" style={ind} />
                      {INTENTS.map((x, i) => (
                        <button key={x.key} type="button" role="radio" aria-checked={intent === i} data-on={intent === i ? '1' : '0'} className={intent === i ? 'on' : ''} onClick={() => pickIntent(i)}>{x.short ?? x.label}</button>
                      ))}
                    </div>

                    <div className="ct-fields">
                      <div className="two">
                        <Field id="c-name" label="Your name" value={name} set={(v) => { setName(v); if (errs.name) setErrs({ ...errs, name: undefined }) }} error={errs.name} inputRef={nameRef} autoComplete="name" />
                        <Field id="c-email" label="Email" type="email" value={email} set={(v) => { setEmail(v); if (errs.email) setErrs({ ...errs, email: undefined }) }} error={errs.email} autoComplete="email" onBlur={() => { if (email.trim() && !EMAIL_RE.test(email.trim())) setErrs((s) => ({ ...s, email: 'That email looks incomplete.' })) }} />
                      </div>

                      <div className="ct-extra" key={it.key}>
                        {it.extra.kind === 'chips' ? (
                          <div className="ct-chips-f">
                            <span className="fl">{it.extra.label}</span>
                            <div className="ct-chips">
                              {it.extra.options.map((o, k) => <button type="button" key={o} className={extra === o ? 'on' : ''} style={{ '--k': k } as CSSProperties} onClick={() => setExtra(extra === o ? '' : o)}>{o}</button>)}
                            </div>
                          </div>
                        ) : (
                          <Field id="c-extra" label={it.extra.label} value={extra} set={setExtra} type={it.extra.type} hint={it.extra.placeholder} />
                        )}
                      </div>

                      <Field id="c-co" label="Company or project" value={company} set={setCompany} autoComplete="organization" />
                      <Field id="c-msg" label={it.prompt} value={message} multiline set={(v) => { setMessage(v); if (errs.message) setErrs({ ...errs, message: undefined }) }} error={errs.message} />
                      <input className="ct-hp" type="text" name="_honey" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} aria-hidden="true" />
                    </div>

                    <button ref={sendRef} className={`ct-send${sending ? ' busy' : ''}`} type="submit" disabled={sending}>
                      <span className="lbl">{sending ? 'Sending' : 'Send message'}</span>
                      <span className="kbd">{isMac ? '⌘' : 'Ctrl'} ↵</span>
                      <span className="ic"><Arrow /></span>
                    </button>
                    {netErr && <div className="ct-neterr" role="alert">{netErr}</div>}
                    <div className="ct-alt">Prefer email? <a href={mailto(it.subj)}>{EMAIL}</a></div>
                  </form>
                ) : (
                  <div className="ct-sent" role="status">
                    <svg className="tick" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
                    <h3>Message on its way.</h3>
                    <p>Thanks, {sent.first}. A person on the team will read it properly and reply to <b>{sent.email}</b> by <b>{sent.by}</b>.</p>
                    <div className="ref"><span>Your reference</span><b>{sent.code}</b></div>
                    <button type="button" className="ct-again" onClick={reset}>Send another message <Arrow /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="ct-cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </section>

      {/* ============ DOORS ============ */}
      <section className="ct-sec ct-doors-sec">
        <div className="ct-head" data-rv>
          <span className="ct-lab2">/ Direct desks</span>
          <h2 className="ct-h2">One inbox. <span>Pick a door.</span></h2>
          <p>Everything reaches a person at {EMAIL}. Choose what fits and the form sets itself up, or email with the subject line shown.</p>
        </div>
        <div className="ct-doors" data-rv>
          {INTENTS.map((x, i) => (
            <article key={x.key} className={`ct-door${door === i ? ' on' : ''}`} onMouseEnter={() => setDoor(i)} onFocus={() => setDoor(i)} onClick={() => setDoor(i)} style={{ '--i': i } as CSSProperties}>
              <div className="ct-dbg" style={{ backgroundImage: `url(${x.image})` }} />
              <div className="shade" />
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <div className="body">
                <h3>{x.label}</h3>
                <div className="ct-more">
                  <div>
                    <p>{x.blurb}</p>
                    <div className="acts">
                      <button type="button" className="go" onClick={(e) => { e.stopPropagation(); chooseDoor(i) }}>Write to us <Arrow /></button>
                      <a className="mail" href={mailto(x.subj)} onClick={(e) => e.stopPropagation()}>Subject: {x.subj}</a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="ct-sec ct-next" ref={nextRef}>
        <div className="ct-head" data-rv>
          <span className="ct-lab2">/ What happens next</span>
          <h2 className="ct-h2">After you hit send. <span>No black hole.</span></h2>
        </div>
        <div className="ct-stepswrap">
        <div className="track" aria-hidden="true"><i /></div>
        <ol className="ct-steps">
          {STEPS.map((s, i) => (
            <li className="ct-step" key={s.h}>
              <span className="dot" aria-hidden="true" />
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </li>
          ))}
        </ol>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="ct-sec ct-faqs">
        <div className="ct-head sticky" data-rv>
          <span className="ct-lab2">/ Before you write</span>
          <h2 className="ct-h2">Common <span>questions.</span></h2>
          <p>Still unsure? Ask anyway. There is no such thing as a wrong door here.</p>
        </div>
        <div className="ct-faqlist" data-rv>
          {FAQS.map((f, i) => <Faq key={f.q} i={i} q={f.q} a={f.a} open={faq === i} onToggle={() => setFaq(faq === i ? null : i)} />)}
        </div>
      </section>

      {/* ============ EMAIL MARQUEE ============ */}
      <section className="ct-mq">
        <div className="ct-mq-lab"><span className="ct-lab2">/ Or skip the form</span></div>
        <div className="skew" ref={mqSkewRef}>
          <button type="button" className="ct-mq-btn" onClick={copyEmail} aria-label={`Copy ${EMAIL} to clipboard`}>
            <div className="track">
              {[0, 1].map((g) => (
                <div className="grp" key={g} aria-hidden="true">
                  {mqItems.map((k) => <span key={k}>{EMAIL}<i>✦</i></span>)}
                </div>
              ))}
            </div>
          </button>
        </div>
        <div className="ct-mq-foot"><span>Click to copy the address</span><a href={`mailto:${EMAIL}`}>Open in your mail app <Arrow /></a></div>
      </section>

      <div className={`ct-toast${copied ? ' on' : ''}`} role="status" aria-live="polite">{copied && <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 13l4 4L19 7" /></svg>{EMAIL} copied</>}</div>

      <Footer />
    </div>
  )
}
