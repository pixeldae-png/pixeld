import { site } from '../data/site'
import { supabase, supabaseEnabled } from './supabase'

export type ContactSettings = {
  email: string
}

const bucket = 'project-media'
const path = 'settings/contact-settings.json'
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const defaultContactSettings = (): ContactSettings => ({
  email: site.contact.email,
})

export function normalizeContactEmail(value: string): string {
  const email = value.trim().toLowerCase()
  if (!emailRe.test(email)) throw new Error('Enter a valid email address.')
  return email
}

export async function loadContactSettings(): Promise<ContactSettings> {
  if (!supabaseEnabled) return defaultContactSettings()

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  const response = await fetch(`${data.publicUrl}?v=${Date.now()}`, { cache: 'no-store' })

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
    if (response.status === 404 || String(problem.statusCode) === '404' || problem.error === 'not_found') {
      return defaultContactSettings()
    }
    throw new Error('Could not load contact settings. Please try again.')
  }

  const saved: unknown = await response.json()
  const email = saved && typeof saved === 'object' ? (saved as Record<string, unknown>).email : ''

  return {
    email: typeof email === 'string' && email.trim() ? normalizeContactEmail(email) : site.contact.email,
  }
}

export async function saveContactSettings(settings: ContactSettings): Promise<ContactSettings> {
  if (!supabaseEnabled) throw new Error('Supabase is not connected.')

  const normalized = {
    email: normalizeContactEmail(settings.email),
  }

  const { error } = await supabase.storage.from(bucket).upload(
    path,
    new Blob([JSON.stringify(normalized)], { type: 'application/json' }),
    {
      contentType: 'application/json',
      cacheControl: '0',
      upsert: true,
    },
  )

  if (error) throw new Error(`Could not save contact settings: ${error.message}`)

  return normalized
}
