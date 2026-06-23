import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDisplayImageGroups, getDisplayImageUrl, getDisplayImageUrls } from '../utils/productImage'
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaCircle, FaEnvelope, FaFlask, FaPhoneAlt, FaRegCircle, FaTimesCircle } from 'react-icons/fa'
import SeoMeta from '../components/SeoMeta'
import StructuredData from '../components/StructuredData'
import { SITE_URL, absoluteUrl } from '../utils/seo'
import { parseProductIdFromParam, toProductSlug } from '../utils/productSeo'
import { getProductVariantOptions } from '../utils/productVariants'
import { CATEGORY_MAP, useCatalogProducts } from '../hooks/useCatalogProducts'
import { useCategories } from '../hooks/useCategories'
import { cleanSchemaValue, getProductSchema } from '../utils/productSchema'

// Clean short_description from WP noise into overview + sections
function parseDescription(raw = '') {
  if (!raw) return { overview: '', sections: [] }
  const cleaned = raw
    .replace(/\r\n/g, '\n')
    .replace(/ENQUIRE NOW/gi, '')
    .replace(/&nbsp;/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const lines = cleaned.split('\n').map(l => l.replace(/^\t/, '').trim()).filter(Boolean)
  let overview = ''
  const sections = []
  let currentSection = null

  for (const line of lines) {
    if (!overview && !line.startsWith('�') && line.length > 40) {
      overview = line
      continue
    }
    if (!line.startsWith('�') && !line.startsWith('�') && !line.startsWith('-') && line.length < 70) {
      currentSection = { title: line, points: [] }
      sections.push(currentSection)
    } else if (currentSection) {
      const point = line.replace(/^[��\-]\s*/, '').trim()
      if (point) currentSection.points.push(point)
    }
  }
  return { overview, sections: sections.filter(s => s.points.length > 0) }
}

function getCAS(attrs = {}) {
  return attrs['CAS Number'] || attrs['CAS Number `'] || null
}

function cleanSpecValue(value) {
  return String(value || '').replace(/\\/g, '').trim()
}

function getAttributeValue(attrs = {}, names = []) {
  for (const name of names) {
    const value = attrs[name]
    if (value !== undefined && value !== null && cleanSpecValue(value)) return cleanSpecValue(value)
  }
  return ''
}

function summarizeApplications(sections = [], categoryName = '') {
  const applicationSections = sections.filter((section) => (
    /application|use|industry|industrial|commercial|household|pharma|food|agriculture|laboratory|cleaning|cosmetic/i.test(section.title)
  ))
  const sourceSections = applicationSections.length ? applicationSections : sections
  const points = sourceSections.flatMap((section) => section.points).filter(Boolean).slice(0, 4)
  if (points.length) return points.join(', ')
  return `Used in ${categoryName || 'industrial'} applications; confirm suitability with PTCGRAM.`
}

function summarizeIndustryUse(sections = [], categoryName = '') {
  const titles = sections
    .map((section) => section.title)
    .filter((title) => /industry|industrial|commercial|household|pharma|food|agriculture|laboratory|cleaning|cosmetic/i.test(title))
    .slice(0, 4)
  if (titles.length) return titles.join(', ')
  return categoryName || 'Industrial and commercial use'
}

function buildRequiredSpecs(product, sections, categoryName) {
  const attrs = product.attributes || {}
  return [
    {
      label: 'CAS Number',
      value: getAttributeValue(attrs, ['CAS Number', 'CAS Number `', 'CAS No.', 'CAS No']) || 'Available on request',
      aliases: ['CAS Number', 'CAS Number `', 'CAS No.', 'CAS No'],
    },
    {
      label: 'Purity',
      value: getAttributeValue(attrs, ['Purity', 'Assay', 'Concentration']) || 'Commercial / industrial grade; purity available on request',
      aliases: ['Purity', 'Assay', 'Concentration'],
    },
    {
      label: 'Applications',
      value: getAttributeValue(attrs, ['Applications', 'Applications / Usage', 'Application', 'Usage']) || summarizeApplications(sections, categoryName),
      aliases: ['Applications', 'Applications / Usage', 'Application', 'Usage'],
    },
    {
      label: 'Packaging',
      value: getAttributeValue(attrs, ['Packaging', 'Pack Size', 'Packing']) || 'Contact PTCGRAM for available pack sizes',
      aliases: ['Packaging', 'Pack Size', 'Packing'],
    },
    {
      label: 'Industry Use',
      value: getAttributeValue(attrs, ['Industry Use', 'Industrial Use', 'Industry', 'End Use']) || summarizeIndustryUse(sections, categoryName),
      aliases: ['Industry Use', 'Industrial Use', 'Industry', 'End Use'],
    },
  ]
}

// categoryId now comes as a PROP (passed from App.jsx routes), not from useParams
export default function ProductDetailPage({ categoryId }) {
  const { productSlug, categoryId: routeCategoryId } = useParams()
  const activeCategoryId = categoryId || routeCategoryId
  const categories = useCategories()
  const navigate = useNavigate()
  const jsonKey = categories.find((category) => category.id === activeCategoryId)?.name || CATEGORY_MAP[activeCategoryId] || activeCategoryId
  const products = useCatalogProducts(activeCategoryId)
  const productId = parseProductIdFromParam(productSlug)
  const product  = products.find(p => p.id === productId)
  const galleryImageCandidates = getDisplayImageGroups(product?.image)
  const galleryImages = galleryImageCandidates.map(arr => arr[0]).filter(Boolean)
  const productImage = galleryImages[0] || getDisplayImageUrl(product?.image)
  const [activeImage, setActiveImage] = useState(productImage || '')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [thumbImages, setThumbImages] = useState(galleryImages)

  useEffect(() => {
    setActiveImage(productImage || '')
    setActiveImageIndex(0)
    setThumbImages(galleryImages)
  }, [productId, activeCategoryId, productImage, galleryImages.join('|')])

  useEffect(() => {
    if (!product) return
    const canonicalSlug = toProductSlug(product)
    if (productSlug !== canonicalSlug) {
      navigate(`/${activeCategoryId}/${canonicalSlug}`, { replace: true })
    }
  }, [product, productSlug, activeCategoryId, navigate])

  if (!product) {
    return (
      <div>
        <SeoMeta
          title="Product Not Found | PTCGRAM"
          description="The requested product could not be found."
          canonical={`/${activeCategoryId}/${productSlug || ''}`}
          robots="noindex,nofollow"
        />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-24">
          <span className="text-7xl"><FaFlask className="inline text-navy-900/30" /></span>
          <h1 className="font-serif text-3xl text-navy-900">Product not found</h1>
          <p className="text-sm text-gray-400">The product ID <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{productId}</code> was not found in <strong>{jsonKey}</strong>.</p>
          <Link to={`/${activeCategoryId}`} className="px-6 py-3 bg-navy-900 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors">
            ? Back to {jsonKey}
          </Link>
        </div>
      </div>
    )
  }

  const idx         = products.findIndex(p => p.id === product.id)
  const prevProduct = idx > 0 ? products[idx - 1] : null
  const nextProduct = idx < products.length - 1 ? products[idx + 1] : null
  const related     = products.filter(p => p.id !== product.id).slice(0, 4)
  const cas         = getCAS(product.attributes)
  const { overview, sections } = parseDescription(product.short_description)
  const requiredSpecs = buildRequiredSpecs(product, sections, jsonKey)
  const requiredAliases = new Set(requiredSpecs.flatMap((spec) => spec.aliases))
  const attrEntries = [
    ...requiredSpecs.map((spec) => [spec.label, spec.value]),
    ...Object.entries(product.attributes || {}).filter(([k]) => !requiredAliases.has(k)),
  ]
  const variantOptions = getProductVariantOptions(product)
  const selectGalleryImage = (imageIndex) => {
    if (imageIndex < 0) return
    const image = thumbImages[imageIndex] || galleryImages[imageIndex]
    if (!image) return
    setActiveImage(image)
    setActiveImageIndex(imageIndex)
  }
  const detailTitle = `${product.name} (${jsonKey}) | PTCGRAM`
  const detailDescription = overview || product.short_description?.split('\n')[0]?.replace(/\r/g, '').trim() || `${product.name} technical details, applications and specifications.`
  const detailKeywords = `${product.name}, ${jsonKey}, CAS ${cas || ''}, industrial chemical supplier India, PTCGRAM`
  const canonicalSlug = toProductSlug(product)
  const canonicalPath = `/${activeCategoryId}/${canonicalSlug}`
  const productUrl = absoluteUrl(canonicalPath)
  const productSchema = getProductSchema({
    product,
    categoryId: activeCategoryId,
    categoryName: jsonKey,
    description: detailDescription,
    image: productImage,
    additionalProperty: attrEntries.map(([name, value]) => ({
      '@type': 'PropertyValue',
      name,
      value: cleanSchemaValue(value),
    })),
  })
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: jsonKey, item: absoluteUrl(`/${activeCategoryId}`) },
      { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
    ],
  }

  return (
    <div>
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      <SeoMeta
        title={detailTitle}
        description={detailDescription}
        canonical={canonicalPath}
        keywords={detailKeywords}
        image={productImage || '/Images/logo.png'}
        ogType="product"
      />
      {/* -- Banner -- */}
      <div className="relative bg-navy-900 pt-16 sm:pt-20 pb-10 sm:pb-14 overflow-hidden">
        <div className="absolute top-0 right-[-100px] bottom-0 w-96 bg-white/[0.02] skew-x-[-12deg]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 60px)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[0.58rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.12em] sm:tracking-widest text-white/35 mb-4 sm:mb-5 flex-wrap">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/${activeCategoryId}`} className="hover:text-amber-400 transition-colors">{jsonKey}</Link>
            <span>/</span>
            <span className="text-amber-400">{product.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div className="flex-1">
              <span className="inline-flex text-[0.62rem] font-bold tracking-[0.15em] uppercase text-amber-400 bg-amber-500/15 border border-amber-400/25 px-3 py-1 rounded-sm mb-3">
                {jsonKey}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl text-white mb-4 leading-tight">{product.name}</h1>
              <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                {cas && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[0.55rem] font-bold tracking-widest uppercase text-white/35">CAS No.</span>
                    <span className="text-sm font-mono text-white/80 tracking-wide">{cas}</span>
                  </div>
                )}
                {product.attributes['Appearance'] && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[0.55rem] font-bold tracking-widest uppercase text-white/35">Appearance</span>
                    <span className="text-sm text-white/75">{String(product.attributes['Appearance']).replace(/\\/g,'')}</span>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.55rem] font-bold tracking-widest uppercase text-white/35">Availability</span>
                  <span className={`text-sm font-semibold ${product.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.in_stock ? <><FaCheckCircle className="inline mr-1" />In Stock</> : <><FaTimesCircle className="inline mr-1" />Out of Stock</>}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-amber-500 text-white text-[0.7rem] sm:text-[0.72rem] font-bold tracking-[0.12em] sm:tracking-widest uppercase rounded hover:bg-amber-400 transition-colors whitespace-nowrap">
                Enquire Now <FaArrowRight className="inline" />
              </Link>
              <Link to={`/${activeCategoryId}`} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border-2 border-white/30 text-white text-[0.7rem] sm:text-[0.72rem] font-bold tracking-[0.12em] sm:tracking-widest uppercase rounded hover:border-white hover:bg-white/10 transition-all whitespace-nowrap">
                <FaArrowLeft className="inline" /> Back to {jsonKey}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* -- Body -- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 sm:gap-10 items-start">

            {/* Main */}
            <div className="flex flex-col gap-8">

              {/* Image + Overview */}
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 sm:gap-6">
                {/* Full product image */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-3 sm:p-4">
                  <div className="rounded-xl overflow-hidden flex items-center justify-center min-h-[220px] sm:min-h-[280px] bg-gray-50">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={`${product.name} main product image`}
                        referrerPolicy="no-referrer"
                        loading="eager" decoding="async" fetchpriority="high" width="640" height="420" className="w-full h-56 sm:h-72 object-contain p-2 sm:p-3"
                        onError={e => {
                          const candidates = galleryImageCandidates[activeImageIndex] || []
                          const current = e.currentTarget.getAttribute('src') || ''
                          const currentIndex = candidates.indexOf(current)
                          const next = candidates[currentIndex + 1]
                          if (next) {
                            setActiveImage(next)
                            setThumbImages(prev => prev.map((v, idx) => (idx === activeImageIndex ? next : v)))
                            e.currentTarget.src = next
                            return
                          }
                          e.currentTarget.style.display='none'
                          e.currentTarget.nextElementSibling.style.display='flex'
                        }}
                      />
                    ) : null}
                    <div className="w-full h-56 sm:h-72 items-center justify-center text-7xl sm:text-8xl bg-navy-900/5"
                      style={{ display: activeImage ? 'none' : 'flex' }}><FaFlask className="text-navy-900/30" /></div>
                  </div>

                  {galleryImages.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {thumbImages.map((img, i) => (
                        <button
                          key={`${img}-${i}`}
                          type="button"
                          onClick={() => {
                            setActiveImage(img)
                            setActiveImageIndex(i)
                          }}
                          className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md border overflow-hidden transition-all ${
                            activeImageIndex === i ? 'border-amber-500 ring-1 ring-amber-400' : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} gallery image ${i + 1}`}
                            referrerPolicy="no-referrer"
                            loading="lazy" decoding="async" width="80" height="80" className="w-full h-full object-cover"
                            onError={e => {
                              const candidates = galleryImageCandidates[i] || []
                              const current = e.currentTarget.getAttribute('src') || ''
                              const currentIndex = candidates.indexOf(current)
                              const next = candidates[currentIndex + 1]
                              if (next) {
                                setThumbImages(prev => prev.map((v, idx) => (idx === i ? next : v)))
                                if (activeImageIndex === i) setActiveImage(next)
                                e.currentTarget.src = next
                                return
                              }
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overview */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
                  <h2 className="font-serif text-xl text-navy-900 mb-1">Product Overview</h2>
                  <div className="w-10 h-[3px] bg-amber-500 rounded-full mb-4" />
                  <p className="text-[0.9rem] text-gray-500 leading-[1.85]">
                    {overview || product.short_description?.split('\n')[0]?.replace(/\r/g,'').trim()}
                  </p>
                  {/* Stock badge */}
                  <div className={`mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded border
                    ${product.in_stock ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                    <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </div>
                  {variantOptions.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <h3 className="text-[0.68rem] font-bold tracking-widest uppercase text-navy-900 mb-3">Available Variants</h3>
                      <div className="flex flex-wrap gap-2">
                        {variantOptions.map((option) => {
                          const isLinked = option.imageIndex >= 0
                          const isActive = isLinked && option.imageIndex === activeImageIndex
                          const className = `rounded-full border px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wide transition-colors ${
                            isActive
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-amber-200 bg-amber-50 text-amber-700'
                          } ${isLinked ? 'hover:border-amber-500 hover:bg-amber-100 cursor-pointer' : ''}`

                          return isLinked ? (
                            <button key={option.label} type="button" onClick={() => selectGalleryImage(option.imageIndex)} className={className}>
                              {option.label}
                            </button>
                          ) : (
                            <span key={option.label} className={className}>
                              {option.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Applications */}
              {sections.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 md:p-10">
                  <h2 className="font-serif text-xl sm:text-2xl text-navy-900 mb-1">Applications &amp; Uses</h2>
                  <div className="w-10 h-[3px] bg-amber-500 rounded-full mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((sec, si) => (
                      <div key={si}>
                        <h4 className="text-[0.75rem] font-bold tracking-widest uppercase text-navy-900 mb-3 flex items-center gap-2">
                          <span className="w-4 h-0.5 bg-amber-500 rounded-full" />{sec.title}
                        </h4>
                        <ul className="flex flex-col gap-2">
                          {sec.points.map((pt, pi) => (
                            <li key={pi} className="flex items-start gap-2.5 text-sm text-gray-500 leading-relaxed">
                              <span className="text-amber-500 mt-1 flex-shrink-0 text-[0.6rem]">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Table */}
              {attrEntries.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 md:p-10">
                  <h2 className="font-serif text-xl sm:text-2xl text-navy-900 mb-1">Technical Specifications</h2>
                  <div className="w-10 h-[3px] bg-amber-500 rounded-full mb-6" />
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {attrEntries.map(([label, value], i) => (
                      <div key={label}
                        className={`flex items-stretch hover:bg-gray-50 transition-colors ${i < attrEntries.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="w-[44%] sm:w-48 md:w-60 flex-shrink-0 px-3 sm:px-5 py-3 text-[0.72rem] sm:text-[0.8rem] font-semibold text-gray-600 bg-navy-900/[0.025] border-r border-gray-100 flex items-center leading-snug">
                          {label}
                        </div>
                        <div className="flex-1 px-3 sm:px-5 py-3 text-[0.78rem] sm:text-sm text-gray-800 font-mono tracking-wide flex items-center leading-snug break-words">
                          {String(value).replace(/\\/g, '')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prev / Next */}
              <div className="hidden sm:flex justify-between gap-3 sm:gap-4 flex-wrap">
                {prevProduct ? (
                  <Link to={`/${activeCategoryId}/${toProductSlug(prevProduct)}`}
                    className="flex flex-col gap-1 px-4 sm:px-5 py-4 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:-translate-y-0.5 hover:shadow-industry transition-all min-w-[140px] w-full sm:w-auto sm:max-w-[48%]">
                    <span className="text-[0.62rem] font-bold tracking-widest uppercase text-amber-500"><FaArrowLeft className="inline" /> Previous</span>
                    <span className="font-serif text-sm text-navy-900 line-clamp-1">{prevProduct.name}</span>
                  </Link>
                ) : <div />}
                {nextProduct && (
                  <Link to={`/${activeCategoryId}/${toProductSlug(nextProduct)}`}
                    className="flex flex-col items-end gap-1 px-4 sm:px-5 py-4 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:-translate-y-0.5 hover:shadow-industry transition-all min-w-[140px] w-full sm:w-auto sm:max-w-[48%]">
                    <span className="text-[0.62rem] font-bold tracking-widest uppercase text-amber-500">Next <FaArrowRight className="inline" /></span>
                    <span className="font-serif text-sm text-navy-900 line-clamp-1 text-right">{nextProduct.name}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-28">
              {/* Quick info */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-industry">
                <div className="bg-navy-900 px-5 sm:px-6 py-5 border-b-[3px] border-amber-500">
                  <div className="flex items-start gap-3">
                    {productImage
                      ? <img src={productImage} alt={`${product.name} product image`} referrerPolicy="no-referrer" loading="lazy" decoding="async" width="48" height="48" className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        onError={e => { e.currentTarget.style.display = 'none' }} />
                                            : <span className="text-3xl flex-shrink-0"><FaFlask className="inline text-navy-900/30" /></span>}
                    <div className="min-w-0">
                      <div className="font-serif text-base text-white leading-snug line-clamp-2">{product.name}</div>
                      <div className="text-[0.6rem] font-semibold tracking-widest uppercase text-white/40 mt-1">{jsonKey}</div>
                    </div>
                  </div>
                </div>
                  <div className="divide-y divide-gray-100">
                  {cas && (
                    <div className="flex justify-between items-center px-5 py-3 text-sm">
                      <span className="text-gray-400">CAS Number</span>
                      <strong className="text-navy-900 font-mono text-xs">{cas}</strong>
                    </div>
                  )}
                  {product.attributes['Appearance'] && (
                    <div className="flex justify-between items-center px-5 py-3 text-sm gap-2">
                      <span className="text-gray-400 flex-shrink-0">Appearance</span>
                      <strong className="text-navy-900 text-xs text-right">{String(product.attributes['Appearance']).replace(/\\/g,'')}</strong>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-5 py-3 text-sm">
                    <span className="text-gray-400">Availability</span>
                    <span className={`text-xs font-bold ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
                      {product.in_stock ? <><FaCircle className="inline mr-1 text-[10px]" />In Stock</> : <><FaRegCircle className="inline mr-1 text-[10px]" />Out of Stock</>}
                    </span>
                  </div>
                  {variantOptions.length > 0 && (
                    <div className="px-5 py-3 text-sm">
                      <span className="block text-gray-400 mb-2">Variants</span>
                      <div className="flex flex-wrap gap-1.5">
                        {variantOptions.slice(0, 4).map((option) => {
                          const isLinked = option.imageIndex >= 0
                          const isActive = isLinked && option.imageIndex === activeImageIndex
                          const className = `rounded-full px-2 py-1 text-[0.62rem] font-semibold transition-colors ${
                            isActive ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'
                          } ${isLinked ? 'hover:bg-amber-100 hover:text-amber-700 cursor-pointer' : ''}`

                          return isLinked ? (
                            <button key={option.label} type="button" onClick={() => selectGalleryImage(option.imageIndex)} className={className}>
                              {option.label}
                            </button>
                          ) : (
                            <span key={option.label} className={className}>
                              {option.label}
                            </span>
                          )
                        })}
                        {variantOptions.length > 4 && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-[0.62rem] font-semibold text-gray-700">
                            +{variantOptions.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 text-white text-[0.7rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">
                    Enquire Now
                  </Link>
                </div>
              </div>

              {/* Quick Specs */}
              {attrEntries.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h4 className="text-[0.62rem] font-bold tracking-widest uppercase text-navy-900 mb-3 pb-2.5 border-b border-gray-100">Quick Specs</h4>
                  <div className="flex flex-col">
                    {attrEntries.slice(0, 6).map(([label, value]) => (
                      <div key={label} className="flex justify-between items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-[0.72rem] text-gray-400 flex-shrink-0">{label}</span>
                        <span className="text-[0.72rem] text-gray-700 font-medium text-right leading-snug">{String(value).replace(/\\/g,'')}</span>
                      </div>
                    ))}
                    {attrEntries.length > 6 && <p className="text-[0.62rem] text-gray-400 mt-2 text-center">+{attrEntries.length - 6} more in table above</p>}
                  </div>
                </div>
              )}

              {/* Help */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
                <h4 className="font-serif text-base text-navy-900">Need Technical Help?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">Our experts can guide you on product selection, grades, dosing and safe handling.</p>
                <a href="tel:+919710879879" className="flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white text-[0.68rem] font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors"><FaPhoneAlt /> Call Us Now</a>
                <a href="mailto:support.ptcgram@gmail.com" className="flex items-center justify-center gap-2 py-2.5 border-2 border-navy-900 text-navy-900 text-[0.68rem] font-bold tracking-widest uppercase rounded hover:bg-navy-900 hover:text-white transition-all"><FaEnvelope /> Email Us</a>
              </div>

              {/* Mobile Next Button */}
              {nextProduct && (
                <Link to={`/${activeCategoryId}/${toProductSlug(nextProduct)}`}
                  className="lg:hidden flex items-center justify-between gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-industry transition-all">
                  <span className="flex flex-col">
                    <span className="text-[0.62rem] font-bold tracking-widest uppercase text-amber-500">Next</span>
                    <span className="font-serif text-sm text-navy-900 line-clamp-1">{nextProduct.name}</span>
                  </span>
                  <FaArrowRight className="text-amber-500 flex-shrink-0" />
                </Link>
              )}

              {/* Category */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-[0.58rem] font-bold tracking-widest uppercase text-gray-400 mb-2">Browse Category</p>
                <Link to={`/${activeCategoryId}`} className="block group">
                  <div className="font-serif text-sm text-navy-900 group-hover:text-amber-500 transition-colors">View all {jsonKey}</div>
                  <div className="text-xs text-amber-500 font-semibold mt-0.5">({products.length} products) <FaArrowRight className="inline" /></div>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5 text-[0.65rem] sm:text-[0.7rem] font-bold tracking-[0.14em] sm:tracking-[0.2em] uppercase text-amber-500 mb-3">
              <span className="w-6 h-0.5 bg-amber-500 rounded-full" />Same Category
            </div>
            <div className="w-12 h-[3px] bg-amber-500 rounded-full mb-4" />
            <h2 className="font-serif text-2xl sm:text-3xl text-navy-900 mb-6 sm:mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(rp => (
                <Link key={rp.id} to={`/${activeCategoryId}/${toProductSlug(rp)}`}
                  className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-400 hover:-translate-y-1 hover:shadow-industry-lg transition-all duration-200">
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {getDisplayImageUrl(rp.image) && (
                      <img src={getDisplayImageUrl(rp.image)} alt={`${rp.name} product photo`} referrerPolicy="no-referrer" loading="lazy" decoding="async" width="320" height="176"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          const candidates = getDisplayImageUrls(rp.image)
                          const current = e.currentTarget.getAttribute('src') || ''
                          const currentIndex = candidates.indexOf(current)
                          const next = candidates[currentIndex + 1]
                          if (next) {
                            e.currentTarget.src = next
                            return
                          }
                          e.currentTarget.style.display='none'
                        }} />
                    )}
                    {!getDisplayImageUrl(rp.image) && <div className="w-full h-full flex items-center justify-center text-4xl bg-navy-900/5"><FaFlask className="text-navy-900/30" /></div>}
                    <div className="absolute top-0 left-0 right-0 h-0 group-hover:h-[3px] bg-amber-500 transition-all duration-200" />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-serif text-sm text-navy-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">{rp.name}</h3>
                    {getCAS(rp.attributes) && <p className="text-[0.6rem] font-mono text-gray-400">CAS: {getCAS(rp.attributes)}</p>}
                    <span className="text-[0.65rem] font-bold tracking-wide text-amber-500 mt-auto group-hover:tracking-widest transition-all">View Details <FaArrowRight className="inline" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative bg-navy-900 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg,white 0,white 1px,transparent 1px,transparent 16px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-3">Interested in {product.name}?</h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">Contact our team for pricing, availability, minimum order quantities and delivery timelines.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-amber-500 text-white text-[0.7rem] sm:text-[0.72rem] font-bold tracking-[0.12em] sm:tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">Get a Quote <FaArrowRight className="inline" /></Link>
            <Link to={`/${activeCategoryId}`} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 border-2 border-white/30 text-white text-[0.7rem] sm:text-[0.72rem] font-bold tracking-[0.12em] sm:tracking-widest uppercase rounded hover:border-white hover:bg-white/10 transition-all">View All {jsonKey}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}








