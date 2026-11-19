const EMAIL = 'admin@redbarn.ventures'
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
document.querySelectorAll('.yr').forEach((e) => { e.textContent = new Date().getFullYear() })

// stars
const cv = document.getElementById('stars'), ctx = cv.getContext('2d'), stage = document.querySelector('.stage')
let w, h, stars = []
const size = () => {
  const d = Math.min(devicePixelRatio || 1, 2); w = stage.clientWidth; h = stage.clientHeight
  cv.width = w * d; cv.height = h * d; cv.style.width = w + 'px'; cv.style.height = h + 'px'; ctx.setTransform(d, 0, 0, d, 0, 0)
  stars = Array.from({ length: Math.round(Math.min(140, (w * h) / 11000)) }, () => ({ x: Math.random() * w, y: Math.random() * h * 0.8, r: Math.random() * 1.1 + 0.25, p: Math.random() * 6.28, s: Math.random() * 0.015 + 0.004, v: Math.random() * 0.06 + 0.01, c: Math.random() < 0.2 }))
}
size(); addEventListener('resize', size)
const draw = () => {
  ctx.clearRect(0, 0, w, h)
  for (const s of stars) {
    s.p += s.s; s.x += s.v; if (s.x > w + 4) s.x = -4
    const a = reduce ? 0.5 : 0.25 + (Math.sin(s.p) + 1) * 0.3
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283)
    ctx.fillStyle = s.c ? `rgba(220,106,124,${a})` : `rgba(243,236,221,${a})`; ctx.fill()
  }
  if (!reduce) requestAnimationFrame(draw)
}
draw()

// cursor glow
if (!reduce && matchMedia('(pointer: fine)').matches) {
  const cur = document.querySelector('.cursor')
  let tx = 0.5, ty = 0.4, x = tx, y = ty
  addEventListener('pointermove', (e) => { const r = stage.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height })
  const loop = () => {
    x += (tx - x) * 0.06; y += (ty - y) * 0.06
    cur.style.setProperty('--cx', (x * 100).toFixed(2) + '%'); cur.style.setProperty('--cy', (y * 100).toFixed(2) + '%')
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
// keep the glow centred on the horizon
const syncGlow = () => { const pl = document.querySelector('.planet'); stage.style.setProperty('--ay', ((pl.offsetTop / stage.clientHeight) * 100).toFixed(1) + '%') }
syncGlow(); addEventListener('resize', syncGlow)

// contact form
const form = document.getElementById('form'), note = document.getElementById('note'), box = document.getElementById('box')
const btn = form.querySelector('button'), label = btn.querySelector('span')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = form.email.value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    form.classList.remove('bad'); void form.offsetWidth; form.classList.add('bad')
    note.className = 'note err'; note.textContent = 'Please enter a valid email address.'; form.email.focus(); return
  }
  if (form._honey.value) { box.classList.add('sent'); return }
  btn.disabled = true; label.textContent = 'Sending...'
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, message: 'Wants to talk to Redbarn (sent from the website contact box).', _subject: `Website enquiry from ${email}`, _replyto: email, _template: 'table', _captcha: 'false' }),
    })
    const j = await r.json().catch(() => ({}))
    if (!r.ok || j.success === 'false' || j.success === false) throw new Error()
    document.getElementById('okmail').textContent = email
    box.classList.add('sent')
  } catch {
    note.className = 'note err'
    note.innerHTML = `Could not send just now. Email us at <a href="mailto:${EMAIL}">${EMAIL}</a>.`
  } finally { btn.disabled = false; label.textContent = 'Contact us' }
})
form.email.addEventListener('input', () => { if (note.classList.contains('err')) { note.className = 'note'; note.innerHTML = `Or email <a href="mailto:${EMAIL}">${EMAIL}</a>` } form.classList.remove('bad') })
