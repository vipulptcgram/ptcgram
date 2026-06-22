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
    for (const [nameKey, existing] of merged) {
      if (Number(existing.id) === id) merged.delete(nameKey)
    }
    merged.set(normalizeProductName(product.name), product)
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
