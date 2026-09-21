/**
 * Helper to determine if a product belongs to the Donzen Accounting Experience Program
 * sales page (/30-days-accounting), which includes:
 * 1. DONZEN ACCOUNTING EXPERIENCE PROGRAM (Plan 01 - Foundation)
 * 2. PROFESSIONAL (Plan 02 - Advanced)
 * 3. COMPLETE EXPERIENCE (Plan 03 - Premium)
 */

export const EXPERIENCE_SALES_PAGE_ROUTE = '/30-days-accounting'

export const EXPERIENCE_PRODUCT_IDS = [
  '60fc92d6-7bdc-42b7-b216-d95fcde36636', // DONZEN ACCOUNTING EXPERIENCE PROGRAM (NEXT BATCH 01NOV2026 )
  'b34f145f-d77f-47ba-aa31-6289ff6298da', // PROFESSIONAL
  '95f930bb-d040-41e4-bba9-4aa9aa7433f3', // COMPLETE EXPERIENCE
]

export function isSalesPageProduct(product) {
  if (!product) return false

  const id = typeof product === 'string'
    ? product.toLowerCase().trim()
    : String(product.id || '').toLowerCase().trim()

  if (EXPERIENCE_PRODUCT_IDS.includes(id)) return true

  if (typeof product === 'object') {
    const title = String(product.title || '').trim().toUpperCase()
    const slug = String(product.slug || '').trim().toLowerCase()

    if (
      title === 'PROFESSIONAL' ||
      title === 'COMPLETE EXPERIENCE' ||
      title.includes('DONZEN ACCOUNTING EXPERIENCE PROGRAM') ||
      title.includes('ACCOUNTING EXPERIENCE PROGRAM') ||
      title.includes('30-DAY WORKPLACE ACCOUNTING')
    ) {
      return true
    }

    if (
      slug === 'professional' ||
      slug === 'complete-experience' ||
      slug === '30-days-accounting' ||
      slug === 'accounting-experience-programme' ||
      slug.includes('donzen-accounting-experience')
    ) {
      return true
    }
  } else if (typeof product === 'string') {
    const lower = product.toLowerCase().trim()
    if (
      lower === 'professional' ||
      lower === 'complete-experience' ||
      lower === '30-days-accounting' ||
      lower === 'accounting-experience-programme' ||
      lower.includes('donzen-accounting-experience')
    ) {
      return true
    }
  }

  return false
}

export function getProductPath(product) {
  if (!product) return '/products'
  if (isSalesPageProduct(product)) {
    return EXPERIENCE_SALES_PAGE_ROUTE
  }
  return `/product/${product.slug || product.id}`
}
