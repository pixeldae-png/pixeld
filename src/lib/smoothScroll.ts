import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapSetup'

let lenis: Lenis | null = null
let rafId: number | null = null

export function initSmoothScroll() {
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function destroySmoothScroll() {
  if (rafId) cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
}

export function getLenis() {
  return lenis
}
