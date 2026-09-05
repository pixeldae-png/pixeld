export interface ProjectImage {
  id: string
  project_id: string
  url: string
  sort_order: number
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  client: string | null
  description: string | null
  category: string | null
  cover_image: string | null
  website_url: string | null
  technologies: string[]
  year: number | null
  featured: boolean
  sort_order: number
  visible: boolean
  created_at: string
  updated_at: string
  images?: ProjectImage[]
}

export interface Testimonial {
  id: string
  name: string
  company: string | null
  quote: string
  avatar_url: string | null
  visible: boolean
  sort_order: number
  created_at: string
}
