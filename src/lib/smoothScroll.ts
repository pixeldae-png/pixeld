import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapSetup'

let lenis: Lenis | null = null
const tick = (time: number) => lenis?.raf(time * 1000)

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

  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function destroySmoothScroll() {
  gsap.ticker.remove(tick)
  lenis?.destroy()
  lenis = null
}

export function getLenis() {
  return lenis
}
