// Setup: 
// 1. Install Supabase CLI
// 2. run `supabase functions new send-confirmation`
// 3. Paste this code into supabase/functions/send-confirmation/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const PDF_DOWNLOAD_URL = Deno.env.get('PDF_DOWNLOAD_URL') || "https://your-domain.com/downloads/n50k-blueprint.pdf"

serve(async (req) => {
    try {
        const { record } = await req.json()

        // Only send if it's a new paid order
        if (!record || record.status !== 'paid') {
            return new Response(JSON.stringify({ message: "Not a paid order" }), { status: 200 })
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'The N50K Blueprint <orders@n50kblueprint.ng>', // Make sure this domain is verified in Resend
                to: [record.customer_email],
                subject: '📗 Your N50K Blueprint Download Link',
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10493A;">Congratulations, ${record.customer_name}!</h2>
            <p>Your payment for <strong>The N50K Blueprint</strong> was successful.</p>
            <p>You now have lifetime access to the guide and all its bonuses. Click the button below to download your copy immediately:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${PDF_DOWNLOAD_URL}" style="background-color: #2E8B57; color: white; padding: 16px 32px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; display: inline-block;">
                📥 Download Your Blueprint Now
              </a>
            </div>

            <p style="color: #666; font-size: 14px;"><strong>Order Details:</strong></p>
            <ul style="color: #666; font-size: 14px; list-style: none; padding: 0;">
              <li><strong>Reference:</strong> ${record.reference}</li>
              <li><strong>Amount Paid:</strong> ₦2,500</li>
              <li><strong>Date:</strong> ${new Date(record.created_at).toLocaleDateString()}</li>
            </ul>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            
            <p style="font-size: 14px; color: #888;">If you have any trouble downloading the file, simply reply to this email or contact us at <a href="mailto:nprecious.official@gmail.com">nprecious.official@gmail.com</a>.</p>
            
            <p style="font-size: 14px; color: #888;">To your success,<br /><strong>Nnanta Precious</strong></p>
          </div>
        `
            })
        })

        const data = await res.json()
        return new Response(JSON.stringify(data), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
