import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import productData from '../data/productdetail.json'
import siteData from '../data/siteData.json'

const CATEGORY_MAP = {
  solvents:   'Solvents',
  acids:      'Acids',
  industrial: 'Industrial Chemicals',
  household:  'Household Cleaning Concentrates',
}

const CAT_META = Object.fromEntries(
  siteData.categories.map(c => [c.id, { headline: c.headline, description: c.description, slug: c.slug }])
)

function getCAS(attrs = {}) {
  return attrs['CAS Number'] || attrs['CAS Number `'] || null
}

export default function ProductCategoryPage({ categoryId }) {
  const jsonKey  = CATEGORY_MAP[categoryId]
  const products = productData[jsonKey] || []
  const meta     = CAT_META[categoryId] || {}
  const catName  = jsonKey || categoryId
  const otherCats = siteData.categories.filter(c => c.id !== categoryId)

  return (
    <div>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }, { label: catName }]}
        title={meta.headline || catName}
        description={meta.description || ''}
      />

      {/* Products grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
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

          {/* ✅ Product cards with full-height images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const cas = getCAS(product.attributes)
              const firstLine = product.short_description
                ?.replace(/\r\n/g, '\n')
                .split('\n')
                .map(l => l.trim())
                .find(l => l.length > 20 && !l.includes('ENQUIRE'))
              return (
                <Link
                  key={product.id}
                  to={`/${categoryId}/${product.id}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 hover:border-amber-400 hover:shadow-industry-xl transition-all duration-300"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* ✅ Full product image — tall, object-cover for proper fill */}
                  <div className="relative overflow-hidden bg-white" style={{ height: 250 }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    {/* Fallback shown when no image or image fails */}
                    <div
                      className="absolute inset-0 bg-navy-900/5 items-center justify-center text-6xl"
                      style={{ display: product.image ? 'none' : 'flex' }}
                    >
                      ⚗️
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
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1">
                      {firstLine || ''}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-4 pt-2">
                    <div className="flex items-center justify-between w-full px-4 py-2.5 bg-navy-900 text-white text-[0.68rem] font-bold tracking-widest uppercase rounded group-hover:bg-amber-500 transition-colors duration-200">
                      <span>VIEW DETAILS</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
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
        <div className="relative z-10 max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-3xl text-white mb-2">Need a Custom Requirement?</h3>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Can't find exactly what you're looking for? Our technical team can help source speciality grades, custom quantities and bulk pricing.
            </p>
          </div>
          <Link to="/contact" className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors whitespace-nowrap">
            Talk to Our Team →
          </Link>
        </div>
      </section>

      {/* Other categories */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">
            <span className="w-6 h-0.5 bg-amber-500 rounded-full" />Also Available
          </div>
          <div className="w-12 h-[3px] bg-amber-500 rounded-full mb-5" />
          <h2 className="font-serif text-3xl text-navy-900 mb-8">Other Product Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCats.map(oc => (
              <Link key={oc.id} to={oc.slug}
                className="flex items-center gap-4 px-5 py-5 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:translate-x-1 hover:shadow-industry transition-all duration-200">
                <span className="text-2xl flex-shrink-0">⚗️</span>
                <div className="flex-1">
                  <div className="font-serif text-base text-navy-900">{oc.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{(productData[CATEGORY_MAP[oc.id]] || []).length} Products</div>
                </div>
                <span className="text-amber-500 flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}