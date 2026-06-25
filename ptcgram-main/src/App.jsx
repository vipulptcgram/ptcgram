import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StructuredData from './components/StructuredData'
import siteData from './data/siteData.json'
import { SITE_URL } from './utils/seo'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ProductCategoryPage = lazy(() => import('./pages/ProductCategoryPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const ImportExportPage = lazy(() => import('./pages/ImportExportPage'))
const HighlightedProductsPage = lazy(() => import('./pages/HighlightedProductsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AfricaExportPage = lazy(() => import('./pages/AfricaExportPage'))
const PrivateAfricaProductPage = lazy(() => import('./pages/PrivateAfricaProductPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function UrlNormalizer() {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const lower = pathname.toLowerCase()
    const noTrailing = lower.length > 1 ? lower.replace(/\/+$/, '') : lower
    const normalized = noTrailing || '/'

    if (pathname !== normalized) {
      navigate(`${normalized}${search}${hash}`, { replace: true })
    }
  }, [pathname, search, hash, navigate])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteData?.company?.name || 'PTCGRAM PVT LTD',
    url: SITE_URL,
    logo: `${SITE_URL}/Images/logo.png`,
    email: siteData?.company?.contact?.email,
    telephone: siteData?.company?.contact?.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteData?.company?.contact?.address,
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '401303',
      addressCountry: 'IN',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteData?.company?.name || 'PTCGRAM PVT LTD',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950" />}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<AdminPage />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <>
      <StructuredData data={[orgSchema, websiteSchema]} />
      <UrlNormalizer />
      <ScrollToTop />
      <div className="pt-[68px] sm:pt-[100px] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<div className="min-h-[40vh]" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/import-export" element={<ImportExportPage />} />
              <Route path="/highlighted-products" element={<HighlightedProductsPage />} />
              <Route path="/private/africa-specialty-chemicals" element={<AfricaExportPage />} />
              <Route path="/private/africa-specialty-chemicals/:productMarketSlug" element={<PrivateAfricaProductPage />} />
              <Route path="/solvents" element={<ProductCategoryPage categoryId="solvents" />} />
              <Route path="/acids" element={<ProductCategoryPage categoryId="acids" />} />
              <Route path="/industrial" element={<ProductCategoryPage categoryId="industrial" />} />
              <Route path="/dietary-supplements" element={<ProductCategoryPage categoryId="dietary-supplements" />} />
              <Route path="/household" element={<ProductCategoryPage categoryId="household" />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/solvents/:productSlug" element={<ProductDetailPage categoryId="solvents" />} />
              <Route path="/acids/:productSlug" element={<ProductDetailPage categoryId="acids" />} />
              <Route path="/industrial/:productSlug" element={<ProductDetailPage categoryId="industrial" />} />
              <Route path="/dietary-supplements/:productSlug" element={<ProductDetailPage categoryId="dietary-supplements" />} />
              <Route path="/household/:productSlug" element={<ProductDetailPage categoryId="household" />} />
              <Route path="/:categoryId/:productSlug" element={<ProductDetailPage />} />
              <Route path="/:categoryId" element={<ProductCategoryPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  )
}
