import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaBoxOpen,
  FaBoxesStacked,
  FaCertificate,
  FaCircleCheck,
  FaFileLines,
  FaFlask,
  FaGlobe,
  FaIndustry,
  FaMoneyBillTrendUp,
  FaPhone,
  FaRoute,
  FaShip,
  FaTruckFast,
} from 'react-icons/fa6'
import PageBanner from '../components/PageBanner'
import SeoMeta from '../components/SeoMeta'
import africaExportLinks from '../data/africaExportLinks.json'

const markets = ['Tanzania', 'Ethiopia', 'Ghana', 'Nigeria', 'Kenya', 'Uganda', 'Zambia']

const strengths = [
  {
    icon: <FaIndustry />,
    title: 'Reliable Manufacturing Support',
    text: 'Specialty chemical supply backed by dependable sourcing, production coordination and batch-level quality focus.',
  },
  {
    icon: <FaShip />,
    title: 'Export-Ready Logistics',
    text: 'Shipment planning for African ports and inland routes with practical support for packing, dispatch and documents.',
  },
  {
    icon: <FaCertificate />,
    title: 'Documentation Assistance',
    text: 'Commercial invoice, packing list, MSDS, COA and other shipment documents arranged as per order requirements.',
  },
]

const productGroups = [
  'Specialty chemicals',
  'Industrial solvents',
  'Acids and alkalis',
  'Cleaning chemical raw materials',
  'Fragrance and essential oil raw materials',
  'Industrial chemical concentrates',
]

const exportCapabilities = [
  [<FaBoxesStacked key="bulk" />, 'Bulk Orders', 'High-volume supply support for distributors, importers and industrial buyers.'],
  [<FaBoxOpen key="container" />, "Container Loads (20'/40')", 'FCL shipment planning for standard 20-foot and 40-foot container requirements.'],
  [<FaShip key="terms" />, 'FOB, CIF & CFR', 'Flexible export terms based on buyer preference, destination and shipment scope.'],
  [<FaGlobe key="worldwide" />, 'Worldwide Shipping', 'International dispatch support for Africa and other global markets.'],
  [<FaFileLines key="documentation" />, 'Export Documentation', 'Commercial invoice, packing list, COA, MSDS and related shipment paperwork support.'],
  [<FaMoneyBillTrendUp key="pricing" />, 'Competitive Pricing', 'Practical pricing backed by sourcing strength and shipment-volume planning.'],
  [<FaTruckFast key="supply-chain" />, 'Reliable Supply Chain', 'Consistent coordination from inquiry and packing to dispatch and delivery follow-up.'],
]

const countrySlugLinks = africaExportLinks.countries
const highlightedProducts = africaExportLinks.products
const africaExportBasePath = africaExportLinks.basePath

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">
      <span className="w-6 h-0.5 bg-amber-500 rounded-full" />
      {children}
    </div>
  )
}

function AfricaRouteGraphic() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-900 shadow-industry-xl border border-white/10 min-h-[330px]">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(0deg, white 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <svg viewBox="0 0 720 420" className="relative z-10 w-full h-full min-h-[330px]" role="img" aria-label="Export route from India to African markets">
        <defs>
          <linearGradient id="routeGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D68A58" />
            <stop offset="100%" stopColor="#C7743D" />
          </linearGradient>
        </defs>
        <path
          d="M458 74 C511 93 556 137 573 192 C588 238 565 274 552 317 C538 365 501 383 461 366 C421 348 405 301 383 260 C357 211 321 174 337 128 C351 88 403 61 458 74Z"
          fill="#59636D"
          opacity="0.28"
        />
        <path
          d="M480 86 C522 113 540 152 551 190 C565 240 532 270 532 318 C503 358 464 363 433 333 C410 302 399 260 376 225 C354 190 349 145 372 113 C396 82 440 66 480 86Z"
          fill="#C7743D"
          opacity="0.18"
        />
        <circle cx="180" cy="168" r="10" fill="#D68A58" />
        <circle cx="180" cy="168" r="24" fill="#D68A58" opacity="0.16" />
        <text x="180" y="137" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">India</text>
        {[
          [455, 165, 'Ghana'],
          [500, 186, 'Nigeria'],
          [548, 205, 'Ethiopia'],
          [544, 242, 'Kenya'],
          [526, 268, 'Tanzania'],
          [510, 244, 'Uganda'],
          [500, 310, 'Zambia'],
        ].map(([x, y, name], index) => (
          <g key={name}>
            <path
              d={`M180 168 C${260 + index * 8} ${110 + index * 12}, ${350 + index * 16} ${130 + index * 16}, ${x} ${y}`}
              stroke="url(#routeGlow)"
              strokeWidth="2"
              strokeDasharray="7 6"
              fill="none"
              opacity="0.68"
            />
            <circle cx={x} cy={y} r="7" fill="#C7743D" />
            <circle cx={x} cy={y} r="16" fill="#C7743D" opacity="0.14" />
            <text x={x + 18} y={y + 4} fill="white" fontSize="11" fontWeight="600" opacity="0.82">{name}</text>
          </g>
        ))}
        <text x="360" y="386" textAnchor="middle" fill="white" fontSize="16" fontFamily="Georgia, serif" opacity="0.72">
          Specialty chemical export routes across Africa
        </text>
      </svg>
    </div>
  )
}

function MiniDrum({ color = '#C7743D', label = 'PTC' }) {
  return (
    <svg viewBox="0 0 76 92" className="w-14 h-16 flex-shrink-0" role="img" aria-label="Chemical drum">
      <ellipse cx="38" cy="18" rx="24" ry="10" fill="#F8F7F5" opacity="0.35" />
      <rect x="14" y="18" width="48" height="56" rx="3" fill={color} />
      <ellipse cx="38" cy="18" rx="24" ry="10" fill={color} />
      <ellipse cx="38" cy="74" rx="24" ry="10" fill="#0B0F14" opacity="0.22" />
      <path d="M18 33H58M18 60H58" stroke="white" strokeWidth="2" opacity="0.32" />
      <rect x="24" y="40" width="28" height="13" rx="2" fill="white" opacity="0.2" />
      <text x="38" y="50" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">
        {label}
      </text>
    </svg>
  )
}

function DrumStrip() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-industry p-5 sm:p-6">
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        <MiniDrum color="#C7743D" label="PTC" />
        <MiniDrum color="#293038" label="MSDS" />
        <MiniDrum color="#D68A58" label="COA" />
        <MiniDrum color="#59636D" label="UN" />
        <MiniDrum color="#884722" label="EXP" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {['Solvents', 'Acids', 'Specialty'].map((item) => (
          <span key={item} className="rounded-lg bg-gray-50 px-2 py-2 text-[0.65rem] font-bold uppercase tracking-widest text-gray-500">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AfricaExportPage() {
  return (
    <div>
      <SeoMeta
        title="Exporting Specialty Chemicals Across Africa | PTCGRAM PVT LTD"
        description="PTCGRAM PVT LTD is a reliable manufacturer, exporter and distributor of specialty chemicals serving Tanzania, Ethiopia, Ghana, Nigeria, Kenya, Uganda, Zambia and other African markets."
        canonical="/private/africa-specialty-chemicals"
        robots="noindex,nofollow,noarchive,nosnippet"
        keywords="specialty chemical exporter Africa, chemical manufacturer India to Africa, Tanzania chemical supplier, Nigeria specialty chemicals, Kenya industrial chemicals"
      />

      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Private Preview' }]}
        title="Exporting Specialty Chemicals Across Africa"
        titleClassName="lg:whitespace-nowrap lg:text-5xl xl:text-6xl"
        description="Reliable manufacturer, exporter and distributor of specialty chemicals serving Tanzania, Ethiopia, Ghana, Nigeria, Kenya, Uganda, Zambia and other African markets."
      />

      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-14 items-center">
            <div>
              <SectionLabel>Africa Export Desk</SectionLabel>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 leading-tight mb-5">
                Specialty chemical supply for growing African industries.
              </h2>
              <p className="text-sm sm:text-base text-gray-500 leading-loose mb-6">
                PTCGRAM PVT LTD supports African buyers with reliable specialty chemical manufacturing, export coordination and distribution support from India. We work with customers who need consistent quality, practical documentation and responsive shipment handling.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors"
                >
                  Enquire Now <FaArrowRight />
                </Link>
                <a
                  href="tel:+919710879879"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-navy-900 text-navy-900 text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-navy-900 hover:text-white transition-all"
                >
                  <FaPhone /> Call Export Team
                </a>
              </div>
            </div>
            <AfricaRouteGraphic />
          </div>
          <div className="mt-8">
            <DrumStrip />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionLabel>Markets Covered</SectionLabel>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-900">
              Serving Key African Markets
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {markets.map((market) => (
              <div key={market} className="bg-white border border-gray-200 rounded-xl px-4 py-5 text-center shadow-sm hover:border-amber-400 transition-colors">
                <FaGlobe className="mx-auto mb-2 text-amber-500" />
                <span className="text-sm font-bold text-navy-900">{market}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 leading-relaxed mt-8 max-w-3xl mx-auto">
            We also support buyers in other African markets based on product availability, shipment regulations and destination requirements.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <SectionLabel>Product Range</SectionLabel>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-900 mb-5">
                Specialty chemicals and industrial raw materials.
              </h2>
              <p className="text-sm text-gray-500 leading-loose mb-6">
                From industrial solvents to cleaning chemical raw materials, PTCGRAM helps African importers source dependable chemical products for manufacturing, distribution and trading requirements.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {productGroups.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <FaCircleCheck className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {strengths.map((item) => (
                <div key={item.title} className="flex gap-4 p-5 sm:p-6 bg-navy-900 rounded-2xl border border-navy-700 shadow-industry">
                  <div className="w-12 h-12 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionLabel>Highlighted Products</SectionLabel>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-900">
              Africa Export Product Links
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
              Product links are prepared with country-specific export slugs for Tanzania, Ethiopia, Ghana and Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {highlightedProducts.map((product, index) => (
              <div key={product.slug} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-industry transition-all duration-200">
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-navy-900 leading-snug">{product.name}</h3>
                    <p className="text-[0.68rem] text-gray-400 mt-1 font-semibold uppercase tracking-widest">
                      Exporter country slugs
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {countrySlugLinks.map((country) => (
                    <Link
                      key={country.slug}
                      to={`${africaExportBasePath}/${product.slug}-exporter-${country.slug}`}
                      className="inline-flex items-center rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"
                    >
                      {country.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20 bg-navy-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              [<FaFlask key="quality" />, 'Quality Focus', 'COA and MSDS support for applicable products.'],
              [<FaBoxOpen key="packing" />, 'Export Packing', 'Chemical packing planned for safer international movement.'],
              [<FaRoute key="routes" />, 'Route Coordination', 'Sea and air shipment coordination based on product and buyer needs.'],
              [<FaFileLines key="docs" />, 'Trade Documents', 'Support for standard export paperwork and destination requirements.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                <span className="text-3xl text-amber-400 mb-4 block">{icon}</span>
                <h3 className="font-serif text-xl text-white mb-2">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionLabel>Export Capabilities</SectionLabel>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-900">
              Built for Bulk Chemical Export Requirements
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
              PTCGRAM supports African and worldwide buyers with practical export terms, container-load planning, documentation and dependable supply chain coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportCapabilities.map(([icon, title, text]) => (
              <div key={title} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-amber-400 hover:shadow-industry transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl mb-4">
                  {icon}
                </div>
                <h3 className="font-serif text-lg text-navy-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white py-14 sm:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <SectionLabel>Start Your Africa Inquiry</SectionLabel>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-900 mb-3">
              Need specialty chemicals for an African market?
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              Share the product name, quantity, destination country and preferred shipment terms. Our team will respond with availability and next steps.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors whitespace-nowrap"
          >
            Send Inquiry <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}
