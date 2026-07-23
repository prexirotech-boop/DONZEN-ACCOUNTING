import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCurrency } from '../context/CurrencyContext'

export default function PricingPage() {
  const { formatPrice } = useCurrency()
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_published', true)
          .order('price', { ascending: false })

        if (data) setDbProducts(data)
      } catch (err) {
        console.error('Error fetching products from DB:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter services vs templates vs courses directly from DB
  const serviceProducts = dbProducts.filter(p => p.type === 'service')
  const templateProducts = dbProducts.filter(p => p.type === 'template')
  const courseProducts = dbProducts.filter(p => p.type === 'course' || p.type === 'ebook')

  return (
    <div className="pricing-page">
      {/* Hero Header */}
      <section className="pricing-hero">
        <div className="pricing-hero-container">
          <span className="pricing-badge">Donzen Pricing & Packages</span>
          <h1 className="pricing-title">Simple, Transparent Pricing For Every Business</h1>
          <p className="pricing-subtitle">
            Whether you need hands-off monthly bookkeeping, customized advisory, software training, or practical DIY accounting templates — we have you covered.
          </p>
        </div>
      </section>

      {/* Main Service Packages from Database */}
      <section className="pricing-grid-section">
        <div className="pricing-section-container">
          <h2 className="section-title">Monthly Accounting & Advisory Packages</h2>
          <p className="section-subtitle">Real-time financial management, payroll, tax computation, and advisory for African SMEs.</p>

          <div className="pricing-grid">
            {serviceProducts.length > 0 ? (
              serviceProducts.map((p, idx) => {
                const features = Array.isArray(p.features) ? p.features : []
                return (
                  <div key={p.id} className={`pricing-card ${idx === 0 ? 'featured' : ''}`}>
                    {idx === 0 && <div className="card-badge">Popular Choice</div>}
                    <h3 className="card-title">{p.title}</h3>
                    <p className="card-subnote">{p.description}</p>
                    
                    <div className="card-price-box">
                      <span className="card-price">{formatPrice(p.price)}</span>
                      <span className="card-period">/ Monthly</span>
                      {p.old_price && <div className="card-subnote">Was {formatPrice(p.old_price)}</div>}
                    </div>

                    {features.length > 0 && (
                      <ul className="card-features">
                        {features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link to={`/checkout?product=${p.id}`} className="card-cta-btn">
                      Get Started →
                    </Link>
                  </div>
                )
              })
            ) : (
              <div style={{ textalign: 'center', padding: '40px 0', gridColumn: '1 / -1', color: '#71717a' }}>
                {loading ? 'Loading packages from database...' : 'No service packages available.'}
              </div>
            )}

            {/* Stand-Alone Consulting Card */}
            <div className="pricing-card">
              <div className="card-badge" style={{ background: '#101010', color: '#ff1717', border: '1px solid #ff1717' }}>Bespoke</div>
              <h3 className="card-title">Premium Business Consulting</h3>
              <p className="card-subnote">Tailored Corporate Advisory, Business Incorporation & System Setup</p>
              
              <div className="card-price-box">
                <span className="card-price">Custom</span>
                <span className="card-period">/ Stand-Alone</span>
              </div>

              <ul className="card-features">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Accounting Software Setup (QuickBooks, Excel & Cloud Apps)</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>CAC Business Incorporation (Business Name, LTD, NGO)</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Tax Strategy, Audited Financial Reports & Audit Support</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Individual, Staff & Corporate Financial Training</span>
                </li>
              </ul>

              <Link to="/contact" className="card-cta-btn" style={{ background: '#101010' }}>
                Contact Advisory Team →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DIY Templates from Database */}
      <section className="templates-section">
        <div className="templates-container">
          <div className="templates-header">
            <h2>Donzen DIY Accounting Templates</h2>
            <p>Ready-to-use professional spreadsheets and templates engineered for African small businesses.</p>
          </div>

          <div className="templates-grid">
            {templateProducts.length > 0 ? (
              templateProducts.map(t => (
                <div key={t.id} className="template-card">
                  <div className="template-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                  <div className="template-price-row">
                    <span className="template-price">{formatPrice(t.price)}</span>
                    <Link to={`/checkout?product=${t.id}`} className="template-buy-btn">
                      Get Template →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', width: '100%', color: '#71717a' }}>
                {loading ? 'Loading templates from database...' : 'No templates found in database.'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Training Courses & Academy from Database */}
      {courseProducts.length > 0 && (
        <section className="templates-section" style={{ background: '#ffffff', paddingTop: 0 }}>
          <div className="templates-container">
            <div className="templates-header">
              <h2>Bootcamps & Academy Programs</h2>
              <p>Practical online training programs with certificates and live mentor support.</p>
            </div>

            <div className="templates-grid">
              {courseProducts.map(c => (
                <div key={c.id} className="template-card" style={{ borderColor: '#ff1717' }}>
                  <div className="template-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <div className="template-price-row">
                    <span className="template-price">{formatPrice(c.price)}</span>
                    <Link to={`/product/${c.slug || c.id}`} className="template-buy-btn" style={{ background: '#ff1717' }}>
                      Enroll Program →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Payment Details */}
      <section className="bank-details-section">
        <div className="bank-container">
          <div className="bank-card">
            <h3>Zenith Bank Direct Transfer Details</h3>
            <p>Prefer direct bank transfer in Nigeria? Pay directly into our Zenith Bank account:</p>
            <div className="bank-info-box">
              <div className="bank-row"><strong>Account Name:</strong> <span>Donzen Accounting Hub</span></div>
              <div className="bank-row"><strong>Account Number:</strong> <span style={{ fontSize: '20px', fontWeight: '900', color: '#ff1717' }}>1211575347</span></div>
              <div className="bank-row"><strong>Bank Name:</strong> <span>Zenith Bank</span></div>
            </div>
            <p className="bank-notice">After payment, send your proof of transfer to WhatsApp: <strong>+234 703 9999 842</strong> or Email: <strong>info@donzenaccountinghub.com</strong></p>
          </div>
        </div>
      </section>

      <style>{`
        .pricing-page {
          font-family: var(--font);
          background: #F7F3F5;
          min-height: 100vh;
        }

        .pricing-hero {
          background: linear-gradient(135deg, #101010 0%, #18181B 60%, #050505 100%);
          color: #ffffff;
          padding: 80px 24px;
          text-align: center;
          border-bottom: 3px solid #ff1717;
        }
        .pricing-hero-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .pricing-badge {
          display: inline-block;
          background: rgba(255,23,23,0.15);
          color: #ff1717;
          border: 1px solid rgba(255,23,23,0.3);
          padding: 6px 18px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        .pricing-title {
          font-size: 46px;
          font-weight: 900;
          margin: 0 0 20px;
          letter-spacing: -1.5px;
          line-height: 1.15;
        }
        .pricing-subtitle {
          font-size: 18px;
          color: rgba(255,255,255,0.8);
          line-height: 1.7;
          margin: 0;
        }

        .pricing-grid-section {
          padding: 72px 24px;
          max-width: 1240px;
          margin: 0 auto;
        }
        .pricing-section-container {
          text-align: center;
        }
        .section-title {
          font-size: 32px;
          font-weight: 900;
          color: #101010;
          margin: 0 0 10px;
        }
        .section-subtitle {
          font-size: 16px;
          color: #71717a;
          margin: 0 0 48px;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          text-align: left;
        }
        .pricing-card {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          padding: 36px 30px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .pricing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .pricing-card.featured {
          border: 2px solid #ff1717;
        }
        .card-badge {
          position: absolute;
          top: -14px;
          right: 24px;
          background: #ff1717;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-title {
          font-size: 20px;
          font-weight: 800;
          color: #101010;
          margin: 0 0 10px;
          line-height: 1.3;
        }
        .card-subnote {
          font-size: 13px;
          color: #71717a;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .card-price-box {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f4f4f5;
        }
        .card-price {
          font-size: 38px;
          font-weight: 900;
          color: #ff1717;
          letter-spacing: -1px;
        }
        .card-period {
          font-size: 14px;
          color: #71717a;
          font-weight: 600;
          margin-left: 4px;
        }
        .card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .card-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #27272a;
          line-height: 1.5;
        }
        .card-features svg {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .card-cta-btn {
          display: block;
          text-align: center;
          background: #ff1717;
          color: #ffffff;
          padding: 14px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 15px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .card-cta-btn:hover {
          background: #d91414;
        }

        .templates-section {
          background: #F7F3F5;
          padding: 64px 24px;
          border-top: 1px solid #e4e4e7;
        }
        .templates-container {
          max-width: 1240px;
          margin: 0 auto;
        }
        .templates-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .templates-header h2 {
          font-size: 32px;
          font-weight: 900;
          color: #101010;
          margin: 0 0 10px;
        }
        .templates-header p {
          font-size: 16px;
          color: #71717a;
          margin: 0;
        }
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .template-card {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 14px;
          padding: 28px;
          display: flex;
          flex-direction: column;
        }
        .template-icon {
          font-size: 32px;
          margin-bottom: 14px;
        }
        .template-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #101010;
          margin: 0 0 10px;
        }
        .template-card p {
          font-size: 13.5px;
          color: #71717a;
          line-height: 1.6;
          margin: 0 0 20px;
          flex: 1;
        }
        .template-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #f4f4f5;
        }
        .template-price {
          font-size: 20px;
          font-weight: 900;
          color: #ff1717;
        }
        .template-buy-btn {
          background: #101010;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .bank-details-section {
          padding: 64px 24px;
          background: #ffffff;
          border-top: 1px solid #e4e4e7;
        }
        .bank-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .bank-card {
          background: #101010;
          color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          border-left: 6px solid #ff1717;
        }
        .bank-card h3 {
          font-size: 24px;
          font-weight: 900;
          margin: 0 0 12px;
          color: #ffffff;
        }
        .bank-card p {
          color: rgba(255,255,255,0.8);
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 24px;
        }
        .bank-info-box {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .bank-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 15px;
        }
        .bank-row:last-child {
          border-bottom: none;
        }
        .bank-notice {
          font-size: 13.5px;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }

        @media (max-width: 768px) {
          .pricing-title { font-size: 32px; }
          .pricing-subtitle { font-size: 15px; }
        }
      `}</style>
    </div>
  )
}
