import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Truss } from './truss'
import { TechGrid } from './techgrid'
import { CONTACT_EMAIL } from './config'

gsap.registerPlugin(ScrollTrigger)

const html = document.documentElement
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[]

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
const isMobile = () => window.innerWidth <= 860
if (reduce) html.classList.add('no-motion')
html.classList.add('booted')

/* ------------------------------------------------------------------ basics */
$$<HTMLAnchorElement>('.js-email').forEach((a) => (a.href = `mailto:${CONTACT_EMAIL}`))
$$('.js-email-txt, .mnav-foot .js-email').forEach((el) => (el.textContent = CONTACT_EMAIL))
$$('.js-year').forEach((el) => (el.textContent = String(new Date().getFullYear())))

function clocks() {
  $$('[data-tz]').forEach((el) => {
    try {
      el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: el.dataset.tz }).format(new Date())
    } catch { /* ignore */ }
  })
}
clocks()
setInterval(clocks, 20_000)

/* --------------------------------------------------------- wordmark fit */
const wm = $('.wm')
function fitWordmark() {
  const host = $('.wordmark')
  wm.style.setProperty('--wm-size', '100px')
  // width of widest line
  const letters = $$('.wm-l', wm)
  const lines = new Map<number, number>()
  letters.forEach((l) => {
    const r = l.getBoundingClientRect()
    const key = Math.round(r.top)
    lines.set(key, (lines.get(key) ?? 0) + r.width)
  })
  const widest = Math.max(...lines.values())
  const avail = host.clientWidth
  const size = Math.floor((avail / widest) * 100 * 0.995 * 10) / 10
  wm.style.setProperty('--wm-size', `${size}px`)
}

/* ---------------------------------------------------------- smooth scroll */
let lenis: Lenis | null = null
if (!reduce) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis!.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  lenis.stop()
}

function scrollToHash(hash: string) {
  const target = hash === '#index' || hash === '#top' ? 0 : (document.querySelector(hash) as HTMLElement | null)
  if (target === null) return
  if (lenis) lenis.scrollTo(target as HTMLElement | number, { duration: 1.6, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) })
  else if (target === 0) window.scrollTo({ top: 0 })
  else (target as HTMLElement).scrollIntoView()
}

/* ---------------------------------------------------------- mobile nav */
const toggle = $<HTMLButtonElement>('.nav-toggle')
const mnav = $('#mnav')
function setMenu(open: boolean) {
  toggle.setAttribute('aria-expanded', String(open))
  toggle.querySelector('.nav-toggle-txt')!.textContent = open ? 'Close' : 'Menu'
  mnav.classList.toggle('is-open', open)
  mnav.setAttribute('aria-hidden', String(!open))
  if (open) lenis?.stop()
  else lenis?.start()
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) setMenu(false) })
window.addEventListener('resize', () => { if (!isMobile() && mnav.classList.contains('is-open')) setMenu(false) })

$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href')!
    if (hash === '#main') return
    e.preventDefault()
    const wasOpen = mnav.classList.contains('is-open')
    if (wasOpen) setMenu(false)
    setTimeout(() => scrollToHash(hash), wasOpen ? 380 : 0)
    history.replaceState(null, '', hash === '#index' ? location.pathname : hash)
  })
})

/* ---------------------------------------------------------- hero canvas */
const truss = new Truss($<HTMLCanvasElement>('.hero-canvas'), { mobile: isMobile(), still: reduce })
if (reduce) { truss.build = 1; truss.draw() }

const heroEl = $('.hero')
new IntersectionObserver(([e]) => { truss.active = e.isIntersecting }).observe(heroEl)

/* ---------------------------------------------------------- tech grid */
const techPanel = $('.panel[data-tone="tech"]')
const tech = new TechGrid($<HTMLCanvasElement>('.vis-tech'), techPanel)
new IntersectionObserver(([e]) => { tech.visible = e.isIntersecting; if (reduce && e.isIntersecting) tech.tick(0, true) }).observe(techPanel)

/* ---------------------------------------------------------- one ticker */
let last = performance.now()
function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  if (!reduce) {
    if (lenis) truss.vel += (lenis.velocity - truss.vel) * 0.1
    if (!document.hidden) {
      truss.tick(dt)
      tech.tick(dt)
    }
  }
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

/* ---------------------------------------------------------- pointer */
if (fine && !reduce) {
  html.classList.add('has-cursor')
  const cursor = $('.cursor')
  const ring = $('.cursor-ring')
  const dot = $('.cursor-dot')
  const label = $('.cursor-label')
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' })
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' })
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' })
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' })

  window.addEventListener('pointermove', (e) => {
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY)
    cursor.classList.remove('is-hidden')
    truss.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
  }, { passive: true })
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'))

  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement
    const lab = t.closest<HTMLElement>('[data-cursor]')
    const link = t.closest('a, button')
    if (lab && !(link && lab !== link && !link.contains(lab) && lab.contains(link))) {
      label.textContent = lab.dataset.cursor ?? ''
      cursor.classList.add('is-label'); cursor.classList.remove('is-link')
    } else if (link) {
      cursor.classList.add('is-link'); cursor.classList.remove('is-label')
    } else {
      cursor.classList.remove('is-link', 'is-label')
    }
  })

  // magnetic elements
  $$('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const strength = el.classList.contains('ct-mail') ? 0.18 : 0.32
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      mx((e.clientX - (r.left + r.width / 2)) * strength)
      my((e.clientY - (r.top + r.height / 2)) * strength)
    })
    el.addEventListener('pointerleave', () => { mx(0); my(0) })
  })
}

/* ---------------------------------------------------------- panels */
const panels = $$('.panel')
function activate(p: HTMLElement) {
  panels.forEach((q) => q.classList.toggle('is-active', q === p))
  tech.target = p === techPanel ? 1 : 0
}
panels.forEach((p) => {
  p.addEventListener('focus', () => activate(p))
  p.addEventListener('click', () => activate(p))
  if (fine) {
    p.addEventListener('pointerenter', () => { if (!isMobile()) activate(p) })
    const vis = $('.vis', p)
    p.addEventListener('pointermove', (e) => {
      const r = p.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      vis.style.setProperty('--ry', `${nx * 18}deg`)
      vis.style.setProperty('--rx', `${-ny * 14}deg`)
      if (p === techPanel) {
        const vr = vis.getBoundingClientRect()
        tech.focus((e.clientX - vr.left) / vr.width, (e.clientY - vr.top) / vr.height)
      }
    })
    p.addEventListener('pointerleave', () => {
      vis.style.setProperty('--ry', '0deg'); vis.style.setProperty('--rx', '0deg')
      if (p === techPanel) tech.focus(0.5, 0.5)
    })
  }
})
tech.target = 0

/* ---------------------------------------------------------- intro / loader */
const loader = $('.loader')
const seen = html.classList.contains('seen')

function intro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.to(truss, { build: 1, duration: reduce ? 0 : 2.8, ease: 'power2.inOut' }, 0)
    .to('.wm-l > span', { yPercent: 0, duration: 1.5, stagger: 0.055 }, 0.15)
    .to('.hero-tag .ln > span', { yPercent: 0, duration: 1.4, stagger: 0.09 }, 0.45)
    .to(['.hero-meta', '.hero-sub'], { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.7)
    .to('.hero .rv', { opacity: 1, duration: 1, stagger: 0.08, ease: 'power2.out' }, 0.85)
  return tl
}

function setInitial() {
  // GSAP owns these transforms from here on; CSS set the pre-state.
  // the CSS pre-state uses `translate`; hand control to GSAP's transform first
  $$('.wm-l > span, .hero-tag .ln > span').forEach((el) => (el.style.translate = 'none'))
  gsap.set('.wm-l > span', { y: 0, yPercent: 105 })
  gsap.set('.hero-tag .ln > span', { y: 0, yPercent: 110 })
}

async function boot() {
  const fonts = (document as any).fonts?.ready ?? Promise.resolve()
  await Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))])
  fitWordmark()

  if (reduce) {
    truss.build = 1
    truss.resize()
    setupScroll()
    finish()
    return
  }

  setInitial()

  const count = { v: 0 }
  const countEl = $('.loader-count b')
  const gable = $('.loader-gable')
  const floor = $('.loader-floor')
  const dur = seen ? 0.55 : 1.45

  const tl = gsap.timeline()
  tl.to(count, {
    v: 100, duration: dur, ease: 'power2.inOut',
    onUpdate: () => {
      countEl.textContent = String(Math.round(count.v)).padStart(3, '0')
      gable.style.strokeDashoffset = String(1 - count.v / 100)
    },
  })
    .to(floor, { strokeDashoffset: 0, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .add(() => { lenis?.start() })
  // lift the loader with a roof-shaped edge
  const lift = { p: 0 }
  tl.to(lift, {
    p: 1, duration: 1.15, ease: 'expo.inOut',
    onUpdate: () => {
      const p = lift.p
      const side = 100 - p * 125
      const peak = side - Math.sin(Math.PI * Math.min(1, p * 1.2)) * 16
      loader.style.clipPath = `polygon(0 0, 100% 0, 100% ${side}%, 50% ${peak}%, 0 ${side}%)`
    },
    onComplete: () => { loader.remove(); finish() },
  }, '+=0.05')
  tl.add(intro(), '-=0.75')
  tl.add(() => setupScroll(), '-=1.2')
}

function finish() {
  try { sessionStorage.setItem('rb-seen', '1') } catch { /* ignore */ }
  html.classList.add('ready')
}

/* ---------------------------------------------------------- scroll choreography */
let scrollBuilt = false
function setupScroll() {
  if (scrollBuilt) return
  scrollBuilt = true

  // nav current section
  const links = $$<HTMLAnchorElement>('.nav-links a')
  const mark = (id: string | null) => links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${id}`))
  ;['index', 'services', 'approach', 'contact'].forEach((id) => {
    ScrollTrigger.create({
      trigger: `#${id}`, start: 'top 45%', end: 'bottom 45%',
      onToggle: (s) => { if (s.isActive) mark(id === 'approach' ? null : id) },
    })
  })

  if (reduce) {
    activate(panels[0])
    return
  }

  // HERO: fly-through + wordmark drift
  ScrollTrigger.create({
    trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (s) => { truss.scroll = s.progress },
  })
  const letters = $$('.wm-l')
  gsap.to(letters, {
    yPercent: (i) => -18 - ((i * 37) % 5) * 9,
    ease: 'none',
    scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true },
  })
  gsap.to('.hero-copy', { y: -120, opacity: 0, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: '60% top', scrub: true } })
  gsap.to('.hero-meta', { opacity: 0, ease: 'none', scrollTrigger: { trigger: heroEl, start: '10% top', end: '45% top', scrub: true } })

  // ROOF: gable edges flatten as the section rises
  $$('.what, .contact').forEach((sec) => {
    gsap.fromTo(sec, { '--roof': 1 }, { '--roof': 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 15%', scrub: true } })
  })

  // generic line reveals
  $$('.what-title, .ct-ask, .ct-title').forEach((el) => {
    gsap.from($$('.ln > span', el), {
      yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    })
  })

  // panels enter
  gsap.from('.panel', {
    y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.panels', start: 'top 85%' },
  })

  const mm = gsap.matchMedia()

  mm.add('(min-width: 861px)', () => {
    activate(panels.find((p) => p.classList.contains('is-active')) ?? panels[0])
    // STATEMENT — pinned, scrubbed
    const words = $$('.st-w:not(.st-small)')
    gsap.set(words, { color: 'rgba(21,20,19,0.09)' })
    gsap.set('.st-strike', { '--strike': 0 })
    gsap.set('.venn .v1', { y: -60, opacity: 0 })
    gsap.set('.venn .v2', { x: -70, y: 40, opacity: 0 })
    gsap.set('.venn .v3', { x: 70, y: 40, opacity: 0 })
    gsap.set('.venn-core', { scale: 0, transformOrigin: '50% 50%' })
    gsap.set('.st-copy', { opacity: 0, y: 30 })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.statement', start: 'top top', end: '+=150%', scrub: 0.6, pin: '.st-pin', anticipatePin: 1 },
    })
    tl.to(words, { color: '#151413', stagger: 0.35, duration: 0.6, ease: 'none' })
            .to('.st-strike', { '--strike': 1, duration: 0.9, ease: 'power2.inOut' })
      .to('.st-copy', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
      .to(['.venn .v1', '.venn .v2', '.venn .v3'], { x: 0, y: 0, opacity: 1, duration: 1, ease: 'power2.out', stagger: 0.08 }, '<')
      .to('.venn-core', { scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
      .to({}, { duration: 0.4 })
    return () => { gsap.set(words, { clearProps: 'color' }) }
  })

  mm.add('(max-width: 860px)', () => {
    // panels light up as they cross the middle of the screen
    panels.forEach((p) => {
      ScrollTrigger.create({
        trigger: p, start: 'top 60%', end: 'bottom 40%',
        onToggle: (s) => { if (s.isActive) activate(p) },
      })
    })
    const words = $$('.st-w:not(.st-small)')
    gsap.set(words, { color: 'rgba(21,20,19,0.1)' })
    gsap.to(words, { color: '#151413', stagger: 0.3, ease: 'none', scrollTrigger: { trigger: '.st-title', start: 'top 80%', end: 'bottom 45%', scrub: true } })
    gsap.fromTo('.st-strike', { '--strike': 0 }, { '--strike': 1, ease: 'none', scrollTrigger: { trigger: '.st-r3', start: 'top 70%', end: 'top 45%', scrub: true } })
    gsap.from('.st-copy', { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.st-copy', start: 'top 88%' } })
    gsap.from(['.venn .v1', '.venn .v2', '.venn .v3'], { opacity: 0, y: (i) => [-40, 30, 30][i], x: (i) => [0, -40, 40][i], duration: 1.4, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.venn', start: 'top 85%' } })
    gsap.from('.venn-core', { scale: 0, transformOrigin: '50% 50%', duration: 0.6, delay: 0.7, ease: 'back.out(2)', scrollTrigger: { trigger: '.venn', start: 'top 85%' } })
    return () => { gsap.set(words, { clearProps: 'color' }) }
  })

  // CONTACT
  gsap.from('.ct-mail', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ct-mail', start: 'top 92%' } })

  // signature: outline is drawn, then filled
  const sigText = $('.sig-text') as unknown as SVGTextElement
  const sigMark = $('.sig-mark') as unknown as SVGPathElement
  gsap.set(sigText, { strokeDashoffset: 900, fillOpacity: 0 })
  gsap.set(sigMark, { strokeDashoffset: 1 })
  gsap.timeline({ scrollTrigger: { trigger: '.signature', start: 'top 92%' } })
    .to(sigMark, { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut' })
    .to(sigText, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0.2)
    .to(sigText, { fillOpacity: 1, duration: 1, ease: 'power2.out' }, 1.7)

  ScrollTrigger.refresh()
}

/* ---------------------------------------------------------- resize */
let rt = 0
window.addEventListener('resize', () => {
  clearTimeout(rt)
  rt = window.setTimeout(() => {
    fitWordmark()
    truss.resize()
    tech.resize()
    ScrollTrigger.refresh()
  }, 150)
})

boot()
