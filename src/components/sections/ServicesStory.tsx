import { useLayoutEffect, useRef } from 'react'
import { site } from '../../data/site'
import { Shape } from '../decor/Shape'
import { gsap } from '../../lib/gsapSetup'
import type { ShapeKind } from '../decor/Shape'
import { MobileServices } from './MobileServices'

const shapeCycle: { kind: ShapeKind; color: 'coral' | 'teal' | 'violet' | 'sky' | 'lime' }[] = [
  { kind: 'sphere', color: 'coral' },
  { kind: 'cylinder', color: 'lime' },
  { kind: 'gem', color: 'sky' },
  { kind: 'star', color: 'coral' },
  { kind: 'cube', color: 'violet' },
  { kind: 'pyramid', color: 'teal' },
  { kind: 'gem', color: 'violet' },
  { kind: 'cube', color: 'lime' },
]

export function ServicesStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(min-width: 640px)', () => {
    const ctx = gsap.context(() => {
      const items = site.services
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isMobile = window.matchMedia('(max-width: 639px)').matches
      const perItemVh = reduced ? 200 : window.innerHeight * (isMobile ? 0.55 : 0.85)

      gsap.set(itemRefs.current.slice(1), { autoAlpha: 0, y: 40, scale: 0.96 })
      gsap.set(itemRefs.current[0], { autoAlpha: 1, y: 0, scale: 1 })
      gsap.set(
        shapeRefs.current.slice(1),
        { autoAlpha: 0, scale: 0.5, y: 50, rotate: -30 },
      )
      gsap.set(shapeRefs.current[0], { autoAlpha: 1, scale: 1, y: 0, rotate: 0 })

      const setActiveDot = (index: number) => {
        dotRefs.current.forEach((dot, i) => {
          if (!dot) return
          gsap.to(dot, {
            scale: i === index ? 1.6 : 1,
            backgroundColor: i === index ? '#7c6cf2' : '#e7e7ea',
            duration: 0.3,
          })
        })
      }
      setActiveDot(0)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${items.length * perItemVh}`,
          scrub: 0.8,
          pin: stageRef.current,
          anticipatePin: 1,
          onUpdate: (self) => setActiveDot(Math.round(self.progress * (items.length - 1))),
        },
      })

      items.forEach((_, i) => {
        if (i === 0) return
        const t = i - 0.35

        tl.to(itemRefs.current[i - 1], { autoAlpha: 0, y: -50, scale: 0.96, duration: 0.35, ease: 'power2.in' }, t)
          .to(shapeRefs.current[i - 1], { autoAlpha: 0, y: -60, scale: 0.6, rotate: 30, duration: 0.35, ease: 'power2.in' }, t)
          .to(itemRefs.current[i], { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }, t + 0.1)
          .to(shapeRefs.current[i], { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(1.5)' }, t + 0.1)
      })
    }, sectionRef)

    return () => ctx.revert()
    })
    return () => media.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="relative">
      <MobileServices />
      <div ref={stageRef} className="service-motion-stage relative hidden min-h-[100svh] items-center overflow-hidden px-6 sm:flex">
        <div className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2.5 sm:flex lg:right-8">
          {site.services.map((s, i) => (
            <span
              key={s.n}
              ref={(el) => (dotRefs.current[i] = el)}
              className="h-1.5 w-1.5 rounded-full bg-line"
            />
          ))}
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-8 sm:grid-cols-2">
          <div className="relative order-2 flex h-[220px] items-center justify-center sm:order-1 sm:h-[320px]">
            {shapeCycle.map((cfg, i) => (
              <div key={i} className="absolute" ref={(el) => (shapeRefs.current[i] = el)}>
                <Shape kind={cfg.kind} color={cfg.color} size={140} />
              </div>
            ))}
          </div>

          <div className="relative order-1 h-[220px] sm:order-2 sm:h-[280px]">
            {site.services.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => (itemRefs.current[i] = el)}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <span className="mb-4 select-none font-display text-[64px] font-800 leading-none text-ink/10 sm:text-[88px]">
                  {s.n}
                </span>
                <h3 className="font-display text-[7vw] font-800 leading-tight text-ink sm:text-[30px]">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mist">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
