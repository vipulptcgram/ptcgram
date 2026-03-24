import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import data from '../data/siteData.json'

const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-500">
    <span className="w-6 h-0.5 bg-amber-500 rounded-full" />{children}
  </div>
)

const Divider = ({ center = false }) => (
  <div className={`w-12 h-[3px] bg-amber-500 rounded-full ${center ? 'mx-auto' : ''}`} />
)

export default function AboutPage() {
  const { company, stats, features } = data

  const values = [
    { icon: '🤝', title: 'Integrity',      desc: 'Transparent, honest dealings with every client, supplier and partner — always.' },
    { icon: '🎯', title: 'Reliability',    desc: 'Consistent on-time delivery and quality you can count on, every single order.' },
    { icon: '🔬', title: 'Expertise',      desc: 'Deep technical knowledge across all chemical categories we distribute.' },
    { icon: '🌏', title: 'Reach',          desc: 'Pan-India distribution network ensuring availability wherever our clients operate.' },
    { icon: '🌱', title: 'Responsibility', desc: 'Safe handling, storage and transport in full regulatory compliance.' },
    { icon: '📈', title: 'Growth',         desc: 'Helping our clients grow with the right materials at the right price.' },
  ]

  return (
    <div>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
        title="About PTCGRAM"
        description="A trusted name in specialty chemical distribution and manufacturing since 2009."
      />

      {/* ── Story ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="flex flex-col gap-5">
            <Eyebrow>Our Story</Eyebrow>
            <Divider />
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 leading-tight">Who We Are</h2>
            <p className="text-sm text-gray-500 leading-loose">{company.about}</p>
            <p className="text-sm text-gray-500 leading-loose">
              Founded in {company.founded}, PTCGRAM PVT LTD has grown from a regional chemical
              trader to a nationally recognised distributor serving industries including
              pharmaceuticals, textiles, food processing, manufacturing and household products.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-2">
              {stats.map(s => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="font-serif text-3xl text-amber-500 leading-none">{s.value}</span>
                  <span className="text-[0.65rem] font-bold tracking-widest uppercase text-gray-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — cards */}
          <div className="flex flex-col gap-5">
            <div className="bg-navy-900 rounded-2xl p-7">
              <h3 className="font-serif text-xl text-white mb-3">Our Mission</h3>
              <p className="text-sm text-white/65 leading-relaxed">{company.mission}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200/40 rounded-2xl p-7">
              <h3 className="font-serif text-xl text-amber-600 mb-3">Our Promise</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every product we distribute meets stringent quality standards. We stand
                behind every delivery with full technical support and responsive after-sales service.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
              <h3 className="font-serif text-xl text-navy-900 mb-3">Our Reach</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Operating from our headquarters in Virar, Mumbai, we serve clients across
                India with a comprehensive distribution network spanning all major industrial hubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-cream border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <Eyebrow>What Drives Us</Eyebrow>
            <Divider center />
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(v => (
              <div key={v.title}
                className="group bg-white border border-gray-200 rounded-xl p-7 flex flex-col gap-3 hover:border-amber-400 hover:-translate-y-1 hover:shadow-industry-lg transition-all duration-300">
                <span className="text-2xl">{v.icon}</span>
                <h4 className="font-serif text-lg text-navy-900">{v.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-12">
            <Eyebrow>Why Choose PTCGRAM</Eyebrow>
            <Divider />
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mt-4">Industry‑Trusted Since 2009</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
            {features.map((f, i) => (
              <div key={f.title}
                className="group bg-white p-8 flex flex-col gap-3 hover:bg-navy-900 transition-colors duration-300 cursor-default">
                <span className="font-serif text-4xl text-amber-200/20 leading-none group-hover:text-amber-400/20">0{i + 1}</span>
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-serif text-lg text-navy-900 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-white/65 transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-navy-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg,white 0,white 1px,transparent 1px,transparent 16px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="font-serif text-4xl text-white mb-3">Ready to Work Together?</h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-xl">
              Contact our team today for pricing, availability and technical enquiries across all product categories.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap flex-shrink-0">
            <Link to="/contact" className="inline-flex items-center justify-center px-7 py-3.5 bg-amber-500 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:bg-amber-400 transition-colors">
              Get in Touch
            </Link>
            <Link to="/solvents" className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-white/30 text-white text-[0.72rem] font-bold tracking-widest uppercase rounded hover:border-white hover:bg-white/10 transition-all">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
