import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════════
   DONZEN ACCOUNTING HUB — SERVICES PAGE
   Premium corporate services page with hardcoded service data,
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

// ─── Animated Counter ───
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useReveal(0.3)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = Math.max(1, Math.floor(end / 112))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [visible, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── SVG Icons ───
const SvgIcons = {
  book: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  calculator: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/></svg>,
  building: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/></svg>,
  users: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  fileText: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  shield: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrowUpRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>,
}

// ─── SERVICE DATA ───
const SERVICES = [
  {
    id: 'bookkeeping',
    icon: SvgIcons.book,
    title: 'Bookkeeping & Accounting',
    subtitle: 'DIY Remote Services',
    description: 'Comprehensive day-to-day financial record-keeping designed for small and medium-sized businesses. We handle your transactions, reconciliations, and reporting so you can focus on growth.',
    features: [
      'Daily transaction recording & categorisation',
      'Bank & credit card reconciliation',
      'Accounts receivable & payable management',
      'Monthly financial statements (P&L, Balance Sheet)',
      'QuickBooks, Xero & Excel-based workflows',
      'Custom chart of accounts setup',
    ],
    highlight: 'Most Popular',
    color: '#ff1717',
  },
  {
    id: 'done-for-you',
    icon: SvgIcons.calculator,
    title: 'Done-For-You Accounting',
    subtitle: 'Fully Managed Service',
    description: 'A premium, hands-off accounting solution where our team manages your entire financial back-office. Ideal for busy founders and scaling businesses that need reliable financial oversight.',
    features: [
      'End-to-end bookkeeping management',
      'Payroll processing & compliance',
      'Vendor & client invoice management',
      'Cash flow analysis & forecasting',
      'Dedicated account manager',
      'Monthly review calls with your team',
    ],
    highlight: 'Premium',
    color: '#0f172a',
  },
  {
    id: 'tax',
    icon: SvgIcons.shield,
    title: 'Tax Advisory & Compliance',
    subtitle: 'FIRS & State Tax Services',
    description: 'Stay compliant with Nigerian tax regulations. We handle FIRS registration, VAT filing, annual returns, and strategic tax planning to minimise your liability and avoid penalties.',
    features: [
      'FIRS TIN registration & filing',
      'VAT returns & remittance',
      'Company income tax preparation',
      'Withholding tax management',
      'Tax planning & optimisation strategy',
      'Audit support & representation',
    ],
    highlight: null,
    color: '#16a34a',
  },
  {
    id: 'incorporation',
    icon: SvgIcons.building,
    title: 'Business Incorporation',
    subtitle: 'CAC Registration Services',
    description: 'Register your business with the Corporate Affairs Commission seamlessly. From business name reservations to LLC and NGO incorporation — we handle all the paperwork and compliance.',
    features: [
      'Business Name registration',
      'Limited Liability Company (LLC) incorporation',
      'NGO / Incorporated Trustees registration',
      'Post-incorporation compliance (annual returns)',
      'TIN & VAT registration assistance',
      'Corporate documentation & advisory',
    ],
    highlight: null,
    color: '#7c3aed',
  },
  {
    id: 'templates',
    icon: SvgIcons.fileText,
    title: 'DIY Accounting Templates',
    subtitle: 'Plug-and-Play Spreadsheets',
    description: 'Professional-grade accounting templates built for Nigerian businesses. Start tracking your finances immediately with our ready-to-use profit & loss, vendor management, and client tracking tools.',
    features: [
      'Profit & Loss statement template',
      'Vendor management tracker',
      'Client invoicing & payment log',
      'Expense categorisation workbook',
      'Cash flow forecast template',
      'Instant download — start in minutes',
    ],
    highlight: 'Affordable',
    color: '#ea580c',
  },
  {
    id: 'bootcamp',
    icon: SvgIcons.users,
    title: 'Accounting Experience Programme',
    subtitle: '30-Day Intensive Bootcamp',
    description: 'Our signature training programme for aspiring accountants, fresh graduates, and entrepreneurs who want to master practical bookkeeping, QuickBooks, and financial management skills.',
    features: [
      'Hands-on QuickBooks & Excel training',
      'Real client simulation exercises',
      'Financial statement preparation practice',
      'Mentorship from practising accountants',
      'Certificate of completion',
      'Job placement & networking support',
    ],
    highlight: 'Enrolling',
    color: '#0891b2',
  },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Discovery Call', desc: 'We schedule a free 15-minute consultation to understand your business structure, current pain points, and financial goals.' },
  { num: '02', title: 'Custom Proposal', desc: 'Based on your needs, we prepare a tailored service proposal with transparent pricing and a clear scope of work.' },
  { num: '03', title: 'Onboarding', desc: 'We set up your accounts, connect your bank feeds, and establish reporting workflows — typically completed within 48 hours.' },
  { num: '04', title: 'Ongoing Support', desc: 'Your dedicated account manager delivers monthly reports, review calls, and proactive financial insights to keep your business on track.' },
]


export default function ServicesPage() {
  const [heroRef, heroVis] = useReveal(0.08)
  const [gridRef, gridVis] = useReveal(0.08)
  const [processRef, processVis] = useReveal(0.1)
  const [whyRef, whyVis] = useReveal(0.1)
  const [faqRef, faqVis] = useReveal(0.1)
  const [ctaRef, ctaVis] = useReveal(0.1)

  const [activeFaq, setActiveFaq] = useState(null)
  const [expandedService, setExpandedService] = useState(null)

  const faqs = [
    { q: 'How do I know which service is right for my business?', a: 'We offer a free 15-minute discovery call where we assess your business size, industry, and current accounting setup. Based on this, we recommend the most cost-effective service package for you.' },
    { q: 'Do you work with businesses outside Lagos?', a: 'Yes. Our bookkeeping and accounting services are fully remote. We serve clients across all 36 states of Nigeria, with cloud-based tools like QuickBooks Online and Excel for seamless collaboration.' },
    { q: 'What accounting software do you use?', a: 'We primarily work with QuickBooks Online, Xero, and Microsoft Excel. If your business already uses a specific platform, we can adapt to your existing workflow.' },
    { q: 'How long does onboarding take?', a: 'Most clients are fully onboarded within 48 hours. This includes setting up your chart of accounts, connecting bank feeds, and establishing your reporting schedule.' },
    { q: 'Can I switch or upgrade my plan later?', a: 'Absolutely. You can upgrade, downgrade, or switch service packages at any time. We will work with you to ensure a smooth transition without disrupting your financial records.' },
  ]

  return (
    <>
      <div className="sv-root">

        {/* ─── SEO STRUCTURED DATA ─── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "provider": {
              "@type": "AccountingService",
              "name": "Donzen Accounting Hub",
              "url": "https://www.donzenaccountinghub.com"
            },
            "serviceType": "Bookkeeping, Tax Advisory, Business Incorporation, Accounting Training",
            "areaServed": { "@type": "Country", "name": "Nigeria" },
            "description": "Professional bookkeeping, tax advisory, CAC business incorporation, and accounting training services for Nigerian SMEs."
          })
        }} />


        {/* ════════════════════════════════════════════════════════════
            SECTION 1 — HERO
            ════════════════════════════════════════════════════════════ */}
        <section className="sv-hero" ref={heroRef}>
          <div className="sv-hero-bg">
            <img src="/images/services-hero.jpg" alt="" aria-hidden="true" />
            <div className="sv-hero-overlay" />
          </div>
          <div className={`sv-hero-inner ${heroVis ? 'sv-vis' : ''}`}>
            <h1 className="sv-hero-title">
              Professional Financial<br />
              <span className="sv-hero-accent">Solutions for Your Business</span>
            </h1>
            <p className="sv-hero-desc">
              From bookkeeping and tax compliance to business incorporation and professional training — we provide the complete financial infrastructure Nigerian businesses need to scale.
            </p>
            <div className="sv-hero-ctas">
              <Link to="/contact" className="sv-btn sv-btn-red">
                Get a Free Quote {SvgIcons.arrow}
              </Link>
              <a href="#services-grid" className="sv-btn sv-btn-glass">
                Explore Services
              </a>
            </div>
          </div>
          <div className="sv-hero-shape-1" />
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 2 — TRUST BAR
            ════════════════════════════════════════════════════════════ */}
        <section className="sv-trust-bar">
          <div className="sv-trust-inner">
            {[
              { end: 500, suffix: '+', label: 'Clients Served' },
              { end: 6, suffix: '+', label: 'Years in Business' },
              { end: 36, suffix: '', label: 'States Covered' },
              { end: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map((s, i) => (
              <div key={i} className="sv-trust-stat">
                <div className="sv-trust-val"><Counter end={s.end} suffix={s.suffix} /></div>
                <div className="sv-trust-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 3 — SERVICES GRID
            ════════════════════════════════════════════════════════════ */}
        <section className="sv-grid-section" id="services-grid" ref={gridRef}>
          <div className={`sv-grid-inner ${gridVis ? 'sv-vis' : ''}`}>
            <div className="sv-grid-header">
              <span className="sv-overline">What We Offer</span>
              <h2 className="sv-section-title">Comprehensive Service Portfolio</h2>
              <p className="sv-grid-desc">
                Each service is designed to address a specific financial challenge. Select any service below to learn more about what is included.
              </p>
            </div>

            <div className="sv-cards-grid">
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.id}
                  className={`sv-service-card ${expandedService === svc.id ? 'sv-card-expanded' : ''}`}
                  style={{ '--accent': svc.color, animationDelay: `${i * 0.06}s` }}
                >
                  {svc.highlight && (
                    <div className="sv-card-badge" style={{ background: svc.color }}>{svc.highlight}</div>
                  )}

                  <div className="sv-card-icon">{svc.icon}</div>
                  <div className="sv-card-subtitle">{svc.subtitle}</div>
                  <h3 className="sv-card-title">{svc.title}</h3>
                  <p className="sv-card-desc">{svc.description}</p>

                  <button
                    className="sv-card-toggle"
                    onClick={() => setExpandedService(expandedService === svc.id ? null : svc.id)}
                  >
                    {expandedService === svc.id ? 'Hide Details' : 'View Details'}
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`sv-toggle-chevron ${expandedService === svc.id ? 'sv-chevron-up' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  <div className={`sv-card-features ${expandedService === svc.id ? 'sv-features-open' : ''}`}>
                    <div className="sv-features-inner">
                      <div className="sv-features-label">What's Included:</div>
                      <ul>
                        {svc.features.map((f, fi) => (
                          <li key={fi}>{SvgIcons.check}<span>{f}</span></li>
                        ))}
                      </ul>
                      <div className="sv-card-actions">
                        <Link to="/contact" className="sv-card-cta">
                          Request This Service {SvgIcons.arrowUpRight}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 4 — HOW IT WORKS
            ════════════════════════════════════════════════════════════ */}
        <section className="sv-process" ref={processRef}>
          <div className={`sv-process-inner ${processVis ? 'sv-vis' : ''}`}>
            <div className="sv-process-header">
              <span className="sv-overline">How It Works</span>
              <h2 className="sv-section-title">Getting Started Is Simple</h2>
              <p className="sv-process-desc">From your first call to ongoing support, our onboarding process is designed to be fast, transparent, and hassle-free.</p>
            </div>

            <div className="sv-process-grid">
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} className="sv-step-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="sv-step-num">{step.num}</div>
                  <div className="sv-step-line" />
                  <h3 className="sv-step-title">{step.title}</h3>
                  <p className="sv-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 5 — WHY CHOOSE US
            ════════════════════════════════════════════════════════════ */}
        <section className="sv-why" ref={whyRef}>
          <div className={`sv-why-inner ${whyVis ? 'sv-vis' : ''}`}>
            <div className="sv-why-text">
              <span className="sv-overline-light">Why Donzen</span>
              <h2 className="sv-why-title">Why Businesses Trust Us With Their Finances</h2>
              <div className="sv-why-points">
                {[
                  { title: 'Industry Expertise', desc: 'Our team brings cross-sector experience in real estate, hospitality, tech startups, retail, and more.' },
                  { title: 'Remote-First & Reliable', desc: 'We operate 100% digitally, so you get responsive service no matter where in Nigeria you are located.' },
                  { title: 'Transparent Pricing', desc: 'No hidden fees. Every engagement starts with a clear proposal and fixed scope so you know exactly what you are paying for.' },
                  { title: 'Dedicated Account Managers', desc: 'You work with a named professional who knows your business — not a random support queue.' },
                ].map((p, i) => (
                  <div key={i} className="sv-why-point">
                    <div className="sv-why-check">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sv-why-visual">
              <img src="/advisory-team.jpg" alt="Donzen Accounting Hub advisory team" />
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 6 — FAQ
            ════════════════════════════════════════════════════════════ */}
        <section className="sv-faq" ref={faqRef}>
          <div className={`sv-faq-inner ${faqVis ? 'sv-vis' : ''}`}>
            <div className="sv-faq-header">
              <span className="sv-overline">FAQ</span>
              <h2 className="sv-section-title">Common Questions About Our Services</h2>
            </div>
            <div className="sv-faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`sv-faq-item ${activeFaq === i ? 'sv-faq-open' : ''}`}>
                  <button className="sv-faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <svg className="sv-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div className="sv-faq-a"><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 7 — BOTTOM CTA
            ════════════════════════════════════════════════════════════ */}
        <section className="sv-cta" ref={ctaRef}>
          <div className={`sv-cta-inner ${ctaVis ? 'sv-vis' : ''}`}>
            <h2>Ready to Get Your Finances in Order?</h2>
            <p>Book a free consultation and let our team build a tailored financial plan for your business.</p>
            <div className="sv-cta-btns">
              <Link to="/contact" className="sv-btn sv-btn-red">
                Get a Free Consultation {SvgIcons.arrow}
              </Link>
              <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn-glass">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

      </div>


      {/* ═══════════════════════════════════════════════════════════
          STYLES
          ═══════════════════════════════════════════════════════════ */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ─── ROOT ─── */
        .sv-root {
          --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --red: #e12b2b;
          --dark: #121214;
          font-family: var(--font);
          color: #0f172a;
          background: #fff;
          overflow-x: hidden;
        }

        /* ─── ANIMATIONS ─── */
        .sv-vis { animation: svFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes svFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── SHARED ─── */
        .sv-overline {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--red);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .sv-overline-light {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .sv-section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1.15;
          margin: 0 0 16px;
          color: #0f172a;
        }
        .sv-btn {
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
        .sv-btn-red {
          background: var(--red);
          color: #fff;
        }
        .sv-btn-red:hover {
          background: var(--hp-red-dark, #b91c1c);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(225,43,43,0.25);
        }
        .sv-btn-glass {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .sv-btn-glass:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .sv-btn-white {
          background: #fff;
          color: var(--dark);
        }
        .sv-btn-white:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }


        /* ════ HERO ════ */
        .sv-hero {
          position: relative;
          min-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 130px 24px 90px;
          overflow: hidden;
        }
        .sv-hero-bg {
          position: absolute;
          inset: 0;
        }
        .sv-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
        }
        .sv-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(170deg, rgba(9,9,11,0.94) 0%, rgba(9,9,11,0.82) 50%, rgba(9,9,11,0.92) 100%);
        }
        .sv-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 780px;
          text-align: center;
          opacity: 0;
        }
        .sv-hero-badge {
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
        .sv-hero-title {
          font-size: clamp(2.4rem, 5.5vw, 3.8rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.08;
          letter-spacing: -2px;
          margin: 0 0 20px;
        }
        .sv-hero-accent {
          background: linear-gradient(135deg, #ff1717, #ff6b4a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sv-hero-desc {
          font-size: 1.08rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          max-width: 620px;
          margin: 0 auto 36px;
        }
        .sv-hero-ctas {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .sv-hero-shape-1 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.1), transparent 70%);
          top: -150px;
          right: -150px;
          z-index: 1;
          pointer-events: none;
        }



        /* ════ TRUST BAR ════ */
        .sv-trust-bar {
          background: var(--dark);
          padding: 0 24px;
        }
        .sv-trust-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .sv-trust-stat {
          padding: 36px 24px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .sv-trust-stat:last-child { border-right: none; }
        .sv-trust-val {
          font-size: 2.2rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
        }
        .sv-trust-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 500;
          margin-top: 6px;
        }


        /* ════ SERVICES GRID ════ */
        .sv-grid-section {
          padding: 100px 24px;
          background: #fafafa;
        }
        .sv-grid-inner {
          max-width: 1200px;
          margin: 0 auto;
          opacity: 0;
        }
        .sv-grid-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .sv-grid-desc {
          font-size: 1.02rem;
          color: #64748b;
          max-width: 560px;
          margin: 0 auto;
        }
        .sv-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ─── Service Card ─── */
        .sv-service-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px 28px 28px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .sv-service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s;
        }
        .sv-service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.08);
          border-color: transparent;
        }
        .sv-service-card:hover::before { transform: scaleX(1); }

        .sv-card-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 0.68rem;
          font-weight: 800;
          color: #fff;
          padding: 4px 12px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .sv-card-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .sv-card-subtitle {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 6px;
        }
        .sv-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
          letter-spacing: -0.3px;
        }
        .sv-card-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.65;
          margin: 0 0 16px;
          flex: 1;
        }
        .sv-card-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--accent);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font);
          padding: 0;
          transition: gap 0.2s;
        }
        .sv-card-toggle:hover { gap: 10px; }
        .sv-toggle-chevron {
          transition: transform 0.3s;
        }
        .sv-chevron-up {
          transform: rotate(180deg);
        }

        /* ─── Expandable Features ─── */
        .sv-card-features {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sv-features-open {
          max-height: 400px;
        }
        .sv-features-inner {
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
          margin-top: 16px;
        }
        .sv-features-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .sv-features-inner ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sv-features-inner li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.86rem;
          color: #334155;
          line-height: 1.5;
        }
        .sv-features-inner li svg { flex-shrink: 0; margin-top: 3px; }
        .sv-card-actions {
          margin-top: 16px;
        }
        .sv-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          font-weight: 700;
          color: #ff1717;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 10px;
          background: rgba(255,23,23,0.06);
          transition: all 0.2s;
        }
        .sv-card-cta:hover {
          background: rgba(255,23,23,0.12);
          gap: 10px;
        }


        /* ════ PROCESS ════ */
        .sv-process {
          padding: 100px 24px;
          background: #fff;
        }
        .sv-process-inner {
          max-width: 1100px;
          margin: 0 auto;
          opacity: 0;
        }
        .sv-process-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .sv-process-desc {
          font-size: 1rem;
          color: #64748b;
          max-width: 540px;
          margin: 0 auto;
        }
        .sv-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
        }
        .sv-step-card {
          padding: 0 20px;
          position: relative;
          text-align: center;
        }
        .sv-step-num {
          font-size: 2.8rem;
          font-weight: 900;
          color: rgba(255,23,23,0.08);
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 16px;
        }
        .sv-step-line {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #e2e8f0 80%, transparent 100%);
          margin-bottom: 20px;
          position: relative;
        }
        .sv-step-line::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff1717;
        }
        .sv-step-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .sv-step-desc {
          font-size: 0.86rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }


        /* ════ WHY CHOOSE US ════ */
        .sv-why {
          padding: 100px 24px;
          background: var(--dark);
          position: relative;
          overflow: hidden;
        }
        .sv-why::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.06), transparent 70%);
          bottom: -200px;
          left: -200px;
          pointer-events: none;
        }
        .sv-why-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 2;
          opacity: 0;
        }
        .sv-why-title {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -1px;
          margin: 0 0 32px;
        }
        .sv-why-points {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .sv-why-point {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .sv-why-check {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,23,23,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sv-why-point h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 4px;
        }
        .sv-why-point p {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          margin: 0;
        }
        .sv-why-visual {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }
        .sv-why-visual img {
          display: block;
          width: 100%;
          height: 440px;
          object-fit: cover;
        }


        /* ════ FAQ ════ */
        .sv-faq {
          padding: 100px 24px;
          background: #fafafa;
        }
        .sv-faq-inner {
          max-width: 760px;
          margin: 0 auto;
          opacity: 0;
        }
        .sv-faq-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .sv-faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sv-faq-item {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          transition: all 0.3s;
        }
        .sv-faq-item:hover { border-color: #cbd5e1; }
        .sv-faq-open { border-color: #ff1717 !important; box-shadow: 0 4px 20px rgba(255,23,23,0.06); }
        .sv-faq-q {
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
        .sv-faq-chevron {
          flex-shrink: 0;
          color: #94a3b8;
          transition: transform 0.3s, color 0.3s;
        }
        .sv-faq-open .sv-faq-chevron { transform: rotate(180deg); color: #ff1717; }
        .sv-faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sv-faq-open .sv-faq-a { max-height: 300px; }
        .sv-faq-a p {
          padding: 0 24px 20px;
          margin: 0;
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.7;
        }


        /* ════ BOTTOM CTA ════ */
        .sv-cta {
          padding: 80px 24px;
          background: linear-gradient(135deg, var(--dark), var(--hp-black-slate, #0f172a));
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .sv-cta::before {
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
        .sv-cta-inner {
          max-width: 650px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          opacity: 0;
        }
        .sv-cta h2 {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -1px;
        }
        .sv-cta p {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin: 0 0 36px;
        }
        .sv-cta-btns {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }


        /* ════ RESPONSIVE ════ */
        @media (max-width: 1024px) {
          .sv-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .sv-process-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
          .sv-why-inner { grid-template-columns: 1fr; gap: 48px; }
          .sv-trust-inner { grid-template-columns: repeat(2, 1fr); }
          .sv-hero { min-height: 460px; padding: 110px 24px 80px; }
        }
        @media (max-width: 768px) {
          .sv-cards-grid { grid-template-columns: 1fr; }
          .sv-process-grid { grid-template-columns: 1fr; gap: 24px; }
          .sv-trust-inner { grid-template-columns: repeat(2, 1fr); }
          .sv-trust-stat { padding: 28px 16px; }
          .sv-trust-val { font-size: 1.8rem; }
          .sv-grid-section, .sv-process, .sv-why, .sv-faq { padding: 64px 16px; }
          .sv-why-visual img { height: 320px; }
          .sv-hero { min-height: 400px; padding: 100px 16px 60px; }
          .sv-step-line { display: none; }
          .sv-step-card { text-align: left; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
          .sv-step-num { font-size: 2rem; }
        }
        @media (max-width: 480px) {
          .sv-trust-inner { grid-template-columns: 1fr 1fr; }
          .sv-trust-val { font-size: 1.5rem; }
          .sv-hero-title { font-size: 2rem; letter-spacing: -1px; }
          .sv-hero-desc { font-size: 0.92rem; }
          .sv-hero-ctas { flex-direction: column; align-items: center; }
          .sv-section-title { font-size: 1.6rem; }
          .sv-cta-btns { flex-direction: column; align-items: stretch; }
          .sv-btn { justify-content: center; }
          .sv-why-visual img { height: 260px; }
        }
      `}} />
    </>
  )
}
