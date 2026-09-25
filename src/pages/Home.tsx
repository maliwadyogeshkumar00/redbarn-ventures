import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DOMAINS, STAGES, INDUSTRIES } from '../content/site'
import { ARTICLES, fmtDate } from '../content/insights'
import { CtaBand, usePageMeta, Arrow, Promises } from '../components/Blocks'
import Footer from '../components/Footer'

// Base (moody) and reveal (illuminated) share one generated city image;
// the base layer is darkened/cooled via CSS so the spotlight reveals the warm, lit skyline.
const BG_IMAGE = '/city.png'
const SPOTLIGHT_R = 260

type Pt = { x: number; y: number }

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mask, setMask] = useState<string>('')

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const size = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    size()
    window.addEventListener('resize', size)
    return () => window.removeEventListener('resize', size)
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.4, 'rgba(255,255,255,1)')
    g.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    g.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    g.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()
    setMask(c.toDataURL())
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url('${image}')`,
          filter: 'brightness(1.4) saturate(1.55) contrast(1.05) sepia(0.22)',
          WebkitMaskImage: mask ? `url(${mask})` : 'none',
          maskImage: mask ? `url(${mask})` : 'none',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />
    </>
  )
}

export default function Home() {
  usePageMeta('Redbarn Ventures — Consulting, Ownership & Investment under one roof', 'Redbarn Ventures brings design, technology, marketing, business and finance consultancy together with long-term ownership and investment, across Ahmedabad, Oslo, London and Amsterdam.', '/')
  const mouse = useRef<Pt>({ x: -999, y: -999 })
  const smooth = useRef<Pt>({ x: -999, y: -999 })
  const rafRef = useRef<number>(0)
  const [cursorPos, setCursorPos] = useState<Pt>({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="rb-page tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <section className="hhero">
        <div className="hbg hero-zoom" style={{ backgroundImage: `url('${BG_IMAGE}')` }} />
        <div className="tone" style={{ zIndex: 15 }} />
        <div className="hgrade" />
        <RevealLayer image={BG_IMAGE} cursorX={cursorPos.x} cursorY={cursorPos.y} />
        <div className="hui">
          <div className="hh-top hero-anim hero-fade" style={{ animationDelay: '0.1s' }}>
            <div className="hh-lab">[ Redbarn Ventures ]<br /><b>Consult &middot; Own &middot; Invest</b></div>
            <div className="status"><span className="dot" />Ahmedabad &middot; Oslo &middot; London &middot; Amsterdam</div>
          </div>
          <h1 className="hh1">
            <span className="hero-anim hero-reveal" style={{ animationDelay: '0.2s' }}>Durable value,</span>
            <span className="hero-anim hero-reveal" style={{ animationDelay: '0.36s' }}>built to <em>last.</em></span>
          </h1>
          <div className="hh-foot hero-anim hero-fade" style={{ animationDelay: '0.7s' }}>
            <p>Consulting, long-term ownership and investing under one roof, so the right idea, the right operators and the right capital finally work together.</p>
            <div className="hh-cta">
              <Link to="/contact" className="rb-btn"><span>Start a conversation</span><Arrow /></Link>
              <Link to="/consultancy" className="tlink">What we do<Arrow /></Link>
            </div>
          </div>
          <div className="hh-hint hero-anim hero-fade" style={{ animationDelay: '1.2s' }}>Move across the skyline</div>
        </div>
      </section>

      <section className="facts">
        {[['5', 'Disciplines under one roof'], ['4', 'Investment stages, pre-seed to strategic'], ['8', 'Industries we work across'], ['4', 'Cities, one team'], ['2', 'Business days to a real reply']].map(([n, t]) => (
          <div className="fact" key={t}><b>{n}</b><span>{t}</span></div>
        ))}
      </section>

      <section className="statement">
        <span className="lab">/ Why Redbarn</span>
        <p className="big">Most advisers get paid whether you win or not. <span>We put our own capital behind the companies we believe in, so our advice has to be right.</span></p>
        <Promises />
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ What we do</span><h2>Three roles. One point of view.</h2></div>
          <div>
            <p className="lead">Most of the business world is optimised for the next quarter. We are not. Whether we are advising a company, running one or backing one, the question is the same: will this still be worth something in ten years?</p>
            <div className="g3" style={{ marginTop: 34 }}>
              <Link to="/consultancy" className="tile"><span className="n">Consult</span><h3>Five disciplines, one team</h3><p>Design, technology, marketing, business and finance, solved whole.</p></Link>
              <Link to="/investment/strategic" className="tile"><span className="n">Own</span><h3>Long-term positions</h3><p>Companies we hold and run like owners, because we are.</p></Link>
              <Link to="/investment" className="tile"><span className="n">Invest</span><h3>First cheque to growth</h3><p>Capital that arrives with the whole bench behind it.</p></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><div><span className="lab">/ Consultancy</span><h2>Everything a growing company needs, under one roof.</h2></div><Link to="/consultancy" className="tlink">All services<Arrow /></Link></div>
        <div className="doms">
          {DOMAINS.map((d, i) => (
            <Link to={`/consultancy/${d.slug}`} className="domt withimg" key={d.slug}>
              <div className="timg" style={{ backgroundImage: `url(/img/${d.slug}.jpg)` }} />
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{d.name}</h3>
              <p>{d.tagline}</p>
              <ul>{d.services.slice(0, 3).map((s) => <li key={s.name}>{s.name}</li>)}</ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="g2">
          <div><span className="lab">/ Investment</span><h2>We back founders from first cheque to growth.</h2><p className="lead" style={{ marginTop: 18 }}>Pre-seed to scale, and we stay. Every investment comes with the full Redbarn bench from day one.</p><Link to="/investment" className="tlink" style={{ marginTop: 26 }}>How we invest<Arrow /></Link></div>
          <div className="stages compact">
            {STAGES.map((s, i) => <Link to={`/investment/${s.slug}`} className="stage" key={s.slug}><span className="n">{String(i + 1).padStart(2, '0')}</span><div><h3>{s.name}</h3></div></Link>)}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><div><span className="lab">/ Industry</span><h2>Where we work.</h2></div><Link to="/industry" className="tlink">All industries<Arrow /></Link></div>
        <div className="chips big">{INDUSTRIES.map((i) => <Link key={i.slug} to={`/industry/${i.slug}`} className="chip">{i.name}</Link>)}</div>
      </section>

      <section className="sec">
        <span className="lab">/ How we work</span>
        <h2>From first call to lasting result.</h2>
        <div className="g4" style={{ marginTop: 40 }}>
          {[['Listen', 'A real conversation with a senior person. No pitch deck, no junior hand-off.'], ['Diagnose', 'An honest read of the problem, including whether we are the right team to fix it.'], ['Commit', 'Scope, price and outcome agreed in writing before any work starts.'], ['Deliver and stay', 'Work shipped in phases you can see. Then we stay on as partners, or as owners.']].map(([h, p], i) => (
            <div className="step" key={h}><span className="n">{String(i + 1).padStart(2, '0')}</span><h4>{h}</h4><p>{p}</p></div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><div><span className="lab">/ Insights</span><h2>Notes from the barn.</h2></div><Link to="/insights" className="tlink">All writing<Arrow /></Link></div>
        <div className="arts">
          {ARTICLES.slice(0, 3).map((a) => (
            <Link to={`/insights/${a.slug}`} className="art" key={a.slug}>
              <div className="am"><span>{a.category}</span><span>{fmtDate(a.date)}</span></div>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <span className="go">Read<Arrow /></span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
      <Footer />
    </div>
  )
}
