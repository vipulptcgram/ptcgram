import { Link } from 'react-router-dom'

/**
 * Reusable ProductCard
 * Props: product, categoryId
 */
export default function ProductCard({ product, categoryId }) {
  const { name, cas, purity, description, applications } = product
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-industry-xl transition-all duration-300">
      {/* Card header */}
      <div className="bg-navy-900 px-6 pt-7 pb-5 relative overflow-hidden">
        {/* Amber bottom strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 to-amber-400" />
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 60px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 60px)' }} />
        <span className="text-3xl block mb-2 relative">⚗️</span>
        <h3 className="font-serif text-lg text-white leading-snug relative">{name}</h3>
        <p className="text-[0.65rem] font-bold tracking-widest uppercase text-amber-400 mt-1 relative">{purity}</p>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex-1 flex flex-col gap-3">
        {cas !== 'N/A' && (
          <p className="text-[0.68rem] font-mono tracking-wide text-gray-400">CAS: {cas}</p>
        )}
        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {applications.map(a => (
            <span key={a} className="text-[0.62rem] font-bold tracking-widest uppercase text-steel bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-sm">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-5">
        <Link
          to={`/${categoryId}/${product.id}`}
          className="flex items-center justify-between w-full px-4 py-3 bg-navy-900 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-500 transition-colors duration-200 group-hover:bg-amber-500"
        >
          <span>View Details</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  )
}
