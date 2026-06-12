import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaXmark, FaPhone, FaEnvelope, FaLocationDot, FaGlobe, FaChevronDown, FaMagnifyingGlass } from 'react-icons/fa6'
import { useCategories } from '../hooks/useCategories'
import { toProductSlug } from '../utils/productSeo'

export default function Navbar() {
  const categories = useCategories()
  const productLinks = categories.map((category) => ({ label: category.name, path: category.slug || `/${category.id}` }))
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchableProducts, setSearchableProducts] = useState([])
  const [searchLoaded, setSearchLoaded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  async function loadSearchProducts() {
    if (searchLoaded) return
    setSearchLoaded(true)
    const { default: productData } = await import('../data/productdetail.json')
    const categoryIds = {
      Solvents: 'solvents',
      Acids: 'acids',
      'Industrial Chemicals': 'industrial',
      'Household Cleaning Concentrates': 'household',
    }
    setSearchableProducts(Object.entries(productData).flatMap(([categoryName, products]) =>
      products.map((product) => ({
        ...product,
        categoryId: categoryIds[categoryName],
        categoryName,
      }))
    ))
  }

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (query.length < 2) return []
    return searchableProducts
      .filter((product) => product.name.toLowerCase().includes(query))
      .slice(0, 7)
  }, [searchQuery, searchableProducts])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [location])

  function submitSearch(event) {
    event.preventDefault()
    if (searchResults[0]) {
      navigate(`/${searchResults[0].categoryId}/${toProductSlug(searchResults[0])}`)
    }
  }

  const SearchBox = ({ mobile = false }) => (
    <div className={`relative ${mobile ? 'w-full' : ''}`}>
      <form onSubmit={submitSearch} className="relative">
        <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onFocus={() => {
            setSearchOpen(true)
            loadSearchProducts()
          }}
          onChange={(event) => {
            setSearchQuery(event.target.value)
            setSearchOpen(true)
          }}
          placeholder="Search chemicals..."
          aria-label="Search products"
          className={`${mobile ? 'w-full' : 'w-44 2xl:w-56'} rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-xs text-navy-900 outline-none transition-all duration-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10`}
        />
      </form>
      {searchOpen && searchQuery.trim().length >= 2 && (
        <div className={`absolute z-[70] mt-2 bg-white border border-gray-200 rounded-xl shadow-industry-xl overflow-hidden ${mobile ? 'left-0 right-0' : 'right-0 w-80'}`}>
          {searchResults.length > 0 ? searchResults.map((product) => (
            <Link
              key={`${product.categoryId}-${product.id}`}
              to={`/${product.categoryId}/${toProductSlug(product)}`}
              className="block px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-amber-50 transition-colors"
            >
              <span className="block text-sm font-semibold text-navy-900 truncate">{product.name}</span>
              <span className="block text-[0.62rem] text-gray-400 mt-0.5">{product.categoryName}</span>
            </Link>
          )) : (
            <p className="px-4 py-4 text-xs text-gray-400">No matching chemicals found.</p>
          )}
        </div>
      )}
    </div>
  )

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  const isProductActive = productLinks.some(p => location.pathname.startsWith(p.path))

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Top info bar ── */}
      <div className={`bg-navy-900 border-b border-white/5 transition-all duration-300 ${scrolled ? 'hidden' : 'hidden sm:block'}`}>
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center gap-6 flex-wrap">
          <span className="text-xs text-white/60 tracking-wide flex items-center gap-1.5">
            <FaPhone className="text-[0.7rem]" />+91 97-10-879-879
          </span>
          <span className="text-xs text-white/60 tracking-wide flex items-center gap-1.5 hidden sm:flex">
            <FaEnvelope className="text-[0.7rem]" />support.ptcgram@gmail.com
          </span>
          <span className="text-xs text-white/60 tracking-wide flex items-center gap-1.5 hidden md:flex">
            <FaLocationDot className="text-[0.7rem]" />Virar(E), Palghar, Mumbai
          </span>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div className={`bg-white transition-shadow duration-300 ${scrolled ? 'shadow-industry' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4" style={{ height: 68 }}>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src="/Images/logo.png"
              alt="PTCGRAM PVT LTD"
              width="180"
              height="48"
              loading="eager"
              decoding="async"
              fetchpriority="high"
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
                <FaChevronDown className={`text-[0.5rem] transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
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
            <div className="hidden xl:block"><SearchBox /></div>
            <Link to="/contact"
              className="hidden xl:inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors shadow-sm whitespace-nowrap">
              GET A QUOTE
            </Link>
            {/* Hamburger — show on < xl */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-navy-900 hover:bg-gray-50 transition-colors">
              {mobileOpen ? <FaXmark className="text-xl leading-none" /> : <FaBars className="text-xl leading-none" />}
            </button>
          </div>
        </div>

        {/* ── Mobile / Tablet menu ── */}
        {mobileOpen && (
          <div className="xl:hidden border-t-[3px] border-amber-500 bg-white shadow-industry-lg">
            <div className="flex flex-col px-6 py-4 gap-0.5 max-h-[80vh] overflow-y-auto">
              <div className="pb-3 mb-1 border-b border-gray-100"><SearchBox mobile /></div>

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
                <FaGlobe className="text-base" />
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
