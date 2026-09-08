import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import { CITIES, EMAIL, mailto } from '../content/site'
import { usePageMeta } from '../components/Blocks'

const CITY_IMAGE = '/city.png'
const TOPICS = ['New venture', 'Consulting', 'Investment', 'Press', 'Careers']
const DESKS = [
  { t: 'New ventures & pitches', d: 'The one-line idea and what you need: capital, a co-builder, or both.', subj: 'Pitch: [company name]' },
  { t: 'Consulting engagements', d: 'Design, technology, marketing, business or finance. The problem and the timeline.', subj: 'Consulting enquiry' },
  { t: 'Investment & partnerships', d: 'Pre-seed to growth. Your stage, round size and deck.', subj: 'Investment enquiry' },
  { t: 'Press & media', d: 'Quotes, data and introductions.', subj: 'Press enquiry' },
  { t: 'Careers', d: 'Send your work, not just your CV.', subj: 'Application' },
]
const FAQS = [
  { q: 'Do you only work with technology companies?', a: 'No. Most of our work is technology-led, but we back and advise strong teams across consumer, fintech, healthcare, energy and more. What matters is the founder and the problem.' },
  { q: 'What stage do you invest at?', a: 'Pre-seed to growth. Early conviction cheques when an idea is barely a deck, and follow-ons once we know the team.' },
  { q: 'Can I hire Redbarn for a one-off project?', a: "Yes. Short, focused engagements or longer partnerships. Tell us the scope and we'll say plainly whether we're the right team." },
  { q: 'How quickly will I hear back?', a: "Two business days for serious enquiries. If it's time-sensitive, say so in the first line." },
  { q: 'Do you sign NDAs?', a: 'For substantive conversations, yes. For a first-line pitch, a short non-confidential summary is usually enough.' },
]

const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h15M13 6l6 6-6 6" /></svg>

function useClock(tz: string) {
  const [t, setT] = useState<{ hm: string; s: string }>({ hm: '--:--', s: '--' })
  useEffect(() => {
    const fmtHM = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
    const fmtS = new Intl.DateTimeFormat('en-GB', { timeZone: tz, second: '2-digit' })
    const tick = () => { const n = new Date(); setT({ hm: fmtHM.format(n), s: fmtS.format(n) }) }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tz])
  return t
}

function Clock({ name, tz }: { name: string; tz: string }) {
  const { hm, s } = useClock(tz)
  return <div className="clock"><div className="c">{name}</div><div className="t">{hm}<s>:{s}</s></div></div>
}

function Faq({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const aRef = useRef<HTMLDivElement>(null)
  const pRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (!aRef.current || !pRef.current) return
    aRef.current.style.maxHeight = open ? pRef.current.offsetHeight + 20 + 'px' : '0px'
  }, [open])
  return (
    <div className={`faq${open ? ' open' : ''}`}>
      <button className="q" type="button" onClick={onToggle} aria-expanded={open}>{q}<span className="qp" /></button>
      <div className="a" ref={aRef}><p ref={pRef}>{a}</p></div>
    </div>
  )
}

export default function Contact() {
  const heroRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const bgwrapRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const spot2Ref = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [imgOn, setImgOn] = useState(false)
  const [topic, setTopic] = useState(0)
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')
  const nameRef = useRef<HTMLInputElement>(null), emailRef = useRef<HTMLInputElement>(null), coRef = useRef<HTMLInputElement>(null), msgRef = useRef<HTMLTextAreaElement>(null)
  usePageMeta('Contact', 'Contact Redbarn Ventures. Tell us what you are building; a real person reads every message and replies within two business days.', '/contact')

  const submit = async () => {
    const name = nameRef.current?.value.trim() ?? '', email = emailRef.current?.value.trim() ?? '', message = msgRef.current?.value.trim() ?? ''
    if (!name || !email || !message) { setErr('Please add your name, email and a message.'); return }
    setErr(''); setSending(true)
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name, email, company: coRef.current?.value ?? '', topic: TOPICS[topic], message, _subject: `Website: ${TOPICS[topic]} from ${name}`, _template: 'table', _captcha: 'false' }) })
      if (!r.ok) throw new Error(String(r.status))
      setDone(true)
    } catch { setErr(`Could not send just now. Email us directly at ${EMAIL}.`) } finally { setSending(false) }
  }
  const [faq, setFaq] = useState<number | null>(null)

  // image load + reveal (never blocks on a slow image)
  useEffect(() => {
    let alive = true
    const im = new Image()
    im.onload = () => { if (!alive) return; setImgOn(true); requestAnimationFrame(() => setReady(true)) }
    im.onerror = () => { if (alive) setReady(true) }
    im.src = CITY_IMAGE
    const t = setTimeout(() => { if (alive) setReady(true) }, 2400)
    return () => { alive = false; clearTimeout(t) }
  }, [])

  // eased cursor light + parallax + twinkling lights
  useEffect(() => {
    const hero = heroRef.current, spot = spotRef.current, spot2 = spot2Ref.current, bgwrap = bgwrapRef.current, cv = canvasRef.current
    if (!hero || !spot || !spot2 || !bgwrap || !cv) return
    const fine = matchMedia('(pointer:fine)').matches
    const mok = !matchMedia('(prefers-reduced-motion:reduce)').matches
    let raf = 0, tx = 0.62, ty = 0.45, cx = 0.62, cy = 0.45
    const onMove = (e: MouseEvent) => { const r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height }
    if (fine && mok) hero.addEventListener('mousemove', onMove)

    const ctx = cv.getContext('2d')
    let W = 0, H = 0
    type P = { x: number; y: number; r: number; a: number; s: number; v: number; warm: boolean }
    let pts: P[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = () => {
      W = cv.width = hero.clientWidth * dpr; H = cv.height = hero.clientHeight * dpr
      const n = Math.round((W * H) / (dpr * dpr) / 9000)
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.85, r: (Math.random() * 1.4 + 0.6) * dpr, a: Math.random() * Math.PI * 2, s: Math.random() * 0.012 + 0.004, v: Math.random() * 0.06 + 0.02, warm: Math.random() > 0.35 }))
    }
    size()
    window.addEventListener('resize', size)

    const frame = () => {
      if (fine && mok) {
        cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07
        const px = (cx * 100).toFixed(2) + '%', py = (cy * 100).toFixed(2) + '%'
        spot.style.setProperty('--mx', px); spot.style.setProperty('--my', py)
        spot2.style.setProperty('--mx', px); spot2.style.setProperty('--my', py)
        bgwrap.style.transform = `translate(${((cx - 0.5) * -22).toFixed(2)}px,${((cy - 0.5) * -14).toFixed(2)}px)`
      }
      if (ctx && mok) {
        ctx.clearRect(0, 0, W, H)
        for (const p of pts) {
          p.a += p.s; p.y -= p.v * dpr; if (p.y < -4) p.y = H * 0.85
          const al = 0.25 + Math.sin(p.a) * 0.25
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = p.warm ? `rgba(255,214,190,${al})` : `rgba(230,140,160,${al})`; ctx.fill()
        }
      }
      raf = requestAnimationFrame(frame)
    }
    if (mok) raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); hero.removeEventListener('mousemove', onMove); window.removeEventListener('resize', size) }
  }, [])

  return (
    <div className="rb-page">
      <div className="rb-grain" />
      <section className={`chero${ready ? ' ready' : ''}`} ref={heroRef}>
        <div className="bgwrap" ref={bgwrapRef}><div className={`bg${imgOn ? ' on' : ''}`} ref={bgRef} style={imgOn ? { backgroundImage: `url(${CITY_IMAGE})` } : undefined} /></div>
        <div className="tone" />
        <div className="grade" />
        <canvas className="lights" ref={canvasRef} />
        <div className="spot" ref={spotRef} />
        <div className="spot2" ref={spot2Ref} />

        <div className="ui">
          <div className="htop">
            <div className="lab">[ Contact ]<br /><b>Redbarn Ventures</b></div>
            <div className="status"><span className="dot" />Online now &middot; replies in 2 days</div>
          </div>

          <h1 className="hl"><span className="ln"><span>Let's</span></span><span className="ln"><span><em>talk.</em></span></span></h1>

          <div className="clocks">{CITIES.map((c) => <Clock key={c.tz} name={c.name} tz={c.tz} />)}</div>

          <div className="glass">
            <div className="lab"><span>/ Send a message</span><span>2-day reply</span></div>
            <h2>Tell us what you're building.</h2>
            {!done ? (
              <>
                <div className="f">
                  <div className="two">
                    <div><label htmlFor="c-name">Name</label><input id="c-name" ref={nameRef} type="text" placeholder="Jane Okafor" /></div>
                    <div><label htmlFor="c-email">Email</label><input id="c-email" ref={emailRef} type="email" placeholder="jane@company.com" /></div>
                  </div>
                  <div><label htmlFor="c-co">Company or project</label><input id="c-co" ref={coRef} type="text" placeholder="What you're working on" /></div>
                  <div><label>About</label><div className="pills">{TOPICS.map((t, i) => <button key={t} type="button" className={`pill${topic === i ? ' on' : ''}`} onClick={() => setTopic(i)}>{t}</button>)}</div></div>
                  <div><label htmlFor="c-msg">Message</label><textarea id="c-msg" ref={msgRef} placeholder="A couple of honest lines about what you need." /></div>
                </div>
                <button className="send" type="button" onClick={submit} disabled={sending}><span>{sending ? 'Sending…' : 'Send message'}</span><Arrow /></button>
                {err && <div className="ferr">{err}</div>}
                <div className="alt">Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
              </>
            ) : (
              <div className="sent">
                <div className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 13l4 4L19 7" /></svg></div>
                <h3>Message on its way.</h3>
                <p>Thanks for reaching out. Someone on the team will read it properly and reply within two business days.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="more">
        <div className="blk">
          <span className="lab">/ Direct desks</span>
          <h2>One inbox. Tell us which door.</h2>
          <p className="lead" style={{ marginBottom: 22 }}>Everything reaches a person at {EMAIL}. Pick the subject that fits and we will route it to the right team.</p>
          {DESKS.map((d) => (
            <a className="desk" key={d.subj} href={mailto(d.subj)}><h3>{d.t}<small>{d.d}</small></h3><span className="m">{d.subj}</span></a>
          ))}
        </div>
        <div className="blk">
          <span className="lab">/ Before you write</span>
          <h2>Common questions.</h2>
          {FAQS.map((f, i) => <Faq key={f.q} q={f.q} a={f.a} open={faq === i} onToggle={() => setFaq(faq === i ? null : i)} />)}
        </div>
      </section>

      <Footer />
    </div>
  )
}
