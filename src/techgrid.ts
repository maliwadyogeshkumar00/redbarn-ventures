/**
 * Technology panel visual: a 13×13 signal matrix.
 * A radial wave pulses through the grid; a "packet" travels a snake path,
 * and the pointer bends the wave's origin. Cheap: ~170 arcs per frame, and
 * only drawn while the panel is on screen.
 */
export class TechGrid {
  private ctx: CanvasRenderingContext2D
  private size = 0
  private dpr = 1
  private t = 0
  private n = 13
  private fx = 0.5
  private fy = 0.5
  private tfx = 0.5
  private tfy = 0.5
  energy = 0 // 0..1 eased toward target (active)
  target = 0
  visible = false

  constructor(private canvas: HTMLCanvasElement, private host: HTMLElement) {
    this.ctx = canvas.getContext('2d')!
    this.resize()
  }

  resize() {
    const r = this.canvas.getBoundingClientRect()
    this.size = Math.max(10, r.width)
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(this.size * this.dpr)
    this.canvas.height = Math.round(this.size * this.dpr)
  }

  focus(nx: number, ny: number) {
    this.tfx = nx
    this.tfy = ny
  }

  tick(dt: number, still = false) {
    if (!this.visible) return
    if (!still) this.t += dt
    const k = 1 - Math.pow(0.02, dt)
    this.energy += (this.target - this.energy) * k
    this.fx += (this.tfx - this.fx) * k
    this.fy += (this.tfy - this.fy) * k
    this.draw()
  }

  draw() {
    const { ctx, size, dpr, n, t } = this
    const rect = this.canvas.getBoundingClientRect()
    if (Math.abs(rect.width - size) > 1) this.resize()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, this.size, this.size)

    const col = getComputedStyle(this.host).color
    const rgb = col.match(/\d+/g)?.slice(0, 3).join(',') ?? '237,234,227'
    const e = this.energy
    const pad = this.size * 0.06
    const step = (this.size - pad * 2) / (n - 1)
    const maxR = step * 0.32

    // packet position along snake path
    const total = n * n
    const pos = Math.floor((t * 9) % total)
    const prow = Math.floor(pos / n)
    const pcol = prow % 2 === 0 ? pos % n : n - 1 - (pos % n)

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const x = pad + c * step
        const y = pad + r * step
        const dx = c / (n - 1) - this.fx
        const dy = r / (n - 1) - this.fy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const wave = 0.5 + 0.5 * Math.sin(dist * 14 - t * 2.6)
        const amp = 0.18 + e * 0.82
        const rad = maxR * (0.22 + wave * 0.78 * amp)
        let a = 0.18 + wave * 0.62 * amp

        const isPacket = r === prow && c === pcol
        const trail = r === prow && Math.abs(c - pcol) <= 3 && e > 0.2
        if (isPacket && e > 0.05) {
          ctx.fillStyle = `rgba(176,83,62,${0.4 + e * 0.6})`
          ctx.fillRect(x - maxR, y - maxR, maxR * 2, maxR * 2)
          continue
        }
        if (trail) a = Math.min(1, a + 0.25 * e)
        ctx.fillStyle = `rgba(${rgb},${a})`
        ctx.beginPath()
        ctx.arc(x, y, Math.max(0.6, rad), 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // frame ticks (corner marks)
    ctx.strokeStyle = `rgba(${rgb},${0.25 + e * 0.35})`
    ctx.lineWidth = 1
    const m = 10
    const s = this.size - 1
    ctx.beginPath()
    ctx.moveTo(0.5, m); ctx.lineTo(0.5, 0.5); ctx.lineTo(m, 0.5)
    ctx.moveTo(s - m, 0.5); ctx.lineTo(s, 0.5); ctx.lineTo(s, m)
    ctx.moveTo(s, s - m); ctx.lineTo(s, s); ctx.lineTo(s - m, s)
    ctx.moveTo(m, s); ctx.lineTo(0.5, s); ctx.lineTo(0.5, s - m)
    ctx.stroke()
  }
}
