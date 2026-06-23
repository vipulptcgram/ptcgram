import productData from '../data/productdetail.json'

export const CATEGORY_MAP = {
  solvents: 'Solvents',
  acids: 'Acids',
  industrial: 'Industrial Chemicals',
  'dietary-supplements': 'Dietary Supplements',
  household: 'Household Cleaning Concentrates',
}

export const PRIORITY_PRODUCT_IDS = [
  ['acids', 3069],
  ['industrial', 1112],
  ['solvents', 1113],
  ['solvents', 1923],
  ['industrial', 1888],
  ['industrial', 1118],
  ['industrial', 1909],
  ['acids', 1944],
  ['acids', 1940],
  ['industrial', 1873],
  ['industrial', 1889],
  ['industrial', 1114],
  ['industrial', 1115],
  ['solvents', 1920],
  ['solvents', 3068],
]

export const priorityProducts = PRIORITY_PRODUCT_IDS.map(([categoryId, productId]) => {
  const categoryName = CATEGORY_MAP[categoryId]
  const product = (productData[categoryName] || []).find((item) => Number(item.id) === Number(productId))
  return product ? { ...product, categoryId, categoryName } : null
}).filter(Boolean)

export const highlightedProducts = priorityProducts.slice(0, 5)

export function getProductOverview(product) {
  return String(product.short_description || '')
    .replace(/\r/g, '')
    .replace(/ENQUIRE NOW/gi, '')
    .replace(/&nbsp;/g, '')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 30) || `${product.name} from PTCGRAM.`
}
