import './apple.css'
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
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = () => innerWidth <= 760

/* ---------------- basics ---------------- */
$$<HTMLAnchorElement>('.js-email').forEach((a) => (a.href = `mailto:${CONTACT_EMAIL}`))
$$('.js-email-txt').forEach((el) => (el.textContent = CONTACT_EMAIL))
$$('.js-year').forEach((el) => (el.textContent = String(new Date().getFullYear())))
const clocks = () => $$('[data-tz]').forEach((el) => { try { el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: el.dataset.tz }).format(new Date()) } catch { /* */ } })
clocks(); setInterval(clocks, 15000)

/* ---------------- smooth scroll ---------------- */
let lenis: Lenis | null = null
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis!.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!
    const el = id === '#top' ? document.body : $(id)
    if (!el) return
    e.preventDefault(); lenis!.scrollTo(el as HTMLElement, { offset: id === '#top' ? 0 : -52, duration: 1.4 })
  }))
}

/* ---------------- hero: truss hall ---------------- */
const truss = new Truss($<HTMLCanvasElement>('.hero-canvas'), { mobile: mobile(), still: reduce, ink: [245, 245, 247], accent: [232, 128, 106] })
addEventListener('pointermove', (e) => truss.pointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1), { passive: true })
addEventListener('resize', () => truss.resize())

let started = false
const start = () => { if (started) return; started = true
  html.classList.add('ready')
  gsap.to(truss, { build: 1, duration: reduce ? 0 : 3.2, ease: 'power2.inOut', delay: 0.15 })
}
requestAnimationFrame(start); setTimeout(start, 250)

if (!reduce) {
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => { truss.scroll = s.progress } } })
    .to('.hero-copy', { scale: 0.86, y: -40, opacity: 0, ease: 'none' }, 0)
    .to('.hero-cue', { opacity: 0, duration: 0.15, ease: 'none' }, 0)
    .to('.hero-glow', { opacity: 0.2, ease: 'none' }, 0)
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onToggle: (s) => { truss.active = s.isActive } })
}

/* ---------------- statement: word by word ---------------- */
const words = $('[data-words]')
const raw = words.textContent!.trim().split(/\s+/)
words.innerHTML = raw.map((w, i) => `<span class="w${i >= raw.length - 3 ? ' hl' : ''}">${w}</span>`).join(' ')
const ws = $$('.w', words)
if (!reduce) {
  ScrollTrigger.create({
    trigger: '.statement', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (s) => { const n = Math.round(s.progress * 1.15 * ws.length); ws.forEach((w, i) => w.classList.toggle('on', i < n)) },
  })
  gsap.from('.statement-pin', { opacity: 0, y: 40, scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'top 30%', scrub: true } })
}

/* ---------------- chapters: horizontal track ---------------- */
const setChh = () => { const hd = $('.chapters-head'); const top = parseFloat(getComputedStyle($('.chapters')).paddingTop); document.documentElement.style.setProperty('--chh', `${hd.offsetHeight + top}px`) }
setChh(); addEventListener('resize', setChh)
const track = $('.track')
const techCanvas = $<HTMLCanvasElement>('.vis-tech')
const tech = new TechGrid(techCanvas, $('.c-tech'))
const designDraw = gsap.timeline({ paused: true })
  .to('.vis-design .dv-c', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out' })
  .to('.vis-design .dv-s', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out' }, 0.2)
  .to('.vis-design .dv-g', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out' }, 0.4)
const investDraw = gsap.timeline({ paused: true })
  .to('.vis-invest .iv-line', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
  .to('.vis-invest .iv-dot', { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '-=0.2')

if (!reduce) {
  const dist = () => track.scrollWidth - innerWidth
  const h = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.chapters', start: 'top top', end: () => '+=' + dist() * 1.1, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
    onToggle: (s) => { tech.visible = s.isActive } } })
  gsap.utils.toArray<HTMLElement>('.card').forEach((card, i) => {
    gsap.from(card, { scale: 0.9, opacity: 0.4, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: h, start: 'left right', end: 'left 40%', scrub: true } })
    if (i === 0) ScrollTrigger.create({ trigger: card, containerAnimation: h, start: 'left 85%', onEnter: () => designDraw.play() })
    if (i === 1) ScrollTrigger.create({ trigger: card, containerAnimation: h, start: 'left 85%', onEnter: () => { tech.target = 1 } })
    if (i === 2) ScrollTrigger.create({ trigger: card, containerAnimation: h, start: 'left 85%', onEnter: () => investDraw.play() })
  })
  ScrollTrigger.create({ trigger: '.chapters', start: 'top 70%', onEnter: () => designDraw.play() })
  gsap.from('.chapters-head > *', { y: 40, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.chapters', start: 'top 75%' } })
} else { designDraw.progress(1); investDraw.progress(1); tech.visible = true; tech.target = 1 }
addEventListener('resize', () => tech.resize())

/* ---------------- bento ---------------- */
if (!reduce) {
  gsap.from('.bento-head > *', { y: 40, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.bento-sec', start: 'top 75%' } })
  ScrollTrigger.batch('[data-tile]', { start: 'top 88%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', stagger: 0.09 }) })
}
const cnt = $('[data-count]')
ScrollTrigger.create({ trigger: cnt, start: 'top 85%', once: true, onEnter: () => {
  const o = { v: 0 }; gsap.to(o, { v: Number(cnt.dataset.count), duration: reduce ? 0 : 1.2, ease: 'power2.out', onUpdate: () => (cnt.textContent = String(Math.round(o.v))) })
} })

/* ---------------- contact ---------------- */
if (!reduce) {
  gsap.to('.contact [data-in]', { opacity: 1, y: 0, stagger: 0.12, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.contact', start: 'top 65%' } })
  gsap.fromTo('.contact-glow', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'center center', scrub: true } })
}

/* ---------------- nav ---------------- */
const nav = $('#nav')
ScrollTrigger.create({ start: 10, end: 'max', onToggle: (s) => nav.classList.toggle('scrolled', s.isActive) })
ScrollTrigger.create({ trigger: '.bento-sec', start: 'top 52px', end: 'bottom 52px', onToggle: (s) => nav.classList.toggle('on-light', s.isActive) })
ScrollTrigger.create({ trigger: '.foot', start: 'top 52px', end: 'max', onToggle: (s) => s.isActive && nav.classList.add('on-light'), onLeaveBack: () => nav.classList.remove('on-light') })

/* ---------------- render loop ---------------- */
let last = performance.now()
gsap.ticker.add(() => {
  const now = performance.now(); const dt = Math.min(0.05, (now - last) / 1000); last = now
  truss.vel = lenis ? lenis.velocity : 0
  truss.tick(dt)
  tech.tick(dt, reduce)
})

addEventListener('load', () => ScrollTrigger.refresh())
