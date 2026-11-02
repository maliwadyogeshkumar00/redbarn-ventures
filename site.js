// Redbarn Ventures - site behaviour
const EMAIL = 'admin@redbarn.ventures'
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = matchMedia('(pointer: fine)').matches
document.documentElement.classList.add('js')

// year
document.querySelectorAll('.yr').forEach((el) => { el.textContent = new Date().getFullYear() })

// header state
const hdr = document.getElementById('hdr')
const onScroll = () => hdr && hdr.classList.toggle('scrolled', scrollY > 30)
onScroll(); addEventListener('scroll', onScroll, { passive: true })

// mobile menu
const burger = document.querySelector('.burger')
const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open)
  burger?.setAttribute('aria-expanded', String(open))
  burger?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
}
burger?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')))
document.querySelectorAll('.mmenu a').forEach((a) => a.addEventListener('click', () => setMenu(false)))
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false) })

// clocks
const fmts = {}
const tick = () => {
  const now = new Date()
  document.querySelectorAll('[data-tz]').forEach((el) => {
    const tz = el.dataset.tz
    fmts[tz] ||= new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
    el.textContent = fmts[tz].format(now)
  })
}
tick(); setInterval(tick, 15000)

// reveal on scroll
const rv = document.querySelectorAll('.rv')
if (reduce || !('IntersectionObserver' in window)) rv.forEach((el) => el.classList.add('in'))
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  rv.forEach((el) => io.observe(el))
}

// hero: cursor light, parallax, dust
const hero = document.getElementById('top')
const light = document.getElementById('heroLight')
const bg = document.getElementById('heroBg')
if (hero && light && !reduce) {
  let tx = 0.7, ty = 0.35, x = tx, y = ty, gx = 0.3, gy = 0.7, t = 0, visible = true
  new IntersectionObserver(([e]) => { visible = e.isIntersecting }).observe(hero)
  if (fine) hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height
  })
  const loop = () => {
    if (visible) {
      t += 0.004
      if (!fine) { tx = 0.55 + Math.sin(t * 1.3) * 0.25; ty = 0.35 + Math.cos(t) * 0.12 }
      x += (tx - x) * 0.07; y += (ty - y) * 0.07
      gx = 0.3 + Math.sin(t) * 0.15; gy = 0.65 + Math.cos(t * 0.8) * 0.1
      light.style.setProperty('--lx', (x * 100).toFixed(2) + '%'); light.style.setProperty('--ly', (y * 100).toFixed(2) + '%')
      light.style.setProperty('--gx', (gx * 100).toFixed(2) + '%'); light.style.setProperty('--gy', (gy * 100).toFixed(2) + '%')
      if (bg) bg.style.translate = `${((0.5 - x) * 18).toFixed(1)}px ${((0.5 - y) * 12 + scrollY * 0.18).toFixed(1)}px`
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  const cv = document.getElementById('dust')
  const ctx = cv?.getContext('2d')
  if (cv && ctx) {
    let w, h, dpr, parts = []
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2); w = hero.clientWidth; h = hero.clientHeight
      cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(110, (w * h) / 14000))
      parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + 0.3, s: Math.random() * 0.25 + 0.05, p: Math.random() * Math.PI * 2, c: Math.random() < 0.35 }))
    }
    size(); addEventListener('resize', size)
    const draw = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h)
        for (const p of parts) {
          p.y -= p.s; p.p += 0.02; if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w }
          const a = 0.25 + Math.sin(p.p) * 0.25 + 0.2
          const dx = p.x - x * w, dy = p.y - y * h, near = Math.max(0, 1 - Math.hypot(dx, dy) / 260)
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r + near * 1.2, 0, 6.283)
          ctx.fillStyle = p.c ? `rgba(220,106,124,${Math.min(1, a + near * 0.6)})` : `rgba(243,236,221,${Math.min(0.9, a * 0.8 + near * 0.5)})`
          ctx.fill()
        }
      }
      requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
  }
}

// service card spotlight
if (fine) document.querySelectorAll('.svc').forEach((c) => c.addEventListener('pointermove', (e) => {
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px')
}))

// contact form
const form = document.getElementById('form')
if (form) {
  const card = document.getElementById('card')
  const btn = form.querySelector('.send')
  const lbl = btn.querySelector('.lbl')
  const net = document.getElementById('neterr')
  const f = (n) => form.elements[n]
  const rules = {
    name: () => f('name').value.trim().length > 1,
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f('email').value.trim()),
    message: () => f('message').value.trim().length > 4,
    need: () => form.querySelectorAll('input[name=need]:checked').length > 0,
  }
  const box = (k) => (k === 'need' ? document.getElementById('f-need') : f(k).closest('.fld'))
  const check = (k) => { const ok = rules[k](); box(k).classList.toggle('bad', !ok); return ok }
  ;['name', 'email', 'message'].forEach((k) => f(k).addEventListener('input', () => box(k).classList.contains('bad') && check(k)))
  form.querySelectorAll('input[name=need]').forEach((c) => c.addEventListener('change', () => check('need')))

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    net.classList.remove('show')
    const bad = Object.keys(rules).filter((k) => !check(k))
    if (bad.length) { (bad[0] === 'need' ? form.querySelector('input[name=need]') : f(bad[0])).focus(); return }
    const name = f('name').value.trim(), email = f('email').value.trim()
    const needs = [...form.querySelectorAll('input[name=need]:checked')].map((c) => c.value).join(', ')
    const finish = () => {
      document.getElementById('done-name').textContent = ', ' + name.split(' ')[0]
      document.getElementById('done-mail').textContent = email
      card.classList.add('sent')
    }
    if (f('_honey').value) { finish(); return }
    btn.disabled = true; btn.classList.add('busy'); lbl.textContent = 'Sending'
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, company: f('company').value.trim() || '-', services: needs, message: f('message').value.trim(), _subject: `Website: ${needs} enquiry from ${name}`, _replyto: email, _template: 'table', _captcha: 'false' }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || j.success === 'false' || j.success === false) throw new Error(String(r.status))
      finish()
    } catch {
      net.innerHTML = `Could not send just now. Please email us directly at <a href="mailto:${EMAIL}" style="color:inherit">${EMAIL}</a>.`
      net.classList.add('show')
    } finally { btn.disabled = false; btn.classList.remove('busy'); lbl.textContent = 'Send message' }
  })

  document.getElementById('again')?.addEventListener('click', () => {
    form.reset(); card.classList.remove('sent'); setTimeout(() => f('name').focus(), 50)
  })
}
