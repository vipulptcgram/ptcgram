import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCheck, FaLocationDot, FaEnvelope, FaPhone, FaFlask, FaArrowRightLong } from 'react-icons/fa6'
import PageBanner from '../components/PageBanner'
import data from '../data/siteData.json'
import SeoMeta from '../components/SeoMeta'

const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-2.5 text-[0.65rem] sm:text-[0.7rem] font-bold tracking-[0.14em] sm:tracking-[0.2em] uppercase text-amber-500">
    <span className="w-6 h-0.5 bg-amber-500 rounded-full" />{children}
  </div>
)

const InfoCard = ({ icon, label, children, color = 'border-gray-200' }) => (
  <div className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-white border ${color} rounded-xl hover:border-amber-400 sm:hover:translate-x-1 hover:shadow-industry transition-all duration-200 group`}>
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-navy-900/5 flex items-center justify-center text-sm sm:text-base flex-shrink-0 group-hover:bg-amber-50 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[0.58rem] sm:text-[0.62rem] font-bold tracking-[0.12em] sm:tracking-widest uppercase text-gray-400 mb-1">{label}</p>
      {children}
    </div>
  </div>
)

const FormInput = ({ label, required, children, ...rest }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.12em] sm:tracking-widest uppercase text-gray-500">
      {label}{required && ' *'}
    </label>
    {children || (
      <input
        className="bg-gray-100 border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/8 transition-all"
        {...rest}
      />
    )}
  </div>
)

export default function ContactPage() {
  const { contact } = data.company
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', product: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          pageUrl: window.location.href,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || 'Unable to submit form.')
      }

      setSent(true)
      setForm({ name: '', company: '', email: '', phone: '', product: '', message: '' })
    } catch (err) {
      setError(err?.message || 'Unable to submit form right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SeoMeta
        title="Contact PTCGRAM | Bulk Chemical Enquiries & Quotes"
        description="Contact PTCGRAM PVT LTD for chemical product enquiries, bulk pricing, sourcing support, and technical assistance. Reach our team by phone or email."
        canonical="/contact"
        keywords="contact chemical supplier, bulk chemical quote India, PTCGRAM contact, specialty chemicals enquiry"
      />
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]}
        title="Get in Touch"
        description="Reach out for product enquiries, pricing, bulk orders or any business enquiry. Our team responds within 24 hours."
      />

      <section className="py-14 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-8 sm:gap-10 lg:gap-12 items-start">
          <div className="flex flex-col gap-5">
            <Eyebrow>Contact Information</Eyebrow>
            <div className="w-12 h-[3px] bg-amber-500 rounded-full" />
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-navy-900">We'd Love to Hear From You</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Whether you're looking for a specific chemical, need bulk pricing, or want to
              explore a business relationship - we're here to help.
            </p>

            <div className="flex flex-col gap-3">
              <InfoCard icon={<FaLocationDot />} label="Office Address">
                <p className="text-sm text-gray-600 leading-snug">{contact.address}</p>
              </InfoCard>
              <InfoCard icon={<FaLocationDot />} label="Factory Address">
                <p className="text-sm text-gray-600 leading-snug">{contact.factoryAddress}</p>
              </InfoCard>
              <InfoCard icon={<FaEnvelope />} label="Email Address">
                <a href={`mailto:${contact.email}`} className="text-sm font-medium text-navy-900 hover:text-amber-500 transition-colors">
                  {contact.email}
                </a>
              </InfoCard>
              <InfoCard icon={<FaPhone />} label="Phone Number">
                <a href="tel:+919710879879" className="text-sm font-medium text-navy-900 hover:text-amber-500 transition-colors">
                  {contact.phone}
                </a>
              </InfoCard>
            </div>

            <div className="bg-navy-900 rounded-xl p-4 sm:p-5">
              <p className="text-[0.6rem] font-bold tracking-widest uppercase text-amber-400 mb-3">Office Hours</p>
              <div className="flex flex-col gap-2">
                {[['Monday - Saturday', '9:00 AM - 6:30 PM'], ['Sunday', 'Closed']].map(([day, hrs]) => (
                  <div key={day} className="flex justify-between items-start gap-3 text-sm py-1.5 border-b border-white/6 last:border-0">
                    <span className="text-white/55">{day}</span>
                    <span className="text-white/75 font-medium text-right">{hrs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-industry w-full">
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-5 py-14 sm:py-20 px-5 sm:px-10 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-2xl text-amber-500 animate-pulse-amber">
                  <FaCheck />
                </div>
                <h3 className="font-serif text-2xl text-navy-900">Thank You!</h3>
                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                  Your message has been received. Our team will get back to you within 24 business hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 px-6 py-2.5 bg-navy-900 text-white text-[0.7rem] font-bold tracking-widest uppercase rounded hover:bg-navy-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-4 sm:p-6 md:p-10 flex flex-col gap-5">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-navy-900">Send Us a Message</h3>
                  <p className="text-sm text-gray-400 mt-1">Fill in the details below and we'll get back to you promptly.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Full Name" required>
                    <input name="name" value={form.name} onChange={handle} placeholder="Your name" required
                      className="bg-gray-100 border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/8 transition-all w-full" />
                  </FormInput>
                  <FormInput label="Company Name">
                    <input name="company" value={form.company} onChange={handle} placeholder="Your company"
                      className="bg-gray-100 border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/8 transition-all w-full" />
                  </FormInput>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Email Address" required>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" required
                      className="bg-gray-100 border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/8 transition-all w-full" />
                  </FormInput>
                  <FormInput label="Phone Number">
                    <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX"
                      className="bg-gray-100 border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/8 transition-all w-full" />
                  </FormInput>
                </div>

                <FormInput label="Product / Category of Interest">
                  <select name="product" value={form.product} onChange={handle}
                    className="bg-gray-100 border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/8 transition-all w-full appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8a8a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                    <option value="">Select a category</option>
                    {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="other">Other / General Enquiry</option>
                  </select>
                </FormInput>

                <FormInput label="Your Message" required>
                  <textarea name="message" value={form.message} onChange={handle} rows={5}
                    placeholder="Describe your requirement, quantity needed, or any questions..." required
                    className="bg-gray-100 border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-navy-900 focus:ring-2 focus:ring-navy-900/8 transition-all w-full resize-y min-h-[110px]" />
                </FormInput>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-navy-900 text-white text-[0.72rem] sm:text-[0.75rem] font-bold tracking-[0.14em] sm:tracking-widest uppercase rounded hover:bg-navy-700 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-industry'} transition-all`}
                >
                  {loading ? 'Sending...' : 'Send Enquiry ->'}
                </button>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14 lg:py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-xl sm:text-2xl text-navy-900 mb-2">Browse Our Products</h2>
          <p className="text-sm text-gray-400 mb-7">Not sure what you need? Explore our categories and then get in touch.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.categories.map(cat => (
              <Link key={cat.id} to={cat.slug}
                className="group flex items-center gap-3 px-4 sm:px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-900 hover:bg-white sm:hover:-translate-y-0.5 hover:shadow-industry transition-all duration-200">
                <span className="text-xl flex-shrink-0"><FaFlask /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy-900 truncate">{cat.name}</div>
                  <div className="text-[0.65rem] text-gray-400 mt-0.5">{cat.products.length} products</div>
                </div>
                <FaArrowRightLong className="text-amber-500 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
