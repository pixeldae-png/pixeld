import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site } from '../../data/site'
import { gsap } from '../../lib/gsapSetup'
import { RollText } from '../ui/roll-text'
import { loadContactSettings } from '../../lib/contactSettings'

type Status = 'idle' | 'loading' | 'success' | 'error'

const finaleLines = ["Let's build", 'something', 'memorable.']

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const finaleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [contactEmail, setContactEmail] = useState<string>(site.contact.email)

  useEffect(() => {
    let cancelled = false
    loadContactSettings().then((settings) => {
      if (!cancelled) setContactEmail(settings.email)
    }).catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const lines = finaleRefs.current.filter(Boolean) as HTMLSpanElement[]

      gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        },
      )

      gsap.fromTo(
        '[data-contact-reveal]',
        { autoAlpha: 1, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-xl">
        <div className="mb-12 text-center">
          <p data-contact-reveal className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-mist">
            <span className="contact-spark mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" aria-hidden />
            Contact
          </p>
          <h2 className="font-display text-[12vw] font-800 uppercase leading-[0.98] text-ink sm:text-[52px]">
            {finaleLines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  ref={(el) => (finaleRefs.current[i] = el)}
                  className="inline-block"
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <p data-contact-reveal className="mt-6 text-[15px] text-mist">
            Tell me about your project and I&rsquo;ll get back to you within a day or two.
          </p>
        </div>

        {status === 'success' ? (
          <div className="rounded-3xl border border-line bg-white p-10 text-center">
            <p className="text-[16px] font-semibold text-ink">Message sent — thank you!</p>
            <p className="mt-2 text-[14px] text-mist">I&rsquo;ll reply to you shortly.</p>
          </div>
        ) : (
          <form data-contact-reveal onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required name="name" placeholder="Name" className="input" />
              <input required type="email" name="email" placeholder="Email" className="input" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input name="phone" placeholder="Phone" className="input" />
              <input name="business" placeholder="Business Name" className="input" />
            </div>
            <textarea required name="message" placeholder="Message" rows={5} className="input resize-none" />

            {status === 'error' && <p className="text-[13px] text-red-600">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-full bg-ink px-6 py-3.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              <RollText>{status === 'loading' ? 'Sending…' : 'Send Message'}</RollText>
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-[13px] text-mist">
          Or email directly at{' '}
          <a href={`mailto:${contactEmail}`} className="font-semibold text-ink underline underline-offset-4">
            {contactEmail}
          </a>
        </p>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #e7e7ea;
          padding: 13px 16px;
          font-size: 14px;
          background: #fff;
          outline: none;
          transition: border-color .2s ease;
        }
        .input:focus { border-color: #0b0c0f; }
      `}</style>
    </section>
  )
}
