import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'sitemap.xml')
const SITE_DATA_FILE = path.join(ROOT, 'src', 'data', 'siteData.json')
const PRODUCT_DATA_FILE = path.join(ROOT, 'src', 'data', 'productdetail.json')
const BLOG_DATA_FILE = path.join(ROOT, 'src', 'data', 'blog.json')

const SITE_URL = process.env.SITE_URL || 'https://ptcgram.com'

function toIsoDate(date) {
  return new Date(date).toISOString()
}

function fileLastMod(filePath) {
  try {
    return toIsoDate(fs.statSync(filePath).mtime)
  } catch {
    return toIsoDate(new Date())
  }
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function normalizePath(p) {
  if (!p) return '/'
  const withLeading = p.startsWith('/') ? p : `/${p}`
  if (withLeading !== '/' && withLeading.endsWith('/')) return withLeading.slice(0, -1)
  return withLeading
}

function slugifyProductName(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function toProductSlug(product) {
  const base = slugifyProductName(product?.name || '')
  const id = String(product?.id || '').trim()
  if (!id) return base || ''
  return base ? `${base}-${id}` : id
}

function toAbsoluteUrl(routePath) {
  return `${SITE_URL}${normalizePath(routePath)}`
}

function makeUrlNode({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
    `    <priority>${escapeXml(priority)}</priority>`,
    '  </url>',
  ].join('\n')
}

function collectStaticRoutes() {
  return [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/import-export', changefreq: 'weekly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  ]
}

function collectCategoryRoutes(siteData) {
  const categories = Array.isArray(siteData?.categories) ? siteData.categories : []
  return categories
    .map((c) => c?.slug)
    .filter(Boolean)
    .map((slug) => ({
      path: normalizePath(slug),
      changefreq: 'weekly',
      priority: '0.8',
    }))
}

function collectProductRoutes(productData) {
  const categoryPathMap = {
    Solvents: '/solvents',
    Acids: '/acids',
    'Industrial Chemicals': '/industrial',
    'Dietary Supplements': '/dietary-supplements',
    'Household Cleaning Concentrates': '/household',
  }

  const routes = []
  for (const [categoryName, products] of Object.entries(productData || {})) {
    const categoryPath = categoryPathMap[categoryName]
    if (!categoryPath || !Array.isArray(products)) continue

    for (const p of products) {
      const slug = toProductSlug(p)
      if (!slug) continue
      routes.push({
        path: `${categoryPath}/${slug}`,
        changefreq: 'monthly',
        priority: '0.7',
      })
    }
  }

  return routes
}

function collectBlogRoutes() {
  const blogData = readJson(BLOG_DATA_FILE, null)
  if (!blogData) return []

  const rows = Array.isArray(blogData)
    ? blogData
    : Array.isArray(blogData.posts)
      ? blogData.posts
      : []

  if (rows.length === 0) return []

  const routes = [{ path: '/blog', changefreq: 'weekly', priority: '0.6' }]
  for (const post of rows) {
    const slug = post?.slug
    if (!slug) continue
    routes.push({
      path: `/blog/${slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    })
  }
  return routes
}

function dedupeByPath(routeRows) {
  const map = new Map()
  for (const row of routeRows) {
    map.set(normalizePath(row.path), row)
  }
  return [...map.values()]
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })

  const siteData = readJson(SITE_DATA_FILE, {})
  const productData = readJson(PRODUCT_DATA_FILE, {})
  const lastmodStatic = fileLastMod(SITE_DATA_FILE)
  const lastmodProducts = fileLastMod(PRODUCT_DATA_FILE)
  const lastmodBlog = fileLastMod(BLOG_DATA_FILE)

  const staticRoutes = collectStaticRoutes().map((r) => ({ ...r, lastmod: lastmodStatic }))
  const categoryRoutes = collectCategoryRoutes(siteData).map((r) => ({ ...r, lastmod: lastmodStatic }))
  const productRoutes = collectProductRoutes(productData).map((r) => ({ ...r, lastmod: lastmodProducts }))
  const blogRoutes = collectBlogRoutes().map((r) => ({ ...r, lastmod: lastmodBlog }))

  const allRoutes = dedupeByPath([
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogRoutes,
  ])

  const body = allRoutes
    .map((r) =>
      makeUrlNode({
        loc: toAbsoluteUrl(r.path),
        lastmod: r.lastmod,
        changefreq: r.changefreq,
        priority: r.priority,
      }),
    )
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</urlset>',
    '',
  ].join('\n')

  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8')
  console.log(`Generated sitemap: ${OUTPUT_FILE} (${allRoutes.length} URLs)`)
}

main()
