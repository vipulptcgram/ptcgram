import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const productLinks = [
  { label: 'Solvents', path: '/solvents' },
  { label: 'Acids', path: '/acids' },
  { label: 'Industrial Chemicals', path: '/industrial' },
  { label: 'Household Cleaning', path: '/household' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropOpen(false)
  }, [location])

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  const isProductActive = productLinks.some(p => location.pathname.startsWith(p.path))

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Top info bar ── */}
      <div className={`bg-navy-900 border-b border-white/5 transition-all duration-300 ${scrolled ? 'hidden' : 'block'}`}>
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center gap-6 flex-wrap">
          <span className="text-xs text-white/60 tracking-wide flex items-center gap-1.5">
            <span>📞</span>+91 97-10-879-879
          </span>
          <span className="text-xs text-white/60 tracking-wide flex items-center gap-1.5 hidden sm:flex">
            <span>✉️</span>sales.ptcgram@gmail.com
          </span>
          <span className="text-xs text-white/60 tracking-wide flex items-center gap-1.5 hidden md:flex">
            <span>📍</span>Virar(E), Palghar, Mumbai
          </span>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div className={`bg-white border-b border-gray-200 transition-shadow duration-300 ${scrolled ? 'shadow-industry' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4" style={{ height: 68 }}>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src="/Images/logo.png"
              alt="PTCGRAM PVT LTD"
              style={{ height: 48, width: 'auto', maxWidth: 180 }}
              className="object-contain block"
            />
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">

            {/* Home */}
            <Link to="/"
              className={`relative group px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors whitespace-nowrap
                ${isActive('/') ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
              Home
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded transition-all duration-300
                ${isActive('/') ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
            </Link>

            {/* About */}
            <Link to="/about"
              className={`relative group px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors whitespace-nowrap
                ${isActive('/about') ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
              About
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded transition-all duration-300
                ${isActive('/about') ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
            </Link>

            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropOpen(true)}
              onMouseLeave={() => setDropOpen(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors flex items-center gap-1 whitespace-nowrap
                  ${isProductActive ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
                Products
                <span className={`text-[0.5rem] transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              <div className={`absolute top-full left-0 mt-1.5 w-56 bg-white border border-gray-200 border-t-[3px] border-t-amber-500 rounded-b-lg shadow-industry-lg overflow-hidden transition-all duration-200
                ${dropOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                {productLinks.map(link => (
                  <Link key={link.path} to={link.path}
                    className={`block px-5 py-3 text-sm font-medium border-b border-gray-100 last:border-0 transition-all duration-150
                      ${isActive(link.path) ? 'bg-amber-50 text-amber-600' : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900 hover:pl-6'}`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Import & Export — highlighted tab */}
            <Link to="/import-export"
              className={`relative group px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors whitespace-nowrap
                ${isActive('/import-export') ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
              Import &amp; Export
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded transition-all duration-300
                ${isActive('/import-export') ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
            </Link>

            {/* Contact */}
            <Link to="/contact"
              className={`relative group px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors whitespace-nowrap
                ${isActive('/contact') ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
              Contact
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded transition-all duration-300
                ${isActive('/contact') ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
            </Link>
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/contact"
              className="hidden xl:inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors shadow-sm whitespace-nowrap">
              GET A QUOTE
            </Link>
            {/* Hamburger — show on < xl */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-navy-900 hover:bg-gray-50 transition-colors">
              <span className="text-xl leading-none">{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* ── Mobile / Tablet menu ── */}
        {mobileOpen && (
          <div className="xl:hidden border-t-[3px] border-amber-500 bg-white shadow-industry-lg">
            <div className="flex flex-col px-6 py-4 gap-0.5 max-h-[80vh] overflow-y-auto">

              <Link to="/"
                className={`py-3 px-2 text-sm font-semibold border-b border-gray-100 transition-all
                  ${isActive('/') ? 'text-navy-900 pl-4' : 'text-gray-600 hover:text-navy-900 hover:pl-4'}`}>
                Home
              </Link>

              <Link to="/about"
                className={`py-3 px-2 text-sm font-semibold border-b border-gray-100 transition-all
                  ${isActive('/about') ? 'text-navy-900 pl-4' : 'text-gray-600 hover:text-navy-900 hover:pl-4'}`}>
                About
              </Link>

              {/* Products sub-group */}
              <div className="border-b border-gray-100">
                <p className="text-[0.62rem] font-bold tracking-widest uppercase text-amber-500 pt-3 pb-2 px-2">Products</p>
                {productLinks.map(link => (
                  <Link key={link.path} to={link.path}
                    className={`block py-2.5 text-sm font-medium border-b border-gray-50 last:border-0 transition-all px-4
                      ${isActive(link.path) ? 'text-amber-600 bg-amber-50' : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50'}`}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Import & Export — highlighted in mobile too */}
              <Link to="/import-export"
                className={`py-3 px-2 text-sm font-semibold border-b border-gray-100 transition-all flex items-center gap-2
                  ${isActive('/import-export') ? 'text-amber-600 bg-amber-50 pl-4' : 'text-gray-600 hover:text-navy-900 hover:pl-4'}`}>
                <span className="text-base">🌍</span>
                Import &amp; Export
              </Link>

              <Link to="/contact"
                className={`py-3 px-2 text-sm font-semibold border-b border-gray-100 transition-all
                  ${isActive('/contact') ? 'text-navy-900 pl-4' : 'text-gray-600 hover:text-navy-900 hover:pl-4'}`}>
                Contact
              </Link>

              <Link to="/contact"
                className="mt-3 flex items-center justify-center py-3.5 bg-navy-900 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors">
                GET A QUOTE
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
