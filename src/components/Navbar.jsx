import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const productLinks = [
  { label: 'Solvents', path: '/solvents' },
  { label: 'Acids', path: '/acids' },
  { label: 'Industrial Chemicals', path: '/industrial' },
  { label: 'Household Cleaning', path: '/household' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropOpen(false) }, [location])

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  const isProductActive = productLinks.some(p => location.pathname.startsWith(p.path))

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Topbar */}
      <div className={`bg-navy-900 border-b border-white/5 transition-all duration-300 ${scrolled ? 'hidden' : 'block'}`}>
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center gap-8 flex-wrap">
          {[
            ['📞', '+91 97-10-879-879'],
            ['✉️', 'sales.ptcgram@gmail.com'],
            ['📍', 'Virar(E), Palghar, Mumbai'],
          ].map(([icon, text]) => (
            <span key={text} className="text-xs text-white/60 tracking-wide flex items-center gap-1.5">
              <span>{icon}</span>{text}
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div className={`bg-white border-b border-gray-200 transition-shadow duration-300 ${scrolled ? 'shadow-industry' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 gap-6">

          {/* Logo — real image from public/Images/logo.png */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/Images/logo.png"
              alt="PTCGRAM PVT LTD"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <Link to="/"
              className={`px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors relative group
                ${isActive('/') ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
              Home
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded transition-all duration-300
                ${isActive('/') ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
            </Link>

            <Link to="/about"
              className={`px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors relative group
                ${isActive('/about') ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
              About
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded transition-all duration-300
                ${isActive('/about') ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
            </Link>

            {/* Products Dropdown */}
            <div className="relative" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
              <button className={`px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors flex items-center gap-1
                ${isProductActive ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
                Products
                <span className={`text-[0.5rem] transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              <div className={`absolute top-full left-0 mt-1.5 w-56 bg-white border border-gray-200 border-t-2 border-t-amber-500
                rounded-b-lg shadow-industry-lg transition-all duration-200 overflow-hidden
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

            <Link to="/contact"
              className={`px-3 py-2 text-sm font-semibold rounded tracking-wide transition-colors relative group
                ${isActive('/contact') ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'}`}>
              Contact
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded transition-all duration-300
                ${isActive('/contact') ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/contact"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors shadow-sm">
              Get a Quote
            </Link>
            <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden p-2 text-navy-900 text-xl">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t-2 border-amber-500 bg-white shadow-industry-lg">
            <div className="flex flex-col px-6 py-4 gap-1">
              {[{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }].map(item => (
                <Link key={item.path} to={item.path}
                  className="py-3 text-sm font-semibold text-gray-600 border-b border-gray-100 hover:text-navy-900 hover:pl-2 transition-all">
                  {item.label}
                </Link>
              ))}
              <div className="pt-1 pb-0.5">
                <p className="text-[0.62rem] font-bold tracking-widest uppercase text-amber-500 py-2">Products</p>
                {productLinks.map(link => (
                  <Link key={link.path} to={link.path}
                    className="block py-2.5 pl-3 text-sm font-medium text-gray-500 border-b border-gray-100 hover:text-navy-900 hover:pl-5 transition-all">
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link to="/contact" className="py-3 text-sm font-semibold text-gray-600 border-b border-gray-100 hover:text-navy-900">
                Contact
              </Link>
              <Link to="/contact"
                className="mt-3 flex items-center justify-center py-3 bg-navy-900 text-white text-xs font-bold tracking-widest uppercase rounded">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
