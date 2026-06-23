import { Link } from 'react-router-dom'
import { FaArrowLeft, FaArrowRightLong } from 'react-icons/fa6'
import SeoMeta from '../components/SeoMeta'
import StructuredData from '../components/StructuredData'
import HighlightedProductCard from '../components/HighlightedProductCard'
import { getProductOverview, priorityProducts } from '../utils/highlightedProducts'
import { absoluteUrl } from '../utils/seo'
import { toProductSlug } from '../utils/productSeo'
import { getProductSchema } from '../utils/productSchema'

const highlightedProductsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Highlighted Industrial Chemical Products',
  itemListElement: priorityProducts.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: product.name,
    url: absoluteUrl(`/${product.categoryId}/${toProductSlug(product)}`),
  })),
}

const highlightedProductGraphSchema = {
  '@context': 'https://schema.org',
  '@graph': priorityProducts.map((product) => getProductSchema({
    product,
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    description: getProductOverview(product),
  })),
}

export default function HighlightedProductsPage() {
  return (
    <div>
      <SeoMeta
        title="Highlighted Industrial Chemical Products | PTCGRAM"
        description="Browse PTCGRAM highlighted industrial chemicals, acids, solvents, gums, waxes, paraffin products, ethanol and high-demand chemical raw materials."
        canonical="/highlighted-products"
        keywords="highlighted industrial chemicals, chemical products India, acids, solvents, caustic soda flakes, acid slurry, PTCGRAM"
      />
      <StructuredData data={[highlightedProductsSchema, highlightedProductGraphSchema]} />

      <section className="relative bg-navy-900 pt-16 sm:pt-20 pb-10 sm:pb-14 overflow-hidden">
        <div className="absolute top-0 right-[-100px] bottom-0 w-96 bg-white/[0.02] skew-x-[-12deg]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 60px)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[0.58rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.12em] sm:tracking-widest text-white/35 mb-4 sm:mb-5">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-400">Highlighted Products</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex text-[0.62rem] font-bold tracking-[0.15em] uppercase text-amber-400 bg-amber-500/15 border border-amber-400/25 px-3 py-1 rounded-sm mb-3">
                Priority Product List
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight">Highlighted Products</h1>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl mt-4">
                High-demand industrial chemicals, acids, solvents, gums, paraffin products and ethanol selected for quick enquiry.
              </p>
            </div>
            <Link to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:border-white hover:bg-white/10 transition-all w-full sm:w-auto">
              <FaArrowLeft /> Back Home
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-18 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">
                <span className="w-6 h-0.5 bg-amber-500 rounded-full" />Complete Priority Range
              </div>
              <div className="w-12 h-[3px] bg-amber-500 rounded-full mb-4" />
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-900">All Highlighted Products</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
                {priorityProducts.length} products available. Open any product for full specifications, packaging and applications.
              </p>
            </div>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">
              Request Pricing <FaArrowRightLong />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {priorityProducts.map((product) => (
              <HighlightedProductCard key={`${product.categoryId}-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
