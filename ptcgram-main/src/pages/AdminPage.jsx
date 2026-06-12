import { useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { FaArrowRightFromBracket, FaBoxOpen, FaDownload, FaEnvelope, FaFileCsv, FaFloppyDisk, FaGlobe, FaImage, FaLayerGroup, FaPlus, FaRotate, FaTrash } from 'react-icons/fa6'
import { auth, db, storage } from '../firebase'
import productData from '../data/productdetail.json'
import { CATEGORY_MAP } from '../hooks/useCatalogProducts'
import { DEFAULT_CATEGORIES, useCategories } from '../hooks/useCategories'
import { getDisplayImageUrl, hasUsableProductImage } from '../utils/productImage'

const EMPTY_PRODUCT = {
  id: '',
  name: '',
  in_stock: true,
  short_description: '',
  image: [],
  attributes: {},
}

const categoryEntries = Object.entries(CATEGORY_MAP)

function slugifyCategory(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function parseCsv(text = '') {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    const next = text[index + 1]

    if (character === '"') {
      if (quoted && next === '"') {
        field += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === ',' && !quoted) {
      row.push(field)
      field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1
      row.push(field)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }

  row.push(field)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

function normalizeCsvHeader(value = '') {
  return String(value).replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function splitImageUrls(value = '') {
  return String(value)
    .split(/\r?\n|\s*\|\s*|\s*;\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function csvValue(record, ...keys) {
  for (const key of keys) {
    const value = record[normalizeCsvHeader(key)]
    if (value !== undefined && String(value).trim() !== '') return String(value).trim()
  }
  return ''
}

function productDocumentId(categoryId, productId) {
  return `${categoryId}_${productId}`
}

function normalizedProductName(name = '') {
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

function normalizeProduct(product) {
  return {
    ...EMPTY_PRODUCT,
    ...product,
    id: Number(product.id),
    image: Array.isArray(product.image) ? product.image : product.image ? [product.image] : [],
    attributes: product.attributes || {},
  }
}

function AdminLogin({ onMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setBusy(true)
    onMessage('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (error) {
      onMessage(error.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="bg-navy-900 px-7 py-7 border-b-4 border-amber-500">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400">PTCGRAM</p>
          <h1 className="font-serif text-3xl text-white mt-2">Admin Panel</h1>
          <p className="text-sm text-white/50 mt-2">Sign in with an approved administrator account.</p>
        </div>
        <form onSubmit={handleLogin} className="p-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-amber-500 px-5 py-3.5 text-sm font-bold text-white hover:bg-amber-400 disabled:opacity-60 transition-colors"
          >
            {busy ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}

function ProductEditor({ categoryId, product, onClose, onSaved }) {
  const categories = useCategories()
  const categoryName = categories.find((category) => category.id === categoryId)?.name || CATEGORY_MAP[categoryId] || categoryId
  const [draft, setDraft] = useState(normalizeProduct(product))
  const [attributesText, setAttributesText] = useState(JSON.stringify(product.attributes || {}, null, 2))
  const [imagesText, setImagesText] = useState((product.image || []).join('\n'))
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function currentImages() {
    return imagesText.split('\n').map((item) => item.trim()).filter(Boolean)
  }

  async function handleGallerySelection(event) {
    const files = [...(event.target.files || [])]
    event.target.value = ''
    if (files.length === 0) return

    const invalidFile = files.find((file) => !file.type.startsWith('image/') || file.size > 8 * 1024 * 1024)
    if (invalidFile) {
      setError('Choose image files smaller than 8 MB each.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const productId = Number(draft.id) || 'new'
      const uploadedUrls = []

      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')
        const fileRef = ref(
          storage,
          `product-images/${auth.currentUser.uid}/${categoryId}/${productId}/${Date.now()}-${safeName}`
        )
        await uploadBytes(fileRef, file, { contentType: file.type })
        uploadedUrls.push(await getDownloadURL(fileRef))
      }

      setImagesText([...currentImages(), ...uploadedUrls].join('\n'))
    } catch (uploadError) {
      setError(uploadError.code === 'storage/unauthorized'
        ? 'Image upload is not authorized. Deploy the Firebase Storage rules.'
        : uploadError.message)
    } finally {
      setUploading(false)
    }
  }

  function removeImage(imageUrl) {
    setImagesText(currentImages().filter((item) => item !== imageUrl).join('\n'))
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')

    let attributes
    try {
      attributes = JSON.parse(attributesText || '{}')
    } catch {
      setError('Attributes must be valid JSON.')
      return
    }

    const id = Number(draft.id)
    if (!Number.isInteger(id) || id <= 0 || !draft.name.trim()) {
      setError('A valid numeric ID and product name are required.')
      return
    }

    setBusy(true)
    try {
      const savedProduct = {
        ...draft,
        id,
        name: draft.name.trim(),
        image: imagesText.split('\n').map((item) => item.trim()).filter(Boolean),
        attributes,
      }

      await setDoc(doc(db, 'products', productDocumentId(categoryId, id)), {
        categoryId,
        product: savedProduct,
        updatedAt: serverTimestamp(),
      })
      onSaved()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-3 sm:p-6 overflow-y-auto">
      <form onSubmit={handleSave} className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-navy-900 px-5 sm:px-7 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-bold tracking-widest uppercase text-amber-400">{categoryName}</p>
            <h2 className="font-serif text-2xl text-white mt-1">{product.id ? 'Edit Product' : 'Add Product'}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Product ID
            <input
              type="number"
              required
              disabled={Boolean(product.id)}
              value={draft.id}
              onChange={(event) => setDraft({ ...draft, id: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal outline-none focus:border-amber-500 disabled:bg-gray-100"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Product Name
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal outline-none focus:border-amber-500"
            />
          </label>
          <label className="sm:col-span-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            Description
            <textarea
              rows="6"
              value={draft.short_description}
              onChange={(event) => setDraft({ ...draft, short_description: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-500"
            />
          </label>
          <label className="sm:col-span-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            Image URLs, one per line
            <textarea
              rows="3"
              value={imagesText}
              onChange={(event) => setImagesText(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-mono font-normal normal-case tracking-normal outline-none focus:border-amber-500"
            />
          </label>
          <div className="sm:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Gallery</p>
                <p className="text-xs text-gray-400 mt-1">Choose one or more images from your phone or computer.</p>
              </div>
              <label className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-navy-900 text-white text-xs font-bold cursor-pointer hover:bg-navy-700 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                <FaImage />
                {uploading ? 'Uploading...' : 'Choose From Gallery'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={handleGallerySelection}
                  className="sr-only"
                />
              </label>
            </div>

            {currentImages().length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {currentImages().map((imageUrl, index) => {
                  const previewUrl = getDisplayImageUrl(imageUrl)
                  return (
                    <div key={`${imageUrl}-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {previewUrl ? (
                        <img src={previewUrl} alt={`Product gallery ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 px-2 text-center">No preview</div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(imageUrl)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <label className="sm:col-span-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            Attributes JSON
            <textarea
              rows="10"
              value={attributesText}
              onChange={(event) => setAttributesText(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-xs font-mono font-normal normal-case tracking-normal outline-none focus:border-amber-500"
            />
          </label>
          <label className="sm:col-span-2 flex items-center gap-3 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={draft.in_stock}
              onChange={(event) => setDraft({ ...draft, in_stock: event.target.checked })}
              className="h-5 w-5 accent-amber-500"
            />
            Product is in stock
          </label>
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-5 sm:px-7 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600">
            Cancel
          </button>
          <button type="submit" disabled={busy || uploading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-400 disabled:opacity-60">
            <FaFloppyDisk /> {busy ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

function CategoryEditor({ onClose, onSaved }) {
  const [name, setName] = useState('')
  const [headline, setHeadline] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function uploadCategoryImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) {
      setError('Choose an image smaller than 8 MB.')
      return
    }
    setUploading(true)
    try {
      const fileRef = ref(storage, `category-images/${auth.currentUser.uid}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`)
      await uploadBytes(fileRef, file, { contentType: file.type })
      setImage(await getDownloadURL(fileRef))
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setUploading(false)
    }
  }

  async function saveCategory(event) {
    event.preventDefault()
    const id = slugifyCategory(name)
    if (!id || !image) {
      setError('Category name and image are required.')
      return
    }
    await setDoc(doc(db, 'categories', id), {
      id,
      name: name.trim(),
      slug: `/${id}`,
      headline: headline.trim() || name.trim(),
      description: description.trim(),
      image,
      updatedAt: serverTimestamp(),
    })
    onSaved(id)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-3 sm:p-6 overflow-y-auto">
      <form onSubmit={saveCategory} className="max-w-xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-navy-900 px-6 py-5 flex justify-between gap-4">
          <div><p className="text-xs text-amber-400 font-bold uppercase tracking-widest">Categories</p><h2 className="font-serif text-2xl text-white">Add Category</h2></div>
          <button type="button" onClick={onClose} className="text-2xl text-white/60 hover:text-white">×</button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category Name
            <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-500" />
          </label>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Page Headline
            <input value={headline} onChange={(event) => setHeadline(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-500" />
          </label>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description
            <textarea rows="4" value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-500" />
          </label>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Category Image</p>
            <label className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white rounded-lg text-xs font-bold cursor-pointer">
              <FaImage /> {uploading ? 'Uploading...' : 'Choose Image'}
              <input type="file" accept="image/*" onChange={uploadCategoryImage} className="sr-only" disabled={uploading} />
            </label>
            {image && <img src={image} alt="Category preview" className="mt-3 w-full h-40 object-cover rounded-xl border border-gray-200" />}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="p-5 bg-gray-50 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-lg text-sm font-semibold">Cancel</button>
          <button type="submit" disabled={uploading} className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-bold disabled:opacity-60">Save Category</button>
        </div>
      </form>
    </div>
  )
}

export default function AdminPage() {
  const categories = useCategories()
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [message, setMessage] = useState('')
  const [categoryId, setCategoryId] = useState('solvents')
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [imageFilter, setImageFilter] = useState('all')
  const [editorProduct, setEditorProduct] = useState(null)
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setChecking(true)
    setUser(nextUser)
    setAuthorized(false)

    if (nextUser) {
      try {
        const adminRecord = await getDoc(doc(db, 'users', nextUser.uid))
        setAuthorized(adminRecord.exists() && adminRecord.data().role === 'admin')
      } catch {
        setMessage('Unable to verify admin access. Check Firestore rules.')
      }
    }
    setChecking(false)
  }), [])

  useEffect(() => {
    if (!authorized) return undefined
    return onSnapshot(collection(db, 'products'), (snapshot) => {
      const managed = snapshot.docs
        .map((item) => item.data())
        .filter((item) => item.product && !item.deleted)
      setProducts(managed)
    }, (error) => setMessage(error.message))
  }, [authorized])

  const allProducts = useMemo(() => {
    const merged = new Map()
    for (const [id, label] of categoryEntries) {
      for (const product of productData[label] || []) {
        merged.set(`${id}:${normalizedProductName(product.name)}`, { categoryId: id, product })
      }
    }
    for (const item of products) {
      merged.set(`${item.categoryId}:${normalizedProductName(item.product.name)}`, item)
    }
    return [...merged.values()]
  }, [products])

  const imageCount = allProducts.filter((item) => hasUsableProductImage(item.product.image)).length
  const missingImageCount = allProducts.length - imageCount

  const visibleProducts = useMemo(() => allProducts
    .filter((item) => item.categoryId === categoryId)
    .map((item) => item.product)
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    .filter((product) => imageFilter === 'all'
      || (imageFilter === 'with' && hasUsableProductImage(product.image))
      || (imageFilter === 'without' && !hasUsableProductImage(product.image)))
    .sort((a, b) => Number(hasUsableProductImage(b.image)) - Number(hasUsableProductImage(a.image)) || Number(a.id) - Number(b.id)),
  [allProducts, categoryId, search, imageFilter])

  async function importCatalog() {
    setBusy(true)
    setMessage('')
    try {
      const currentSnapshot = await getDocs(collection(db, 'products'))
      const existingDocumentIds = new Set(currentSnapshot.docs.map((item) => item.id))
      const existingNames = new Set(
        currentSnapshot.docs
          .map((item) => normalizedProductName(item.data().product?.name))
          .filter(Boolean)
      )
      const batch = writeBatch(db)
      let importedCount = 0
      let skippedCount = 0

      for (const [id, label] of categoryEntries) {
        for (const product of productData[label] || []) {
          const documentId = productDocumentId(id, product.id)
          const productName = normalizedProductName(product.name)

          if (existingDocumentIds.has(documentId) || existingNames.has(productName)) {
            skippedCount += 1
            continue
          }

          batch.set(doc(db, 'products', documentId), {
            categoryId: id,
            product: normalizeProduct(product),
            updatedAt: serverTimestamp(),
          })
          existingDocumentIds.add(documentId)
          existingNames.add(productName)
          importedCount += 1
        }
      }

      if (importedCount > 0) await batch.commit()
      setMessage(`Imported ${importedCount} new products. Skipped ${skippedCount} existing products.`)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  function downloadCsvTemplate() {
    const template = [
      'id,name,category,description,in_stock,image_urls,scientific_name,chemical_formula,usage,grade,packaging,storage,attributes_json',
      '4001,Sample Chemical,Industrial Chemicals,"Sample product description",true,"https://example.com/image-1.jpg|https://example.com/image-2.jpg",Sample Scientific Name,H2O,"Cleaning; Manufacturing",Industrial Grade,25 kg bag,"Store in a cool dry place","{""CAS Number"":""000-00-0""}"',
      '4002,Sample Without Image,acids,"Images are optional",true,,Sample Acid,HX,Industrial use,Commercial Grade,50 kg drum,"Follow the product SDS",{}',
    ].join('\n')
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ptcgram-product-import-template.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function importCsv(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setBusy(true)
    setMessage('')
    try {
      const csvRows = parseCsv(await file.text())
      if (csvRows.length < 2) throw new Error('The CSV file has no product rows.')

      const headers = csvRows[0].map(normalizeCsvHeader)
      if (!headers.includes('name') || !headers.includes('category')) {
        throw new Error('CSV must contain name and category columns.')
      }

      const categoryLookup = new Map()
      categories.forEach((category) => {
        categoryLookup.set(normalizedProductName(category.id), category.id)
        categoryLookup.set(normalizedProductName(category.name), category.id)
      })

      const existingNames = new Set(allProducts.map((item) => normalizedProductName(item.product.name)))
      const existingIds = new Set(allProducts.map((item) => `${item.categoryId}:${Number(item.product.id)}`))
      let nextId = Math.max(0, ...allProducts.map((item) => Number(item.product.id) || 0)) + 1
      const pending = []
      const errors = []
      let skippedCount = 0

      csvRows.slice(1).forEach((values, rowIndex) => {
        const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
        const name = csvValue(record, 'name', 'product name', 'chemical name')
        const categoryValue = csvValue(record, 'category', 'category id', 'category name')
        const resolvedCategoryId = categoryLookup.get(normalizedProductName(categoryValue))

        if (!name || !resolvedCategoryId) {
          errors.push(`Row ${rowIndex + 2}: missing name or unknown category "${categoryValue}".`)
          return
        }

        const nameKey = normalizedProductName(name)
        if (existingNames.has(nameKey)) {
          skippedCount += 1
          return
        }

        let id = Number(csvValue(record, 'id', 'product id'))
        if (!Number.isInteger(id) || id <= 0) {
          while (existingIds.has(`${resolvedCategoryId}:${nextId}`)) nextId += 1
          id = nextId
          nextId += 1
        }

        if (existingIds.has(`${resolvedCategoryId}:${id}`)) {
          skippedCount += 1
          return
        }

        let extraAttributes = {}
        const attributesJson = csvValue(record, 'attributes json', 'attributes')
        if (attributesJson) {
          try {
            extraAttributes = JSON.parse(attributesJson)
          } catch {
            errors.push(`Row ${rowIndex + 2}: attributes_json is not valid JSON.`)
            return
          }
        }

        const scientificName = csvValue(record, 'scientific name', 'scientific_name')
        const formula = csvValue(record, 'chemical formula', 'formula')
        const usage = csvValue(record, 'usage', 'applications', 'applications usage')
        const grade = csvValue(record, 'grade')
        const packaging = csvValue(record, 'packaging')
        const storageText = csvValue(record, 'storage')
        const stockValue = csvValue(record, 'in stock', 'in_stock', 'stock').toLowerCase()
        const product = {
          id,
          name,
          in_stock: !['false', 'no', '0', 'out of stock'].includes(stockValue),
          short_description: csvValue(record, 'description', 'short description', 'short_description'),
          image: splitImageUrls(csvValue(record, 'image urls', 'image_urls', 'images', 'image', 'image url')),
          attributes: {
            ...(scientificName ? { 'Scientific Name': scientificName } : {}),
            ...(formula ? { 'Chemical Formula': formula } : {}),
            ...(usage ? { 'Applications / Usage': usage } : {}),
            ...(grade ? { Grade: grade } : {}),
            ...(packaging ? { Packaging: packaging } : {}),
            ...(storageText ? { Storage: storageText } : {}),
            ...extraAttributes,
          },
        }

        pending.push({ categoryId: resolvedCategoryId, product })
        existingNames.add(nameKey)
        existingIds.add(`${resolvedCategoryId}:${id}`)
      })

      for (let start = 0; start < pending.length; start += 450) {
        const batch = writeBatch(db)
        pending.slice(start, start + 450).forEach(({ categoryId: csvCategoryId, product }) => {
          batch.set(doc(db, 'products', productDocumentId(csvCategoryId, product.id)), {
            categoryId: csvCategoryId,
            product,
            updatedAt: serverTimestamp(),
          })
        })
        await batch.commit()
      }

      const errorSummary = errors.length ? ` ${errors.length} invalid rows were ignored: ${errors.slice(0, 3).join(' ')}` : ''
      setMessage(`CSV imported ${pending.length} products and skipped ${skippedCount} duplicates.${errorSummary}`)
    } catch (error) {
      setMessage(`CSV import failed: ${error.message}`)
    } finally {
      setBusy(false)
    }
  }

  async function toggleStock(product) {
    await setDoc(doc(db, 'products', productDocumentId(categoryId, product.id)), {
      categoryId,
      product: { ...product, in_stock: !product.in_stock },
      updatedAt: serverTimestamp(),
    })
  }

  async function removeProduct(product) {
    if (!window.confirm(`Delete ${product.name}?`)) return
    await setDoc(doc(db, 'products', productDocumentId(categoryId, product.id)), {
      categoryId,
      deleted: true,
      product: {
        id: product.id,
        name: product.name,
      },
      updatedAt: serverTimestamp(),
    })
  }

  if (checking) {
    return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">Checking admin access...</div>
  }

  if (!user) return <AdminLogin onMessage={setMessage} />

  if (!authorized) {
    return (
      <main className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
        <div className="max-w-lg bg-white rounded-2xl p-8 text-center">
          <h1 className="font-serif text-3xl text-navy-900">Access Not Approved</h1>
          <p className="text-sm text-gray-500 mt-3">This account is signed in but does not have an admin record in Firestore.</p>
          <p className="text-xs font-mono text-gray-400 mt-3 break-all">UID: {user.uid}</p>
          {message && <p className="text-sm text-red-600 mt-3">{message}</p>}
          <button onClick={() => signOut(auth)} className="mt-6 px-5 py-2.5 bg-navy-900 text-white rounded-lg text-sm font-bold">Sign Out</button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-navy-950 text-white border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-amber-400">PTCGRAM</p>
            <h1 className="font-serif text-3xl">Catalog Admin</h1>
            <p className="text-xs text-white/45 mt-1">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-xs font-bold hover:border-amber-400">
              <FaGlobe /> View Website
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-xs font-bold hover:border-amber-400">
              <FaEnvelope /> Contact Us
            </a>
            <button onClick={() => setCategoryEditorOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-xs font-bold hover:bg-amber-400">
              <FaLayerGroup /> Add Category
            </button>
            <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 text-xs font-bold hover:bg-white/15 cursor-pointer ${busy ? 'opacity-60 pointer-events-none' : ''}`}>
              <FaFileCsv /> Import CSV
              <input type="file" accept=".csv,text/csv" onChange={importCsv} className="sr-only" disabled={busy} />
            </label>
            <button onClick={downloadCsvTemplate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-xs font-bold hover:border-amber-400">
              <FaDownload /> CSV Template
            </button>
            <button onClick={importCatalog} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 text-xs font-bold hover:bg-white/15 disabled:opacity-60">
              <FaRotate /> {busy ? 'Importing...' : 'Import JSON Catalog'}
            </button>
            <button onClick={() => signOut(auth)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-xs font-bold hover:border-amber-400">
              <FaArrowRightFromBracket /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {message && <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</div>}

        <div className="bg-navy-900 text-white rounded-2xl p-4 sm:p-6 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl">Import Products From CSV</h2>
            <p className="text-xs sm:text-sm text-white/55 mt-2 max-w-2xl">
              The image column is optional. Import products with image URLs or leave it empty for products without images. Multiple images can be separated with a vertical bar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-500 text-xs font-bold cursor-pointer hover:bg-amber-400 ${busy ? 'opacity-60 pointer-events-none' : ''}`}>
              <FaFileCsv /> {busy ? 'Importing...' : 'Choose CSV File'}
              <input type="file" accept=".csv,text/csv" onChange={importCsv} className="sr-only" disabled={busy} />
            </label>
            <button onClick={downloadCsvTemplate} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/20 text-xs font-bold hover:border-amber-400">
              <FaDownload /> Download Template
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
          {[
            ['Total Products', allProducts.length, 'all'],
            ['With Images', imageCount, 'with'],
            ['Missing Images', missingImageCount, 'without'],
            ['Categories', categories.length, null],
          ].map(([label, value, filter]) => (
            <button
              key={label}
              type="button"
              onClick={() => filter && setImageFilter(filter)}
              className={`text-left bg-white border rounded-xl p-4 sm:p-5 shadow-sm transition-colors ${filter && imageFilter === filter ? 'border-amber-500' : 'border-gray-200 hover:border-amber-300'}`}
            >
              <p className="text-[0.62rem] sm:text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
              <p className="font-serif text-2xl sm:text-4xl text-navy-900 mt-2">{value}</p>
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div><h2 className="font-serif text-xl text-navy-900">Categories</h2><p className="text-xs text-gray-400 mt-1">Every category has a visible cover image.</p></div>
            <button onClick={() => setCategoryEditorOpen(true)} className="px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-bold">Add Category</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map((category) => (
              <button key={category.id} onClick={() => setCategoryId(category.id)} className={`overflow-hidden rounded-xl border text-left ${categoryId === category.id ? 'border-amber-500 ring-1 ring-amber-400' : 'border-gray-200'}`}>
                <img src={category.image || '/Images/logo.png'} alt={category.name} className="w-full h-24 object-cover bg-gray-100" />
                <span className="block p-3 text-xs font-bold text-navy-900 truncate">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(({ id, name: label }) => (
                <button
                  key={id}
                  onClick={() => setCategoryId(id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${categoryId === id ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={imageFilter} onChange={(event) => setImageFilter(event.target.value)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500">
                <option value="all">All images</option>
                <option value="with">With images</option>
                <option value="without">Missing images</option>
              </select>
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
              />
              <button
                onClick={() => {
                  const nextId = Math.max(0, ...visibleProducts.map((item) => Number(item.id) || 0)) + 1
                  setEditorProduct({ ...EMPTY_PRODUCT, id: nextId })
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-400"
              >
                <FaPlus /> Add Product
              </button>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="py-20 text-center">
              <FaBoxOpen className="mx-auto text-5xl text-gray-300" />
              <p className="text-gray-500 mt-4">No managed products in this category.</p>
              <p className="text-xs text-gray-400 mt-1">Use “Import JSON Catalog” to load the existing products.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visibleProducts.map((product) => (
                <div key={product.id} className="p-4 sm:px-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50">
                  <div className="w-full md:w-16 h-32 md:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {getDisplayImageUrl(product.image)
                      ? <img src={getDisplayImageUrl(product.image)} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.62rem] font-mono text-gray-400">ID {product.id}</p>
                    <h2 className="font-serif text-lg text-navy-900 truncate">{product.name}</h2>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.short_description}</p>
                  </div>
                  <button
                    onClick={() => toggleStock(product)}
                    className={`px-3 py-2 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider border ${product.in_stock ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}
                  >
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </button>
                  <span className={`px-3 py-2 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider border ${hasUsableProductImage(product.image) ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-orange-700 bg-orange-50 border-orange-200'}`}>
                    {hasUsableProductImage(product.image) ? 'Has Image' : 'No Image'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditorProduct(product)} className="px-4 py-2 rounded-lg bg-navy-900 text-white text-xs font-bold">Edit</button>
                    <button onClick={() => removeProduct(product)} className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {editorProduct && (
        <ProductEditor
          categoryId={categoryId}
          product={editorProduct}
          onClose={() => setEditorProduct(null)}
          onSaved={() => {
            setEditorProduct(null)
            setMessage('Product saved successfully.')
          }}
        />
      )}
      {categoryEditorOpen && (
        <CategoryEditor
          onClose={() => setCategoryEditorOpen(false)}
          onSaved={(id) => {
            setCategoryEditorOpen(false)
            setCategoryId(id)
            setMessage('Category created successfully.')
          }}
        />
      )}
    </main>
  )
}
