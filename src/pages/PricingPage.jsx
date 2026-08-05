import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCurrency } from '../context/CurrencyContext'

/* ═══════════════════════════════════════════════════════════════
   DONZEN ACCOUNTING HUB — PRICING & RESOURCES PAGE
   Premium corporate pricing page with hardcoded fallback data,
   scroll animations, and professional design language.
   ═══════════════════════════════════════════════════════════════ */

// ─── Scroll-Reveal Hook ───
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ─── SVG Icons ───
const Icons = {
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  star: <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff1717" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
}

// ─── HARDCODED FALLBACK DATA ───
const FALLBACK_SERVICES = [
  {
    id: 'starter',
    title: 'Starter Bookkeeping',
    description: 'Essential bookkeeping for micro-businesses and sole proprietors just getting started with structured financial records.',
    price: 35000,
    old_price: null,
    type: 'service',
    features: [
      'Monthly transaction recording',
      'Bank reconciliation (1 account)',
      'Quarterly P&L statement',
      'Email support',
    ],
  },
  {
    id: 'growth',
    title: 'Growth Package',
    description: 'Complete financial management for growing SMEs that need consistent, reliable bookkeeping and reporting.',
    price: 75000,
    old_price: 95000,
    type: 'service',
    features: [
      'Daily transaction recording',
      'Bank reconciliation (up to 3 accounts)',
      'Monthly P&L & Balance Sheet',
      'Accounts receivable & payable tracking',
      'Payroll processing (up to 10 staff)',
      'Dedicated account manager',
      'Priority WhatsApp support',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    title: 'Enterprise Suite',
    description: 'Premium end-to-end accounting for established businesses that require comprehensive financial oversight and advisory.',
    price: 150000,
    old_price: null,
    type: 'service',
    features: [
      'Everything in Growth Package',
      'Unlimited bank accounts',
      'Full payroll management',
      'Tax computation & FIRS filing',
      'Cash flow forecasting',
      'Monthly review calls',
      'Audit-ready financial reports',
      'CFO-level advisory support',
    ],
  },
]

const FALLBACK_TEMPLATES = [
  {
    id: 'tpl-pnl',
    title: 'Profit & Loss Tracker',
    description: 'Track your income, expenses, and net profit with this professional Excel spreadsheet built for Nigerian businesses.',
    price: 5000,
    type: 'template',
  },
  {
    id: 'tpl-vendor',
    title: 'Vendor Management Tracker',
    description: 'Organise vendor contacts, purchase orders, and payment schedules in one structured workbook.',
    price: 5000,
    type: 'template',
  },
  {
    id: 'tpl-invoice',
    title: 'Client Invoicing System',
    description: 'Generate professional invoices, track payments, and manage outstanding client balances effortlessly.',
    price: 7500,
    type: 'template',
  },
  {
    id: 'tpl-cashflow',
    title: 'Cash Flow Forecast Template',
    description: 'Project your monthly cash inflows and outflows to make smarter business decisions ahead of time.',
    price: 5000,
    type: 'template',
  },
]

const CONSULTING_SERVICES = [
  { title: 'Accounting Software Setup', desc: 'QuickBooks, Xero, Excel & Cloud App configuration' },
  { title: 'CAC Business Incorporation', desc: 'Business Name, LLC, NGO registration & compliance' },
  { title: 'Tax Strategy & Audit Support', desc: 'FIRS registration, VAT filing, audit representation' },
  { title: 'Financial Training', desc: 'Individual, staff & corporate accounting workshops' },
]


export default function PricingPage() {
  const { formatPrice } = useCurrency()
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState('monthly')

  const [heroRef, heroVis] = useReveal(0.08)
  const [packagesRef, packagesVis] = useReveal(0.08)
  const [consultingRef, consultingVis] = useReveal(0.1)
  const [templatesRef, templatesVis] = useReveal(0.1)
  const [faqRef, faqVis] = useReveal(0.1)
  const [ctaRef, ctaVis] = useReveal(0.1)

  const [activeFaq, setActiveFaq] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_published', true)
          .order('price', { ascending: true })
        if (data && data.length > 0) setDbProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Use DB data if available, otherwise hardcoded fallbacks
  const serviceProducts = dbProducts.filter(p => p.type === 'service')
  const templateProducts = dbProducts.filter(p => p.type === 'template')
  const packages = serviceProducts.length > 0 ? serviceProducts : FALLBACK_SERVICES
  const templates = templateProducts.length > 0 ? templateProducts : FALLBACK_TEMPLATES

  const faqs = [
    { q: 'Can I switch plans at any time?', a: 'Yes. You can upgrade or downgrade your plan at any point. Changes take effect at the start of your next billing cycle, and we will prorate any differences.' },
    { q: 'Is there a setup fee?', a: 'No. All our packages come with free onboarding, including chart of accounts setup, bank feed connection, and an initial review of your existing records.' },
    { q: 'What payment methods do you accept?', a: 'We accept bank transfers (Zenith Bank), online card payments via Paystack, and international payments. Contact us for wire transfer details.' },
    { q: 'Do you offer discounts for annual billing?', a: 'Yes. Clients on annual billing receive a 15% discount. Contact our team to learn more about long-term partnership benefits.' },
    { q: 'What happens if I need to pause my service?', a: 'You can pause your subscription at any time. We will securely archive your records and resume exactly where we left off when you are ready to continue.' },
  ]


  return (
    <>
      <div className="pr-root">

        {/* ─── SEO ─── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Pricing & Resources — Donzen Accounting Hub",
            "url": "https://www.donzenaccountinghub.com/resources",
            "description": "Transparent pricing for bookkeeping, tax advisory, business incorporation, and DIY accounting templates. Packages designed for Nigerian SMEs."
          })
        }} />


        {/* ════ HERO ════ */}
        <section className="pr-hero" ref={heroRef}>
          <div className="pr-hero-bg">
            <img src="/images/about-hero.jpg" alt="" aria-hidden="true" />
            <div className="pr-hero-overlay" />
          </div>
          <div className={`pr-hero-inner ${heroVis ? 'pr-vis' : ''}`}>
            <div className="pr-hero-badge">Pricing & Resources</div>
            <h1 className="pr-hero-title">
              Simple, Transparent<br />
              <span className="pr-hero-accent">Pricing for Every Business</span>
            </h1>
            <p className="pr-hero-desc">
              No hidden fees. No surprises. Choose the plan that fits your business size and let our team handle the numbers while you focus on growth.
            </p>
          </div>
          <div className="pr-hero-shape" />
        </section>


        {/* ════ PACKAGES ════ */}
        <section className="pr-packages" ref={packagesRef}>
          <div className={`pr-packages-inner ${packagesVis ? 'pr-vis' : ''}`}>
            <div className="pr-packages-header">
              <span className="pr-overline">Monthly Plans</span>
              <h2 className="pr-section-title">Accounting & Advisory Packages</h2>
              <p className="pr-packages-desc">
                Real-time financial management, payroll, tax computation, and advisory for African SMEs.
              </p>

              {/* Billing Toggle */}
              <div className="pr-toggle-wrap">
                <button
                  className={`pr-toggle-btn ${billingCycle === 'monthly' ? 'pr-toggle-active' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`pr-toggle-btn ${billingCycle === 'annual' ? 'pr-toggle-active' : ''}`}
                  onClick={() => setBillingCycle('annual')}
                >
                  Annual <span className="pr-toggle-save">Save 15%</span>
                </button>
              </div>
            </div>

            <div className="pr-cards-grid">
              {packages.map((pkg, i) => {
                const isPopular = pkg.popular || i === 1
                const features = Array.isArray(pkg.features) ? pkg.features : []
                const price = billingCycle === 'annual'
                  ? Math.round(pkg.price * 12 * 0.85)
                  : pkg.price

                return (
                  <div
                    key={pkg.id}
                    className={`pr-card ${isPopular ? 'pr-card-featured' : ''}`}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {isPopular && <div className="pr-card-badge">Most Popular</div>}

                    <div className="pr-card-top">
                      <h3 className="pr-card-name">{pkg.title}</h3>
                      <p className="pr-card-desc">{pkg.description}</p>
                    </div>

                    <div className="pr-card-price-area">
                      <div className="pr-card-price-row">
                        <span className="pr-card-price">{formatPrice(price)}</span>
                        <span className="pr-card-period">
                          / {billingCycle === 'annual' ? 'year' : 'month'}
                        </span>
                      </div>
                      {pkg.old_price && billingCycle === 'monthly' && (
                        <div className="pr-card-old-price">Was {formatPrice(pkg.old_price)}</div>
                      )}
                      {billingCycle === 'annual' && (
                        <div className="pr-card-annual-note">
                          {formatPrice(Math.round(price / 12))}/mo billed annually
                        </div>
                      )}
                    </div>

                    <ul className="pr-card-features">
                      {features.map((f, fi) => (
                        <li key={fi}>{Icons.check}<span>{f}</span></li>
                      ))}
                    </ul>

                    <Link
                      to={`/checkout?product=${pkg.id}`}
                      className={`pr-card-cta ${isPopular ? 'pr-card-cta-primary' : ''}`}
                    >
                      Get Started {Icons.arrow}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>


        {/* ════ CUSTOM CONSULTING ════ */}
        <section className="pr-consulting" ref={consultingRef}>
          <div className={`pr-consulting-inner ${consultingVis ? 'pr-vis' : ''}`}>
            <div className="pr-consulting-content">
              <span className="pr-overline-light">Bespoke Solutions</span>
              <h2 className="pr-consulting-title">Premium Business Consulting</h2>
              <p className="pr-consulting-desc">
                Need something more tailored? Our advisory team provides custom-scoped engagements for businesses with unique financial requirements.
              </p>
              <div className="pr-consulting-grid">
                {CONSULTING_SERVICES.map((cs, i) => (
                  <div key={i} className="pr-consulting-item">
                    <div className="pr-consulting-check">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div className="pr-consulting-item-title">{cs.title}</div>
                      <div className="pr-consulting-item-desc">{cs.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="pr-btn pr-btn-white">
                Contact Advisory Team {Icons.arrow}
              </Link>
            </div>
            <div className="pr-consulting-price-col">
              <div className="pr-consulting-price-card">
                <div className="pr-consulting-price-label">Starting From</div>
                <div className="pr-consulting-price-value">Custom</div>
                <div className="pr-consulting-price-note">Priced per project scope</div>
                <div className="pr-consulting-divider" />
                <div className="pr-consulting-includes">
                  <div className="pr-consulting-includes-title">Every engagement includes:</div>
                  {['Free discovery call', 'Written project proposal', 'Fixed-scope pricing', 'Post-project support'].map((item, i) => (
                    <div key={i} className="pr-consulting-inc-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ════ TEMPLATES ════ */}
        <section className="pr-templates" ref={templatesRef}>
          <div className={`pr-templates-inner ${templatesVis ? 'pr-vis' : ''}`}>
            <div className="pr-templates-header">
              <span className="pr-overline">DIY Tools</span>
              <h2 className="pr-section-title">Accounting Templates</h2>
              <p className="pr-templates-desc">
                Professional-grade spreadsheets built for Nigerian businesses. Download instantly and start tracking your finances today.
              </p>
            </div>

            <div className="pr-templates-grid">
              {templates.map((tpl, i) => (
                <div key={tpl.id} className="pr-template-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="pr-template-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <h3 className="pr-template-title">{tpl.title}</h3>
                  <p className="pr-template-desc">{tpl.description}</p>
                  <div className="pr-template-footer">
                    <span className="pr-template-price">{formatPrice(tpl.price)}</span>
                    <Link to={`/checkout?product=${tpl.id}`} className="pr-template-btn">
                      Get Template {Icons.arrow}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════ GUARANTEE + TRUST SIGNALS ════ */}
        <section className="pr-trust">
          <div className="pr-trust-inner">
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Money-Back Guarantee', desc: 'Not satisfied within the first 14 days? We will refund you — no questions asked.' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: 'Secure Payments', desc: 'All transactions are encrypted and processed through Paystack\u2019s PCI-compliant platform.' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Dedicated Support', desc: 'Every client gets a named account manager — not a generic support queue.' },
            ].map((t, i) => (
              <div key={i} className="pr-trust-card">
                <div className="pr-trust-icon">{t.icon}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ════ FAQ ════ */}
        <section className="pr-faq" ref={faqRef}>
          <div className={`pr-faq-inner ${faqVis ? 'pr-vis' : ''}`}>
            <div className="pr-faq-header">
              <span className="pr-overline">FAQ</span>
              <h2 className="pr-section-title">Pricing Questions</h2>
            </div>
            <div className="pr-faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`pr-faq-item ${activeFaq === i ? 'pr-faq-open' : ''}`}>
                  <button className="pr-faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <svg className="pr-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div className="pr-faq-a"><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════ BOTTOM CTA ════ */}
        <section className="pr-cta" ref={ctaRef}>
          <div className={`pr-cta-inner ${ctaVis ? 'pr-vis' : ''}`}>
            <h2>Not Sure Which Plan is Right for You?</h2>
            <p>Book a free 15-minute discovery call and let our team recommend the best package for your business.</p>
            <div className="pr-cta-btns">
              <Link to="/contact" className="pr-btn pr-btn-red">
                Get a Free Consultation {Icons.arrow}
              </Link>
              <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noopener noreferrer" className="pr-btn pr-btn-glass">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

      </div>


      {/* ═══ STYLES ═══ */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pr-root {
          --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --red: #ff1717;
          --dark: #09090b;
          font-family: var(--font);
          color: #0f172a;
          background: #fff;
          overflow-x: hidden;
        }

        .pr-vis { animation: prFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes prFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pr-overline {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: #ff1717;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .pr-overline-light {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .pr-section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1.15;
          margin: 0 0 16px;
          color: #0f172a;
        }
        .pr-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          font-family: var(--font);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          border: none;
        }
        .pr-btn-red { background: #ff1717; color: #fff; }
        .pr-btn-red:hover { background: #d91414; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,23,23,0.3); }
        .pr-btn-glass { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
        .pr-btn-glass:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
        .pr-btn-white { background: #fff; color: #09090b; }
        .pr-btn-white:hover { background: #f1f5f9; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }


        /* ════ HERO ════ */
        .pr-hero {
          position: relative;
          padding: 130px 24px 90px;
          text-align: center;
          overflow: hidden;
        }
        .pr-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .pr-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.28;
        }
        .pr-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(9,9,11,0.2) 0%, #09090b 80%),
                      linear-gradient(to bottom, transparent 60%, #09090b 100%);
        }
        .pr-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 750px;
          margin: 0 auto;
          opacity: 0;
        }
        .pr-hero-badge {
          display: inline-block;
          background: rgba(255,23,23,0.12);
          border: 1px solid rgba(255,23,23,0.2);
          color: #ff1717;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 6px 20px;
          border-radius: 100px;
          margin-bottom: 24px;
        }
        .pr-hero-title {
          font-size: clamp(2.4rem, 5.5vw, 3.8rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.08;
          letter-spacing: -2px;
          margin: 0 0 20px;
        }
        .pr-hero-accent {
          background: linear-gradient(135deg, #ff1717, #ff6b4a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pr-hero-desc {
          font-size: 1.08rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.75;
          max-width: 600px;
          margin: 0 auto;
        }
        .pr-hero-shape {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.08), transparent 70%);
          top: -200px;
          right: -200px;
          z-index: 1;
          pointer-events: none;
        }


        /* ════ PACKAGES ════ */
        .pr-packages {
          padding: 100px 24px;
          background: #fafafa;
        }
        .pr-packages-inner {
          max-width: 1100px;
          margin: 0 auto;
          opacity: 0;
        }
        .pr-packages-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .pr-packages-desc {
          font-size: 1rem;
          color: #64748b;
          max-width: 540px;
          margin: 0 auto 28px;
        }

        /* Toggle */
        .pr-toggle-wrap {
          display: inline-flex;
          background: #e2e8f0;
          border-radius: 12px;
          padding: 4px;
        }
        .pr-toggle-btn {
          padding: 10px 24px;
          border: none;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: var(--font);
          cursor: pointer;
          background: transparent;
          color: #64748b;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .pr-toggle-active {
          background: #fff;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .pr-toggle-save {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fff;
          background: #ff1717;
          padding: 2px 8px;
          border-radius: 100px;
        }

        /* Cards Grid */
        .pr-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: start;
        }
        .pr-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 36px 32px 32px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pr-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.08);
        }
        .pr-card-featured {
          border-color: #ff1717;
          box-shadow: 0 8px 32px rgba(255,23,23,0.08);
          transform: scale(1.02);
        }
        .pr-card-featured:hover {
          transform: scale(1.02) translateY(-6px);
        }
        .pr-card-badge {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff1717;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 5px 16px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .pr-card-top { margin-bottom: 24px; }
        .pr-card-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .pr-card-desc {
          font-size: 0.86rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }
        .pr-card-price-area {
          padding-bottom: 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid #f1f5f9;
        }
        .pr-card-price-row { display: flex; align-items: baseline; gap: 4px; }
        .pr-card-price {
          font-size: 2.2rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -1.5px;
        }
        .pr-card-period {
          font-size: 0.88rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .pr-card-old-price {
          font-size: 0.82rem;
          color: #94a3b8;
          text-decoration: line-through;
          margin-top: 4px;
        }
        .pr-card-annual-note {
          font-size: 0.78rem;
          color: #16a34a;
          font-weight: 600;
          margin-top: 4px;
        }
        .pr-card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .pr-card-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.86rem;
          color: #334155;
          line-height: 1.5;
        }
        .pr-card-features li svg { flex-shrink: 0; margin-top: 3px; }
        .pr-card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s;
          background: #09090b;
          color: #fff;
        }
        .pr-card-cta:hover {
          background: #1e293b;
          transform: translateY(-1px);
        }
        .pr-card-cta-primary {
          background: #ff1717;
        }
        .pr-card-cta-primary:hover {
          background: #d91414;
          box-shadow: 0 8px 24px rgba(255,23,23,0.25);
        }


        /* ════ CONSULTING ════ */
        .pr-consulting {
          padding: 100px 24px;
          background: #09090b;
          position: relative;
          overflow: hidden;
        }
        .pr-consulting::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.06), transparent 70%);
          top: -200px;
          left: -200px;
          pointer-events: none;
        }
        .pr-consulting-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 56px;
          align-items: center;
          position: relative;
          z-index: 2;
          opacity: 0;
        }
        .pr-consulting-title {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -1px;
          margin: 0 0 16px;
        }
        .pr-consulting-desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin: 0 0 28px;
        }
        .pr-consulting-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }
        .pr-consulting-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .pr-consulting-check {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,23,23,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pr-consulting-item-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 2px;
        }
        .pr-consulting-item-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.5;
        }

        /* Price Card */
        .pr-consulting-price-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 32px;
          text-align: center;
        }
        .pr-consulting-price-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }
        .pr-consulting-price-value {
          font-size: 3rem;
          font-weight: 900;
          color: #ff1717;
          letter-spacing: -2px;
          margin-bottom: 4px;
        }
        .pr-consulting-price-note {
          font-size: 0.84rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 28px;
        }
        .pr-consulting-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin-bottom: 24px;
        }
        .pr-consulting-includes-title {
          font-size: 0.76rem;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 14px;
        }
        .pr-consulting-inc-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.86rem;
          color: rgba(255,255,255,0.65);
          margin-bottom: 10px;
        }


        /* ════ TEMPLATES ════ */
        .pr-templates {
          padding: 100px 24px;
          background: #fff;
        }
        .pr-templates-inner {
          max-width: 1100px;
          margin: 0 auto;
          opacity: 0;
        }
        .pr-templates-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .pr-templates-desc {
          font-size: 1rem;
          color: #64748b;
          max-width: 520px;
          margin: 0 auto;
        }
        .pr-templates-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .pr-template-card {
          background: #fafafa;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
        }
        .pr-template-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.06);
          border-color: transparent;
          background: #fff;
        }
        .pr-template-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,23,23,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .pr-template-title {
          font-size: 1.02rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .pr-template-desc {
          font-size: 0.84rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 20px;
          flex: 1;
        }
        .pr-template-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }
        .pr-template-price {
          font-size: 1.15rem;
          font-weight: 900;
          color: #0f172a;
        }
        .pr-template-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #ff1717;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(255,23,23,0.06);
          transition: all 0.2s;
        }
        .pr-template-btn:hover { background: rgba(255,23,23,0.12); }


        /* ════ TRUST ════ */
        .pr-trust {
          padding: 64px 24px;
          background: #fafafa;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        .pr-trust-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .pr-trust-card {
          text-align: center;
          padding: 28px 24px;
        }
        .pr-trust-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255,23,23,0.06);
          color: #ff1717;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .pr-trust-card h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .pr-trust-card p {
          font-size: 0.86rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }


        /* ════ FAQ ════ */
        .pr-faq {
          padding: 100px 24px;
          background: #fff;
        }
        .pr-faq-inner {
          max-width: 760px;
          margin: 0 auto;
          opacity: 0;
        }
        .pr-faq-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .pr-faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pr-faq-item {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          background: #fafafa;
          transition: all 0.3s;
        }
        .pr-faq-item:hover { border-color: #cbd5e1; }
        .pr-faq-open { border-color: #ff1717 !important; box-shadow: 0 4px 20px rgba(255,23,23,0.06); background: #fff; }
        .pr-faq-q {
          width: 100%;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font);
          color: #0f172a;
          cursor: pointer;
          text-align: left;
        }
        .pr-faq-chevron {
          flex-shrink: 0;
          color: #94a3b8;
          transition: transform 0.3s, color 0.3s;
        }
        .pr-faq-open .pr-faq-chevron { transform: rotate(180deg); color: #ff1717; }
        .pr-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
        .pr-faq-open .pr-faq-a { max-height: 300px; }
        .pr-faq-a p { padding: 0 24px 20px; margin: 0; font-size: 0.92rem; color: #64748b; line-height: 1.7; }


        /* ════ BOTTOM CTA ════ */
        .pr-cta {
          padding: 80px 24px;
          background: linear-gradient(135deg, #09090b, #1a1a2e);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pr-cta::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.1), transparent 70%);
          bottom: -250px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .pr-cta-inner {
          max-width: 650px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          opacity: 0;
        }
        .pr-cta h2 {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -1px;
        }
        .pr-cta p {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin: 0 0 36px;
        }
        .pr-cta-btns {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }


        /* ════ RESPONSIVE ════ */
        @media (max-width: 1024px) {
          .pr-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .pr-card-featured { transform: none; }
          .pr-card-featured:hover { transform: translateY(-6px); }
          .pr-consulting-inner { grid-template-columns: 1fr; }
          .pr-templates-grid { grid-template-columns: repeat(2, 1fr); }
          .pr-trust-inner { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .pr-cards-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
          .pr-templates-grid { grid-template-columns: 1fr 1fr; }
          .pr-consulting-grid { grid-template-columns: 1fr; }
          .pr-trust-inner { grid-template-columns: 1fr; gap: 16px; }
          .pr-packages, .pr-consulting, .pr-templates, .pr-faq { padding: 64px 16px; }
          .pr-hero { padding: 100px 16px 60px; }
        }
        @media (max-width: 480px) {
          .pr-templates-grid { grid-template-columns: 1fr; }
          .pr-hero-title { font-size: 2rem; letter-spacing: -1px; }
          .pr-hero-desc { font-size: 0.92rem; }
          .pr-section-title { font-size: 1.6rem; }
          .pr-cta-btns { flex-direction: column; align-items: stretch; }
          .pr-btn { justify-content: center; }
          .pr-toggle-wrap { flex-direction: column; }
          .pr-toggle-btn { justify-content: center; }
          .pr-card-price { font-size: 1.8rem; }
        }
      `}} />
    </>
  )
}
