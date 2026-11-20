const root = document.documentElement
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s) as T | null
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)]

/* ---------- mobile nav ---------- */
const burger = $('[data-burger]')
burger?.addEventListener('click', () => {
  const open = !document.body.classList.contains('nav-open')
  document.body.classList.toggle('nav-open', open)
  burger.setAttribute('aria-expanded', String(open))
})
$$('.sheet a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('nav-open')))

/* ---------- email nudge (click to open) ---------- */
const nudge = $('[data-nudge]')
if (nudge) {
  const tog = $('[data-nudge-toggle]', nudge)
  const set = (o: boolean) => { nudge.classList.toggle('open', o); tog?.setAttribute('aria-expanded', String(o)) }
  tog?.addEventListener('click', () => set(!nudge.classList.contains('open')))
  $('[data-nudge-close]', nudge)?.addEventListener('click', () => set(false))
  document.addEventListener('click', (e) => { if (!nudge.contains(e.target as Node)) set(false) })
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false) })
}

/* ---------- header state ---------- */
const top = $('.top')
const onScroll = () => top?.classList.toggle('scrolled', scrollY > 8)
onScroll(); addEventListener('scroll', onScroll, { passive: true })

/* ---------- live local clock ---------- */
const clocks = $$('[data-clock]')
if (clocks.length) {
  const fmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' })
  const tick = () => {
    const parts = fmt.formatToParts(new Date())
    const get = (t: string) => parts.find((p) => p.type === t)?.value || ''
    const txt = `${get('hour').replace(/^24/, '00')}:${get('minute')} ${get('timeZoneName')}`
    clocks.forEach((c) => (c.textContent = txt))
  }
  tick(); setInterval(tick, 10000)
}

/* ---------- menu overlay ---------- */
const menu = $('#menu')
const openers = $$('[data-menu-open]')
const closer = $('[data-menu-close]')
let lastFocus: HTMLElement | null = null
const setMenu = (open: boolean) => {
  if (!menu) return
  menu.classList.toggle('open', open)
  menu.setAttribute('aria-hidden', String(!open))
  openers.forEach((b) => b.setAttribute('aria-expanded', String(open)))
  document.body.style.overflow = open ? 'hidden' : ''
  dispatchEvent(new CustomEvent('rb:menu', { detail: open }))
  if (open) { lastFocus = document.activeElement as HTMLElement; setTimeout(() => $('.menu-list a', menu)?.focus(), 60) }
  else lastFocus?.focus()
}
openers.forEach((b) => b.addEventListener('click', () => setMenu(true)))
closer?.addEventListener('click', () => setMenu(false))
addEventListener('keydown', (e) => {
  if (!menu?.classList.contains('open')) return
  if (e.key === 'Escape') setMenu(false)
  if (e.key === 'Tab') {
    const f = $$<HTMLElement>('a,button', menu)
    const first = f[0], lastEl = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus() }
    else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus() }
  }
})
if (menu) {
  const arts = $$('.menu-art .ma', menu)
  const show = (k?: string) => arts.forEach((i) => {
    const on = i.dataset.k === k, svg = i.querySelector('.art')
    if (on && !i.classList.contains('on') && svg) { svg.classList.remove('in'); requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add('in'))) }
    i.classList.toggle('on', on)
  })
  $$<HTMLAnchorElement>('.menu-list a', menu).forEach((a) => {
    a.addEventListener('mouseenter', () => show(a.dataset.obj))
    a.addEventListener('focus', () => show(a.dataset.obj))
  })
  show($('.menu-list a[aria-current=page]', menu)?.dataset.obj || 'cube')
}

/* ---------- page wipe transitions ---------- */
const wipe = $('.wipe')
const arriving = root.classList.contains('arrive')
if (arriving) {
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('go')))
  setTimeout(() => root.classList.remove('arrive', 'go'), 520)
}
document.addEventListener('click', (e) => {
  if (!wipe || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = (e.target as Element).closest('a')
  if (!a || a.target || a.hasAttribute('download') || a.dataset.noWipe !== undefined) return
  const url = new URL(a.href, location.href)
  if (url.origin !== location.origin) return
  if (url.pathname === location.pathname && url.search === location.search) return
  e.preventDefault()
  try { sessionStorage.setItem('rbw', '1') } catch {}
  wipe?.classList.add('cover')
  setTimeout(() => (location.href = url.href), 340)
})
addEventListener('pageshow', (e) => { if (e.persisted) { wipe?.classList.remove('cover'); root.classList.remove('arrive', 'go'); setMenu(false) } })

/* ---------- line-mask headline split ---------- */
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const splitEl = (el: HTMLElement) => {
  const text = (el.dataset.text ??= (el.textContent || '').replace(/\s+/g, ' ').trim())
  const words = text.split(' ')
  el.innerHTML = words.map((w) => `<span class="w" style="display:inline-block">${esc(w)}</span>`).join(' ')
  const lines: string[][] = []
  let lastTop = -1
  $$<HTMLElement>('.w', el).forEach((w, i) => {
    const t = w.offsetTop
    if (Math.abs(t - lastTop) > 2) { lines.push([]); lastTop = t }
    lines[lines.length - 1].push(words[i])
  })
  el.innerHTML = lines.map((l, i) => `<span class="ln"><span style="transition-delay:${(Number(el.dataset.delay || 0) + i * 80)}ms">${esc(l.join(' '))}</span></span>`).join('')
  el.setAttribute('aria-label', text)
  el.classList.add('ready')
}
const splits = $$('[data-split]')
const doSplit = () => splits.forEach(splitEl)
if (document.fonts?.ready) document.fonts.ready.then(doSplit); else doSplit()
let rz = 0
addEventListener('resize', () => { clearTimeout(rz); rz = window.setTimeout(doSplit, 150) })

/* ---------- reveal on scroll ---------- */
const startReveal = () => {
  const els = $$('[data-split],.rv,.hl,.sec-head')
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in', 'reveal')); return }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    const el = e.target as HTMLElement
    const go = () => el.classList.add('in', 'reveal')
    el.hasAttribute('data-split') && !el.classList.contains('ready') ? (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(go)) : go()
    io.unobserve(el)
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  els.forEach((e) => io.observe(e))
}
setTimeout(startReveal, arriving ? 260 : 40)

/* ---------- red 10% breathing + progress fallbacks ---------- */
const hasView = CSS.supports?.('animation-timeline: view()')
const bts = $$('.bt')
const prog = $('.progress')
if (!hasView && !reduce) {
  const mix = (t: number) => {
    const k = 0.1 * t
    const c = (a: number, b: number) => Math.round(b + (a - b) * k)
    return `rgb(${c(215, 242)},${c(38, 242)},${c(61, 242)})`
  }
  let ticking = false
  const upd = () => {
    ticking = false
    const vh = innerHeight
    bts.forEach((s) => {
      const r = s.getBoundingClientRect()
      const p = (vh - r.top) / (vh + r.height)
      const t = Math.max(0, Math.min(1, (0.38 - Math.abs(p - 0.5)) / 0.38))
      s.style.backgroundColor = mix(t)
    })
    const max = document.documentElement.scrollHeight - vh
    prog?.style.setProperty('--p', String(max > 0 ? scrollY / max : 0))
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd) } }, { passive: true })
  addEventListener('resize', upd); upd()
} else if (!CSS.supports?.('animation-timeline: scroll()')) {
  const upd = () => { const max = document.documentElement.scrollHeight - innerHeight; prog?.style.setProperty('--p', String(max > 0 ? scrollY / max : 0)) }
  addEventListener('scroll', upd, { passive: true }); upd()
}

/* ---------- back to top ---------- */
$$('[data-top]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }) }))

/* ---------- 2D art motion: draw-in, float, cursor drift, scroll drift ---------- */
const arts = $$<SVGSVGElement>('.art').filter((a) => !a.closest('#menu'))
if (arts.length) {
  if (reduce || !('IntersectionObserver' in window)) arts.forEach((a) => a.classList.add('in'))
  else {
    const vis = new Set<SVGSVGElement>()
    const st = new Map<SVGSVGElement, { x: number; y: number; r: number }>()
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const a = e.target as SVGSVGElement
      if (e.isIntersecting) { a.classList.add('in'); vis.add(a) } else vis.delete(a)
      run()
    }), { threshold: 0.15 })
    arts.forEach((a) => { io.observe(a); st.set(a, { x: 0, y: 0, r: 0 }) })
    let px = innerWidth / 2, py = innerHeight / 2, raf = 0
    addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; run() }, { passive: true })
    addEventListener('scroll', () => run(), { passive: true })
    const fine = matchMedia('(pointer: fine)').matches
    const step = () => {
      raf = 0
      let moving = false
      vis.forEach((a) => {
        const r = a.getBoundingClientRect(), s = st.get(a)!
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const nx = fine ? Math.max(-1, Math.min(1, (px - cx) / (innerWidth / 2))) : 0
        const ny = fine ? Math.max(-1, Math.min(1, (py - cy) / (innerHeight / 2))) : 0
        const sp = (cy / innerHeight - 0.5)
        const tx = nx * 10, ty = ny * 8 - sp * 26, tr = nx * 2 - sp * 3
        s.x += (tx - s.x) * 0.08; s.y += (ty - s.y) * 0.08; s.r += (tr - s.r) * 0.08
        a.style.transform = `translate3d(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px,0) rotate(${s.r.toFixed(2)}deg)`
        if (Math.abs(tx - s.x) + Math.abs(ty - s.y) + Math.abs(tr - s.r) > 0.05) moving = true
      })
      if (moving) raf = requestAnimationFrame(step)
    }
    function run() { if (!raf && vis.size) raf = requestAnimationFrame(step) }
  }
}
