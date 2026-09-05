import { useLayoutEffect, useRef } from 'react'
import { site } from '../../data/site'
import { gsap } from '../../lib/gsapSetup'

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current ? Array.from(gridRef.current.children) : []
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="pricing" ref={sectionRef} className="px-6 py-28 sm:py-36">
      <div className="mx-auto mb-14 max-w-lg text-center">
        <p className="mb-3 text-[13px] font-semibold text-mist">Pricing</p>
        <h2 className="font-display text-[9vw] font-800 leading-tight text-ink sm:text-[40px]">
          Plans that fit your project
        </h2>
      </div>

      <div ref={gridRef} className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {site.pricing.plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-3xl border p-8 ${
              plan.highlighted ? 'border-ink bg-ink text-white shadow-xl' : 'border-line bg-white'
            }`}
          >
            <h3 className={`text-[16px] font-semibold ${plan.highlighted ? 'text-white' : 'text-ink'}`}>
              {plan.name}
            </h3>
            <p className={`mt-1 text-[13px] ${plan.highlighted ? 'text-white/60' : 'text-mist'}`}>{plan.note}</p>
            <p className={`mt-3 font-display text-[36px] font-800 ${plan.highlighted ? 'text-white' : 'text-ink'}`}>
              {site.pricing.currency} {plan.price}
            </p>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className={`flex items-start gap-2.5 text-[14px] ${plan.highlighted ? 'text-white/85' : 'text-ink/75'}`}
                >
                  <span className={plan.highlighted ? 'text-white' : 'text-ink'}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`mt-8 block rounded-full px-5 py-3 text-center text-[14px] font-semibold transition-transform hover:scale-[1.03] ${
                plan.highlighted ? 'bg-white text-ink' : 'bg-ink text-white'
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-md text-center text-[14px] text-mist">
        {site.pricing.footnote}{' '}
        <a href="#contact" className="font-semibold text-ink underline underline-offset-4">
          Book a Call
        </a>
      </p>
    </section>
  )
}
