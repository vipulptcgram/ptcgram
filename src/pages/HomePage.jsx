import { Link } from 'react-router-dom'
import siteData from '../data/siteData.json'
import productData from '../data/productdetail.json'
// import "../components/LoadingScreen.css"

const CATEGORY_MAP = {
  solvents: 'Solvents',
  acids: 'Acids',
  industrial: 'Industrial Chemicals',
  household: 'Household Cleaning Concentrates',
}

// const AtomSVG = ({ className = '' }) => (
//   <svg viewBox="0 0 180 180" fill="none" className={className}>
//     <ellipse cx="90" cy="90" rx="80" ry="30" stroke="#1a3a6b" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
//     <ellipse cx="90" cy="90" rx="80" ry="30" stroke="#1a3a6b" strokeWidth="1.5" fill="none" strokeDasharray="3 3" transform="rotate(60 90 90)" />
//     <ellipse cx="90" cy="90" rx="80" ry="30" stroke="#1a3a6b" strokeWidth="1.5" fill="none" strokeDasharray="3 3" transform="rotate(120 90 90)" />
//     <path d="M90 65 C102 75 102 105 90 115 C78 105 78 75 90 65Z" fill="#c8872a" opacity=".9" />
//     <circle cx="90" cy="10" r="5" fill="#1a3a6b" />
//     <circle cx="158" cy="135" r="5" fill="#1a3a6b" />
//     <circle cx="22" cy="135" r="5" fill="#1a3a6b" />
//   </svg>
// )


const AtomSVG = "/Images/favicon.jpeg"

const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500">
    <span className="w-6 h-0.5 bg-amber-500 rounded-full" />{children}
  </div>
)
const Divider = ({ center = false }) => (
  <div className={`w-12 h-[3px] bg-amber-500 rounded-full ${center ? 'mx-auto' : ''}`} />
)

export default function HomePage() {
  const { company, stats, features } = siteData

  // Categories with live product counts from productdetail.json
  const categories = [
    { id: 'solvents', slug: '/solvents', name: 'Solvents', description: 'Industrial chemicals for dissolving, extracting and as chemical feedstocks across textiles, pharma and manufacturing.' },
    { id: 'acids', slug: '/acids', name: 'Acids', description: 'High-purity industrial acids for chemical synthesis, metal processing, food and pharmaceutical applications.' },
    { id: 'industrial', slug: '/industrial', name: 'Industrial Chemicals', description: 'Wide range of commercial chemicals for large-scale manufacturing, cleaning formulation and industrial processing.' },
    { id: 'household', slug: '/household', name: 'Household Cleaning Concentrates', description: 'Professional-grade concentrated cleaning solutions and disinfectants for home, commercial and institutional use.' },
  ]

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg,rgba(10,20,50,.95) 0%,rgba(15,37,69,.9) 40%,rgba(26,58,107,.82) 70%,rgba(10,20,50,.95) 100%), #0f2545' }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 60px)' }} />
        {/* Amber bottom strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        <div className="relative z-10 max-w-6xl mx-auto px-8 pt-18 pb-20 flex flex-col gap-10">
          {/* Text block */}
          <div className="flex flex-col gap-5 max-w-3xl animate-fade-up animation-fill-both">
            <p className="text-[0.8rem] font-bold tracking-[0.15em] uppercase text-amber-400">
              Welcome to PTCGRAM PVT LTD.
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.02]">
              "Big or Small,<br />We Trade All"
            </h1>
            <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-xl">
              Leading distributors &amp; manufacturers of specialty chemicals, solvents, acids
              and industrial solutions since 2009.
            </p>
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Link to="/solvents"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-white text-[0.78rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
                Explore Products
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white text-[0.78rem] font-bold tracking-widest uppercase rounded border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200">
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap bg-white/6 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm w-fit animate-fade-up animation-fill-both animation-delay-300">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-7 py-5 flex flex-col items-center gap-1 ${i < stats.length - 1 ? 'border-r border-white/8' : ''}`}>
                <span className="font-serif text-3xl text-amber-400 leading-none">{s.value}</span>
                <span className="text-[0.62rem] font-bold tracking-widest uppercase text-white/45">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[0.6rem] font-bold tracking-widest uppercase text-white/30 animate-fade-in animation-fill-both animation-delay-500 pointer-events-none">
          <span>Scroll to explore</span>
          <span className="text-base animate-float">↓</span>
        </div>
      </section>

      {/* ── ABOUT INTRO ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col gap-5">
            <Eyebrow>About Our Company</Eyebrow>
            <Divider />
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 leading-tight">
              Leading Traders &amp; Manufacturers<br />for Over <em className="not-italic text-amber-500">15 Years</em>
            </h2>
            <p className="text-sm text-gray-500 leading-loose">{company.about}</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 mt-1">
              {['ISO Quality Standards', 'Pan-India Distribution', 'Technical Expert Team', 'Regulatory Compliance'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <span className="text-amber-500 font-bold">✓</span>{item}
                </div>
              ))}
            </div>
            <Link to="/about" className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors w-fit">
              Learn More About Us
            </Link>
          </div>

          {/* Visual card with atom */}
          <div className="flex justify-center">
            <div className="relative bg-cream border border-gray-200 rounded-2xl p-10 w-full max-w-sm flex flex-col items-center gap-7 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-400" />
              {/* <AtomSVG className="w-44 h-44 animate-float" /> */}
              {/* <img src={AtomSVG} alt="" className='w-44 h-44 animate-float' /> */}
              <div
                className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-400/30 shadow-industry-lg"
                style={{ animation: 'spinFavicon 3s linear infinite' }}
              >
                <img
                  src="/Images/favicon.jpeg"
                  alt="PTCGRAM"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-5 w-full">
                {[['2009', 'Founded'], ['4', 'Categories'], ['Mumbai', 'HQ']].map(([num, lbl], i, arr) => (
                  <div key={lbl} className="flex items-center gap-5 flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <span className="font-serif text-xl text-navy-900 leading-none">{num}</span>
                      <span className="text-[0.6rem] font-bold tracking-widest uppercase text-gray-400 text-center mt-1">{lbl}</span>
                    </div>
                    {i < arr.length - 1 && <div className="w-px h-8 bg-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-cream border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <Eyebrow>Why Choose Us</Eyebrow>
            <Divider center />
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900">Our Core Commitments</h2>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Trusted by over 1,000 clients across India for quality, reliability and expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
            {features.map(f => (
              <div key={f.title} className="bg-white p-9 flex flex-col gap-3 group hover:bg-navy-900 transition-colors duration-300 cursor-default">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-serif text-lg text-navy-900 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-white/65 transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS OVERVIEW ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-4">
              <Eyebrow>What We Offer</Eyebrow>
              <Divider />
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900">Our Product Categories</h2>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                Reliable, up-to-the-mark solutions across four major chemical categories.
              </p>
            </div>
            <Link to="/solvents"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-navy-900 text-navy-900 text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-navy-900 hover:text-white transition-all duration-200">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => {
              const count = (productData[CATEGORY_MAP[cat.id]] || []).length
              return (
                <Link key={cat.id} to={cat.slug}
                  className="group flex flex-col gap-3 p-7 bg-white border border-gray-200 rounded-xl hover:border-navy-900 hover:-translate-y-1 hover:shadow-industry-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚗️</span>
                    <span className="text-[0.6rem] font-bold tracking-widest uppercase text-amber-500 bg-amber-50 border border-amber-200/50 px-2 py-1 rounded-sm">
                      {count} Products
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-navy-900 leading-snug">{cat.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3">{cat.description}</p>
                  <span className="text-[0.72rem] font-bold tracking-wide text-amber-500 group-hover:tracking-widest transition-all duration-200">
                    Explore Category →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative bg-navy-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg,white 0,white 1px,transparent 1px,transparent 16px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl text-white">Looking for Business?</h2>
            <p className="text-sm text-white/60 leading-loose">{company.about}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link to="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">
              Contact Our Team
            </Link>
            <Link to="/about"
              className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-white/30 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:border-white hover:bg-white/10 transition-all">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── BELIEF ── */}
      <section className="py-24 bg-cream border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-8 flex flex-col items-center text-center gap-5">
          <span className="font-serif text-7xl text-amber-400/30 leading-none">"</span>
          <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-navy-900 leading-snug italic -mt-4">
            {company.mission}
          </blockquote>
          <cite className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500 not-italic">
            — PTCGRAM Management
          </cite>
        </div>
      </section>
      <style>{`
        @keyframes spinFavicon {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
