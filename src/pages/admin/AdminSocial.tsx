import { useEffect, useState } from 'react'
import { emptySocialLinks, loadSocialLinks, saveSocialLinks, socialPlatforms } from '../../lib/socialLinks'

export default function AdminSocial() {
  const [links, setLinks] = useState(emptySocialLinks)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(''); setReady(false)
    loadSocialLinks().then(data => { if (!cancelled) { setLinks(data); setReady(true) } })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [attempt])

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(''); setSaved(false)
    try { setLinks(await saveSocialLinks(links)); setSaved(true) }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not save. Please try again.') }
    finally { setSaving(false) }
  }
  return <section className="max-w-2xl">
    <h1 className="font-display text-3xl font-bold">Social links</h1>
    <p className="mt-3 text-base text-mist">Add your accounts to the website footer. Leave a field empty to hide it.</p>
    {loading ? <p role="status" className="mt-8">Loading your links…</p> : <form onSubmit={submit} className="mt-8 space-y-6">
      <fieldset disabled={!ready || saving} className="space-y-6 disabled:opacity-60">
        {socialPlatforms.map(({ id, label, placeholder }) => <div key={id}>
          <label htmlFor={id} className="mb-2 block text-base font-semibold">{label}</label>
          <input id={id} name={id} type="text" inputMode={id === 'whatsapp' ? 'text' : 'url'} autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={2048}
            value={links[id]} placeholder={placeholder}
            onChange={event => { setLinks(current => ({ ...current, [id]: event.target.value })); setSaved(false) }}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base focus:outline-accent" />
          {id === 'whatsapp' && <p className="mt-2 text-sm text-mist">Enter your number including country code, or paste a WhatsApp link.</p>}
        </div>)}
        <button type="submit" className="min-h-12 rounded-full bg-ink px-6 py-3 text-base font-semibold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save social links'}</button>
      </fieldset>
      {error && <div role="alert" className="text-base text-red-700"><p>{error}</p>{!ready && <button type="button" onClick={() => setAttempt(a => a + 1)} className="mt-3 underline">Try loading again</button>}</div>}
      {saved && <p role="status" className="text-base text-green-700">Saved. Your links are now published. <a href="/" target="_blank" rel="noopener noreferrer" className="underline">View website ↗</a></p>}
    </form>}
  </section>
}
