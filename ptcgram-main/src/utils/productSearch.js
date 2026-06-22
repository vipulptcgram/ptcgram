const SEARCH_REPLACEMENTS = [
  [/sulph/g, 'sulf'],
  [/xanthum/g, 'xanthan'],
  [/hypochloride/g, 'hypochlorite'],
  [/thickner/g, 'thickener'],
  [/alchohol/g, 'alcohol'],
  [/alcohal/g, 'alcohol'],
  [/etnalo/g, 'ethanol'],
  [/ethonal/g, 'ethanol'],
]

const SEARCH_ALIAS_RULES = [
  [/\b(i\s*p\s*a|ipa|iso\s*propyl|isopropyl)\b/, 'ipa i p a iso propyl isopropyl isopropanol propan 2 ol alcohol'],
  [/\b(h\s*c\s*l|hcl|hydrochloric)\b/, 'hcl h c l hydrochloric acid'],
  [/\b(d\s*e\s*p|dep|diethyl\s*phthalate)\b/, 'dep d e p diethyl phthalate'],
  [/\b(s\s*l\s*e\s*s|sles)\b/, 'sles sodium lauryl ether sulphate sulfate surfactant'],
  [/\b(s\s*t\s*p\s*p|stpp)\b/, 'stpp sodium tripolyphosphate'],
  [/\b(e\s*d\s*t\s*a|edta)\b/, 'edta ethylenediaminetetraacetic'],
  [/\b(p\s*e\s*g|peg)\b/, 'peg p e g polyethylene glycol'],
  [/\b(p\s*g|pg|propylene\s*glycol)\b/, 'pg p g propylene glycol'],
  [/\b(d\s*p\s*g|dpg|dipropylene\s*glycol)\b/, 'dpg d p g dipropylene glycol'],
  [/\b(p\s*v\s*a|pva)\b/, 'pva p v a polyvinyl alcohol'],
  [/\b(e\s*n\s*a|ena|extra\s*neutral|neutral\s*alcohol|ethanol|ethyl\s*alcohol|white\s*spirit)\b/, 'ena e n a extra neutral alcohol ethanol ethyl alcohol neutral alcohol white spirit solvent'],
  [/\b(vitamin|riboflavin|thiamine|pyridoxine|folic|biotin|niacin|pantothenic|menadione)\b/, 'vitamin vitamins dietary supplement pharma feed nutrition'],
]

export function normalizeSearchText(value = '') {
  let normalized = String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')

  for (const [pattern, replacement] of SEARCH_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement)
  }

  normalized = normalized
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')

  const aliases = []
  for (const [pattern, aliasText] of SEARCH_ALIAS_RULES) {
    if (pattern.test(normalized)) aliases.push(aliasText)
  }

  return [normalized, ...aliases].filter(Boolean).join(' ')
}

export function productSearchText(product = {}, categoryName = '', categoryId = '') {
  const attributes = product.attributes && typeof product.attributes === 'object'
    ? Object.entries(product.attributes).flatMap(([key, value]) => [key, value])
    : []

  return normalizeSearchText([
    product.name,
    product.id,
    product.short_description,
    categoryName,
    categoryId,
    ...attributes,
  ].filter(Boolean).join(' '))
}

export function searchMatches(searchText = '', query = '') {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true

  const haystack = normalizeSearchText(searchText)
  if (haystack.includes(normalizedQuery)) return true

  return normalizedQuery
    .split(' ')
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}
