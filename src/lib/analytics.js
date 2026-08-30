// Google Analytics (GA4) Tracker Helper
// Automatically dispatches events to window.gtag if initialized

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-KC9YVM7JDR'

/**
 * Initialize Google Analytics dynamically
 */
export function initGA() {
  if (typeof window === 'undefined') return

  if (!window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true
    })
  }
}

/**
 * Track Page Views
 * @param {string} path - URL path (e.g. /courses, /pricing)
 * @param {string} title - Page title
 */
export function trackPageView(path, title) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path || window.location.pathname,
      page_title: title || document.title,
      page_location: window.location.href
    })
  }
}

/**
 * Track Custom Ecommerce / Action Events
 * @param {string} eventName - e.g. 'view_item', 'begin_checkout', 'purchase'
 * @param {object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

/**
 * Track Course or Product View
 */
export function trackProductView(product) {
  if (!product) return
  trackEvent('view_item', {
    currency: 'NGN',
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.type || 'course',
        price: product.price || 0
      }
    ]
  })
}

/**
 * Track Checkout Initiation
 */
export function trackBeginCheckout(product) {
  if (!product) return
  trackEvent('begin_checkout', {
    currency: 'NGN',
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.type || 'course',
        price: product.price || 0
      }
    ]
  })
}

/**
 * Track Successful Purchase
 */
export function trackPurchase(order, product) {
  if (!order) return
  trackEvent('purchase', {
    transaction_id: order.reference || order.id,
    value: order.amount || product?.price || 0,
    currency: 'NGN',
    items: [
      {
        item_id: product?.id || order.product_id,
        item_name: product?.title || 'Donzen Accounting Resource',
        item_category: product?.type || 'course',
        price: order.amount || product?.price || 0
      }
    ]
  })
}
