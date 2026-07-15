import { useState, useEffect } from 'react'
import { CONFIG } from '../lib/config'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import UpsellWidget from '../components/UpsellWidget'

export default function ThankYouPage() {
  const { user } = useAuth()
  const customer = JSON.parse(localStorage.getItem('paid_customer') || '{}')
  const [product, setProduct] = useState(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  useEffect(() => {
    async function loadPurchasedProduct() {
      if (customer?.product_id) {
        const { data } = await supabase.from('products').select('*').eq('id', customer.product_id).maybeSingle()
        if (data) setProduct(data)
      } else {
        const { data } = await supabase.from('products').select('*').eq('slug', 'freelance-web-design-blueprint').maybeSingle()
        if (data) setProduct(data)
      }
    }
    loadPurchasedProduct()
  }, [customer?.product_id])

  const first = (customer?.name || 'Champion').split(' ')[0]

  return (
    <>
      {/* Hero */}
      <div className="ty-hero">
        <div className="wrap t-center">
          <div className="check-circle">🎉</div>
          <h1 className="h1 t-white" style={{ marginBottom: 12 }}>
            {first}, Your Blueprint is Ready!
          </h1>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
            {customer?.payment_method === 'bank_transfer' ? (
              <>
                Receipt submitted & pending verification. We will activate download access as soon as your transfer is verified (usually within 1-6 hours).
              </>
            ) : (
              <>
                Payment confirmed. Your N50K Blueprint and all bonuses are ready for you right now.
              </>
            )}
          </p>
          {customer?.ref && (
            <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.76rem', marginTop: 12 }}>
              Order ref: {customer.ref}
            </p>
          )}
        </div>
      </div>

      <section className="section-sm">
        <div className="wrap-n">
          {/* Post-Purchase One-Time Offer Widget */}
          <UpsellWidget placement="thankyou" userId={user?.id} />

          {/* Download card */}
          <div style={{ background: '#fff', borderRadius: 'var(--r-2xl)', padding: 32, textAlign: 'center', boxShadow: 'var(--sh-xl)', border: '2px solid var(--g200)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg, var(--g700), var(--gold), var(--g600))' }} />
            <div style={{ fontSize: '3.5rem', marginBottom: 10 }}>📗</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 5 }}>{product?.title || 'The N50K Blueprint'}</h2>
            <p style={{ fontSize: '.88rem', color: 'var(--n500)', marginBottom: 6 }}>Complete E-Book Guide + Included Bonuses</p>
            {customer?.email && (
              <p style={{ fontSize: '.82rem', color: 'var(--g600)', fontWeight: 600, background: 'var(--g50)', display: 'inline-block', padding: '4px 14px', borderRadius: 50, marginBottom: 20 }}>
                📧 {customer?.payment_method === 'bank_transfer' ? 'Updates will be sent to:' : 'Also sent to:'} {customer.email}
              </p>
            )}
            {customer?.payment_method === 'bank_transfer' ? (
              <div style={{ background: 'var(--g50)', border: '1.5px dashed var(--g300)', padding: '16px 20px', borderRadius: 12, color: 'var(--g800)', fontWeight: 600, fontSize: '.9rem', marginTop: 10 }}>
                ⏳ Transfer Verification Pending... The download button will become active once your receipt is verified by our admin.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <a href={product?.ebook_url || CONFIG.PDF_URL} download target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                  <button className="btn-download">
                    <span>⬇️</span>
                    <span>Download Ebook (PDF)</span>
                  </button>
                </a>

                {product?.bonus_ebook_urls && product.bonus_ebook_urls.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: '1px solid #e2e8f0', paddingTop: 14, textAlign: 'left' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--g800)', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>🎁 Your Included Bonuses:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {product.bonus_ebook_urls.map((bonus, idx) => (
                        <a 
                          key={idx} 
                          href={bonus.url} 
                          download 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: '#eff6ff',
                            borderRadius: '8px',
                            border: '1px solid #bfdbfe',
                            color: '#2563eb',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '13px'
                          }}
                        >
                          <span>📘 {bonus.name || `Bonus #${idx + 1}`}</span>
                          <span style={{ fontSize: '11px', background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>Download</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next steps */}
          <div style={{ background: 'var(--g50)', border: '1.5px solid var(--g200)', borderRadius: 'var(--r-xl)', padding: '22px 20px', marginBottom: 16 }}>
            <p style={{ fontWeight: 800, color: 'var(--g800)', marginBottom: 12, fontSize: '.92rem' }}>🚀 Start Here — Do This Right Now:</p>
            <ol style={{ paddingLeft: 0 }}>
              {[
                'Download your Blueprint and save it to your phone',
                'Read Chapter 1 & 2 today — takes less than 30 minutes',
                'Pick your business from Chapter 3 by tomorrow',
                'Set up WhatsApp Business and post your first offer this week',
                'Tell 10 people what you\'re building — accountability starts now',
              ].map((step, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--g200)' : 'none', fontSize: '.9rem', color: 'var(--n700)' }}>
                  <span style={{ width: 26, height: 26, minWidth: 26, borderRadius: '50%', background: 'var(--g700)', color: '#fff', fontWeight: 800, fontSize: '.76rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Bonuses */}
          <div style={{ background: '#fff', borderRadius: 'var(--r-xl)', padding: '22px 20px', border: '1.5px solid var(--n200)', marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: 12, color: 'var(--n700)' }}>🎁 Your Free Bonuses Are Inside the PDF:</p>
            <div className="grid-2" style={{ gap: 8 }}>
              {['📋 Supplier Directory', '📱 30 Social Captions', '📊 100-Day Action Plan', '🛠️ Free Tools Directory'].map(b => (
                <div key={b} style={{ background: 'var(--g50)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--g100)', fontSize: '.86rem', fontWeight: 600, color: 'var(--g800)' }}>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          <div style={{ background: 'var(--n50)', borderRadius: 'var(--r-xl)', padding: '22px 20px', border: '1.5px solid var(--n200)', marginBottom: 16, textAlign: 'center' }}>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>💚 Share — Help Another Nigerian Build</p>
            <p style={{ fontSize: '.84rem', color: 'var(--n500)', marginBottom: 14 }}>Know someone who needs this? Share the page and give them the same opportunity you just took.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'WhatsApp', bg: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(`I just got the N50K Blueprint — the complete guide to starting a profitable business in Nigeria with ₦50K. You should get it too: ${window.location.origin}`)}` },
                { label: 'Facebook', bg: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}` },
                { label: 'X / Twitter', bg: '#000', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just got the N50K Blueprint! Starting my business journey. You should too 👉 ${window.location.origin}`)}` },
              ].map(({ label, bg, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                  <button style={{ background: bg, color: '#fff', padding: '10px 18px', borderRadius: 50, fontWeight: 700, fontSize: '.83rem', border: 'none', cursor: 'pointer', transition: 'opacity .2s', opacity: .9 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = .9}
                  >{label}</button>
                </a>
              ))}
            </div>
          </div>

          {/* Guarantee reminder */}
          <div style={{ background: 'var(--gold-l)', borderRadius: 'var(--r-lg)', padding: '18px 20px', textAlign: 'center', border: '1.5px solid var(--gold)' }}>
            <p style={{ fontWeight: 700, color: 'var(--g800)', fontSize: '.9rem' }}>🔐 Your Access Is Permanent</p>
            <p style={{ fontSize: '.81rem', color: 'var(--n600)', marginTop: 5 }}>Your Blueprint is tied to your email — yours forever. Every future update is included at no extra cost.</p>
          </div>

        </div>
      </section>

    </>
  )
}
