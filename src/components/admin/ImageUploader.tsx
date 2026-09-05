import { useRef, useState } from 'react'
import { uploadProjectImage } from '../../lib/upload'

interface ImageUploaderProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
}

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadProjectImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold text-ink">{label}</label>
      <div className="flex items-center gap-4">
        {value && <img src={value} alt="" className="h-20 w-20 rounded-xl object-cover" />}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-line px-4 py-2 text-[13px] font-medium hover:bg-ink/5 disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload image'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-[12px] text-mist hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
    </div>
  )
}
