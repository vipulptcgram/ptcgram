import { useEffect, useState } from 'react'
import siteData from '../data/siteData.json'

const defaultCategoryCovers = {
  solvents: 'https://drive.usercontent.google.com/download?id=1370tdEK0xAWwMmlJ32h3CjeRr8-rQC6P&export=view&authuser=0',
  acids: 'https://drive.usercontent.google.com/download?id=1Si2NHBAqYuoC8TKRRfS5C7vXIvQruXtq&export=view&authuser=0',
  industrial: 'https://drive.usercontent.google.com/download?id=1szYcpMnU8J9JI56N8UAZp-tmrvE1DkEi&export=view&authuser=0',
  'dietary-supplements': '/Images/logo.png',
  household: 'https://drive.usercontent.google.com/download?id=1QBferXZp7sDkNDGQIVqrQgjkl41mNKaW&export=view&authuser=0',
}

function getCategoryCover(categoryId) {
  return defaultCategoryCovers[categoryId] || '/Images/logo.png'
}

export const DEFAULT_CATEGORIES = siteData.categories.map((category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug || `/${category.id}`,
  headline: category.headline || category.name,
  description: category.description || '',
  image: category.image || getCategoryCover(category.id),
}))

export function useCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  useEffect(() => {
    let unsubscribe
    let active = true
    let timer

    const subscribe = () => {
      Promise.all([
        import('firebase/firestore'),
        import('../firebase'),
      ]).then(([{ collection, onSnapshot }, { db }]) => {
        if (!active) return
        unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
          const merged = new Map(DEFAULT_CATEGORIES.map((category) => [category.id, category]))
          snapshot.docs.forEach((item) => {
            const category = item.data()
            if (category?.id && !category.deleted) {
              merged.set(category.id, { ...merged.get(category.id), ...category })
            }
          })
          setCategories([...merged.values()].sort((a, b) => a.name.localeCompare(b.name)))
        }, () => setCategories(DEFAULT_CATEGORIES))
      }).catch(() => setCategories(DEFAULT_CATEGORIES))
    }

    if ('requestIdleCallback' in window) {
      timer = window.requestIdleCallback(subscribe, { timeout: 3000 })
    } else {
      timer = window.setTimeout(subscribe, 1500)
    }

    return () => {
      active = false
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(timer)
      else window.clearTimeout(timer)
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return categories
}

export function getDefaultCategoryName(categoryId) {
  return DEFAULT_CATEGORIES.find((category) => category.id === categoryId)?.name || categoryId
}
