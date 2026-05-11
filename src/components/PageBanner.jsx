import { Link } from 'react-router-dom'

/**
 * PageBanner - used at top of every inner page
 * Props: breadcrumbs [{label, to}], title, description
 */
export default function PageBanner({ breadcrumbs = [], title, description }) {
  return (
    <div className="relative bg-navy-900 pt-20 pb-14 overflow-hidden">
      {/* Diagonal accent stripe */}
      <div className="absolute top-0 right-[-100px] bottom-0 w-96 bg-white/[0.02] skew-x-[-12deg]" />
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 60px)' }} />
      {/* Bottom amber line */}
      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

      <div className="relative z-10 max-w-6xl mx-auto px-8">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest text-white/40 mb-4">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>›</span>}
                {crumb.to
                  ? <Link to={crumb.to} className="hover:text-amber-400 transition-colors">{crumb.label}</Link>
                  : <span className="text-amber-400">{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">{title}</h1>
        {description && (
          <p className="text-base text-white/60 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}
