import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import StructuredData from '../components/StructuredData'
import { getDisplayImageGroups, getDisplayImageUrl, hasUsableProductImage } from '../utils/productImage'
import { FaArrowRight, FaFlask } from 'react-icons/fa'
import SeoMeta from '../components/SeoMeta'
import { toProductSlug } from '../utils/productSeo'
import { getProductVariantSummary } from '../utils/productVariants'
import { useCatalogProducts } from '../hooks/useCatalogProducts'
import { useCategories } from '../hooks/useCategories'

function getCAS(attrs = {}) {
  return attrs['CAS Number'] || attrs['CAS Number `'] || null
}

const productCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://ptcgram.com/product/#collection',
  name: 'PTCGRAM Chemical Products',
  url: 'https://ptcgram.com/product',
  description:
    "Explore PTCGRAM's range of specialty chemicals, solvents, acids, industrial chemicals and cleaning concentrates.",
  isPartOf: {
    '@id': 'https://ptcgram.com/#website',
  },
  about: {
    '@id': 'https://ptcgram.com/#organization',
  },
  mainEntity: {
    '@type': 'ItemList',
    name: 'Chemical Product Range',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Acid Slurry 90% LABSA',
        url: 'https://ptcgram.com/acids/acid-slurry-90-grade-a-3069',
      },
      { '@type': 'ListItem', position: 2, name: 'Caustic Soda Flakes' },
      { '@type': 'ListItem', position: 3, name: 'Isopropyl Alcohol IPA' },
      { '@type': 'ListItem', position: 4, name: 'Ethanol 99%' },
      { '@type': 'ListItem', position: 5, name: 'Propylene Glycol' },
      { '@type': 'ListItem', position: 6, name: 'Diethyl Phthalate DEP' },
      { '@type': 'ListItem', position: 7, name: 'Guar Gum Powder' },
      { '@type': 'ListItem', position: 8, name: 'Xanthan Gum' },
      { '@type': 'ListItem', position: 9, name: 'Hydrochloric Acid HCl' },
      { '@type': 'ListItem', position: 10, name: 'Phosphoric Acid' },
      { '@type': 'ListItem', position: 11, name: 'Bleaching Powder' },
      { '@type': 'ListItem', position: 12, name: 'Light Liquid Paraffin' },
      { '@type': 'ListItem', position: 13, name: 'Heavy Liquid Paraffin' },
      { '@type': 'ListItem', position: 14, name: 'Fully Refined Paraffin Wax' },
    ],
  },
}

export default function ProductCategoryPage({ categoryId }) {
  const params = useParams()
  const activeCategoryId = categoryId || params.categoryId
  const categories = useCategories()
  const meta = categories.find((category) => category.id === activeCategoryId) || {}
  const products = useCatalogProducts(activeCategoryId)
  const displayedProducts = (activeCategoryId === 'acids' || activeCategoryId === 'solvents')
    ? [...products].sort((a, b) => Number(hasUsableProductImage(b.image)) - Number(hasUsableProductImage(a.image)))
    : products
  const catName = meta.name || activeCategoryId
  const otherCats = categories.filter(c => c.id !== activeCategoryId)
  const pageTitle = `${catName} | PTCGRAM Chemical Products`
  const pageDescription = meta.description || `Explore ${catName} from PTCGRAM with technical specifications, applications, and bulk supply support across India.`
  const categoryImage = getDisplayImageUrl(displayedProducts[0]?.image) || '/Images/logo.png'

  return (
    <div>
      <SeoMeta
        title={pageTitle}
        description={pageDescription}
        canonical={`/${activeCategoryId}`}
        keywords={`${catName}, ${catName} supplier India, industrial chemicals, bulk chemicals, PTCGRAM`}
        image={categoryImage}
      />
      <StructuredData data={productCollectionSchema} />
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }, { label: catName }]}
        title={meta.headline || catName}
        description={meta.description || ''}
      />

      {/* Products grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">
                <span className="w-6 h-0.5 bg-amber-500 rounded-full" />{catName}
              </div>
              <div className="w-12 h-[3px] bg-amber-500 rounded-full mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900">Our {catName} Range</h2>
              <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
                {products.length} products available. Click any product card to view full specifications and details.
              </p>
            </div>
            <Link to="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">
              Request Pricing
            </Link>
          </div>

          {/* Product cards with full-height images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product, i) => {
              const cas = getCAS(product.attributes)
              const imageCandidates = getDisplayImageGroups(product.image)[0] || []
              const productImage = imageCandidates[0] || getDisplayImageUrl(product.image)
              const firstLine = product.short_description
                ?.replace(/\r\n/g, '\n')
                .split('\n')
                .map(l => l.trim())
                .find(l => l.length > 20 && !l.includes('ENQUIRE'))
              const variantSummary = getProductVariantSummary(product)
              return (
                <Link
                  key={product.id}
                  to={`/${activeCategoryId}/${toProductSlug(product)}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 hover:border-amber-400 hover:shadow-industry-xl transition-all duration-300"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Product image */}
                  <div className="relative overflow-hidden bg-white border-b border-gray-100" style={{ height: 250 }}>
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={`${product.name} product photo`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="250"
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          const current = e.currentTarget.getAttribute('src') || ''
                          const currentIndex = imageCandidates.indexOf(current)
                          const next = imageCandidates[currentIndex + 1]
                          if (next) {
                            e.currentTarget.src = next
                            return
                          }
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    {/* Fallback shown when no image or image fails */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/70 items-center justify-center text-6xl"
                      style={{ display: productImage ? 'none' : 'flex' }}
                    >
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-navy-900/10 bg-white shadow-sm">
                        <FaFlask className="text-navy-900/25" />
                      </div>
                    </div>

                    {/* Stock badge top-right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`text-[0.58rem] font-bold tracking-widest uppercase px-2 py-1 rounded border backdrop-blur-sm
                        ${product.in_stock
                          ? 'text-green-700 bg-green-50/90 border-green-200'
                          : 'text-red-600 bg-red-50/90 border-red-200'}`}>
                        {product.in_stock ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </div>

                    {/* Bottom navy gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/20 to-transparent" />
                  </div>

                  {/* Card content */}
                  <div className="px-5 pt-4 pb-2 flex-1 flex flex-col gap-1.5">
                    <h3 className="font-serif text-[1rem] text-navy-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2 font-semibold">
                      {product.name}
                    </h3>
                    {cas && (
                      <p className="text-[0.65rem] font-mono text-gray-400 tracking-wide">CAS: {cas}</p>
                    )}
                    {variantSummary && (
                      <p className="text-[0.62rem] font-bold tracking-wide uppercase text-amber-600 line-clamp-1">
                        {variantSummary}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1">
                      {firstLine || ''}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-4 pt-2">
                    <div className="flex items-center justify-between w-full px-4 py-2.5 bg-navy-900 text-white text-[0.68rem] font-bold tracking-widest uppercase rounded group-hover:bg-amber-500 transition-colors duration-200">
                      <span>VIEW DETAILS</span>
                      <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative bg-navy-900 py-16 overflow-hidden">
        <div className="absolute top-0 bottom-0 right-0 w-72 bg-amber-500/5"
          style={{ clipPath: 'polygon(20% 0,100% 0,100% 100%,0% 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-3xl text-white mb-2">Need a Custom Requirement?</h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Can't find exactly what you're looking for? Our technical team can help source speciality grades, custom quantities and bulk pricing.
            </p>
          </div>
          <Link to="/contact" className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors whitespace-nowrap">
            <span>Talk to Our Team</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Other categories */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">
            <span className="w-6 h-0.5 bg-amber-500 rounded-full" />Also Available
          </div>
          <div className="w-12 h-[3px] bg-amber-500 rounded-full mb-5" />
          <h2 className="font-serif text-3xl text-navy-900 mb-8">Other Product Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCats.map(oc => (
              <Link key={oc.id} to={oc.slug}
                className="flex items-center gap-4 px-5 py-5 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:translate-x-1 hover:shadow-industry transition-all duration-200">
                <FaFlask className="text-2xl text-navy-900/70 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-serif text-base text-navy-900">{oc.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">View Products</div>
                </div>
                <FaArrowRight className="text-amber-500 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
