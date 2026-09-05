import { supabase, supabaseEnabled } from './supabase'

export const socialPlatforms = [
  { id: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/yourname' },
  { id: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@yourname' },
  { id: 'whatsapp', label: 'WhatsApp', placeholder: '+971 50 123 4567' },
  { id: 'x', label: 'X', placeholder: 'https://x.com/yourname' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/yourname' },
] as const
export type SocialId = typeof socialPlatforms[number]['id']
export type SocialLinks = Record<SocialId, string>
export const emptySocialLinks = (): SocialLinks => ({ instagram: '', tiktok: '', whatsapp: '', x: '', linkedin: '' })
const bucket = 'project-media'
const path = 'settings/social-links.json'

export function normalizeSocialLink(id: SocialId, value: string): string {
  const input = value.trim()
  if (!input) return ''
  if (id === 'whatsapp' && /^[+\d\s()-]+$/.test(input)) {
    const digits = input.replace(/\D/g, '')
    if (!/^[1-9]\d{6,14}$/.test(digits)) throw new Error('Enter your WhatsApp number with its country code, for example +971 50 123 4567.')
    return `https://wa.me/${digits}`
  }
  let url: URL
  try { url = new URL(input) } catch { throw new Error('Enter a full link starting with https://.') }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Use a secure https:// link without login details.')
  const hosts: Record<SocialId, string[]> = {
    instagram: ['instagram.com'], tiktok: ['tiktok.com'], whatsapp: ['wa.me', 'whatsapp.com'],
    x: ['x.com', 'twitter.com'], linkedin: ['linkedin.com'],
  }
  if (!hosts[id].some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
    throw new Error(`Use a ${socialPlatforms.find(p => p.id === id)?.label} link.`)
  }
  return url.toString()
}

export async function loadSocialLinks(): Promise<SocialLinks> {
  if (!supabaseEnabled) throw new Error('Supabase is not connected. Add the website’s Supabase settings first.')
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  const response = await fetch(`${data.publicUrl}?v=${Date.now()}`, { cache: 'no-store' })
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
    if (response.status === 404 || String(problem.statusCode) === '404' || problem.error === 'not_found') return emptySocialLinks()
    throw new Error('Could not load social links. Please try again.')
  }
  const dataLinks: unknown = await response.json()
  if (!dataLinks || typeof dataLinks !== 'object' || Array.isArray(dataLinks)) throw new Error('Saved social links could not be read.')
  const result = emptySocialLinks()
  for (const { id } of socialPlatforms) {
    const value = (dataLinks as Record<string, unknown>)[id]
    if (typeof value === 'string') result[id] = normalizeSocialLink(id, value)
  }
  return result
}

export async function saveSocialLinks(links: SocialLinks): Promise<SocialLinks> {
  if (!supabaseEnabled) throw new Error('Supabase is not connected.')
  const normalized = emptySocialLinks()
  for (const { id, label } of socialPlatforms) {
    try { normalized[id] = normalizeSocialLink(id, links[id]) }
    catch (error) { throw new Error(`${label}: ${error instanceof Error ? error.message : 'Invalid link.'}`) }
  }
  const { error } = await supabase.storage.from(bucket).upload(path, new Blob([JSON.stringify(normalized)], { type: 'application/json' }), {
    contentType: 'application/json', cacheControl: '0', upsert: true,
  })
  if (error) throw new Error(`Could not save social links: ${error.message}`)
  return normalized
}
