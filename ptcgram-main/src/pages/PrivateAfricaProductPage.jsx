import { useLocation, useParams } from 'react-router-dom'
import ProductDetailPage from './ProductDetailPage'
import AfricaExportPage from './AfricaExportPage'
import africaExportLinks from '../data/africaExportLinks.json'

const countryLabels = Object.fromEntries(africaExportLinks.countries.map((country) => [country.slug, country.label]))
const countrySlugs = africaExportLinks.countries.map((country) => country.slug)
const privateProductMap = Object.fromEntries(africaExportLinks.products.map((product) => [product.slug, product]))

function parsePrivateSlug(slug = '') {
  for (const country of countrySlugs) {
    const suffix = `-exporter-${country}`
    if (slug.endsWith(suffix)) {
      return {
        country,
        productKey: slug.slice(0, -suffix.length),
      }
    }
  }

  return { country: '', productKey: '' }
}

export default function PrivateAfricaProductPage() {
  const { productMarketSlug } = useParams()
  const location = useLocation()
  const { country, productKey } = parsePrivateSlug(productMarketSlug)
  const product = privateProductMap[productKey]

  if (!product) return <AfricaExportPage />

  return (
    <ProductDetailPage
      categoryId={product.categoryId}
      productSlugOverride={product.productSlug}
      canonicalOverride={location.pathname}
      robots="noindex,nofollow,noarchive,nosnippet"
      exportCountryLabel={countryLabels[country]}
      disableCanonicalRedirect
    />
  )
}
