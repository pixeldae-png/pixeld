// Cloudflare Pages Function — POST /api/contact
// Runs server-side only. RESEND_API_KEY / RESEND_FROM_EMAIL / CONTACT_RECEIVER_EMAIL
// are set as environment variables in the Cloudflare Pages dashboard and are
// never exposed to the client bundle.

interface Env {
  RESEND_API_KEY: string
  RESEND_FROM_EMAIL: string
  CONTACT_RECEIVER_EMAIL: string
}

// Best-effort in-memory rate limit (per edge isolate — resets on cold start).
// Good enough to stop naive spam bursts; for stronger protection add
// Cloudflare Turnstile or a KV-backed limiter.
const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 4

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (isRateLimited(ip)) {
    return json({ error: 'Too many requests. Please try again later.' }, 429)
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request body.' }, 400)
  }

  const name = String(body.name || '').trim().slice(0, 200)
  const email = String(body.email || '').trim().slice(0, 200)
  const phone = String(body.phone || '').trim().slice(0, 60)
  const business = String(body.business || '').trim().slice(0, 200)
  const message = String(body.message || '').trim().slice(0, 5000)

  if (!name || !email || !message) {
    return json({ error: 'Name, email, and message are required.' }, 400)
  }
  if (!emailRe.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400)
  }

  const notifyHtml = `
    <h2>New PIXELD contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
    ${business ? `<p><strong>Business:</strong> ${escapeHtml(business)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
  `

  try {
    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: env.CONTACT_RECEIVER_EMAIL,
        reply_to: email,
        subject: `New inquiry from ${name}`,
        html: notifyHtml,
      }),
    })

    if (!notifyRes.ok) {
      return json({ error: 'Failed to send message. Please try again.' }, 502)
    }

    // Optional confirmation email to the customer — non-fatal if it fails.
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Thanks for reaching out to PIXELD',
        html: `<p>Hi ${escapeHtml(name)},</p><p>Thanks for your message — I'll get back to you within a day or two.</p><p>— Khalid, PIXELD</p>`,
      }),
    }).catch(() => {})

    return json({ ok: true })
  } catch {
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
