import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://ptcgram.com'
const DEFAULT_IMAGE = '/Images/logo.png'
const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

function upsertMeta(selector, attrs) {
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    document.head.appendChild(node)
  }
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v))
}

function upsertLink(selector, attrs) {
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('link')
    document.head.appendChild(node)
  }
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v))
}

function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export default function SeoMeta({
  title,
  description,
  canonical,
  keywords,
  robots = DEFAULT_ROBOTS,
  image = DEFAULT_IMAGE,
  ogType = 'website',
}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(canonical || pathname || '/')
    const imageUrl = toAbsoluteUrl(image)

    if (title) document.title = title

    if (description) upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
    if (keywords) upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType })
    if (title) upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    if (description) upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'PTCGRAM PVT LTD' })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    if (title) upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    if (description) upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
  }, [title, description, canonical, keywords, robots, image, ogType, pathname])

  return null
}

