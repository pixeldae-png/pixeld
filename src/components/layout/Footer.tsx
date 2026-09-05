import { site } from '../../data/site'
import { useEffect, useState } from 'react'
import { emptySocialLinks, loadSocialLinks, socialPlatforms } from '../../lib/socialLinks'

export function Footer() {
  const year = new Date().getFullYear()
  const [socialLinks, setSocialLinks] = useState(emptySocialLinks)
  useEffect(() => {
    let cancelled = false
    loadSocialLinks().then(links => { if (!cancelled) setSocialLinks(links) }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-[13px] font-semibold text-ink">Contact Me</h4>
            <ul className="space-y-2.5 text-[14px] text-mist">
              <li>
                <a href="#contact" className="hover:text-ink">Book a Call</a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="hover:text-ink">
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold text-ink">Useful Links</h4>
            <ul className="space-y-2.5 text-[14px] text-mist">
              {site.nav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-ink">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold text-ink">Social</h4>
            <ul className="space-y-2.5 text-[14px] text-mist">
              {socialPlatforms.filter(s => socialLinks[s.id]).map((s) => (
                <li key={s.id}>
                  <a href={socialLinks[s.id]} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-ink">{s.label} ↗</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-semibold text-ink">Legal</h4>
            <ul className="space-y-2.5 text-[14px] text-mist">
              <li><a href="#" className="hover:text-ink">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-ink">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-line" />

        <div className="mb-10">
          <p className="text-[13px] font-semibold text-ink">{site.brand}</p>
          <p className="text-[13px] text-mist">{site.footer.tagline}</p>
        </div>

        <div className="wordmark-huge select-none overflow-hidden text-[16vw] leading-[0.78] text-ink/95 sm:text-[15vw]">
          {site.wordmark}
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-3 text-[12px] text-mist sm:flex-row sm:items-center">
          <p>© {year} {site.brand}. All rights reserved.</p>
          <p>Designed &amp; built by {site.name}</p>
        </div>
      </div>
    </footer>
  )
}
