import { useEffect, useRef, useState } from 'react'
import { site } from '../../data/site'
import { gsap } from '../../lib/gsapSetup'

export function Nav() {
  const barRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    gsap.set(el, { y: -80, opacity: 0 })
    gsap.to(el, { y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease: 'power3.out' })
  }, [])

  // Active-section indicator — a subtle accent dot appears under whichever
  // nav link matches the section currently crossing the middle of the
  // viewport. IntersectionObserver, not scroll math, so it stays cheap.
  useEffect(() => {
    const sections = site.nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => !!el)

    if (sections.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveHref(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Tasteful "magnetic" pull on the primary CTA — nudges toward the cursor
  // within a small radius, springs back on leave. Desktop pointer only.
  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      gsap.to(el, { x: relX * 0.25, y: relY * 0.5, duration: 0.4, ease: 'power2.out' })
    }
    function onLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  function go(href: string) {
    setOpen(false)
    const target = document.querySelector(href)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fixed top-4 left-1/2 z-50 w-[min(920px,92vw)] -translate-x-1/2">
      <div ref={barRef}>
        <nav className="flex items-center justify-between rounded-full border border-line/70 bg-white/80 px-3 py-2 shadow-[0_8px_30px_rgba(11,12,15,0.06)] backdrop-blur-md">
          <a href="#top" className="flex items-center gap-1.5 pl-2 font-display text-[15px] font-800 tracking-tight">
            <span aria-hidden className="text-lg leading-none">↗</span>
            {site.brand}
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {site.nav.map((item) => {
              const isActive = activeHref === item.href
              return (
                <button
                  key={item.label}
                  onClick={() => go(item.href)}
                  className={`group relative flex flex-col items-center gap-1 text-[14px] font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  {item.label}
                  <span
                    className={`h-[3px] w-[3px] rounded-full bg-accent transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    }`}
                    aria-hidden
                  />
                </button>
              )
            })}
          </div>

          <a
            ref={ctaRef}
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              go('#contact')
            }}
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] md:block"
          >
            Let&rsquo;s Work Together
          </a>

          <button
            className="mr-1 rounded-full p-2 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </nav>

        {open && (
          <div className="mt-2 flex flex-col gap-1 rounded-3xl border border-line/70 bg-white/95 p-3 shadow-lg backdrop-blur-md md:hidden">
            {site.nav.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.href)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-medium hover:bg-ink/5 ${
                  activeHref === item.href ? 'text-ink' : 'text-ink/80'
                }`}
              >
                {item.label}
                {activeHref === item.href && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
              </button>
            ))}
            <button
              onClick={() => go('#contact')}
              className="mt-1 rounded-xl bg-ink px-4 py-3 text-center text-[14px] font-semibold text-white"
            >
              Let&rsquo;s Work Together
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
