function extractGoogleDriveFileId(url = '') {
  const clean = String(url).trim()
  if (!clean) return null

  const byPath = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (byPath?.[1]) return byPath[1]

  const byQuery = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (byQuery?.[1]) return byQuery[1]

  return null
}

function toDisplayableGoogleDriveUrl(url = '') {
  if (!url.includes('drive.google.com')) return url
  const fileId = extractGoogleDriveFileId(url)
  if (!fileId) return url
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export function getDisplayImageUrl(imageValue = '') {
  const firstImage = String(imageValue)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)[0]

  if (!firstImage) return ''
  return toDisplayableGoogleDriveUrl(firstImage)
}

