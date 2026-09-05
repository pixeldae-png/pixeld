import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  phase: number
}

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let time = 0
    let scroll = window.scrollY
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, active: false }
    let particles: Particle[] = []

    const createParticles = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches
      const count = coarse ? 22 : 44
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (coarse ? 0.18 : 0.32),
        vy: (Math.random() - 0.5) * (coarse ? 0.14 : 0.24),
        size: 1.4 + Math.random() * (coarse ? 2.2 : 3.6),
        hue: i % 3 === 0 ? 254 : i % 3 === 1 ? 184 : 14,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles()
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const onScroll = () => {
      scroll = window.scrollY
    }

    const draw = () => {
      time += 0.008
      ctx.clearRect(0, 0, width, height)

      const scrollPulse = Math.sin(scroll * 0.002 + time) * 0.5 + 0.5
      const primary = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, Math.max(width, height) * 0.72)
      primary.addColorStop(0, pointer.active ? 'rgba(124, 108, 242, 0.18)' : 'rgba(124, 108, 242, 0.10)')
      primary.addColorStop(0.34, `rgba(20, 184, 166, ${0.035 + scrollPulse * 0.035})`)
      primary.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = primary
      ctx.fillRect(0, 0, width, height)

      particles.forEach((p, index) => {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
        const force = pointer.active ? Math.max(0, 1 - dist / 260) : 0

        p.vx += (dx / dist) * force * 0.012
        p.vy += (dy / dist) * force * 0.012
        p.vx *= 0.992
        p.vy *= 0.992
        p.x += p.vx + Math.sin(time + p.phase) * 0.12
        p.y += p.vy + Math.cos(time * 0.8 + p.phase) * 0.1

        if (p.x < -30) p.x = width + 30
        if (p.x > width + 30) p.x = -30
        if (p.y < -30) p.y = height + 30
        if (p.y > height + 30) p.y = -30

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j]
          const lx = other.x - p.x
          const ly = other.y - p.y
          const length = Math.sqrt(lx * lx + ly * ly)
          if (length < 150) {
            ctx.strokeStyle = `rgba(17, 17, 23, ${0.055 * (1 - length / 150)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }

        ctx.fillStyle = `hsla(${p.hue}, 78%, 60%, ${0.16 + force * 0.22})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + force * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.strokeStyle = 'rgba(124, 108, 242, 0.08)'
      ctx.lineWidth = 1
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath()
        ctx.ellipse(
          width * (0.18 + i * 0.3),
          height * (0.18 + ((i + 1) % 3) * 0.22),
          90 + Math.sin(time + i) * 25,
          28 + Math.cos(time + i) * 10,
          time * (i % 2 ? -0.7 : 0.7),
          0,
          Math.PI * 2,
        )
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-canvas" aria-hidden="true" />
}
