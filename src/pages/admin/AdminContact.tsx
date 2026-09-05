import { useEffect, useState } from 'react'
import { defaultContactSettings, loadContactSettings, saveContactSettings } from '../../lib/contactSettings'

export default function AdminContact() {
  const [settings, setSettings] = useState(defaultContactSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    loadContactSettings()
      .then((data) => {
        if (!cancelled) setSettings(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load contact settings.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      setSettings(await saveContactSettings(settings))
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Contact settings</h1>
      <p className="mt-3 text-base text-mist">Change the email shown on the website contact section and footer.</p>

      {loading ? (
        <p role="status" className="mt-8">Loading contact settings…</p>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="contact-email" className="mb-2 block text-base font-semibold">Contact email</label>
            <input
              id="contact-email"
              name="contact-email"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={settings.email}
              onChange={(event) => {
                setSettings({ email: event.target.value })
                setSaved(false)
              }}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base focus:outline-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="min-h-12 rounded-full bg-ink px-6 py-3 text-base font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save contact settings'}
          </button>

          {error && (
            <div role="alert" className="text-base text-red-700">
              <p>{error}</p>
              <button type="button" onClick={() => setAttempt((a) => a + 1)} className="mt-3 underline">
                Try loading again
              </button>
            </div>
          )}
          {saved && <p role="status" className="text-base text-green-700">Saved. Your contact email is now published.</p>}
        </form>
      )}
    </section>
  )
}
