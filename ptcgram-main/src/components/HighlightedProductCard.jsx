import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRightLong, FaFlask } from 'react-icons/fa6'
import { getDisplayImageGroups } from '../utils/productImage'
import { toProductSlug } from '../utils/productSeo'
import { getProductOverview } from '../utils/highlightedProducts'

function sortImageCandidates(candidates) {
  return [...candidates].sort((a, b) => {
    const score = (url) => {
      const value = String(url)
      if (value.startsWith('/')) return 0
      if (value.includes('thumbnail') || value.includes('lh3.googleusercontent.com')) return 1
      return 2
    }
    return score(a) - score(b)
  })
}

export default function HighlightedProductCard({ product }) {
  const candidates = useMemo(() => (
    sortImageCandidates(getDisplayImageGroups(product.image).flat())
  ), [product.image])
  const [imageIndex, setImageIndex] = useState(0)
  const image = candidates[imageIndex] || ''
  const cas = product.attributes?.['CAS Number'] || product.attributes?.['CAS Number `']
  const purity = product.attributes?.Purity || product.attributes?.Grade || product.attributes?.Concentration

  useEffect(() => {
    setImageIndex(0)
  }, [product.id])

  return (
    <Link
      to={`/${product.categoryId}/${toProductSlug(product)}`}
      className="group flex min-h-[330px] flex-col overflow-hidden bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:-translate-y-1 hover:shadow-industry-lg transition-all duration-300"
    >
      <div className="relative h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
        <FaFlask className="text-4xl text-navy-900/25" />
        {image && (
          <img
            src={image}
            alt={`${product.name} product image`}
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            width="260"
            height="144"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageIndex((current) => current + 1)}
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1">
        <span className="w-fit text-[0.56rem] font-bold tracking-widest uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-sm">
          {product.categoryName}
        </span>
        <h3 className="font-serif text-base text-navy-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{getProductOverview(product)}</p>
        <div className="mt-auto flex flex-col gap-1.5 pt-2">
          {cas && <span className="text-[0.62rem] font-mono text-gray-500">CAS: {String(cas).replace(/\\/g, '')}</span>}
          {purity && <span className="text-[0.62rem] font-bold tracking-wide uppercase text-navy-900">{String(purity).replace(/\\/g, '')}</span>}
          <span className="text-[0.68rem] font-bold tracking-wide text-amber-500 group-hover:tracking-widest transition-all">
            View Details <FaArrowRightLong className="inline" />
          </span>
        </div>
      </div>
    </Link>
  )
}
