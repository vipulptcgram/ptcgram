import { Link } from 'react-router-dom'
import { FaGlobe, FaLocationDot, FaEnvelope, FaPhone } from 'react-icons/fa6'
import data from '../data/siteData.json'

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm text-white/50 hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-1 group">
      <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">—</span>
      {children}
    </Link>
  </li>
)

export default function Footer() {
  const { contact } = data.company
  return (
    <footer className="bg-navy-950 text-white/70">
      {/* Amber top line */}
      <div className="h-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-70" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 sm:gap-12 border-b border-white/8">

        {/* Brand */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/Images/logo.png"
              alt="PTCGRAM PVT LTD"
              width="180"
              height="48"
              loading="lazy"
              decoding="async"
              className="h-12 w-auto object-contain flex-shrink-0"
            />
          
          </div>
          <p className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-amber-500">IDEA · PROFIT · FUTURE</p>
          <p className="text-sm text-white/45 leading-relaxed max-w-xs">
            Leading distributors and manufacturers of specialty chemicals, solvents, acids and household cleaning concentrates since 2009.
          </p>
          {/* Import Export badge */}
          <Link to="/import-export"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-[0.65rem] font-bold tracking-widest uppercase hover:bg-amber-500/20 transition-colors w-fit">
            <FaGlobe /> Global Import &amp; Export
          </Link>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5 pb-3 border-b border-white/10">Our Products</h4>
          <ul className="flex flex-col gap-2.5">
            <FooterLink to="/solvents">Solvents</FooterLink>
            <FooterLink to="/acids">Acids</FooterLink>
            <FooterLink to="/industrial">Industrial Chemicals</FooterLink>
            <FooterLink to="/household">Household Cleaning</FooterLink>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5 pb-3 border-b border-white/10">Company</h4>
          <ul className="flex flex-col gap-2.5">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/import-export">Import &amp; Export</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/contact">Get a Quote</FooterLink>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5 pb-3 border-b border-white/10">Contact Us</h4>
          <div className="flex flex-col gap-4">
            {[
              { icon: <FaLocationDot />, label: 'Office', content: contact.address },
              { icon: <FaLocationDot />, label: 'Factory', content: contact.factoryAddress },
              { icon: <FaEnvelope />, content: contact.email, href: `mailto:${contact.email}` },
              { icon: <FaPhone />, content: contact.phone, href: 'tel:+919710879879' },
            ].map(({ icon, label, content, href }) => (
              <div key={content} className="flex items-start gap-2.5 text-sm text-white/50">
                <span className="flex-shrink-0 mt-0.5">{icon}</span>
                {href
                  ? <a href={href} className="hover:text-amber-400 transition-colors leading-snug">{content}</a>
                  : <p className="leading-snug"><strong className="block text-white/70 text-[0.65rem] uppercase tracking-wider mb-1">{label}</strong>{content}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/30">© {new Date().getFullYear()} PTCGRAM PVT LTD. All rights reserved.</p>
        <p className="text-xs font-semibold tracking-widest text-white/30 uppercase">Idea · Profit · Future</p>
      </div>
    </footer>
  )
}
