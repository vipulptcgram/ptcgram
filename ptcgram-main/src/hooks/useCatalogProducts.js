import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import productData from '../data/productdetail.json'
import { getDefaultCategoryName } from './useCategories'

export const CATEGORY_MAP = {
  solvents: 'Solvents',
  acids: 'Acids',
  industrial: 'Industrial Chemicals',
  'dietary-supplements': 'Dietary Supplements',
  household: 'Household Cleaning Concentrates',
}

function normalizeProductName(name = '') {
  return String(name)
    .toLowerCase()
    .replace(/sulph/g, 'sulf')
    .replace(/xanthum/g, 'xanthan')
    .replace(/hypochloride/g, 'hypochlorite')
    .replace(/thickner/g, 'thickener')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function normalizeImages(imageValue = '') {
  if (Array.isArray(imageValue)) return imageValue.map((item) => String(item).trim()).filter(Boolean)
  if (!imageValue) return []
  return String(imageValue)
    .split(/\r?\n|\s*\|\s*|\s*;\s*|\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function imageIdentity(url = '') {
  return driveImageId(url) || String(url).trim()
}

function driveImageId(url = '') {
  return String(url).match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1]
    || String(url).match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1]
}

function isCarboyDrumImage(url = '') {
  return String(url).toLowerCase().includes('/carboy-drum/')
}

function isPackagingVariant(product = {}) {
  return /\b(carboy|drum|kg|ltr|litre|liter|pack|bag|bottle)\b/i.test(product.name || '')
}

function mergeProductImages(fallbackProduct = {}, managedProduct = {}) {
  const primaryImages = normalizeImages(fallbackProduct.image)
  const primaryDriveIds = new Set(primaryImages.map(driveImageId).filter(Boolean))
  const managedImages = normalizeImages(managedProduct.image).filter((image) => {
    const driveId = driveImageId(image)
    return !primaryDriveIds.size || !driveId || primaryDriveIds.has(driveId)
  })
  const ordered = isPackagingVariant(managedProduct)
    ? [...managedImages, ...primaryImages]
    : [
      ...primaryImages.filter((image) => !isCarboyDrumImage(image)),
      ...managedImages.filter((image) => !isCarboyDrumImage(image)),
      ...primaryImages.filter(isCarboyDrumImage),
      ...managedImages.filter(isCarboyDrumImage),
    ]
  const seen = new Set()
  return ordered.filter((image) => {
    const key = imageIdentity(image)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function mergeManagedProduct(fallbackProduct, managedProduct) {
  if (!fallbackProduct) return managedProduct

  return {
    ...fallbackProduct,
    in_stock: managedProduct.in_stock ?? fallbackProduct.in_stock,
    stock: managedProduct.stock ?? fallbackProduct.stock,
    unit: managedProduct.unit ?? fallbackProduct.unit,
    sku: managedProduct.sku ?? fallbackProduct.sku,
    price: managedProduct.price ?? fallbackProduct.price,
    mrp: managedProduct.mrp ?? fallbackProduct.mrp,
    image: mergeProductImages(fallbackProduct, managedProduct),
  }
}

function mergeCatalogProducts(fallback, snapshot) {
  const deletedIds = new Set()
  const deletedNames = new Set()
  const managedProducts = []

  for (const item of snapshot.docs) {
    const data = item.data()
    const product = data.product
    if (!product) continue

    if (data.deleted) {
      deletedIds.add(Number(product.id))
      deletedNames.add(normalizeProductName(product.name))
      continue
    }

    managedProducts.push(product)
  }

  const merged = new Map()

  for (const product of fallback) {
    const nameKey = normalizeProductName(product.name)
    if (deletedIds.has(Number(product.id)) || deletedNames.has(nameKey)) continue
    merged.set(nameKey, product)
  }

  for (const product of managedProducts) {
    const id = Number(product.id)
    let fallbackProduct = null
    for (const [nameKey, existing] of merged) {
      if (Number(existing.id) === id) {
        fallbackProduct = existing
        merged.delete(nameKey)
      }
    }
    const managedNameKey = normalizeProductName(product.name)
    fallbackProduct = fallbackProduct || merged.get(managedNameKey)
    merged.set(managedNameKey, mergeManagedProduct(fallbackProduct, product))
  }

  return [...merged.values()].sort((a, b) => Number(a.id) - Number(b.id))
}

export function useCatalogProducts(categoryId) {
  const fallback = productData[CATEGORY_MAP[categoryId] || getDefaultCategoryName(categoryId)] || []
  const [products, setProducts] = useState(fallback)

  useEffect(() => {
    setProducts(fallback)

    const productsQuery = query(
      collection(db, 'products'),
      where('categoryId', '==', categoryId)
    )

    return onSnapshot(
      productsQuery,
      (snapshot) => {
        setProducts(mergeCatalogProducts(fallback, snapshot))
      },
      () => setProducts(fallback)
    )
  }, [categoryId])

  return products
}
