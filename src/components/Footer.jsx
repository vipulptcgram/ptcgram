import { Link } from 'react-router-dom'
import data from '../data/siteData.json'

const LogoSVG = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-9 h-9 flex-shrink-0">
    <ellipse cx="28" cy="28" rx="24" ry="9" stroke="white" strokeWidth="1.5" fill="none" />
    <ellipse cx="28" cy="28" rx="24" ry="9" stroke="white" strokeWidth="1.5" fill="none" transform="rotate(60 28 28)" />
    <ellipse cx="28" cy="28" rx="24" ry="9" stroke="white" strokeWidth="1.5" fill="none" transform="rotate(120 28 28)" />
    <path d="M28 19 C32 23 32 33 28 37 C24 33 24 23 28 19Z" fill="#c8872a" />
    <circle cx="28" cy="4" r="2" fill="white" />
    <circle cx="48" cy="40" r="2" fill="white" />
    <circle cx="8" cy="40" r="2" fill="white" />
  </svg>
)

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

      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/8">
        {/* Brand */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <LogoSVG />
            <div>
              <span className="block font-serif text-xl text-white leading-none tracking-wide">PTCGRAM</span>
              <span className="block text-[0.55rem] font-semibold tracking-widest text-white/30 uppercase mt-0.5">PVT LTD.</span>
            </div>
          </div>
          <p className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-amber-500">IDEA · PROFIT · FUTURE</p>
          <p className="text-sm text-white/45 leading-relaxed max-w-xs">
            Leading distributors and manufacturers of specialty chemicals, solvents, acids and household cleaning concentrates since 2009.
          </p>
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
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/contact">Get a Quote</FooterLink>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5 pb-3 border-b border-white/10">Contact Us</h4>
          <div className="flex flex-col gap-4">
            {[
              { icon: '📍', content: contact.address },
              { icon: '✉️', content: contact.email, href: `mailto:${contact.email}` },
              { icon: '📞', content: contact.phone, href: 'tel:+919710879879' },
            ].map(({ icon, content, href }) => (
              <div key={icon} className="flex items-start gap-2.5 text-sm text-white/50">
                <span className="flex-shrink-0 mt-0.5">{icon}</span>
                {href
                  ? <a href={href} className="hover:text-amber-400 transition-colors leading-snug">{content}</a>
                  : <p className="leading-snug">{content}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/30">© {new Date().getFullYear()} PTCGRAM PVT LTD. All rights reserved.</p>
        <p className="text-xs font-semibold tracking-widest text-white/30 uppercase">Idea · Profit · Future</p>
      </div>
    </footer>
  )
}
