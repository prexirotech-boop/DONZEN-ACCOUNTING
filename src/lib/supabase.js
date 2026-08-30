import { createClient } from '@supabase/supabase-js'
import { CONFIG } from './config'

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY)

export function triggerConfirmationEmail(payload) {
  setTimeout(async () => {
    try {
      const url = `${CONFIG.SUPABASE_URL}/functions/v1/send-confirmation`
      const apikey = CONFIG.SUPABASE_KEY
      
      let response = null
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apikey,
            'Authorization': `Bearer ${apikey}`
          },
          body: JSON.stringify({ record: payload })
        })
      } catch (err) {
        console.warn('[Email Confirmation] Ignored network or CORS preflight error:', err?.message || err)
      }

      if (response && response.ok) {
        console.log('[Email Confirmation] Request completed successfully')
      } else if (response) {
        console.warn('[Email Confirmation] Edge function returned status:', response.status)
      }
    } catch (e) {
      console.warn('[Email Confirmation] Failed to trigger email:', e)
    }
  }, 10)
}

// ─── SUPABASE DB HELPERS ──────────────────────────────────────────────────────
//
// WooCommerce-style order lifecycle:
//   pending → paid → (refunded | completed)
//
// STEP 1: createPendingOrder() — called BEFORE Paystack popup opens
// STEP 2: completeOrder()     — called AFTER Paystack onSuccess fires
//
// All DB writes are synchronous (awaited), idempotent (ON CONFLICT DO NOTHING),
// and use real DB data only — no localStorage fallbacks for enrollment.

/**
 * STEP 1 — Pre-create a pending order in the DB.
 *
 * Called as soon as the "Pay Now" button is clicked, before the Paystack
 * popup opens. This gives us a clean audit trail even if the user abandons
 * the payment midway.
 *
 * @returns {{ orderId: string|null, productId: string|null, error: string|null }}
 */
export async function createPendingOrder({
  reference,
  name,
  email,
  phone,
  productId,
  amount,
  affiliateCode,
  affiliateId,
  paymentMethod = 'paystack',
  bankReceiptUrl = null,
  parentReference = null,
  paymentPlanId = null,
  installmentPaid = null,
  totalInstallments = null,
  paymentPlanNextDue = null,
  paymentPlanStatus = null,
}) {
  try {
    const cleanEmail = (email || '').trim().toLowerCase()

    const { data, error } = await supabase
      .from('orders')
      .insert({
        reference,
        customer_email: cleanEmail,
        customer_name: (name || '').trim() || null,
        customer_phone: (phone || '').trim() || null,
        product_id: productId || null,
        amount: amount || 0,
        status: 'pending',
        payment_method: paymentMethod,
        bank_receipt_url: bankReceiptUrl,
        currency: 'NGN',
        affiliate_code: affiliateCode || null,
        affiliate_id: affiliateId || null,
        parent_reference: parentReference || null,
        payment_plan_id: paymentPlanId || null,
        installment_paid: installmentPaid || null,
        total_installments: totalInstallments || null,
        payment_plan_next_due: paymentPlanNextDue || null,
        payment_plan_status: paymentPlanStatus || null,
      })
      .select('id, product_id')
      .single()

    if (error) {
      if (error.code === '23505') {
        console.warn('[createPendingOrder] Duplicate reference — order may already exist:', reference)
        return { orderId: null, productId, error: 'duplicate' }
      }
      console.error('[createPendingOrder] Insert failed:', error)
      return { orderId: null, productId, error: error.message }
    }

    console.log('[createPendingOrder] ✅ Pending order created:', data.id)
    return { orderId: data.id, productId: data.product_id || productId, error: null }
  } catch (err) {
    console.error('[createPendingOrder] Unexpected error:', err)
    return { orderId: null, productId, error: err.message }
  }
}

/**
 * Calculate access start and expiration dates based on batch and duration settings.
 */
export function calculateAccessDurationDates(productOrCourse, overrideStartDate = null) {
  let startsAt = overrideStartDate ? new Date(overrideStartDate) : new Date()
  let isBatch = false

  if (productOrCourse?.batch_enrollment_enabled && productOrCourse?.batch_start_date) {
    const batchStart = new Date(productOrCourse.batch_start_date)
    if (!isNaN(batchStart.getTime())) {
      startsAt = batchStart
      isBatch = true
    }
  }

  let expiresAt = null
  const durationType = productOrCourse?.access_duration_type || 'lifetime'
  let days = 0

  if (durationType === '1_month') days = 30
  else if (durationType === '3_months') days = 90
  else if (durationType === '6_months') days = 180
  else if (durationType === '1_year') days = 365
  else if (durationType === 'custom') days = parseInt(productOrCourse?.access_duration_days) || 0

  if (days > 0) {
    expiresAt = new Date(startsAt.getTime() + days * 24 * 60 * 60 * 1000)
  }

  return {
    access_starts_at: startsAt.toISOString(),
    access_expires_at: expiresAt ? expiresAt.toISOString() : null,
    is_batch: isBatch
  }
}

/**
 * STEP 2 — Complete the order after successful Paystack payment.
 *
 * This function:
 *  1. Updates the order status from "pending" to "paid" for main and bumps
 *  2. Creates the enrollment rows synchronously for single courses and product bundles
 *  3. Computes batch start dates & duration expiration dates
 */
export async function completeOrder({
  reference,
  userId,
  productId,
  productType,
  name,
  email,
  phone,
}) {
  let enrolled = false

  try {
    // Check if there is an installment plan to update
    const { data: orderDetails } = await supabase
      .from('orders')
      .select('payment_plan_id, installment_paid, total_installments, parent_reference')
      .eq('reference', reference)
      .maybeSingle()

    let extraUpdates = {}
    if (orderDetails && orderDetails.payment_plan_id) {
      const isLast = orderDetails.installment_paid === orderDetails.total_installments
      extraUpdates = {
        payment_plan_status: isLast ? 'completed' : 'active'
      }

      // If it is a child payment, also update the parent order status and progress!
      if (orderDetails.parent_reference) {
        await supabase
          .from('orders')
          .update({
            installment_paid: orderDetails.installment_paid,
            payment_plan_status: isLast ? 'completed' : 'active',
            payment_plan_next_due: isLast ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('reference', orderDetails.parent_reference)
      }
    }

    // ── 1. Mark all orders as paid (main and bumps) ───────────────────────────
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ 
        status: 'paid', 
        paid_at: new Date().toISOString(),
        ...extraUpdates
      })
      .or(`reference.eq.${reference},reference.like.${reference}-bump-%`)

    if (updateErr) {
      console.error('[completeOrder] Failed to mark order paid (bulk):', updateErr)
      await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('reference', reference)
    } else {
      console.log('[completeOrder] ✅ Orders marked as paid:', reference)
    }

    // Select updated orders with product details
    const { data: updatedOrders } = await supabase
      .from('orders')
      .select('product_id, products(id, type, batch_enrollment_enabled, batch_start_date, batch_name, access_duration_type, access_duration_days)')
      .or(`reference.eq.${reference},reference.like.${reference}-bump-%`)

    // ── 2. Create enrollments for all courses & bundles in the transaction ────
    if (userId && updatedOrders) {
      for (const ord of updatedOrders) {
        const prod = ord.products
        if (!ord.product_id || !prod) continue

        if (prod.type === 'course') {
          const success = await createEnrollment({
            userId,
            courseId: ord.product_id,
            productMetadata: prod
          })
          if (ord.product_id === productId) enrolled = success
        } else if (prod.type === 'bundle') {
          // Fetch all courses inside this bundle
          const { data: bundleItems } = await supabase
            .from('bundle_items')
            .select('course_id')
            .eq('bundle_id', ord.product_id)
            .order('order_index', { ascending: true })

          if (bundleItems && bundleItems.length > 0) {
            for (const item of bundleItems) {
              const success = await createEnrollment({
                userId,
                courseId: item.course_id,
                bundleId: ord.product_id,
                productMetadata: prod // Pass bundle batch/duration preferences
              })
              if (ord.product_id === productId) enrolled = success
            }
          }
        }
      }
    } else if (productId && userId) {
      if (productType === 'bundle') {
        const { data: bundleItems } = await supabase
          .from('bundle_items')
          .select('course_id')
          .eq('bundle_id', productId)
        if (bundleItems) {
          for (const item of bundleItems) {
            await createEnrollment({ userId, courseId: item.course_id, bundleId: productId })
          }
          enrolled = true
        }
      } else if (productType === 'course') {
        enrolled = await createEnrollment({ userId, courseId: productId })
      }
    }

    return { success: true, enrolled }
  } catch (err) {
    console.error('[completeOrder] Unexpected error:', err)
    return { success: false, enrolled }
  }
}


/**
 * Create an enrollment for a user in a course.
 * Handles scheduled batch start dates, access duration expiration, and bundle tracking.
 * Idempotent — safe to call multiple times; will not create duplicates.
 *
 * @returns {boolean|object}
 */
export async function createEnrollment({
  userId,
  courseId,
  bundleId = null,
  productMetadata = null,
  returnDetail = false
}) {
  if (!userId || !courseId) {
    console.warn('[createEnrollment] Missing userId or courseId', { userId, courseId })
    return returnDetail ? { success: false, created: false } : false
  }

  try {
    // 1. Check if enrollment already exists
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id, access_starts_at, access_expires_at')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existing) {
      console.log('[createEnrollment] ℹ️ Enrollment already exists:', existing.id)
      return returnDetail ? { success: true, created: false } : true
    }

    // 2. Fetch course / product schedule metadata if not passed
    let meta = productMetadata
    if (!meta) {
      const { data: courseInfo } = await supabase
        .from('courses')
        .select('batch_enrollment_enabled, batch_start_date, batch_name, access_duration_type, access_duration_days')
        .eq('id', courseId)
        .maybeSingle()

      const { data: prodInfo } = await supabase
        .from('products')
        .select('batch_enrollment_enabled, batch_start_date, batch_name, access_duration_type, access_duration_days')
        .eq('id', courseId)
        .maybeSingle()

      meta = {
        batch_enrollment_enabled: courseInfo?.batch_enrollment_enabled || prodInfo?.batch_enrollment_enabled || false,
        batch_start_date: courseInfo?.batch_start_date || prodInfo?.batch_start_date || null,
        batch_name: courseInfo?.batch_name || prodInfo?.batch_name || null,
        access_duration_type: courseInfo?.access_duration_type || prodInfo?.access_duration_type || 'lifetime',
        access_duration_days: courseInfo?.access_duration_days || prodInfo?.access_duration_days || null
      }
    }

    // 3. Compute access start & expiration dates
    const { access_starts_at, access_expires_at, is_batch } = calculateAccessDurationDates(meta)

    const insertPayload = {
      user_id: userId,
      course_id: courseId,
      progress: [],
      bundle_id: bundleId,
      access_starts_at: access_starts_at,
      access_expires_at: access_expires_at,
      is_batch: is_batch,
      batch_unlocked_notified: false
    }

    const { error } = await supabase
      .from('enrollments')
      .insert(insertPayload)

    if (error) {
      if (error.code === '23505') {
        console.log('[createEnrollment] ℹ️ Enrollment already exists (concurrent insert)')
        return returnDetail ? { success: true, created: false } : true
      }
      console.error('[createEnrollment] Insert failed:', error)
      return returnDetail ? { success: false, created: false } : false
    }

    console.log('[createEnrollment] ✅ Enrollment created for user', userId, 'course', courseId, { access_starts_at, access_expires_at })
    return returnDetail ? { success: true, created: true } : true
  } catch (err) {
    console.error('[createEnrollment] Unexpected error:', err)
    return returnDetail ? { success: false, created: false } : false
  }
}

/**
 * Recover enrollment for a user based on their paid orders.
 * Supports both standalone courses and bundled products.
 *
 * @returns {boolean} true if any enrollment was recovered
 */
export async function recoverEnrollmentFromOrders(userId, userEmail) {
  if (!userId || !userEmail) return false

  try {
    // Find all paid course & bundle orders for this email
    const { data: orders } = await supabase
      .from('orders')
      .select('product_id, products!inner(id, type, batch_enrollment_enabled, batch_start_date, access_duration_type, access_duration_days)')
      .eq('customer_email', userEmail.toLowerCase())
      .eq('status', 'paid')

    if (!orders || orders.length === 0) return false

    // Fetch existing enrollments for this user
    const { data: existingEnrs } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', userId)

    const existingCourseIds = (existingEnrs || []).map(e => e.course_id)
    let recovered = false

    for (const order of orders) {
      if (!order.product_id || !order.products) continue
      const prod = order.products

      if (prod.type === 'course') {
        if (!existingCourseIds.includes(order.product_id)) {
          const result = await createEnrollment({
            userId,
            courseId: order.product_id,
            productMetadata: prod,
            returnDetail: true
          })
          if (result && result.created) {
            recovered = true
            existingCourseIds.push(order.product_id)
          }
        }
      } else if (prod.type === 'bundle') {
        // Fetch bundled items
        const { data: bundleItems } = await supabase
          .from('bundle_items')
          .select('course_id')
          .eq('bundle_id', order.product_id)

        if (bundleItems) {
          for (const item of bundleItems) {
            if (!existingCourseIds.includes(item.course_id)) {
              const result = await createEnrollment({
                userId,
                courseId: item.course_id,
                bundleId: order.product_id,
                productMetadata: prod,
                returnDetail: true
              })
              if (result && result.created) {
                recovered = true
                existingCourseIds.push(item.course_id)
              }
            }
          }
        }
      }
    }

    return recovered
  } catch (err) {
    console.error('[recoverEnrollmentFromOrders] Error:', err)
    return false
  }
}

/**
 * Check for scheduled batch courses that have unlocked and send in-app notification + email alert.
 */
export async function checkAndTriggerBatchUnlocks(userId) {
  if (!userId) return

  try {
    const nowIso = new Date().toISOString()

    // Find enrollments where access has now started but user has not yet been notified
    const { data: unlockedEnrs, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        course_id,
        access_starts_at,
        access_expires_at,
        is_batch,
        batch_unlocked_notified,
        courses (
          products (
            title,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .eq('batch_unlocked_notified', false)
      .lte('access_starts_at', nowIso)

    if (error || !unlockedEnrs || unlockedEnrs.length === 0) return

    for (const enr of unlockedEnrs) {
      const courseTitle = (enr.courses?.products?.title || 'Your Course').replace(/\s+slug$/i, '')
      const courseLink = `/course/${enr.course_id}`

      // 1. Insert in-app student notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: `Access Unlocked: ${courseTitle}`,
          message: `Your scheduled batch access for "${courseTitle}" is now live! Click here to start learning.`,
          link: courseLink,
          type: 'batch_unlock'
        })

      // 2. Mark enrollment as notified
      await supabase
        .from('enrollments')
        .update({ batch_unlocked_notified: true })
        .eq('id', enr.id)

      console.log(`[Batch Unlock] Notification created for course: ${courseTitle}`)
    }
  } catch (err) {
    console.warn('[checkAndTriggerBatchUnlocks] Error checking batch unlocks:', err)
  }
}

/**
 * Trigger batch release email reminder
 */
export function triggerBatchUnlockEmail({ email, name, courseTitle, courseLink, batchName }) {
  setTimeout(async () => {
    try {
      const url = `${CONFIG.SUPABASE_URL}/functions/v1/send-batch-reminder`
      const apikey = CONFIG.SUPABASE_KEY
      
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apikey,
          'Authorization': `Bearer ${apikey}`
        },
        body: JSON.stringify({
          recipient_email: email,
          recipient_name: name,
          course_title: courseTitle,
          course_link: courseLink,
          batch_name: batchName,
          type: 'batch_unlock'
        })
      }).catch(() => {})
    } catch (e) {
      console.warn('[Batch Email] Ignored error:', e)
    }
  }, 10)
}

/**
 * Legacy saveOrder — kept for backward compatibility only.
 * New code should use createPendingOrder() + completeOrder().
 * @deprecated
 */
export async function saveOrder({ reference, name, email, phone, isEbook = false, userId = null, productId: productIdParam = null }) {
  console.warn('[saveOrder] This function is deprecated. Use createPendingOrder + completeOrder.')
  try {
    const cleanEmail = (email || '').trim().toLowerCase()
    let productId = productIdParam

    if (!productId) {
      const { data: productData } = await supabase
        .from('products')
        .select('id, price')
        .eq('type', isEbook ? 'ebook' : 'course')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      productId = productData?.id || null
    }

    const { error: insertError } = await supabase
      .from('orders')
      .insert([{
        reference,
        customer_email: cleanEmail,
        customer_name: name ? name.trim() : null,
        product_id: productId,
        amount: 0,
        status: 'paid',
        payment_method: 'paystack',
      }])

    if (insertError && insertError.code !== '23505') {
      console.error('[saveOrder] Insert failed:', insertError)
    }

    if (!isEbook && productId && userId) {
      await createEnrollment({ userId, courseId: productId })
    }

    // Confirmation email disabled until Edge Function is deployed
    // triggerConfirmationEmail({
    //   reference,
    //   customer_name: name,
    //   customer_email: email,
    //   customer_phone: phone,
    //   product_id: productId,
    // })

    return true
  } catch (err) {
    console.error('[saveOrder] Unexpected error:', err)
    return true
  }
}
