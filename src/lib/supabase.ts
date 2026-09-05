import { createClient } from '@supabase/supabase-js'

const fallbackUrl = 'https://plmlbjzlqrzjzsdybgvm.supabase.co'
const fallbackAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbWxianpscXJ6anpzZHliZ3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Mzk2MTEsImV4cCI6MjEwNDIxNTYxMX0.t9CXzo0y3ZWiJQnF3KhzHIskGbs-NM5tDBynBvh4SAU'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || fallbackUrl
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || fallbackAnonKey

export const supabaseEnabled = Boolean(url && anonKey)

export const supabase = createClient(url, anonKey)
