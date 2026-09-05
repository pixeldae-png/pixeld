import { useEffect, useLayoutEffect, useRef } from 'react'
import { site } from '../../data/site'
import { gsap } from '../../lib/gsapSetup'

export function Stack() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Pause the infinite idle-bob animation while the section is off screen —
  // no point spending CPU/GPU animating tiles nobody can see.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => el.setAttribute('data-inview', String(entry.isIntersecting)),
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        },
      )

      const tiles = gridRef.current ? Array.from(gridRef.current.children) : []
      gsap.fromTo(
        tiles,
        { autoAlpha: 0, scale: 0.6, y: 24 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: { each: 0.06, from: 'center' },
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="stack" ref={sectionRef} className="relative px-6 py-28 sm:py-36">
      <div ref={headingRef} className="mx-auto mb-16 max-w-lg text-center">
        <p className="mb-3 text-[13px] font-semibold text-mist">My Stack</p>
        <h2 className="font-display text-[8vw] font-800 leading-tight text-ink sm:text-[36px]">
          Tools I build with
        </h2>
      </div>

      <div
        ref={gridRef}
        className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6"
      >
        {site.stack.map((tool, i) => (
          <div
            key={tool}
            className="floaty flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white p-3 text-center shadow-[0_10px_24px_rgba(11,12,15,0.05)]"
            style={{ animationDelay: `${(i % 6) * -0.6}s` }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
              {tool.slice(0, 2)}
            </span>
            <span className="text-[12px] font-medium text-ink/80">{tool}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatyKeyframes {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .floaty { animation: floatyKeyframes 4.5s ease-in-out infinite; animation-play-state: paused; }
        section[data-inview="true"] .floaty { animation-play-state: running; }
        @media (prefers-reduced-motion: reduce) {
          .floaty { animation: none; }
        }
      `}</style>
    </section>
  )
}
