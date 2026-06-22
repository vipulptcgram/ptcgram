import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(root, 'src', 'data', 'productdetail.json')

const rows = [
  ['SLES 28% (Godrej Made)', 'Sodium Lauryl Ether Sulfate', 'Detergents, Shampoos, Cleansers', 'Variable ethoxylate mixture', 'Industrial Chemicals'],
  ['SLES 70% (Godrej Made)', 'Sodium Lauryl Ether Sulfate', 'Detergents, Shampoos, Cleansers', 'Variable ethoxylate mixture', 'Industrial Chemicals'],
  ['SLS Powder', 'Sodium Lauryl Sulfate', 'Detergents, Toothpaste, Soaps', 'C12H25NaO4S', 'Industrial Chemicals'],
  ['Acid Slurry 90% (Grade A)', 'Linear Alkylbenzene Sulfonic Acid (LABSA)', 'Detergent Manufacturing', 'Mixture', 'Acids'],
  ['Acid Slurry 96% (Grade A)', 'Linear Alkylbenzene Sulfonic Acid (LABSA)', 'Detergent Manufacturing', 'Mixture', 'Acids'],
  ['Acid Thickener (IGL Grade)', 'Acid Thickener', 'Industrial Applications', 'Proprietary mixture', 'Acids'],
  ['Acid Thickener (Regular Grade)', 'Acid Thickener', 'Industrial Applications', 'Proprietary mixture', 'Acids'],
  ['Caustic Soda Flakes', 'Sodium Hydroxide', 'Chemical Manufacturing, Cleaning', 'NaOH', 'Industrial Chemicals'],
  ['Caustic Soda Prills', 'Sodium Hydroxide', 'Chemical Manufacturing, Cleaning', 'NaOH', 'Industrial Chemicals'],
  ['Hydrogen Peroxide', 'Hydrogen Peroxide', 'Bleaching, Disinfection, Cleaning', 'H2O2', 'Industrial Chemicals'],
  ['AOS Powder Godrej', 'Alpha Olefin Sulfonate', 'Detergents, Shampoos', 'Mixture', 'Industrial Chemicals'],
  ['AOS 38%', 'Alpha Olefin Sulfonate', 'Detergents, Shampoos', 'Mixture', 'Industrial Chemicals'],
  ['DHM Tops', 'Dihydromyrcenol Tops', 'Cleaners', 'C10H22O', 'Industrial Chemicals'],
  ['Pine Oil 22%', 'Pine Oil', 'Disinfectants, Cleaners', 'Mixture', 'Industrial Chemicals'],
  ['Pine Oil 32%', 'Pine Oil', 'Disinfectants, Cleaners', 'Mixture', 'Industrial Chemicals'],
  ['Phenyl Grade Pine Oil', 'Pine Oil', 'Phenyl Manufacturing', 'Mixture', 'Industrial Chemicals'],
  ['Dipentene', 'Dipentene', 'Solvents, Fragrances', 'C10H16', 'Solvents'],
  ['Turpentine Oil', 'Turpentine', 'Solvents, Paints', 'Mixture', 'Solvents'],
  ['Anthamber Tops', 'Anthember Tops', 'Cleaners', 'Proprietary mixture', 'Industrial Chemicals'],
  ['Citronella Tops', 'Citronella Tops', 'Cleaners', 'Mixture', 'Industrial Chemicals'],
  ['Castor Oil (Commercial Grade and BSS Grade)', 'Ricinus Communis Oil', 'Cosmetics, Lubricants, Pharmaceuticals', 'Mixture', 'Industrial Chemicals'],
  ['Soda Ash', 'Sodium Carbonate', 'Glass Manufacturing, Detergents', 'Na2CO3', 'Industrial Chemicals'],
  ['Turkey Red Oil (TRO) 50%', 'Sulfated Castor Oil', 'Textile Industry', 'Mixture', 'Industrial Chemicals'],
  ['Turkey Red Oil (TRO) 70%', 'Sulfated Castor Oil', 'Textile Industry', 'Mixture', 'Industrial Chemicals'],
  ['Alphox 200', 'Ethoxylated Alcohol', 'Emulsifiers, Detergents', 'Mixture', 'Industrial Chemicals'],
  ['DHM Residue', 'Dihydromyrcenol Residue', 'Disinfectant Formulations', 'Mixture', 'Industrial Chemicals'],
  ['Transparent Soap Flakes (Glycerine)', 'Glycerine Soap Base', 'Pharmaceuticals, Personal Care, Soap Manufacturing', 'Mixture', 'Industrial Chemicals'],
  ['M.E.G. (Mono Ethylene Glycol)', 'Monoethylene Glycol', 'Solvents, Antifreeze', 'C2H6O2', 'Solvents'],
  ['D.E.P. (Diethyl Phthalate)', 'Diethyl Phthalate', 'Plastic Manufacturing, Cosmetics', 'C12H14O4', 'Solvents'],
  ['Technical Grade Urea', 'Urea', 'Fertilizers', 'CH4N2O', 'Industrial Chemicals'],
  ['Sulphuric Acid', 'Sulfuric Acid', 'Chemical Manufacturing, Cleaning', 'H2SO4', 'Acids'],
  ['Iso Propyl Alcohol (I.P.A.)', 'Isopropyl Alcohol', 'Solvents, Disinfectants', 'C3H8O', 'Solvents'],
  ['Glacial Acetic Acid', 'Acetic Acid', 'Chemical Manufacturing, Food Processing', 'C2H4O2', 'Acids'],
  ['T.E.A. (Triethanolamine)', 'Triethanolamine', 'Cosmetics, Pharmaceuticals', 'C6H15NO3', 'Industrial Chemicals'],
  ['Formic Acid 85% (GNFC)', 'Formic Acid', 'Textile, Leather, Rubber', 'CH2O2', 'Acids'],
  ['Phosphoric Acid', 'Phosphoric Acid', 'Fertilizers, Food Processing', 'H3PO4', 'Acids'],
  ['Boric Acid 99.50%', 'Boric Acid', 'Antiseptics, Insecticides', 'H3BO3', 'Acids'],
  ['Carbopol Powder 940', 'Carbomer', 'Cosmetics, Pharmaceuticals', 'Polymer', 'Industrial Chemicals'],
  ['Carbopol Ultrez 20', 'Carbomer', 'Cosmetics, Pharmaceuticals', 'Polymer', 'Industrial Chemicals'],
  ['Carbopol 996', 'Carbomer', 'Food, Pharmaceuticals', 'Polymer', 'Industrial Chemicals'],
  ['Guar Gum Powder', 'Guar Gum', 'Food, Pharmaceuticals', 'Polysaccharide', 'Industrial Chemicals'],
  ['Xanthan Gum', 'Xanthan Gum', 'Food, Cosmetics', 'Polysaccharide', 'Industrial Chemicals'],
  ['Citrolex Powder', 'Citrolex', 'Food, Cosmetics', 'Proprietary mixture', 'Industrial Chemicals'],
  ['Sodium Metasilicate', 'Sodium Metasilicate', 'Cleaning, Corrosion Inhibition', 'Na2SiO3', 'Industrial Chemicals'],
  ['Phenyl Thickener', 'Phenyl Thickener', 'Phenyl and Cleaner Formulations', 'Proprietary mixture', 'Industrial Chemicals'],
  ['CDEA Celestial', 'Cocamide DEA', 'Personal Care Products', 'Mixture', 'Industrial Chemicals'],
  ['TSP (Trisodium Phosphate)', 'Trisodium Phosphate', 'Cleaning, Stain Removal', 'Na3PO4', 'Industrial Chemicals'],
  ['STPP', 'Sodium Tripolyphosphate', 'Cleaning, Water Softening', 'Na5P3O10', 'Industrial Chemicals'],
  ['Liquid Emulsifying Thickener', 'Liquid Emulsifying Thickener', 'Cleaner and Emulsion Formulations', 'Proprietary mixture', 'Industrial Chemicals'],
  ['B.K.C. 50%', 'Benzalkonium Chloride', 'Disinfectants, Cleaners', 'Mixture', 'Industrial Chemicals'],
  ['Hydrochloric Acid (HCl)', 'Hydrochloric Acid', 'Chemical Manufacturing, Cleaning', 'HCl', 'Acids'],
  ['Bleaching Powder', 'Calcium Hypochlorite', 'Bleaching, Disinfection', 'Ca(ClO)2', 'Industrial Chemicals'],
  ['Alum Powder', 'Aluminum Sulfate', 'Water Treatment, Papermaking', 'Al2(SO4)3', 'Industrial Chemicals'],
  ['Sodium Hypochlorite', 'Sodium Hypochlorite', 'Bleaching, Disinfection', 'NaClO', 'Industrial Chemicals'],
  ['CMEA Celestial', 'Cocamide MEA', 'Shampoos, Bath Products', 'Mixture', 'Industrial Chemicals'],
  ['EGMS Celestial', 'Ethylene Glycol Monostearate', 'Cosmetics, Pharmaceuticals', 'C20H40O3', 'Industrial Chemicals'],
  ['CAPB Celestial', 'Cocamidopropyl Betaine', 'Personal Care Products', 'Mixture', 'Industrial Chemicals'],
  ['CDMA Celestial', 'Cocamide DEA', 'Personal Care Products', 'Mixture', 'Industrial Chemicals'],
  ['Sodium Acetate', 'Sodium Acetate', 'Textile, Pharmaceuticals', 'C2H3NaO2', 'Industrial Chemicals'],
  ['Citric Acid Powder (Mono/Anhydrous)', 'Citric Acid', 'Food, Cosmetics, Cleaning', 'C6H8O7', 'Acids'],
  ['Acetic Acid', 'Acetic Acid', 'Food, Chemical Manufacturing', 'C2H4O2', 'Acids'],
  ['Silicone Defoamer', 'Silicone Compound', 'Industrial Applications', 'Proprietary mixture', 'Industrial Chemicals'],
  ['Emulsifier Wax', 'Emulsifying Wax', 'Cosmetics, Pharmaceuticals', 'Mixture', 'Industrial Chemicals'],
  ['EDTA Disodium', 'Ethylenediaminetetraacetic Acid Disodium Salt', 'Metal Treatment, Pharmaceuticals', 'C10H14N2Na2O8', 'Industrial Chemicals'],
  ['EDTA Tetrasodium', 'Ethylenediaminetetraacetic Acid Tetrasodium Salt', 'Metal Treatment, Pharmaceuticals', 'C10H12N2Na4O8', 'Industrial Chemicals'],
  ['Sodium Tripolyphosphate (STPP)', 'Sodium Tripolyphosphate', 'Cleaning, Water Softening', 'Na5P3O10', 'Industrial Chemicals'],
  ['CBS-X Optical Brightener', 'Fluorescent Whitening Agent', 'Textile, Papermaking', 'C28H20Na2O6S2', 'Industrial Chemicals'],
  ['Borax', 'Sodium Borate', 'Cleaning, Insecticide, Flame Retardant', 'Na2B4O7.10H2O', 'Industrial Chemicals'],
  ['Pearl Powder', 'Pearlizing Agent', 'Cleaners and Personal Care Products', 'Mixture', 'Industrial Chemicals'],
  ['Formaldehyde 37% (Formalin)', 'Formaldehyde', 'Disinfectants, Preservatives', 'CH2O', 'Industrial Chemicals'],
  ['Light Liquid Paraffin (LLP)', 'Mineral Oil', 'Cosmetics, Pharmaceuticals', 'Mixture', 'Industrial Chemicals'],
  ['Heavy Liquid Paraffin (HLP)', 'Mineral Oil', 'Cosmetics, Pharmaceuticals', 'Mixture', 'Industrial Chemicals'],
  ['Fully Refined Paraffin Wax', 'Paraffin Wax', 'Candles, Cosmetics, Food Coatings', 'Mixture', 'Industrial Chemicals'],
  ['Semi Refined Paraffin Wax', 'Paraffin Wax', 'Industrial Applications', 'Mixture', 'Industrial Chemicals'],
  ['Emulsifying Wax Cosmetic Grade', 'Emulsifying Wax', 'Cosmetics', 'Mixture', 'Industrial Chemicals'],
  ['Vitamin C', 'Ascorbic Acid', 'Dietary Supplement', 'C6H8O6', 'Dietary Supplements'],
  ['Vitamin E (Dry Powder and Liquid)', 'Tocopherol', 'Cosmetics, Dietary Supplement', 'C29H50O2', 'Dietary Supplements'],
  ['Vitamin E (BASF)', 'Tocopherol', 'Cosmetics, Dietary Supplement', 'C29H50O2', 'Dietary Supplements'],
  ['Vitamin A (Dry Powder)', 'Retinol', 'Dietary Supplement', 'C20H30O', 'Dietary Supplements'],
  ['Vitamin D3 (Feed Grade/Pharma Grade)', 'Cholecalciferol', 'Dietary Supplement', 'C27H44O', 'Dietary Supplements'],
  ['Vitamin B1 (Mono and Hydro)', 'Thiamine', 'Dietary Supplement', 'Varies by salt form', 'Dietary Supplements'],
  ['Vitamin B2 (Feed and Pharma)', 'Riboflavin', 'Dietary Supplement', 'C17H20N4O6', 'Dietary Supplements'],
  ['Vitamin B6', 'Pyridoxine', 'Dietary Supplement', 'C8H11NO3', 'Dietary Supplements'],
  ['Vitamin B5 (Inositol)', 'Pantothenic Acid / Inositol Grade', 'Dietary Supplement', 'Varies by grade', 'Dietary Supplements'],
  ['Vitamin K3', 'Menadione', 'Dietary Supplement, Animal Feed', 'C11H8O2', 'Dietary Supplements'],
  ['Vitamin AD3', 'Vitamin A and Vitamin D3 Blend', 'Dietary Supplement, Animal Feed', 'Mixture', 'Dietary Supplements'],
  ['Niacin', 'Nicotinic Acid', 'Dietary Supplement', 'C6H5NO2', 'Dietary Supplements'],
  ['Folic Acid', 'Folic Acid', 'Dietary Supplement', 'C19H19N7O6', 'Dietary Supplements'],
  ['Biotin (Feed and Pharma)', 'Biotin', 'Dietary Supplement', 'C10H16N2O3S', 'Dietary Supplements'],
  ['Vitamin A Palmitate (1.6/1.7)', 'Retinyl Palmitate', 'Dietary Supplement, Food Fortification', 'C36H60O2', 'Dietary Supplements'],
  ['Colistin Sulphate', 'Colistin Sulfate', 'Pharmaceuticals', 'Varies by sulfate salt composition', 'Industrial Chemicals'],
  ['Propylene Glycol', 'Propylene Glycol', 'Cosmetics, Pharmaceuticals', 'C3H8O2', 'Industrial Chemicals'],
  ['Enrofloxacin', 'Enrofloxacin', 'Veterinary Medicine', 'C19H22FN3O3', 'Industrial Chemicals'],
  ['D-Calcium Pantothenate', 'Calcium Pantothenate', 'Dietary Supplement, Animal Feed', 'C18H32CaN2O10', 'Dietary Supplements'],
  ['Dimethylformamide (DMF)', 'Dimethylformamide', 'Chemical Manufacturing, Textiles', 'C3H7NO', 'Solvents'],
  ['Benzene', 'Benzene', 'Chemical Manufacturing', 'C6H6', 'Solvents'],
  ['Soya Fatty Acid', 'Soybean Oil Fatty Acids', 'Industrial Applications', 'Mixture', 'Industrial Chemicals'],
  ['Ethyl Acetate', 'Ethyl Acetate', 'Solvents, Flavoring', 'C4H8O2', 'Solvents'],
  ['Formic Acid', 'Formic Acid', 'Textile, Leather', 'CH2O2', 'Acids'],
  ['Methanol Solvent', 'Methanol', 'Solvents, Fuel', 'CH4O', 'Solvents'],
  ['Normal Butyl Alcohol (n-Butanol)', 'n-Butanol', 'Solvents, Chemical Manufacturing', 'C4H10O', 'Solvents'],
  ['Iso Butyl Alcohol (Isobutanol)', 'Isobutanol', 'Solvents, Chemical Manufacturing', 'C4H10O', 'Solvents'],
  ['Phenol 90 and 100', 'Phenol', 'Chemical Manufacturing, Disinfectants', 'C6H6O', 'Industrial Chemicals'],
  ['Fatty Acid', 'Fatty Acid Blend', 'Industrial Applications', 'Mixture', 'Industrial Chemicals'],
  ['Stearic Acid', 'Stearic Acid', 'Cosmetics, Candle Making, Plastics', 'C18H36O2', 'Acids'],
  ['Thinners', 'Solvent Thinner Blend', 'Paints, Cleaning', 'Mixture', 'Solvents'],
  ['Phosphoric Acid (Food and Technical Grade)', 'Phosphoric Acid', 'Food, Chemical Manufacturing', 'H3PO4', 'Acids'],
  ['P.E.G.', 'Polyethylene Glycol', 'Cosmetics, Pharmaceuticals', 'Polymer', 'Industrial Chemicals'],
  ['P.G.', 'Propylene Glycol', 'Cosmetics, Pharmaceuticals', 'C3H8O2', 'Industrial Chemicals'],
  ['D.P.G.', 'Dipropylene Glycol', 'Chemical Manufacturing', 'C6H14O3', 'Solvents'],
  ['PVA (Polyvinyl Alcohol) All Grades', 'Polyvinyl Alcohol', 'Adhesives, Coatings, Textiles', '(C2H4O)n', 'Industrial Chemicals'],
  ['Neutral Alcohol', 'Neutral Ethyl Alcohol', 'Solvents, Fragrances, Cleaning', 'C2H6O', 'Solvents'],
  ['White Spirit', 'Mineral Spirits', 'Paints, Coatings, Cleaning', 'Mixture', 'Solvents'],
]

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))

// Re-running this script is deterministic: remove only records previously generated by it.
for (const category of Object.keys(catalog)) {
  catalog[category] = catalog[category].filter((product) => Number(product.id) < 3000)
}

function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/sulph/g, 'sulf')
    .replace(/xanthum/g, 'xanthan')
    .replace(/hypochloride/g, 'hypochlorite')
    .replace(/thickner/g, 'thickener')
    .replace(/monoethylene/g, 'mono ethylene')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

const seenOriginalNames = new Set()
for (const category of Object.keys(catalog)) {
  catalog[category] = catalog[category].filter((product) => {
    const key = normalize(product.name)
    if (seenOriginalNames.has(key)) return false
    seenOriginalNames.add(key)
    return true
  })
}

function identity(name, scientificName) {
  const combined = `${normalize(name)} | ${normalize(scientificName)}`
  const form = combined.match(/\b(22|28|32|37|38|50|70|85|90|99 50)\b/)?.[1] || ''

  const aliases = [
    ['ethylenediaminetetraacetic acid disodium', 'edta disodium'],
    ['edta disodium', 'edta disodium'],
    ['ethylenediaminetetraacetic acid tetrasodium', 'edta tetrasodium'],
    ['edta tetrasodium', 'edta tetrasodium'],
    ['dipropylene glycol', 'dipropylene glycol'],
    ['d p g', 'dipropylene glycol'],
    ['dihydromyrcenol tops', 'dhm tops'],
    ['dhm tops', 'dhm tops'],
    ['turpentine', 'turpentine oil'],
    ['sulfated castor oil', 'turkey red oil'],
    ['turkey red oil', 'turkey red oil'],
    ['castor oil', 'castor oil'],
    ['sodium carbonate', 'soda ash'],
    ['soda ash', 'soda ash'],
    ['cocamide dea', 'cocamide dea'],
    ['tocopherol', 'vitamin e'],
    ['carbopol powder 940', 'carbopol 940'],
    ['carbopol 940', 'carbopol 940'],
    ['aluminum sulfate', 'alum powder'],
    ['potassium aluminum sulfate', 'alum powder'],
    ['alum powder', 'alum powder'],
    ['emulsifier wax', 'emulsifying wax'],
    ['emulsifying wax', 'emulsifying wax'],
    ['diethyl phthalate', 'diethyl phthalate'],
    ['linear alkylbenzene sulfonic acid', 'labsa'],
    ['acid slurry', 'labsa'],
    ['sodium lauryl ether sulfate', `sles ${form}`],
    ['alpha olefin sulfonate', `aos ${form || (combined.includes('powder') ? 'powder' : '')}`],
    ['sodium tripolyphosphate', 'stpp'],
    ['isopropyl alcohol', 'isopropyl alcohol'],
    ['iso propyl alcohol', 'isopropyl alcohol'],
    ['sulfuric acid', 'sulfuric acid'],
    ['acetic acid', combined.includes('glacial') ? 'glacial acetic acid' : 'acetic acid'],
    ['phosphoric acid', combined.includes('food') ? 'phosphoric acid food technical' : 'phosphoric acid'],
    ['formic acid', 'formic acid'],
    ['hydrochloric acid', 'hydrochloric acid'],
    ['sodium hypochlorite', 'sodium hypochlorite'],
    ['calcium hypochlorite', 'bleaching powder'],
    ['propylene glycol', 'propylene glycol'],
    ['ethyl acetate', 'ethyl acetate'],
    ['benzene', 'benzene'],
    ['methanol', 'methanol'],
    ['xanthan gum', 'xanthan gum'],
    ['guar gum', 'guar gum'],
    ['carbomer', combined.includes('ultrez') ? 'carbopol ultrez 20' : combined.includes('996') ? 'carbopol 996' : 'carbopol 940'],
    ['cocamidopropyl betaine', 'capb'],
    ['pine oil', `pine oil ${form || (combined.includes('phenyl grade') ? 'phenyl grade' : '')}`],
    ['paraffin wax', combined.includes('fully') ? 'fully refined paraffin wax' : combined.includes('semi') ? 'semi refined paraffin wax' : 'paraffin wax'],
    ['mineral oil', combined.includes('heavy') ? 'heavy liquid paraffin' : 'light liquid paraffin'],
  ]

  for (const [needle, key] of aliases) {
    if (combined.includes(needle)) return key.trim()
  }

  return normalize(name)
    .replace(/\b(godrej made|godrej|celestial|gnfc|basf)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function makeDescription(name, scientificName, usage) {
  const applications = usage.split(',').map((item) => item.trim()).filter(Boolean)
  return `${name} is supplied as ${scientificName} for commercial and industrial requirements. It is commonly selected for ${applications.join(', ').toLowerCase()} applications. Product grade, concentration, packaging, and handling requirements should be confirmed for the intended process.\n\nApplications\n${applications.map((item) => `- ${item}`).join('\n')}`
}

function makeProduct(id, [name, scientificName, usage, formula]) {
  return {
    id,
    name,
    in_stock: true,
    short_description: makeDescription(name, scientificName, usage),
    image: ['PRODUCT_IMAGE_URL'],
    attributes: {
      'Chemical Name': name,
      'Scientific Name': scientificName,
      'Chemical Formula': formula,
      'Applications / Usage': usage,
      Grade: 'Commercial / Industrial Grade',
      Packaging: 'Contact PTCGRAM for available pack sizes',
      Storage: 'Store according to the product safety data sheet in a cool, dry, well-ventilated area.',
    },
  }
}

const existingIdentities = new Set()
const existingExactNames = new Set()
const usedIds = new Set()

for (const products of Object.values(catalog)) {
  for (const product of products) {
    existingIdentities.add(identity(product.name, product.attributes?.['Scientific Name'] || product.attributes?.['Chemical Name'] || ''))
    existingExactNames.add(normalize(product.name))
    usedIds.add(Number(product.id))
  }
}

const sourceIdentities = new Set()
const added = []
const skipped = []
let nextId = Math.max(...usedIds, 2999) + 1

for (const row of rows) {
  const [name, scientificName, , , category] = row
  const key = identity(name, scientificName)
  const exactName = normalize(name)

  if (existingIdentities.has(key) || existingExactNames.has(exactName) || sourceIdentities.has(key)) {
    skipped.push(`${name} -> ${key}`)
    continue
  }

  while (usedIds.has(nextId)) nextId += 1
  const product = makeProduct(nextId, row)
  catalog[category].push(product)
  existingIdentities.add(key)
  existingExactNames.add(exactName)
  sourceIdentities.add(key)
  usedIds.add(nextId)
  added.push(`${nextId} ${name} -> ${category}`)
  nextId += 1
}

for (const products of Object.values(catalog)) {
  products.sort((a, b) => Number(a.id) - Number(b.id))
}

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`)

console.log(`Added ${added.length} products:`)
for (const item of added) console.log(`  + ${item}`)
console.log(`\nSkipped ${skipped.length} existing/duplicate rows:`)
for (const item of skipped) console.log(`  - ${item}`)
