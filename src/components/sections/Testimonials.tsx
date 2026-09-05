import { useLayoutEffect, useRef } from 'react'
import { useTestimonials } from '../../hooks/useProjects'
import { gsap } from '../../lib/gsapSetup'

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const { testimonials, loading } = useTestimonials()

  useLayoutEffect(() => {
    if (loading || testimonials.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [loading, testimonials.length])

  if (loading || testimonials.length === 0) return null

  return (
    <section ref={sectionRef} className="px-6 py-28 text-center sm:py-36">
      <p className="mb-3 text-[13px] font-semibold text-mist">Kind Words</p>
      <div className="mx-auto max-w-xl">
        {testimonials.slice(0, 1).map((t) => (
          <div key={t.id}>
            {t.avatar_url && (
              <img src={t.avatar_url} alt={t.name} className="mx-auto mb-5 h-14 w-14 rounded-full object-cover" />
            )}
            <p className="font-display text-[6vw] font-700 leading-snug text-ink sm:text-[22px]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="mt-5 text-[14px] font-semibold text-ink">{t.name}</p>
            {t.company && <p className="text-[13px] text-mist">{t.company}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
