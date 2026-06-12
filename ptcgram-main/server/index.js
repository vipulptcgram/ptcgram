import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
const PORT = Number(process.env.PORT || 8080)
const RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000)
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5)
const contactRateLimitStore = new Map()

app.use(cors())
app.use(express.json({ limit: '200kb' }))

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'Unavailable'
}

function sanitizeInput(value, { maxLength = 1000, multiline = false } = {}) {
  const raw = String(value || '')
  const withoutControls = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  const normalized = multiline
    ? withoutControls.replace(/\r\n/g, '\n').trim()
    : withoutControls.replace(/\s+/g, ' ').trim()
  return normalized.slice(0, maxLength)
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, '')
}

function validateBody(body = {}) {
  const name = sanitizeInput(body.name, { maxLength: 120 })
  const email = sanitizeInput(body.email, { maxLength: 254 }).toLowerCase()
  const rawPhone = sanitizeInput(body.phone, { maxLength: 30 })
  const message = sanitizeInput(body.message, { maxLength: 3000, multiline: true })
  const pageUrl = sanitizeInput(body.pageUrl, { maxLength: 1000 })
  const phone = normalizePhone(rawPhone)

  const errors = {}
  if (!name) errors.name = 'Name is required.'
  if (!email) errors.email = 'Email is required.'
  if (!message) errors.message = 'Message is required.'

  if (email && !isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (phone) {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 15) {
      errors.phone = 'Phone number must be between 7 and 15 digits.'
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, error: 'Validation failed.', errors }
  }

  return { ok: true, data: { name, email, phone, message, pageUrl } }
}

function isRateLimited(ip) {
  const now = Date.now()
  const existing = contactRateLimitStore.get(ip)

  if (!existing || existing.expiresAt <= now) {
    contactRateLimitStore.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS })
    return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  existing.count += 1
  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((existing.expiresAt - now) / 1000),
    }
  }

  return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - existing.count }
}

function buildMessage({ name, email, phone, message, pageUrl, submittedAt, ip }) {
  const lines = [
    'New Contact Form Submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'N/A'}`,
    `Message: ${message}`,
    `Page URL: ${pageUrl || 'N/A'}`,
    `Date/Time: ${submittedAt}`,
    `User IP: ${ip || 'Unavailable'}`,
  ]
  return lines.join('\n')
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildLeadEmailHtml({ name, email, phone, message, pageUrl, submittedAt, ip }) {
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || 'N/A'],
    ['Message', message],
    ['Page URL', pageUrl || 'N/A'],
    ['IP Address', ip || 'Unavailable'],
    ['Submitted At', submittedAt],
  ]

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;color:#111827;width:180px;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#1f2937;line-height:1.5;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('')

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Website Contact Lead</title>
  </head>
  <body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" style="width:100%;max-width:700px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:18px 22px;background:#0f2a52;color:#ffffff;">
          <h1 style="margin:0;font-size:20px;line-height:1.3;">New Website Contact Lead</h1>
          <p style="margin:6px 0 0 0;font-size:14px;opacity:0.95;">A new contact form enquiry has been submitted.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:22px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            ${tableRows}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.post('/api/contact', async (req, res) => {
  try {
    const ip = getClientIp(req)
    const rateLimit = isRateLimited(ip)
    if (rateLimit.limited) {
      return res.status(429).json({
        ok: false,
        message: 'Too many contact requests. Please try again later.',
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      })
    }

    const validated = validateBody(req.body)
    if (!validated.ok) {
      return res.status(400).json({
        ok: false,
        message: validated.error,
        errors: validated.errors || undefined,
      })
    }

    const supportEmail = process.env.SUPPORT_EMAIL || 'support.ptcgram@gmail.com'
    const salesEmail = process.env.SALES_EMAIL || 'sales.ptcgram@gmail.com'
    const fromEmail = process.env.SMTP_FROM || process.env.MAIL_FROM || process.env.SMTP_USER

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ ok: false, message: 'Mail service is not configured.' })
    }

    const submittedAt = new Date().toISOString()
    const { name, email, phone, message, pageUrl } = validated.data
    const textBody = buildMessage({ name, email, phone, message, pageUrl, submittedAt, ip })
    const htmlBody = buildLeadEmailHtml({ name, email, phone, message, pageUrl, submittedAt, ip })
    const subject = `New Website Contact Lead - ${name}`

    // Send a single transactional mail to support and cc sales to reduce spam classification
    await transporter.sendMail({
      from: fromEmail,
      to: supportEmail,
      cc: salesEmail,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    })

    return res.status(200).json({ ok: true, message: 'Enquiry sent successfully.' })
  } catch (err) {
    console.error('Contact API error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to send enquiry. Please try again.' })
  }
})

app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, message: 'API route not found.' })
})

app.listen(PORT, () => {
  console.log(`Contact API server running on http://localhost:${PORT}`)
})
