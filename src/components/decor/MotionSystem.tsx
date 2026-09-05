import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'

export function MotionSystem() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cleanup: Array<() => void> = []
    const ctx = gsap.context(() => {
      const sections = Array.from(document.querySelectorAll('main section, section[id]:not(#top)'))

      sections.forEach((section) => {
        section.classList.add('cinematic-section')

        gsap.fromTo(
          section,
          { '--section-glow': 0, '--section-line': 0 } as gsap.TweenVars,
          {
            '--section-glow': 1,
            '--section-line': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
              end: 'center 48%',
              scrub: 0.8,
            },
          } as gsap.TweenVars,
        )

        const headings = section.querySelectorAll('h2, h3')
        gsap.fromTo(
          headings,
          { filter: 'blur(10px)', y: 34, opacity: 0.4 },
          {
            filter: 'blur(0px)',
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 76%' },
          },
        )
      })

      if (!window.matchMedia('(pointer: coarse)').matches) {
        document.querySelectorAll<HTMLElement>('a[href^="#"], button, .motion-card-shell, .toolkit-tile').forEach((el) => {
          if (el.closest('[data-no-magnetic]')) return
          const strength = el.matches('.motion-card-shell, .toolkit-tile') ? 0.08 : 0.18
          const onMove = (event: MouseEvent) => {
            const rect = el.getBoundingClientRect()
            const x = event.clientX - rect.left - rect.width / 2
            const y = event.clientY - rect.top - rect.height / 2
            gsap.to(el, { x: x * strength, y: y * strength, duration: 0.45, ease: 'power3.out' })
          }
          const onLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.45)' })
          }
          el.addEventListener('mousemove', onMove)
          el.addEventListener('mouseleave', onLeave)
          cleanup.push(() => {
            el.removeEventListener('mousemove', onMove)
            el.removeEventListener('mouseleave', onLeave)
          })
        })
      }

      gsap.to('.wordmark-huge', {
        backgroundPositionX: '140%',
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 },
      })

      ScrollTrigger.refresh()
    })

    return () => {
      cleanup.forEach((fn) => fn())
      ctx.revert()
    }
  }, [])

  return null
}
