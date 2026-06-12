export function slugifyProductName(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export function toProductSlug(product) {
  const base = slugifyProductName(product?.name || '')
  const id = String(product?.id || '').trim()
  if (!id) return base || ''
  return base ? `${base}-${id}` : id
}

export function parseProductIdFromParam(param = '') {
  const raw = String(param || '').trim()
  if (!raw) return null
  if (/^\d+$/.test(raw)) return Number(raw)
  const match = raw.match(/-(\d+)$/)
  if (!match) return null
  return Number(match[1])
}

