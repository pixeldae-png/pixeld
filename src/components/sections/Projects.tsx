import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import { gsap } from '../../lib/gsapSetup'
import { TextEffect } from '../ui/text-effect'
import { TextShimmer } from '../ui/text-shimmer'

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const { projects, loading } = useProjects({ onlyVisible: true })

  useLayoutEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const cards = gridRef.current ? Array.from(gridRef.current.children) : []
      // Alternating vertical offsets on entry — reads as composed, not a
      // uniform grid all snapping in together.
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: i % 2 === 0 ? 70 : 90, scale: 0.96, rotation: i % 2 ? 2 : -2 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          },
        )
        const image = card.querySelector('img')
        if (image) gsap.fromTo(image, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .6 } })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [loading, projects.length])

  return (
    <section id="projects" ref={sectionRef} className="px-6 py-28 sm:py-36">
      <div className="mx-auto mb-14 max-w-lg text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-mist"><TextShimmer>Selected Work</TextShimmer></p>
        <h2 className="font-display text-[9vw] font-800 leading-tight text-ink sm:text-[40px]"><TextEffect per="char">Projects</TextEffect></h2>
      </div>

      {!loading && projects.length === 0 && (
        <p className="mx-auto max-w-md text-center text-[14px] text-mist">
          Projects will appear here once added from the admin dashboard.
        </p>
      )}

      <div ref={gridRef} className="mx-auto grid max-w-5xl grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2">
        {projects.map((p, i) => {
          const Card = (
            <div
              className="project-motion-frame group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-line"
              style={{ marginTop: i % 2 === 1 ? '2.5rem' : 0 }}
            >
              {p.cover_image && (
                <img
                  src={p.cover_image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
              <div className="project-motion-caption absolute inset-0 flex items-end bg-gradient-to-t from-black/55 via-black/0 to-black/0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink">
                  View Project
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </span>
              </div>
            </div>
          )

          return (
            <div key={p.id} className="group/card">
              {p.website_url ? (
                <a href={p.website_url} target="_blank" rel="noopener noreferrer">
                  {Card}
                </a>
              ) : (
                <Link to={`/projects/${p.slug}`}>{Card}</Link>
              )}
              <div className="mt-4 flex items-center justify-between" style={{ marginTop: i % 2 === 1 ? '2.5rem' : '1rem' }}>
                <h3 className="text-[16px] font-semibold text-ink transition-transform duration-500 group-hover/card:translate-x-1.5">
                  {p.title}
                </h3>
                {p.category && (
                  <span className="text-[13px] text-mist transition-opacity duration-500 group-hover/card:opacity-50">
                    {p.category}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
