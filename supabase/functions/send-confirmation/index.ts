// Setup: 
// 1. Install Supabase CLI
// 2. Run: `supabase functions deploy send-confirmation`
// Set Env Secrets in Supabase Dashboard (Settings -> Edge Functions):
// - RESEND_API_KEY
// - PAYSTACK_SECRET_KEY
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - PDF_DOWNLOAD_URL (Optional fallback)
// - SITE_URL (Default: https://www.donzenaccountinghub.com)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ""
const SITE_URL = Deno.env.get('SITE_URL') || "https://www.donzenaccountinghub.com"
const PDF_DOWNLOAD_URL = Deno.env.get('PDF_DOWNLOAD_URL') || `${SITE_URL}/downloads/donzen-toolkit.pdf`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const body = await req.json()
    const record = body.record || body

    // 1. Initial validation
    if (!record || (!record.reference && !record.customer_email)) {
      return new Response(JSON.stringify({ message: "No record or reference found" }), { headers: corsHeaders, status: 400 })
    }

    // 1b. Resolve Resend API key (from Env or DB settings fallback)
    let activeResendKey = RESEND_API_KEY
    if (!activeResendKey && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const { data: paySetting } = await supabaseAdmin
          .from('settings')
          .select('value')
          .eq('id', 'payment_config')
          .maybeSingle()
        if (paySetting?.value?.resend_api_key) {
          activeResendKey = paySetting.value.resend_api_key
        }
      } catch (e) {}
    }

    // 2. Optional: If type is direct batch unlock notification
    if (body.type === 'batch_unlock') {
      const targetEmail = body.user_email || body.recipient_email || record.customer_email
      const targetName = body.user_name || body.recipient_name || record.customer_name || 'Student'
      const targetTitle = body.course_title || 'Your Course'
      const targetCourseId = body.course_id || ''

      if (activeResendKey && targetEmail) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeResendKey}`
          },
          body: JSON.stringify({
            from: 'Donzen Accounting Hub <info@donzenaccountinghub.com>',
            to: [targetEmail],
            reply_to: 'info@donzenaccountinghub.com',
            subject: `🎉 Your Batch Has Started: ${targetTitle} is Now Live!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: #101010; padding: 28px; text-align: center; border-bottom: 3px solid #ff1717;">
                  <h1 style="color: #fff; margin: 0; font-size: 20px;">Classroom Now Open!</h1>
                  <p style="color: #ff1717; margin: 6px 0 0; font-size: 13px; font-weight: bold;">DONZEN ACCOUNTING HUB</p>
                </div>
                <div style="padding: 32px 28px;">
                  <h2 style="color: #0f172a; margin-top: 0;">Hello ${targetName},</h2>
                  <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                    The countdown is complete! Your scheduled batch for <strong>${targetTitle}</strong> is now officially unlocked and available in your classroom dashboard.
                  </p>
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${SITE_URL}/course/${targetCourseId}" style="background: #ff1717; color: #fff; padding: 14px 32px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;">
                      🚀 Enter Classroom & Start Learning
                    </a>
                  </div>
                  <p style="color: #64748b; font-size: 13px;">You can also access this anytime by logging into your dashboard at <a href="${SITE_URL}/dashboard">${SITE_URL}/dashboard</a>.</p>
                </div>
              </div>
            `
          })
        })
      }
      return new Response(JSON.stringify({ message: "Batch unlock email dispatched" }), { headers: corsHeaders, status: 200 })
    }

    // 2b. Optional: If type is batch broadcast announcement
    if (body.type === 'batch_broadcast') {
      const targetEmail = body.recipient_email || body.user_email || record.customer_email
      const targetName = body.recipient_name || body.user_name || 'Student'
      const targetTitle = body.course_title || 'Your Course'
      const targetLink = body.course_link || '/dashboard'
      const customSubject = body.custom_subject || `Announcement: ${targetTitle}`
      const customMessage = body.custom_message || ''

      if (activeResendKey && targetEmail) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeResendKey}`
          },
          body: JSON.stringify({
            from: 'Donzen Accounting Hub <info@donzenaccountinghub.com>',
            to: [targetEmail],
            reply_to: 'info@donzenaccountinghub.com',
            subject: customSubject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: #101010; padding: 28px; text-align: center; border-bottom: 3px solid #ff1717;">
                  <h1 style="color: #fff; margin: 0; font-size: 20px;">Classroom Announcement</h1>
                  <p style="color: #ff1717; margin: 6px 0 0; font-size: 13px; font-weight: bold;">DONZEN ACCOUNTING HUB</p>
                </div>
                <div style="padding: 32px 28px;">
                  <h2 style="color: #0f172a; margin-top: 0;">Hello ${targetName},</h2>
                  <div style="color: #334155; font-size: 15px; line-height: 1.7; margin: 20px 0; white-space: pre-wrap;">
                    ${customMessage}
                  </div>
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${SITE_URL}${targetLink}" style="background: #ff1717; color: #fff; padding: 14px 32px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Go to Classroom
                    </a>
                  </div>
                  <p style="color: #94a3b8; font-size: 12px;">You are receiving this update as an enrolled student in ${targetTitle}.</p>
                </div>
              </div>
            `
          })
        })
      }
      return new Response(JSON.stringify({ message: "Broadcast email dispatched" }), { headers: corsHeaders, status: 200 })
    }

    // 3. Security Check: Verify payment status with Paystack API if secret configured
    if (PAYSTACK_SECRET_KEY && record.reference && !record.reference.startsWith('manual_')) {
      const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${record.reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      const paystackData = await paystackRes.json()

      if (!paystackData.status || paystackData.data.status !== 'success') {
        console.error(`Paystack verification failed for ${record.reference}:`, paystackData.message)
        return new Response(JSON.stringify({ message: "Payment verification failed" }), { headers: corsHeaders, status: 400 })
      }
    }

    // 4. Fetch product information to customize email for Course, Bundle, or E-Book
    let product: any = null
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && record.product_id) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      const { data: prodData } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', record.product_id)
        .maybeSingle()
      if (prodData) product = prodData
    }

    const isCourse = product?.type === 'course'
    const isBundle = product?.type === 'bundle'
    const isScheduledBatch = product?.batch_enrollment_enabled && product?.batch_start_date
    const productTitle = product?.title || 'Your Purchased Program'

    // Configure CTA destination & label
    let ctaUrl = `${SITE_URL}/dashboard`
    let ctaLabel = '🎓 Access Your Student Dashboard'
    let emailSubject = `📊 Order Confirmation: Welcome to Donzen Accounting Hub!`

    if (isBundle) {
      emailSubject = `📦 Bundle Confirmed: Welcome to ${productTitle}!`
      ctaLabel = '🎓 Go to Learning Dashboard'
      ctaUrl = `${SITE_URL}/dashboard`
    } else if (isCourse) {
      emailSubject = `🎓 Access Confirmed: Welcome to ${productTitle}!`
      ctaLabel = isScheduledBatch ? '⏳ View Scheduled Batch Countdown' : '🚀 Start Learning Now'
      ctaUrl = `${SITE_URL}/dashboard`
    } else {
      ctaLabel = '📥 Access Your Resources'
      ctaUrl = PDF_DOWNLOAD_URL
    }

    // 5. Send Confirmation Email via Resend
    console.log(`Sending confirmation email to: ${record.customer_email}`)
    if (activeResendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeResendKey}`
        },
        body: JSON.stringify({
          from: 'Donzen Accounting Hub <info@donzenaccountinghub.com>',
          to: [record.customer_email],
          reply_to: 'info@donzenaccountinghub.com',
          subject: emailSubject,
          html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Donzen Order is Confirmed!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F3F5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #eef1f4;">
                    <!-- HEADER -->
                    <tr>
                        <td align="center" style="background-color: #101010; padding: 40px 40px 30px; border-bottom: 3px solid #ff1717;">
                            <img src="${SITE_URL}/logo.png" alt="Donzen Accounting Hub" style="height: 48px; width: auto; margin-bottom: 12px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">Order Confirmed</h1>
                            <p style="color: #ff1717; margin: 8px 0 0; font-size: 13px; font-weight: 700; letter-spacing: 1px;">DONZEN ACCOUNTING HUB</p>
                        </td>
                    </tr>

                    <!-- HERO -->
                    <tr>
                        <td style="padding: 40px 40px 20px;">
                            <h2 style="color: #101010; margin: 0 0 16px; font-size: 20px; font-weight: 800; line-height: 1.3;">Welcome, ${record.customer_name || 'Valued Client'}!</h2>
                            <p style="color: #4a5568; margin: 0; font-size: 15.5px; line-height: 1.7;">
                                Thank you for purchasing <strong>${productTitle}</strong>. Your payment has been verified and your account is ready.
                            </p>

                            ${isScheduledBatch ? `
                            <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px 20px; margin: 20px 0 10px 0;">
                                <div style="color: #b45309; font-weight: 800; font-size: 14px; margin-bottom: 4px;">
                                  ⏳ Scheduled Batch Release: ${product.batch_name || 'Upcoming Cohort'}
                                </div>
                                <div style="color: #92400e; font-size: 13.5px; line-height: 1.5;">
                                  Your classroom is scheduled to open on <strong>${new Date(product.batch_start_date).toLocaleString()}</strong>. You can view your dashboard and live countdown clock anytime. We will notify you via email as soon as lessons unlock!
                                </div>
                            </div>
                            ` : ''}

                            ${isBundle ? `
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 18px 0 10px 0;">
                                <div style="color: #0f172a; font-weight: 700; font-size: 13.5px; margin-bottom: 4px;">
                                  📦 Multi-Course Bundle
                                </div>
                                <div style="color: #475569; font-size: 13px; line-height: 1.5;">
                                  All courses included in this bundle have been automatically added to your student account.
                                </div>
                            </div>
                            ` : ''}
                        </td>
                    </tr>

                    <!-- CTA BUTTON -->
                    <tr>
                        <td align="center" style="padding: 10px 40px 36px;">
                            <a href="${ctaUrl}" style="display: inline-block; background-color: #ff1717; color: #ffffff; padding: 16px 36px; font-size: 16px; font-weight: 800; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 16px rgba(255,23,23,0.35);">
                                ${ctaLabel}
                            </a>
                            <p style="color: #a0aec0; font-size: 12px; margin-top: 14px;">24/7 Access · Lifetime updates & support</p>
                        </td>
                    </tr>

                    <!-- ORDER INFO -->
                    <tr>
                        <td style="padding: 0 40px 36px; border-top: 1px solid #f1f4f8;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="font-size: 13px; color: #718096; width: 50%;"><strong>Reference:</strong> ${record.reference || 'N/A'}</td>
                                    <td align="right" style="font-size: 13px; color: #718096; width: 50%;"><strong>Amount Paid:</strong> ₦${Number(record.amount || 0).toLocaleString()}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="background-color: #F7F3F5; padding: 28px 40px; border-top: 1px solid #eef1f4;">
                            <p style="color: #718096; font-size: 13px; margin: 0 0 12px; line-height: 1.6;">
                                Need help or have questions about your training?<br>Email us at <a href="mailto:info@donzenaccountinghub.com" style="color: #ff1717; text-decoration: none; font-weight: 700;">info@donzenaccountinghub.com</a> or call <strong>+234 703 9999 842</strong>.
                            </p>
                            <p style="color: #a1a1aa; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                                © ${new Date().getFullYear()} Donzen Accounting Hub · Ikota Shopping Complex, Lekki, Lagos, Nigeria
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
          `
        })
      })
      const data = await res.json()
      return new Response(JSON.stringify(data), { headers: corsHeaders, status: 200 })
    }

    return new Response(JSON.stringify({ message: "Order processed successfully" }), { headers: corsHeaders, status: 200 })

  } catch (error) {
    const err = error as Error;
    console.error("Critical error in edge function:", err.message)
    return new Response(JSON.stringify({ error: err.message }), { headers: corsHeaders, status: 500 })
  }
})

