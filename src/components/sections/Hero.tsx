import { useLayoutEffect, useRef } from 'react'
import { site } from '../../data/site'
import { Shape } from '../decor/Shape'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'

// Shapes framing the (now much larger) portrait — pushed toward the edges
// so they read as a frame around the face rather than competing with it.
const shapeConfig = [
  { kind: 'pyramid', color: 'coral', size: 84, pos: 'left-[4%] top-[12%]', drift: { x: -70, y: -46 } },
  { kind: 'star', color: 'teal', size: 74, pos: 'right-[5%] top-[8%]', drift: { x: 76, y: -54 } },
  { kind: 'sphere', color: 'violet', size: 92, pos: 'left-[5%] top-[58%]', drift: { x: -96, y: 34 } },
  { kind: 'cylinder', color: 'sky', size: 78, pos: 'left-[7%] bottom-[7%]', drift: { x: -54, y: 76 } },
  { kind: 'cube', color: 'lime', size: 72, pos: 'right-[7%] bottom-[9%]', drift: { x: 86, y: 64 } },
] as const

// Three independent concerns touch these elements — a one-time entrance
// (plays on mount), a scroll-scrubbed exit/parallax (tied to the pinned
// scroll range), and for shapes a continuous idle float. Each concern gets
// its OWN wrapper node so GSAP's overwrite management never has two tweens
// fighting over the same inline transform/opacity (that bug once left the
// hero content stuck invisible after scrolling down and back up — see the
// identical fix applied to Nav's centering vs. its entrance animation).
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const wordmarkExitRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  // Portrait now moves at its own (slower) parallax speed, independent from
  // the text block below it — it's the dominant visual, not a footnote.
  const portraitOuterRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)

  const contentExitRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const rolesRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const shapeExitRefs = useRef<(HTMLDivElement | null)[]>([])
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const shapes = shapeRefs.current.filter(Boolean) as HTMLDivElement[]

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(wordmarkRef.current, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.2 })
        .fromTo(
          shapes,
          { autoAlpha: 0, y: -30, scale: 0.6, rotate: -20 },
          { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.9, stagger: 0.08 },
          '-=0.7',
        )
        .fromTo(portraitRef.current, { autoAlpha: 0, scale: 0.9, y: 24 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1 }, '-=0.6')
        .fromTo(headingRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.55')
        .fromTo(rolesRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.35')
        .fromTo(subRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo(ctaRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4')

      // Single scrubbed timeline, three readable phases (0→20%, 20→55%,
      // 55→100% of the pinned scroll range), each layer moving at its own
      // depth speed: wordmark slowest (0.6x), portrait mid (0.85x), text
      // fastest (1x) — this is what actually reads as "depth" rather than
      // everything sliding off together.
      // Shorter pinned scroll runway on small screens — the same 3-phase
      // choreography, just less scrolling to get through it.
      const isMobile = window.matchMedia('(max-width: 639px)').matches
      const exit = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: isMobile ? '+=70%' : '+=130%',
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
        },
      })

      exit
        .to(
          wordmarkExitRef.current,
          {
            ease: 'none',
            keyframes: {
              '0%': { y: 0, scale: 1, autoAlpha: 1 },
              '20%': { y: -10, scale: 1.02 },
              '55%': { y: -26, scale: 1.06, autoAlpha: 0.85 },
              '100%': { y: -48, scale: 1.12, autoAlpha: 0 },
            },
          },
          0,
        )
        .to(
          portraitOuterRef.current,
          {
            ease: 'none',
            keyframes: {
              '0%': { y: 0, scale: 0.96, autoAlpha: 1 },
              '20%': { y: -14, scale: 1 },
              '55%': { y: -38, scale: 1.02, autoAlpha: 1 },
              '100%': { y: -70, scale: 1.05, autoAlpha: 0 },
            },
          },
          0,
        )
        .to(
          contentExitRef.current,
          {
            ease: 'none',
            keyframes: {
              '0%': { y: 0, scale: 1, autoAlpha: 1 },
              '20%': { y: -6 },
              '55%': { y: -32, scale: 0.98, autoAlpha: 0.9 },
              '100%': { y: -84, scale: 0.9, autoAlpha: 0 },
            },
          },
          0,
        )

      shapeConfig.forEach((cfg, i) => {
        const el = shapeExitRefs.current[i]
        if (!el) return
        const midRotate = i % 2 === 0 ? 12 : -12
        const endRotate = i % 2 === 0 ? 30 : -30
        exit.to(
          el,
          {
            ease: 'none',
            keyframes: {
              '0%': { x: 0, y: 0, rotate: 0 },
              '35%': { rotate: midRotate },
              '100%': { x: cfg.drift.x, y: cfg.drift.y, rotate: endRotate },
            },
          },
          0,
        )
      })

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const idleTweens = shapes.map((el, i) =>
          gsap.to(el, {
            y: `+=${10 + i * 3}`,
            rotate: `+=${8 + i * 2}`,
            duration: 3.5 + i * 0.6,
            delay: 1.6 + i * 0.15,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            paused: true,
          }),
        )

        // Only run these forever-looping tweens while the hero is actually
        // on screen — keeps idle CPU/GPU use down once the user scrolls on.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => idleTweens.forEach((t) => (self.isActive ? t.play() : t.pause())),
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <div ref={wordmarkExitRef}>
          <div
            ref={wordmarkRef}
            aria-hidden
            className="wordmark-huge select-none whitespace-nowrap text-center text-[26vw] text-ink/[0.08] sm:text-[20vw]"
          >
            {site.wordmark} {site.wordmark}
          </div>
        </div>
      </div>

      {shapeConfig.map((cfg, i) => (
        <div key={cfg.kind + i} className={`absolute ${cfg.pos} z-10`}>
          <div ref={(el) => (shapeExitRefs.current[i] = el)}>
            <Shape
              ref={(el) => (shapeRefs.current[i] = el)}
              kind={cfg.kind}
              color={cfg.color}
              size={cfg.size}
              className="hidden sm:block"
            />
          </div>
        </div>
      ))}

      {/* Portrait is the hero's main focal point — deliberately large and
          layered above the atmospheric wordmark, below nothing. */}
      <div ref={portraitOuterRef} className="relative z-20">
        <div ref={portraitRef} className="h-[300px] w-auto sm:h-[380px] lg:h-[440px] xl:h-[500px]">
          <img
            src={site.portrait}
            alt={site.name}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      <div ref={contentExitRef} className="relative z-20 -mt-2 flex flex-col items-center text-center sm:-mt-4">
        <h1 ref={headingRef} className="font-display text-[11vw] font-800 leading-[0.95] text-ink sm:text-[64px]">
          {site.tagline} {site.name}
        </h1>

        <div ref={rolesRef} className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-y border-line/70 py-4 text-[14px] font-medium text-ink/80 sm:text-[15px]">
          {site.roles.map((r, i) => (
            <span key={r} className="flex items-center gap-2">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden />}
              {r}
            </span>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-md text-[15px] text-mist sm:text-[16px]" ref={subRef}>
          {site.heroSub}
        </p>

        <div ref={ctaRef} className="mt-8">
          <a
            href="#contact"
            className="inline-block rounded-full bg-ink px-7 py-3.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.04] active:scale-[0.98]"
          >
            Let&rsquo;s Work Together!
          </a>
        </div>
      </div>
    </section>
  )
}
