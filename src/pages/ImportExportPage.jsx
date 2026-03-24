import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

/* ── Reusable helpers ── */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">
    <span className="w-6 h-0.5 bg-amber-500 rounded-full" />{children}
  </div>
)
const Divider = ({ center = false }) => (
  <div className={`w-12 h-[3px] bg-amber-500 rounded-full mb-6 ${center ? 'mx-auto' : ''}`} />
)

/* ── Visual image placeholders using SVG patterns (no external img dependency) ── */
const SceneBanner = ({ scene, label }) => {
  const scenes = {
    ship: (
      <svg viewBox="0 0 800 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f2545"/>
            <stop offset="100%" stopColor="#1a3a6b"/>
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e4080"/>
            <stop offset="100%" stopColor="#0f2545"/>
          </linearGradient>
        </defs>
        <rect width="800" height="320" fill="url(#sky)"/>
        <rect y="220" width="800" height="100" fill="url(#sea)" opacity="0.8"/>
        {/* Ship hull */}
        <rect x="120" y="170" width="560" height="60" rx="4" fill="#c8872a" opacity="0.9"/>
        <polygon points="680,170 740,230 120,230 80,170" fill="#a06920"/>
        {/* Containers */}
        {[140,220,300,380,460,540].map((x,i) => (
          <g key={x}>
            <rect x={x} y={130} width="68" height="40" rx="2" fill={['#1a3a6b','#c8872a','#2a5298','#8a5718','#0f2545','#e8a040'][i]} opacity="0.9"/>
            <rect x={x+2} y={132} width="64" height="36" rx="1" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            <line x1={x+34} y1={130} x2={x+34} y2={170} stroke="white" strokeWidth="0.5" opacity="0.3"/>
          </g>
        ))}
        {/* Crane arm */}
        <line x1="620" y1="40" x2="620" y2="130" stroke="#94a3b8" strokeWidth="4"/>
        <line x1="540" y1="40" x2="660" y2="40" stroke="#94a3b8" strokeWidth="3"/>
        <line x1="580" y1="40" x2="580" y2="130" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2"/>
        {/* Stars/dots */}
        {[50,150,250,350,450,700,750].map(x => (
          <circle key={x} cx={x} cy={30} r="1.5" fill="white" opacity="0.6"/>
        ))}
        {/* Text overlay */}
        <text x="400" y="290" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" opacity="0.7" fontFamily="Georgia, serif">{label}</text>
      </svg>
    ),
    drums: (
      <svg viewBox="0 0 800 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f6f2"/>
            <stop offset="100%" stopColor="#e8e4dc"/>
          </linearGradient>
        </defs>
        <rect width="800" height="320" fill="url(#wh)"/>
        {/* Floor */}
        <rect x="0" y="250" width="800" height="70" fill="#d0c8b8" opacity="0.6"/>
        {/* Rows of drums */}
        {[1,2,3].map(row => (
          [80,160,240,320,400,480,560,640,720].map((x,i) => (
            <g key={`${row}-${x}`}>
              <ellipse cx={x} cy={230 - (row-1)*75} rx="28" ry="10" fill={['#1a3a6b','#c8872a','#2a5298'][i%3]} opacity="0.9"/>
              <rect x={x-28} y={190 - (row-1)*75} width="56" height="40" fill={['#1a3a6b','#c8872a','#2a5298'][i%3]} opacity="0.85"/>
              <ellipse cx={x} cy={190 - (row-1)*75} rx="28" ry="10" fill={['#243580','#e8a040','#3a62a8'][i%3]}/>
              <rect x={x-20} y={200 - (row-1)*75} width="40" height="12" rx="1" fill="white" opacity="0.15"/>
              <text x={x} y={212 - (row-1)*75} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" opacity="0.6" fontFamily="monospace">PTCGRAM</text>
            </g>
          ))
        ))}
        {/* MSDS label */}
        <rect x="350" y="260" width="100" height="30" rx="4" fill="#0f2545" opacity="0.8"/>
        <text x="400" y="280" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">UN APPROVED</text>
        <text x="400" y="310" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="Georgia, serif">{label}</text>
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 800 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="320" fill="#0f2545"/>
        {/* Grid lines */}
        {[80,160,240,320,400,480,560,640,720].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="#1a3a6b" strokeWidth="0.5"/>
        ))}
        {[40,80,120,160,200,240,280].map(y => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#1a3a6b" strokeWidth="0.5"/>
        ))}
        {/* Route lines */}
        <path d="M200,160 Q400,80 600,140" stroke="#c8872a" strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.8"/>
        <path d="M150,180 Q400,260 650,190" stroke="#c8872a" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6"/>
        <path d="M300,100 Q450,200 700,160" stroke="#e8a040" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.5"/>
        {/* City dots */}
        {[
          [200,160,'India'],[400,120,'Middle East'],[600,140,'Southeast Asia'],
          [150,200,'Africa'],[650,180,'Europe'],[300,100,'South Asia'],
        ].map(([x,y,name]) => (
          <g key={name}>
            <circle cx={x} cy={y} r="8" fill="#c8872a" opacity="0.3"/>
            <circle cx={x} cy={y} r="4" fill="#c8872a"/>
            <circle cx={x} cy={y} r="4" fill="#c8872a" opacity="0.5" className="animate-ping"/>
            <text x={x} y={y-14} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" opacity="0.8" fontFamily="sans-serif">{name}</text>
          </g>
        ))}
        <text x="400" y="300" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" opacity="0.6" fontFamily="Georgia, serif">{label}</text>
      </svg>
    )
  }
  return (
    <div className="rounded-xl overflow-hidden shadow-industry-lg border border-gray-200" style={{ height: 260 }}>
      {scenes[scene]}
    </div>
  )
}

/* ── Stat card ── */
const StatCard = ({ icon, value, label }) => (
  <div className="flex flex-col items-center text-center gap-2 p-6 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-industry transition-all duration-200">
    <span className="text-3xl">{icon}</span>
    <span className="font-serif text-2xl text-navy-900 font-bold">{value}</span>
    <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{label}</span>
  </div>
)

/* ── Service card ── */
const ServiceCard = ({ icon, title, items, accent }) => (
  <div className={`relative rounded-2xl overflow-hidden border-2 ${accent === 'navy' ? 'border-navy-900 bg-navy-900' : 'border-amber-400 bg-white'}`}>
    <div className={`px-8 py-6 ${accent === 'navy' ? 'bg-navy-900' : 'bg-amber-500'}`}>
      <span className="text-4xl block mb-3">{icon}</span>
      <h3 className="font-serif text-2xl text-white">{title}</h3>
    </div>
    <div className={`px-8 py-6 ${accent === 'navy' ? 'bg-navy-950/80' : 'bg-white'}`}>
      <p className={`text-xs font-bold tracking-widest uppercase mb-4 ${accent === 'navy' ? 'text-amber-400' : 'text-navy-900'}`}>
        Products Include
      </p>
      <ul className="flex flex-col gap-3">
        {items.map(item => (
          <li key={item} className="flex items-start gap-3">
            <span className={`mt-0.5 text-[0.6rem] flex-shrink-0 ${accent === 'navy' ? 'text-amber-400' : 'text-amber-500'}`}>▸</span>
            <span className={`text-sm leading-snug ${accent === 'navy' ? 'text-white/80' : 'text-gray-600'}`}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

/* ── Compliance badge ── */
const ComplianceBadge = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-industry transition-all duration-200 group">
    <div className="w-12 h-12 rounded-xl bg-navy-900/5 group-hover:bg-amber-50 flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
      {icon}
    </div>
    <div>
      <h4 className="font-serif text-base text-navy-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </div>
)

/* ── Doc item ── */
const DocItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
    <span className="text-amber-500 text-xs flex-shrink-0">▸</span>
    <span className="text-sm text-gray-600">{text}</span>
  </div>
)

/* ── Market chip ── */
const MarketChip = ({ region, countries }) => (
  <div className="flex flex-col gap-2 p-5 bg-navy-900 rounded-xl border border-navy-700 hover:border-amber-500 transition-colors">
    <h4 className="font-serif text-lg text-white">{region}</h4>
    <p className="text-xs text-white/50 leading-relaxed">{countries}</p>
  </div>
)

/* ══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════ */
export default function ImportExportPage() {
  return (
    <div>
      {/* ── Page Banner ── */}
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Import & Export' }]}
        title="Import & Export"
        description="Global Supply & Distribution — Connecting Indian industry to world markets with safe, compliant and timely chemical logistics."
      />

      {/* ── Intro Strip ── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon="🌍" value="4+" label="Global Regions" />
            <StatCard icon="📦" value="50+" label="Export Products" />
            <StatCard icon="✅" value="UN" label="Approved Packaging" />
            <StatCard icon="🚢" value="Sea · Air · Road" label="Shipping Modes" />
          </div>
        </div>
      </section>

      {/* ── About our IE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <SectionLabel>Who We Are</SectionLabel>
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4 leading-tight">
                Global Supply &amp;<br />Distribution Partner
              </h2>
              <Divider />
              <p className="text-sm text-gray-500 leading-loose mb-5">
                At PTCGRAM Private Limited, we are engaged in the import and export of high-quality industrial chemicals and raw materials. With a strong supplier and logistics network, we ensure safe handling, compliant packaging, and timely delivery across international markets.
              </p>
              <p className="text-sm text-gray-500 leading-loose">
                Our team handles all aspects of chemical trade — from sourcing and quality verification to documentation, packaging compliance, and last-mile delivery. We are your single-window solution for global chemical supply chains.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">
                  Get an Export Quote
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-navy-900 text-navy-900 text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-navy-900 hover:text-white transition-all">
                  Contact Our Team
                </Link>
              </div>
            </div>
            <div>
              <SceneBanner scene="ship" label="Global Shipping & Logistics" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Import & Export Services ── */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>What We Do</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mt-1">Our Import &amp; Export Services</h2>
            <Divider center />
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              Comprehensive import and export services for industrial chemicals, raw materials and specialty products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard
              icon="🚢"
              title="Our Import Services"
              accent="navy"
              items={[
                'Industrial solvents',
                'Specialty chemicals',
                'Acids and alkalis',
                'Fragrance and essential oil raw materials',
                'Cleaning chemical raw materials',
              ]}
            />
            <ServiceCard
              icon="✈️"
              title="Our Export Services"
              accent="amber"
              items={[
                'Caustic Soda',
                'Industrial chemicals',
                'Cleaning chemical concentrates',
                'Solvents and raw materials',
                'Essential oils and fragrances',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Visual: Drums warehouse ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="order-2 lg:order-1">
              <SceneBanner scene="drums" label="UN Approved Chemical Drums & Packaging" />
            </div>
            <div className="order-1 lg:order-2">
              <SectionLabel>Packaging & Compliance</SectionLabel>
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4 leading-tight">
                Safe, Certified &amp;<br />Compliant Packaging
              </h2>
              <Divider />
              <p className="text-sm text-gray-500 leading-loose mb-6">
                All chemical shipments are packaged in accordance with international regulations. We use UN-approved packaging for hazardous materials and ensure full documentation compliance for every shipment.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  ['🔒', 'UN Approved Packaging', 'Hazardous chemicals packed per UN standards for safe international transport.'],
                  ['📄', 'Fumigation Certificate', 'Fumigation certification provided when required by the destination country.'],
                  ['⚠️', 'Dangerous Goods Declaration', 'Full DGD documentation for regulated chemical shipments.'],
                  ['📋', 'MSDS Documentation', 'Material Safety Data Sheets provided with every shipment.'],
                  ['📦', 'Custom Export Packaging', 'Tailored packaging solutions to meet buyer and regulatory specifications.'],
                ].map(([icon, title, desc]) => (
                  <ComplianceBadge key={title} icon={icon} title={title} desc={desc} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logistics & Documentation ── */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <SectionLabel>Logistics</SectionLabel>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4 leading-tight">
                End-to-End Logistics &amp;<br />Documentation
              </h2>
              <Divider />
              <p className="text-sm text-white/60 leading-loose mb-8">
                We handle complete export documentation and logistics coordination, so you can focus on your business while we manage the trade compliance.
              </p>

              {/* Shipping modes */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  ['🚢', 'Sea Freight', 'Full & partial container loads'],
                  ['✈️', 'Air Freight', 'Urgent & time-sensitive cargo'],
                  ['🚛', 'Road Transport', 'Pan-India distribution'],
                ].map(([icon, mode, desc]) => (
                  <div key={mode} className="flex flex-col items-center text-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-amber-400 transition-colors">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs font-bold tracking-wide uppercase text-white">{mode}</span>
                    <span className="text-[0.65rem] text-white/45 leading-snug">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents list */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="font-serif text-xl text-navy-900 mb-2">Export Documents We Provide</h3>
              <div className="w-10 h-[3px] bg-amber-500 rounded-full mb-5" />
              <div className="flex flex-col">
                {[
                  'Commercial Invoice',
                  'Packing List',
                  'Certificate of Origin',
                  'MSDS & Technical Data Sheets',
                  'Dangerous Goods Declaration (if applicable)',
                  'Bill of Lading / Airway Bill',
                  'Fumigation Certificate (if required)',
                  'Insurance Certificate',
                ].map(doc => (
                  <DocItem key={doc} text={doc} />
                ))}
              </div>
              <Link to="/contact"
                className="mt-6 flex items-center justify-center gap-2 py-3 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">
                Request Documentation Support →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Markets We Serve ── */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Our Reach</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mt-1">Markets We Serve</h2>
            <Divider center />
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              We aim to supply chemicals to global markets, building long-term partnerships across regions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MarketChip
                region="🌙 Middle East"
                countries="UAE, Saudi Arabia, Oman, Qatar, Kuwait, Bahrain"
              />
              <MarketChip
                region="🌏 Southeast Asia"
                countries="Malaysia, Indonesia, Thailand, Vietnam, Philippines, Singapore"
              />
              <MarketChip
                region="🌍 Africa"
                countries="Kenya, Nigeria, Tanzania, Ethiopia, South Africa"
              />
              <MarketChip
                region="🌱 South Asia"
                countries="Bangladesh, Sri Lanka, Nepal, Pakistan"
              />
            </div>
            <div>
              <SceneBanner scene="globe" label="Global Trade Network" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us for IE ── */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Our Advantage</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mt-1">Why Choose PTCGRAM for Global Trade</h2>
            <Divider center />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['🏭', 'Direct Manufacturer Access', 'Strong relationships with Indian manufacturers for competitive pricing and quality assurance.'],
              ['📑', 'Full Documentation Support', 'We handle all trade documentation from DGD to Certificate of Origin — end to end.'],
              ['⚡', 'Fast Turnaround', 'Efficient processing, ready stock, and established freight relationships ensure quick dispatch.'],
              ['🔐', 'Regulatory Compliance', 'All shipments comply with Indian export regulations, destination country requirements, and IATA/IMO rules.'],
              ['🧪', 'Quality Verified Products', 'Every batch quality-tested with COA and MSDS provided for each chemical product.'],
              ['🤝', 'Dedicated Export Manager', 'A single point of contact manages your entire import/export order from inquiry to delivery.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="group flex flex-col gap-3 p-7 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:-translate-y-1 hover:shadow-industry-lg transition-all duration-300">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-serif text-lg text-navy-900">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative bg-navy-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg,white 0,white 1px,transparent 1px,transparent 16px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Ready to Start Exporting?</h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-xl">
              Contact our export team today. We will guide you from product selection and pricing to packaging, documentation and final delivery at your destination port.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors whitespace-nowrap">
              Get Export Quote →
            </Link>
            <a href="tel:+919710879879"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:border-white hover:bg-white/10 transition-all whitespace-nowrap">
              📞 Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
