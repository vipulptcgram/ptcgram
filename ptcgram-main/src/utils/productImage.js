function extractGoogleDriveFileId(url = '') {
  const clean = String(url).trim()
  if (!clean) return null

  const byPath = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (byPath?.[1]) return byPath[1]

  const byQuery = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (byQuery?.[1]) return byQuery[1]

  return null
}

function extractGoogleDriveResourceKey(url = '') {
  const clean = String(url).trim()
  if (!clean) return null
  const match = clean.match(/[?&]resourcekey=([^&]+)/i)
  return match?.[1] || null
}

function toDisplayableGoogleDriveUrls(url = '') {
  if (!url || !url.includes('drive.google.com')) return url
  const fileId = extractGoogleDriveFileId(url)
  if (!fileId) return url
  const resourceKey = extractGoogleDriveResourceKey(url)
  const rk = resourceKey ? `&resourcekey=${resourceKey}` : ''
  const rkUser = resourceKey ? `&resourcekey=${encodeURIComponent(resourceKey)}` : ''

  return [
    `https://drive.usercontent.google.com/download?id=${fileId}&export=view&authuser=0${rkUser}`,
    `https://docs.google.com/uc?export=view&id=${fileId}${rk}`,
    `https://docs.google.com/uc?id=${fileId}${rk}`,
    `https://lh3.googleusercontent.com/d/${fileId}=w1600`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600${rk}`,
    `https://drive.google.com/uc?export=view&id=${fileId}${rk}`,
  ]
}

function normalizeImageInput(imageValue = '') {
  if (Array.isArray(imageValue)) {
    return imageValue
      .map(item => String(item).trim().replace(/^hhttps:/i, 'https:'))
      .filter(Boolean)
  }

  const raw = String(imageValue || '').trim()
  if (!raw) return []

  if (raw.startsWith('[') && raw.endsWith(']')) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
          .map(item => String(item).trim().replace(/^hhttps:/i, 'https:'))
          .filter(Boolean)
      }
    } catch {
      // Fall back below.
    }
  }

  return raw
    .split(/\r?\n|\s*\|\s*|\s*;\s*|\s*,\s*/)
    .map(item => item.trim().replace(/^hhttps:/i, 'https:'))
    .filter(Boolean)
}

function isUsableImageLink(link = '') {
  const normalized = String(link).trim()
  if (!normalized) return false

  return ![
    'PRODUCT_IMAGE_URL',
    'IMAGE_URL',
    'PLACEHOLDER',
    'N/A',
    'NA',
  ].includes(normalized.toUpperCase())
}

export function getDisplayImageUrls(imageValue = '') {
  const links = normalizeImageInput(imageValue).filter(isUsableImageLink)
  const expanded = []

  for (const link of links) {
    const converted = toDisplayableGoogleDriveUrls(link)
    if (Array.isArray(converted)) expanded.push(...converted)
    else if (converted) expanded.push(converted)
  }

  return [...new Set(expanded)]
}

export function getDisplayImageGroups(imageValue = '') {
  const links = normalizeImageInput(imageValue).filter(isUsableImageLink)
  return links
    .map((link) => {
      const converted = toDisplayableGoogleDriveUrls(link)
      const candidates = Array.isArray(converted) ? converted : [converted]
      return [...new Set(candidates.filter(Boolean))]
    })
    .filter((group) => group.length > 0)
}

export function getDisplayImageUrl(imageValue = '') {
  return getDisplayImageUrls(imageValue)[0] || ''
}

export function hasUsableProductImage(imageValue = '') {
  return getDisplayImageUrls(imageValue).length > 0
}
