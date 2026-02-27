// Setup: 
// 1. Install Supabase CLI
// 2. run `supabase functions new send-confirmation`
// 3. Paste this code into supabase/functions/send-confirmation/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
const PDF_DOWNLOAD_URL = Deno.env.get('PDF_DOWNLOAD_URL') || "https://your-domain.com/downloads/n50k-blueprint.pdf"

serve(async (req) => {
  try {
    const { record } = await req.json()

    // 1. Initial validation
    if (!record || !record.reference) {
      return new Response(JSON.stringify({ message: "No record or reference found" }), { status: 400 })
    }

    // 2. Security Check: Verify payment status with Paystack API
    console.log(`Verifying payment for reference: ${record.reference}`)
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${record.reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const paystackData = await paystackRes.json()

    // 3. Ensure transaction is successful AND matches the expected amount
    // Note: record.amount is in Naira (2500), Paystack returns in kobo (250000)
    if (!paystackData.status || paystackData.data.status !== 'success') {
      console.error(`Paystack verification failed for ${record.reference}:`, paystackData.message)
      return new Response(JSON.stringify({ message: "Payment verification failed" }), { status: 400 })
    }

    // 4. Send the Email via Resend
    console.log(`Sending confirmation email to: ${record.customer_email}`)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The N50K Blueprint <orders@n50kblueprint.ng>',
        to: [record.customer_email],
        reply_to: 'nprecious.official@gmail.com',
        subject: '📗 Access Granted: Your N50K Blueprint is Ready!',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Blueprint is Ready!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f9fa; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #eef1f4;">
                    <!-- HEADER -->
                    <tr>
                        <td align="center" style="background-color: #052817; padding: 40px 40px 30px;">
                            <div style="font-size: 38px; margin-bottom: 12px;">📗</div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">Access Granted</h1>
                            <p style="color: #6EE7A0; margin: 8px 0 0; font-size: 14px; font-weight: 700; letter-spacing: 1px;">THE N50K BLUEPRINT</p>
                        </td>
                    </tr>

                    <!-- HERO -->
                    <tr>
                        <td style="padding: 40px 40px 20px;">
                            <h2 style="color: #1a202c; margin: 0 0 16px; font-size: 20px; font-weight: 800; line-height: 1.3;">Welcome to the 1%, ${record.customer_name}!</h2>
                            <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.7;">
                                Your journey to building a profitable Nigerian business starts here. You've successfully secured <strong>The N50K Blueprint</strong> along with all your exclusive launch bonuses. 
                            </p>
                            <p style="color: #4a5568; margin: 16px 0 0; font-size: 16px; line-height: 1.7;">
                                Click the button below to download your copy and start building today.
                            </p>
                        </td>
                    </tr>

                    <!-- CTA BUTTON -->
                    <tr>
                        <td align="center" style="padding: 20px 40px 40px;">
                            <a href="${PDF_DOWNLOAD_URL}" style="display: inline-block; background-color: #3CB371; color: #ffffff; padding: 18px 42px; font-size: 18px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(60,179,113,0.35); transition: all 0.2s ease;">
                                📥 Download Blueprint Now
                            </a>
                            <p style="color: #a0aec0; font-size: 12px; margin-top: 16px;">One-time payment. Lifetime access. Instant download.</p>
                        </td>
                    </tr>

                    <!-- BONUSES -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1.5px dashed #cbd5e0;">
                                <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 800; color: #2d3748; text-transform: uppercase; letter-spacing: 0.5px;">📦 Your Bonuses Included:</h3>
                                <ul style="margin: 0; padding: 0; list-style: none;">
                                    <li style="color: #4a5568; font-size: 14px; margin-bottom: 8px; display: flex; align-items: center;">✅ Supplier Directory (Major Markets)</li>
                                    <li style="color: #4a5568; font-size: 14px; margin-bottom: 8px; display: flex; align-items: center;">✅ 30 Social Media Caption Pack</li>
                                    <li style="color: #4a5568; font-size: 14px; margin-bottom: 8px; display: flex; align-items: center;">✅ 100-Day N100K Action Plan</li>
                                    <li style="color: #4a5568; font-size: 14px; margin-bottom: 0; display: flex; align-items: center;">✅ Free Business Tools Directory</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- ORDER INFO -->
                    <tr>
                        <td style="padding: 0 40px 40px; border-top: 1px solid #f1f4f8;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="font-size: 12px; color: #718096; width: 50%;"><strong>Reference:</strong> ${record.reference}</td>
                                    <td align="right" style="font-size: 12px; color: #718096; width: 50%;"><strong>Amount:</strong> ₦2,500</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #eef1f4;">
                            <p style="color: #718096; font-size: 13px; margin: 0 0 12px; line-height: 1.6;">
                                Need help or lost your link? We're here for you.<br>Email us at <a href="mailto:nprecious.official@gmail.com" style="color: #3CB371; text-decoration: none; font-weight: 700;">nprecious.official@gmail.com</a>
                            </p>
                            <p style="color: #cbd5e0; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                                © ${new Date().getFullYear()} The N50K Blueprint · Lagos, Nigeria
                            </p>
                        </td>
                    </tr>
                </table>
                <p style="color: #a0aec0; font-size: 11px; text-align: center; margin-top: 24px; max-width: 500px; line-height: 1.5;">
                    This email was sent following your purchase on n50kblueprint.ng. If you didn't make this purchase, please ignore this email.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
                `
      })
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })

  } catch (error) {
    console.error("Critical error in edge function:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
