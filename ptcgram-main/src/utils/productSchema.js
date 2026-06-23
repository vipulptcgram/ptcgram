import { getDisplayImageUrl } from './productImage'
import { toProductSlug } from './productSeo'
import { absoluteUrl } from './seo'

export function cleanSchemaValue(value) {
  return String(value || '').replace(/\\/g, '').trim()
}

export function getProductSchemaImage(product = {}, fallbackImage = '') {
  const image = fallbackImage || getDisplayImageUrl(product.image) || '/Images/logo.png'
  return absoluteUrl(image)
}

export function getProductSchemaUrl(product = {}, categoryId = '') {
  return absoluteUrl(`/${categoryId}/${toProductSlug(product)}`)
}

export function getProductSchema({
  product,
  categoryId,
  categoryName,
  description,
  image,
  additionalProperty = [],
}) {
  const productUrl = getProductSchemaUrl(product, categoryId)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: getProductSchemaImage(product, image),
    description: cleanSchemaValue(description) || `${product.name} supplied by PTCGRAM for commercial and industrial requirements.`,
    sku: cleanSchemaValue(product.sku) || String(product.id),
    brand: {
      '@type': 'Brand',
      name: 'PTCGRAM',
    },
    category: categoryName,
    url: productUrl,
    ...(additionalProperty.length ? { additionalProperty } : {}),
    offers: {
      '@type': 'Offer',
      name: 'Request a Quote',
      url: productUrl,
      description: `Contact PTCGRAM to enquire or request a quote for ${product.name}.`,
      availability: product.in_stock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'PTCGRAM PRIVATE LIMITED',
      },
    },
  }
}
