function normalizeImageList(imageValue = '') {
  if (Array.isArray(imageValue)) return imageValue.map((item) => String(item).trim()).filter(Boolean)
  if (!imageValue) return []
  return String(imageValue)
    .split(/\r?\n|\s*\|\s*|\s*;\s*|\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function cleanVariantLabel(value = '') {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\bkg\b/gi, 'KG')
    .replace(/\bkgs\b/gi, 'KG')
    .replace(/\bltrs?\b/gi, 'LTR')
    .replace(/\blit(?:re|er)s?\b/gi, 'LTR')
    .replace(/\bhdpe\b/gi, 'HDPE')
    .replace(/\s+/g, ' ')
    .trim()
}

function splitPackagingVariants(packaging = '') {
  const raw = cleanVariantLabel(packaging)
  if (!raw || /contact ptcgram|available pack sizes/i.test(raw)) return []

  return raw
    .split(/\s*\/\s*|\s*,\s*|\s*;\s*/)
    .map(cleanVariantLabel)
    .filter(Boolean)
}

function variantFromImagePath(url = '') {
  const text = decodeURIComponent(String(url).toLowerCase())
  if (!text.includes('/carboy-drum/')) return null
  const filename = text.split('/').pop() || text

  const isCarboy = /\bcarboy\b/.test(filename)
  const isDrum = /\bdrum\b/.test(filename)
  const sizeMatch = filename.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|ltr|ltrs|litre|liter)/i)
  const size = sizeMatch ? cleanVariantLabel(`${sizeMatch[1]} ${sizeMatch[2]}`) : ''
  const pack = isCarboy ? 'Carboy' : isDrum ? 'Drum' : ''

  if (size && pack) return `${size} ${pack}`
  return pack || null
}

function addDefaultPackSize(label = '') {
  const clean = cleanVariantLabel(label)
  if (/^carboy$/i.test(clean)) return '50 KG Carboy'
  if (/^drum$/i.test(clean)) return '200/250 KG Drum'
  if (/^(35|50)\s*KG$/i.test(clean)) return `${clean} Carboy`
  if (/^(200|210|215|235|250|300)\s*(KG|LTR)$/i.test(clean)) return `${clean} Drum`
  return clean
}

export function getProductVariantLabels(product = {}) {
  const labels = [
    ...splitPackagingVariants(product.attributes?.Packaging),
    ...normalizeImageList(product.image).map(variantFromImagePath).filter(Boolean),
  ].map(addDefaultPackSize)

  const seen = new Set()
  const uniqueLabels = labels.filter((label) => {
    const key = label.toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })

  return uniqueLabels.filter((label) => {
    const isGenericCarboy = /^50 KG Carboy$/i.test(label)
    const isGenericDrum = /^200\/250 KG Drum$/i.test(label)
    if (!isGenericCarboy && !isGenericDrum) return true

    const packName = isGenericCarboy ? 'Carboy' : 'Drum'
    const hasSpecificPack = uniqueLabels.some((other) => {
      if (other === label) return false
      if (!new RegExp(`\\b${packName}\\b`, 'i').test(other)) return false
      return /\b\d+(?:\.\d+)?\s*(KG|LTR)\b/i.test(other)
    })

    return !hasSpecificPack
  })
}

export function getProductVariantOptions(product = {}) {
  const imageOptions = normalizeImageList(product.image)
    .map((image, imageIndex) => {
      const label = variantFromImagePath(image)
      return label ? { label: addDefaultPackSize(label), imageIndex } : null
    })
    .filter(Boolean)

  return getProductVariantLabels(product).map((label) => {
    const exactImage = imageOptions.find((option) => option.label.toLowerCase() === label.toLowerCase())
    const packImage = exactImage || imageOptions.find((option) => {
      if (/\bcarboy\b/i.test(label)) return /\bcarboy\b/i.test(option.label)
      if (/\bdrum\b/i.test(label)) return /\bdrum\b/i.test(option.label)
      return false
    })

    return {
      label,
      imageIndex: packImage?.imageIndex ?? -1,
    }
  })
}

export function getProductVariantSummary(product = {}, maxLabels = 3) {
  const labels = getProductVariantLabels(product)
  if (labels.length <= maxLabels) return labels.join(' / ')
  return `${labels.slice(0, maxLabels).join(' / ')} +${labels.length - maxLabels} more`
}
