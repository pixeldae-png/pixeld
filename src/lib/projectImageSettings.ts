import { supabase, supabaseEnabled } from './supabase'

export type ProjectImageFit = 'cover' | 'contain'

export type ProjectImageSetting = {
  fit: ProjectImageFit
  scale: number
  x: number
  y: number
}

export type ProjectImageSettings = Record<string, ProjectImageSetting>

const bucket = 'project-media'
const path = 'settings/project-image-settings.json'

export const defaultProjectImageSetting = (): ProjectImageSetting => ({
  fit: 'contain',
  scale: 100,
  x: 50,
  y: 50,
})

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function numeric(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function normalizeProjectImageSetting(value: Partial<ProjectImageSetting> | null | undefined): ProjectImageSetting {
  const defaults = defaultProjectImageSetting()

  return {
    fit: value?.fit === 'cover' ? 'cover' : defaults.fit,
    scale: clamp(numeric(value?.scale, defaults.scale), 70, 180),
    x: clamp(numeric(value?.x, defaults.x), 0, 100),
    y: clamp(numeric(value?.y, defaults.y), 0, 100),
  }
}

export async function loadProjectImageSettings(): Promise<ProjectImageSettings> {
  if (!supabaseEnabled) return {}

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  const response = await fetch(`${data.publicUrl}?v=${Date.now()}`, { cache: 'no-store' })

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
    if (response.status === 404 || String(problem.statusCode) === '404' || problem.error === 'not_found') return {}
    throw new Error('Could not load image frame settings.')
  }

  const saved: unknown = await response.json()
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {}

  return Object.fromEntries(
    Object.entries(saved as Record<string, Partial<ProjectImageSetting>>).map(([key, value]) => [
      key,
      normalizeProjectImageSetting(value),
    ]),
  )
}

export async function saveProjectImageSetting(projectId: string, setting: ProjectImageSetting): Promise<ProjectImageSetting> {
  if (!supabaseEnabled) throw new Error('Supabase is not connected.')

  const current: ProjectImageSettings = await loadProjectImageSettings().catch(() => ({}))
  const normalized = normalizeProjectImageSetting(setting)
  current[projectId] = normalized

  const { error } = await supabase.storage.from(bucket).upload(
    path,
    new Blob([JSON.stringify(current)], { type: 'application/json' }),
    {
      contentType: 'application/json',
      cacheControl: '0',
      upsert: true,
    },
  )

  if (error) throw new Error(`Could not save image frame settings: ${error.message}`)

  return normalized
}
