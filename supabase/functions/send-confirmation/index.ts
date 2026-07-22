// Setup: 
// 1. Install Supabase CLI
// 2. Run: `supabase functions new send-confirmation`
// 3. Deploy: `supabase functions deploy send-confirmation`
// Set Env Secrets in Supabase Dashboard:
// - RESEND_API_KEY
// - PAYSTACK_SECRET_KEY
// - PDF_DOWNLOAD_URL

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
const PDF_DOWNLOAD_URL = Deno.env.get('PDF_DOWNLOAD_URL') || "https://www.donzenaccountinghub.com/downloads/donzen-toolkit.pdf"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()

    // 1. Initial validation
    if (!record || !record.reference) {
      return new Response(JSON.stringify({ message: "No record or reference found" }), { headers: corsHeaders, status: 400 })
    }

    // 2. Security Check: Verify payment status with Paystack API
    console.log(`Verifying payment for reference: ${record.reference}`)
    if (PAYSTACK_SECRET_KEY) {
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

    // 3. Send Confirmation Email via Resend
    console.log(`Sending confirmation email to: ${record.customer_email}`)
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Donzen Accounting Hub <info@donzenaccountinghub.com>',
          to: [record.customer_email],
          reply_to: 'info@donzenaccountinghub.com',
          subject: '📊 Order Confirmation: Welcome to Donzen Accounting Hub!',
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
                            <img src="https://www.donzenaccountinghub.com/logo.png" alt="Donzen Accounting Hub" style="height: 48px; width: auto; margin-bottom: 12px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">Order Confirmed</h1>
                            <p style="color: #ff1717; margin: 8px 0 0; font-size: 13px; font-weight: 700; letter-spacing: 1px;">DONZEN ACCOUNTING HUB</p>
                        </td>
                    </tr>

                    <!-- HERO -->
                    <tr>
                        <td style="padding: 40px 40px 20px;">
                            <h2 style="color: #101010; margin: 0 0 16px; font-size: 20px; font-weight: 800; line-height: 1.3;">Welcome, ${record.customer_name || 'Valued Client'}!</h2>
                            <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.7;">
                                Thank you for choosing <strong>Donzen Accounting Hub</strong>. Your order has been successfully processed and confirmed. 
                            </p>
                            <p style="color: #4a5568; margin: 16px 0 0; font-size: 16px; line-height: 1.7;">
                                Click the button below to access your accounting resources, setup instructions, or templates.
                            </p>
                        </td>
                    </tr>

                    <!-- CTA BUTTON -->
                    <tr>
                        <td align="center" style="padding: 20px 40px 40px;">
                            <a href="${PDF_DOWNLOAD_URL}" style="display: inline-block; background-color: #ff1717; color: #ffffff; padding: 18px 42px; font-size: 17px; font-weight: 800; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 16px rgba(255,23,23,0.35);">
                                📥 Access Your Resources
                            </a>
                            <p style="color: #a0aec0; font-size: 12px; margin-top: 16px;">24/7 Access. Lifetime updates & support.</p>
                        </td>
                    </tr>

                    <!-- ORDER INFO -->
                    <tr>
                        <td style="padding: 0 40px 40px; border-top: 1px solid #f1f4f8;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="font-size: 13px; color: #718096; width: 50%;"><strong>Reference:</strong> ${record.reference}</td>
                                    <td align="right" style="font-size: 13px; color: #718096; width: 50%;"><strong>Amount:</strong> ₦${Number(record.amount || 0).toLocaleString()}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="background-color: #F7F3F5; padding: 30px 40px; border-top: 1px solid #eef1f4;">
                            <p style="color: #718096; font-size: 13px; margin: 0 0 12px; line-height: 1.6;">
                                Need help or have questions about your bookkeeping?<br>Email us at <a href="mailto:info@donzenaccountinghub.com" style="color: #ff1717; text-decoration: none; font-weight: 700;">info@donzenaccountinghub.com</a> or call <strong>+234 703 9999 842</strong>.
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
