import { useLayoutEffect, useRef } from 'react'
import { site } from '../../data/site'
import { Shape } from '../decor/Shape'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])
  // Parallax (continuous, scroll-scrubbed) and reveal (one-time entrance)
  // both want to move/rotate these shapes — split across an outer
  // (parallax) and inner (reveal) node so they don't overwrite each other.
  const shapeLeftParallaxRef = useRef<HTMLDivElement>(null)
  const shapeRightParallaxRef = useRef<HTMLDivElement>(null)
  const shapeLeftRef = useRef<HTMLDivElement>(null)
  const shapeRightRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      const lines = lineRefs.current.filter(Boolean) as HTMLParagraphElement[]

      reveal
        .fromTo(labelRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo(
          headingRef.current,
          { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, y: 16 },
          { clipPath: 'inset(0 0 0% 0)', autoAlpha: 1, y: 0, duration: 0.9, ease: 'power4.out' },
          '-=0.3',
        )
        .fromTo(
          lines,
          { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, y: 14 },
          { clipPath: 'inset(0 0 0% 0)', autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' },
          '-=0.5',
        )
        .fromTo(
          [shapeLeftRef.current, shapeRightRef.current],
          { autoAlpha: 0, scale: 0.7, rotate: -16 },
          { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.9, stagger: 0.12 },
          '-=0.6',
        )

      gsap.to(shapeLeftParallaxRef.current, {
        y: -60,
        rotate: -18,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.to(shapeRightParallaxRef.current, {
        y: 60,
        rotate: 18,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden px-6 py-32 sm:py-40">
      <div aria-hidden="true" className="about-shape about-shape-left absolute left-[6%] top-1/2 -translate-y-1/2">
        <div ref={shapeLeftParallaxRef}>
          <Shape ref={shapeLeftRef} kind="cube" color="violet" size={120} />
        </div>
      </div>
      <div aria-hidden="true" className="about-shape about-shape-right absolute right-[6%] top-1/2 -translate-y-1/2">
        <div ref={shapeRightParallaxRef}>
          <Shape ref={shapeRightRef} kind="gem" color="sky" size={120} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div ref={labelRef} className="mb-6 flex items-center justify-center gap-2 text-[13px] font-semibold text-mist">
          <span className="h-1.5 w-1.5 rounded-sm bg-ink" />
          {site.about.label}
        </div>
        <h2 ref={headingRef} className="font-display text-[9vw] font-800 leading-[1.05] text-ink sm:text-[42px]">
          {site.about.heading}
        </h2>
        <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-mist">
          {site.about.paragraphs.map((p, i) => (
            <p key={p} ref={(el) => (lineRefs.current[i] = el)}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
