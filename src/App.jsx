import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ProductCategoryPage from './pages/ProductCategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ImportExportPage from './pages/ImportExportPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <>
      <ScrollToTop />
      <div className="pt-[110px] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"                element={<HomePage />} />
            <Route path="/about"           element={<AboutPage />} />
            <Route path="/import-export"   element={<ImportExportPage />} />
            <Route path="/solvents"        element={<ProductCategoryPage categoryId="solvents" />} />
            <Route path="/acids"           element={<ProductCategoryPage categoryId="acids" />} />
            <Route path="/industrial"      element={<ProductCategoryPage categoryId="industrial" />} />
            <Route path="/household"       element={<ProductCategoryPage categoryId="household" />} />
            <Route path="/contact"         element={<ContactPage />} />
            {/* Product detail pages — categoryId as prop, productId from URL */}
            <Route path="/solvents/:productId"   element={<ProductDetailPage categoryId="solvents" />} />
            <Route path="/acids/:productId"      element={<ProductDetailPage categoryId="acids" />} />
            <Route path="/industrial/:productId" element={<ProductDetailPage categoryId="industrial" />} />
            <Route path="/household/:productId"  element={<ProductDetailPage categoryId="household" />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}
