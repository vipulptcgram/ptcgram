import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StructuredData from './components/StructuredData'

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

  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://ptcgram.com/#organization',
        name: 'PTCGRAM PVT LTD',
        alternateName: ['PTCGRAM', 'PTC Gram', 'PTCGRAM Private Limited'],
        url: 'https://ptcgram.com/',
        logo: 'https://ptcgram.com/logo.png',
        description:
          'PTCGRAM PVT LTD is a distributor, manufacturer, importer, exporter, wholesaler and supplier of specialty chemicals, solvents, acids, industrial chemicals and cleaning concentrates in India.',
        foundingDate: '2009',
        legalName: 'PTCGRAM PRIVATE LIMITED',
        identifier: [
          {
            '@type': 'PropertyValue',
            name: 'GST Number',
            value: '27AALCP9913F1Z2',
          },
          {
            '@type': 'PropertyValue',
            name: 'CIN',
            value: 'U24290MH2021PTC360281',
          },
        ],
        areaServed: ['India', 'Tanzania', 'Ethiopia', 'Ghana', 'Nigeria', 'Africa'],
        knowsAbout: [
          'Specialty Chemicals',
          'Industrial Chemicals',
          'Chemical Solvents',
          'Acids',
          'Ethanol',
          'Caustic Soda',
          'Acid Slurry',
          'Paraffin Wax',
          'Guar Gum',
          'Xanthan Gum',
        ],
        sameAs: ['https://www.ptcgram.in/'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://ptcgram.com/#website',
        url: 'https://ptcgram.com/',
        name: 'PTCGRAM PVT LTD',
        publisher: {
          '@id': 'https://ptcgram.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://ptcgram.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://ptcgram.com/#localbusiness',
        name: 'PTCGRAM PVT LTD',
        image: 'https://ptcgram.com/logo.png',
        url: 'https://ptcgram.com/',
        description:
          'Manufacturer, importer, exporter, distributor and wholesaler of specialty chemicals, solvents, acids and industrial chemicals.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '203/204, Vajreshwari, Padmi Nagar, Phoolpada Road, Virar East',
          addressLocality: 'Vasai Virar',
          addressRegion: 'Maharashtra',
          postalCode: '401305',
          addressCountry: 'IN',
        },
        areaServed: ['Mumbai', 'Maharashtra', 'India', 'Tanzania', 'Ethiopia', 'Ghana', 'Nigeria'],
        priceRange: '$$',
        parentOrganization: {
          '@id': 'https://ptcgram.com/#organization',
        },
      },
    ],
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
      <StructuredData data={globalSchema} />
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
