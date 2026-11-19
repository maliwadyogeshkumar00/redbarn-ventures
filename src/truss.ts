/**
 * Hero visual — "The Truss Hall".
 * An endless hall of gabled barn trusses drawn in true perspective on a 2D canvas.
 * Frames are "built" on load (stroke-by-stroke), the camera drifts forward,
 * follows the pointer, and flies through on scroll. No 3D library needed.
 */

type Opts = { mobile: boolean; still: boolean; ink?: number[]; accent?: number[] }

const INK = [21, 20, 19]
const CLAY = [147, 64, 47]

export class Truss {
  private ctx: CanvasRenderingContext2D
  private w = 0
  private h = 0
  private dpr = 1
  private N: number
  private SP = 4
  private profile: [number, number][]
  private travel = 0
  private mx = 0
  private my = 0
  private tx = 0
  private ty = 0

  /** 0..1 — construction progress, driven by the intro timeline */
  build = 0
  /** 0..1 — hero scroll progress, drives a forward fly-through */
  scroll = 0
  /** smoothed scroll velocity from Lenis */
  vel = 0
  active = true
  private ink: number[]
  private accent: number[]

  constructor(private canvas: HTMLCanvasElement, private opts: Opts) {
    this.ctx = canvas.getContext('2d', { alpha: true })!
    this.ink = opts.ink ?? INK
    this.accent = opts.accent ?? CLAY
    this.N = opts.mobile ? 18 : 26
    const hw = 3
    this.profile = [
      [-hw, 0],
      [-hw, 3.25],
      [0, 5.35],
      [hw, 3.25],
      [hw, 0],
    ]
    this.resize()
  }

  resize() {
    const r = this.canvas.getBoundingClientRect()
    this.w = Math.max(1, r.width)
    this.h = Math.max(1, r.height)
    this.dpr = Math.min(window.devicePixelRatio || 1, this.opts.mobile ? 1.5 : 2)
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    this.draw()
  }

  pointer(nx: number, ny: number) {
    // nx, ny in -1..1
    this.tx = nx
    this.ty = ny
  }

  tick(dt: number) {
    if (!this.active) return
    const v = Math.min(Math.abs(this.vel), 60)
    this.travel += dt * (0.34 + v * 0.05)
    const k = 1 - Math.pow(0.0015, dt)
    this.mx += (this.tx - this.mx) * k
    this.my += (this.ty - this.my) * k
    this.draw()
  }

  draw() {
    const { ctx, w, h, dpr, N, SP, profile } = this
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const mobile = this.opts.mobile
    const f = Math.max(h * (mobile ? 0.72 : 0.95), w * 0.42)
    const cx = w * 0.5 - this.mx * w * 0.035
    const cy = h * (mobile ? 0.36 : 0.43)
    const camX = this.mx * 0.55
    const camY = 2.05 - this.my * 0.35
    const dMax = N * SP
    const near = 1.15
    const t = this.travel + this.scroll * SP * 3.2
    const phase = t % SP
    const base = Math.floor(t / SP)
    const build = this.build

    const P = (x: number, y: number, d: number): [number, number] => [cx + ((x - camX) * f) / d, cy - ((y - camY) * f) / d]
    const fog = (d: number) => {
      const a = Math.max(0, 1 - d / dMax)
      const n = Math.min(1, Math.max(0, (d - 0.9) / 1.6))
      return Math.pow(a, 1.55) * n
    }

    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'

    // --- floor rails (very faint) ---
    const railA = 0.07 * Math.min(1, build * 1.6)
    if (railA > 0.001) {
      ctx.strokeStyle = `rgba(${this.ink},${railA})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = -12; x <= 12; x += 2) {
        const a = P(x, 0, near)
        const b = P(x, 0, dMax)
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
      }
      ctx.stroke()
      // floor cross lines at each frame
      for (let i = 0; i < N; i++) {
        const d = i * SP - phase + near
        if (d < 0.9) continue
        const al = fog(d) * 0.08 * Math.min(1, build * 1.6)
        if (al < 0.003) continue
        const a = P(-12, 0, d)
        const b = P(12, 0, d)
        ctx.strokeStyle = `rgba(${this.ink},${al})`
        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        ctx.stroke()
      }
    }

    // --- longitudinal members (eaves, ridge, posts) ---
    const longA = Math.min(1, Math.max(0, (build - 0.35) / 0.5))
    if (longA > 0.001) {
      for (let i = 0; i < N - 1; i++) {
        const d1 = i * SP - phase + near
        const d2 = d1 + SP
        if (d2 < 0.9) continue
        const dd1 = Math.max(d1, 0.9)
        const al = fog(d2) * 0.5 * longA
        if (al < 0.004) continue
        ctx.strokeStyle = `rgba(${this.ink},${al})`
        ctx.lineWidth = Math.max(0.5, Math.min(1.6, (f / d2) * 0.0035))
        ctx.beginPath()
        for (let v = 0; v < profile.length; v++) {
          const [x, y] = profile[v]
          const a = P(x, y, dd1)
          const b = P(x, y, d2)
          ctx.moveTo(a[0], a[1])
          ctx.lineTo(b[0], b[1])
        }
        ctx.stroke()
      }
    }

    // --- the frames (far → near so near frames paint on top) ---
    const bt = build * (N * 0.55 + 7)
    for (let i = N - 1; i >= 0; i--) {
      const d = i * SP - phase + near
      if (d < 0.9) continue
      const p = Math.min(1, Math.max(0, (bt - i * 0.55) / 7))
      if (p <= 0) continue
      const ep = 1 - Math.pow(1 - p, 3)
      const al = fog(d)
      if (al < 0.004) continue
      const id = i + base
      const red = id % 7 === 3
      const col = red ? this.accent : this.ink
      ctx.strokeStyle = `rgba(${col},${Math.min(1, al * (red ? 1.15 : 0.92))})`
      ctx.lineWidth = Math.max(0.6, Math.min(red ? 3.2 : 2.4, (f / d) * (red ? 0.0062 : 0.0042)))

      // screen points
      const pts = profile.map(([x, y]) => P(x, y, d))
      // draw symmetric from the ridge outwards (feels like it's being raised)
      ctx.beginPath()
      drawPartial(ctx, [pts[2], pts[1], pts[0]], ep)
      drawPartial(ctx, [pts[2], pts[3], pts[4]], ep)
      ctx.stroke()

      // cross tie (collar) on near frames, adds architectural detail
      if (ep > 0.6 && d < dMax * 0.55) {
        const ca = (ep - 0.6) / 0.4
        const l = P(-3, 3.25, d)
        const r = P(3, 3.25, d)
        ctx.strokeStyle = `rgba(${col},${al * 0.45 * ca})`
        ctx.lineWidth = Math.max(0.5, ctx.lineWidth * 0.55)
        ctx.beginPath()
        ctx.moveTo(l[0], l[1])
        ctx.lineTo(r[0], r[1])
        // king post
        const top = P(0, 5.35, d)
        const mid = P(0, 3.25, d)
        ctx.moveTo(top[0], top[1])
        ctx.lineTo(mid[0], mid[1])
        ctx.stroke()
      }
    }
  }
}

function drawPartial(ctx: CanvasRenderingContext2D, pts: [number, number][], frac: number) {
  let total = 0
  const ls: number[] = []
  for (let k = 0; k < pts.length - 1; k++) {
    const l = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1])
    ls.push(l)
    total += l
  }
  let remain = total * frac
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let k = 0; k < ls.length; k++) {
    if (remain <= 0) break
    const l = ls[k]
    if (remain >= l) {
      ctx.lineTo(pts[k + 1][0], pts[k + 1][1])
      remain -= l
    } else {
      const r = remain / l
      ctx.lineTo(pts[k][0] + (pts[k + 1][0] - pts[k][0]) * r, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * r)
      remain = 0
    }
  }
}
