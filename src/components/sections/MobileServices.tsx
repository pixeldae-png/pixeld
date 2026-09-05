import { useLayoutEffect, useRef } from 'react'
import { site } from '../../data/site'
import { Shape, type ShapeKind } from '../decor/Shape'
import { gsap } from '../../lib/gsapSetup'

const kinds: ShapeKind[] = ['sphere', 'cylinder', 'gem', 'star', 'cube', 'pyramid', 'gem', 'cube']
export function MobileServices() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(max-width: 639px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.mobile-service-card')
        cards.forEach((card, i) => {
          const content = card.querySelector('.mobile-service-content')
          const shape = card.querySelector('.mobile-service-shape')
          gsap.fromTo(content, { y: 30, opacity: .35 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 52%', scrub: .45 } })
          gsap.fromTo(shape, { y: 20, rotation: -30, scale: .8 }, { y: -12, rotation: 35, scale: 1.08, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .65 } })
          if (i < cards.length - 1) gsap.to(card, { scale: .94, opacity: .65, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 65%', end: 'top 110px', scrub: .5 } })
        })
      }, root)
      return () => ctx.revert()
    })
    return () => media.revert()
  }, [])
  return <section ref={root} className="mobile-services sm:hidden" aria-label="Services">
    <div className="mobile-services-heading"><p>WHAT I CAN BUILD FOR YOU</p><h2>From idea<br />to experience.</h2><span>Explore services ↓</span></div>
    <div className="mobile-service-deck">{site.services.map((service, i) => <article key={service.n} className="mobile-service-card">
      <div className="mobile-service-top"><span>{service.n} / 08</span><div className="mobile-service-shape" aria-hidden="true"><Shape kind={kinds[i]} color={i % 2 ? 'teal' : 'violet'} size={78} /></div></div>
      <div className="mobile-service-content"><h3>{service.title}</h3><p>{service.body}</p><a href="#contact">Let’s talk about your project <span aria-hidden="true">↗</span></a></div>
    </article>)}</div>
  </section>
}
