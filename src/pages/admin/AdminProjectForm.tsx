import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadProjectImage } from '../../lib/upload'
import { ImageUploader } from '../../components/admin/ImageUploader'
import type { Project, ProjectImage } from '../../types'

const empty = {
  title: '',
  slug: '',
  client: '',
  description: '',
  category: '',
  cover_image: null as string | null,
  website_url: '',
  technologies: '',
  year: new Date().getFullYear(),
  featured: false,
  visible: true,
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminProjectForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()

  const [form, setForm] = useState(empty)
  const [gallery, setGallery] = useState<ProjectImage[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (isNew) return
    async function load() {
      const { data } = await supabase
        .from('projects')
        .select('*, images:project_images(*)')
        .eq('id', id)
        .maybeSingle()
      if (data) {
        const p = data as Project
        setForm({
          title: p.title,
          slug: p.slug,
          client: p.client || '',
          description: p.description || '',
          category: p.category || '',
          cover_image: p.cover_image,
          website_url: p.website_url || '',
          technologies: (p.technologies || []).join(', '),
          year: p.year || new Date().getFullYear(),
          featured: p.featured,
          visible: p.visible,
        })
        setGallery(p.images || [])
        setSlugTouched(true)
      }
      setLoading(false)
    }
    load()
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      client: form.client || null,
      description: form.description || null,
      category: form.category || null,
      cover_image: form.cover_image,
      website_url: form.website_url || null,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      year: form.year || null,
      featured: form.featured,
      visible: form.visible,
    }

    if (isNew) {
      const { data: maxRow } = await supabase
        .from('projects')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle()
      const nextSort = (maxRow?.sort_order ?? -1) + 1

      const { error } = await supabase.from('projects').insert({ ...payload, sort_order: nextSort })
      if (error) setError(error.message)
      else navigate('/admin/projects')
    } else {
      const { error } = await supabase.from('projects').update(payload).eq('id', id)
      if (error) setError(error.message)
      else navigate('/admin/projects')
    }

    setSaving(false)
  }

  async function handleGalleryUpload(file: File | undefined) {
    if (!file || !id) return
    const url = await uploadProjectImage(file)
    const { data } = await supabase
      .from('project_images')
      .insert({ project_id: id, url, sort_order: gallery.length })
      .select()
      .single()
    if (data) setGallery((g) => [...g, data as ProjectImage])
  }

  async function removeGalleryImage(imgId: string) {
    await supabase.from('project_images').delete().eq('id', imgId)
    setGallery((g) => g.filter((i) => i.id !== imgId))
  }

  if (loading) return <p className="text-[14px] text-mist">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-[22px] font-800">{isNew ? 'New Project' : 'Edit Project'}</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value
              setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }))
            }}
            className="field"
          />
        </Field>

        <Field label="Slug">
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              setForm((f) => ({ ...f, slug: e.target.value }))
            }}
            className="field"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Client">
            <input value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} className="field" />
          </Field>
          <Field label="Category">
            <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="field" />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="field resize-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Website URL">
            <input value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} className="field" />
          </Field>
          <Field label="Year">
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
              className="field"
            />
          </Field>
        </div>

        <Field label="Technologies (comma separated)">
          <input
            value={form.technologies}
            onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
            className="field"
            placeholder="React, TypeScript, Supabase"
          />
        </Field>

        <ImageUploader label="Cover Image" value={form.cover_image} onChange={(url) => setForm((f) => ({ ...f, cover_image: url }))} />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-[13px] text-ink/80">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-[13px] text-ink/80">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} />
            Visible
          </label>
        </div>

        {!isNew && (
          <div>
            <label className="mb-2 block text-[13px] font-semibold text-ink">Gallery Images</label>
            <div className="mb-3 grid grid-cols-4 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="group relative">
                  <img src={img.url} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img.id)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleGalleryUpload(e.target.files?.[0])}
              className="text-[13px]"
            />
          </div>
        )}

        {isNew && (
          <p className="text-[12px] text-mist">Save the project first to add gallery images.</p>
        )}

        {error && <p className="text-[13px] text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Project'}
        </button>
      </form>

      <style>{`
        .field {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #e7e7ea;
          padding: 11px 14px;
          font-size: 14px;
          outline: none;
        }
        .field:focus { border-color: #0b0c0f; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</label>
      {children}
    </div>
  )
}
