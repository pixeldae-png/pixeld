import { useEffect, useRef } from 'react'

// Adapted from the particle-text component supplied with the intro brief.
// Particles retain position and velocity as each word gets a new set of targets.
interface Vector2D { x: number; y: number }
class Particle {
  pos: Vector2D
  vel: Vector2D = { x: 0, y: 0 }
  target: Vector2D
  opacity = 1
  active = true
  constructor(x: number, y: number) {
    this.pos = { x, y }
    this.target = { x, y }
  }
  move(dt: number) {
    this.vel.x += ((this.target.x - this.pos.x) * 110 - this.vel.x * 21) * dt
    this.vel.y += ((this.target.y - this.pos.y) * 110 - this.vel.y * 21) * dt
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
    this.opacity += ((this.active ? 1 : 0) - this.opacity) * Math.min(1, dt * 9)
  }
  draw(ctx: CanvasRenderingContext2D, size: number) {
    if (this.opacity < .01) return
    ctx.globalAlpha = this.opacity
    ctx.fillRect(this.pos.x, this.pos.y, size, size)
  }
}

export const INTRO_WORDS = ['WELCOME', 'TO', 'PIXELD', 'MADE', 'BY', 'KHALID', 'ALKETBI']
interface ParticleTextEffectProps {
  words?: readonly string[]
  onComplete: () => void
}

export function ParticleTextEffect({ words = INTRO_WORDS, onComplete }: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => {
    const canvas = canvasRef.current
    const frame = frameRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !frame || !ctx || words.length === 0) { completeRef.current(); return }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) { completeRef.current(); return }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    let width = 0, height = 0, fontSize = 0, wordIndex = -1
    let elapsed = 0, previousTime = 0, raf = 0, finished = false
    const particles: Particle[] = []
    const duration = 1250
    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      completeRef.current()
    }

    function nextWord(index: number) {
      if (!canvas) return
      const offscreen = document.createElement('canvas')
      offscreen.width = Math.ceil(width)
      offscreen.height = Math.ceil(fontSize * 1.6)
      const text = offscreen.getContext('2d', { willReadFrequently: true })
      if (!text) { finish(); return }
      text.font = `800 ${fontSize}px Arial, sans-serif`
      text.textAlign = 'center'
      text.textBaseline = 'middle'
      text.fillText(words[index], width / 2, offscreen.height / 2)
      const pixels = text.getImageData(0, 0, offscreen.width, offscreen.height).data
      const points: Vector2D[] = []
      const step = width < 640 ? 2 : 3
      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          if (pixels[(y * offscreen.width + x) * 4 + 3] > 150) points.push({ x, y: y + (height - offscreen.height) / 2 })
        }
      }
      // Shuffle only the actual glyph pixels, not every pixel on the screen.
      for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[points[i], points[j]] = [points[j], points[i]]
      }
      const targets = points.slice(0, width < 640 ? 1500 : 2400)
      targets.forEach((point, i) => {
        if (!particles[i]) {
          const angle = Math.random() * Math.PI * 2
          const radius = Math.min(width, height) * (.3 + Math.random() * .25)
          particles[i] = new Particle(width / 2 + Math.cos(angle) * radius, height / 2 + Math.sin(angle) * radius)
        }
        particles[i].target = point
        particles[i].active = true
      })
      for (let i = targets.length; i < particles.length; i++) {
        const particle = particles[i]
        if (particle.active) particle.target = { x: particle.pos.x + (Math.random() - .5) * 120, y: particle.pos.y + (Math.random() - .5) * 100 }
        particle.active = false
      }
    }
    function resize() {
      if (!canvas || !ctx || !frame) return
      const bounds = frame.getBoundingClientRect()
      width = Math.max(1, Math.round(bounds.width))
      height = Math.max(1, Math.round(bounds.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = '800 100px Arial, sans-serif'
      const maxWidth = Math.max(...words.map(word => ctx.measureText(word).width))
      fontSize = Math.min(140, height * .22, (width - 40) * 100 / Math.max(1, maxWidth))
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, width, height)
      if (wordIndex >= 0) nextWord(wordIndex)
    }
    function animate(time: number) {
      if (finished || !ctx || !frame) return
      const delta = previousTime ? Math.min(time - previousTime, 50) : 0
      previousTime = time
      elapsed += delta
      const index = Math.min(words.length - 1, Math.floor(elapsed / duration))
      if (index !== wordIndex) { wordIndex = index; nextWord(index) }
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#000'
      // Small substeps keep the spring stable on slower phones.
      const steps = Math.max(1, Math.ceil(delta / 16))
      for (const particle of particles) {
        for (let step = 0; step < steps; step++) particle.move(delta / steps / 1000)
        particle.draw(ctx, width < 640 ? 1.7 : 2.3)
      }
      ctx.globalAlpha = 1
      const fade = Math.max(0, (elapsed - words.length * duration) / 450)
      frame.style.opacity = String(1 - Math.min(1, fade))
      if (fade >= 1) { finish(); return }
      raf = requestAnimationFrame(animate)
    }
    const onVisibility = () => { previousTime = 0 }
    const onReduced = () => { if (reduced.matches) finish() }
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') finish() }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(frame)
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('keydown', onKey)
    reduced.addEventListener('change', onReduced)
    raf = requestAnimationFrame(animate)
    return () => {
      finished = true
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.body.style.overflow = previousOverflow
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('keydown', onKey)
      reduced.removeEventListener('change', onReduced)
    }
  }, [words])

  return <div ref={frameRef} className="pixeld-intro">
    <p className="sr-only">Welcome to PIXELD. Made by Khalid Alketbi.</p>
    <canvas ref={canvasRef} aria-hidden="true" className="pixeld-intro-canvas" />
    <button type="button" className="pixeld-intro-skip" onClick={onComplete}>Skip intro <span aria-hidden="true">↗</span></button>
  </div>
}
