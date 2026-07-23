import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ─── HIGH-GRADE SVG ICONS (NO EMOJIS) ───────────────────────────────────────
const Icons = {
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <path d="M9 18h6v4H9z" />
    </svg>
  ),
  Scale: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M3 7h18M5 7l-2 7h6L7 7M19 7l-2 7h6l-2-7" />
    </svg>
  ),
  ChartTrend: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Headset: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Smartphone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  // State for Interactive Business Calculator / Service Selector
  const [businessType, setBusinessType] = useState('sme')
  const [txVolume, setTxVolume] = useState('medium')

  // State for FAQ Accordion
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Dynamic recommendation calculation
  const getRecommendation = () => {
    if (businessType === 'micro' || txVolume === 'low') {
      return {
        title: 'Donzen DIY Remote Bookkeeping',
        price: '₦80,000',
        subtext: 'Ideal for small businesses processing up to 350 transactions monthly.',
        link: '/resources'
      }
    } else if (businessType === 'sme' || txVolume === 'medium') {
      return {
        title: 'Donzen Done-For-You Accounting',
        price: '₦120,000',
        subtext: 'Full-service bookkeeping, payroll, tax computation & monthly advisory.',
        link: '/resources'
      }
    } else {
      return {
        title: 'Premium Corporate Consulting & Audit Support',
        price: 'Custom Quote',
        subtext: 'Tailored corporate tax advisory, audited financials & system setup.',
        link: '/contact'
      }
    }
  }

  const rec = getRecommendation()

  return (
    <div className="home-corporate-root">

      {/* ─── 1. HERO SECTION ────────────────────────────────────────────── */}
      <section className="hero-section">
        
        {/* Geometric Background Textures & Subtle Mesh Glow */}
        <div className="hero-bg-grid" />
        <div className="hero-shape-glow glow-1" />
        <div className="hero-shape-glow glow-2" />
        <div className="hero-accent-lines" />

        <div className="hero-container">
          
          {/* Left Text Column */}
          <div className="hero-text-col">
            <h1 className="hero-headline">
              Executive Bookkeeping, Accounting & Tax Compliance <span className="highlight-text">For Growing Businesses</span>
            </h1>

            <p className="hero-description">
              We empower startups, SMEs, and corporate entities with accurate financial recordkeeping, payroll management, FIRS/LIRS tax compliance, and cloud accounting systems designed for sustainable profitability.
            </p>

            {/* Value Checklist */}
            <div className="hero-checklist">
              <div className="check-item">
                <Icons.Check />
                <span>FIRS & State Tax Compliance (CIT, WHT, VAT, PAYE)</span>
              </div>
              <div className="check-item">
                <Icons.Check />
                <span>24/7 Access to Real-Time P&L & Balance Sheets</span>
              </div>
              <div className="check-item">
                <Icons.Check />
                <span>QuickBooks & Custom Excel Financial Systems</span>
              </div>
            </div>

            <div className="hero-cta-group">
              <Link to="/contact" className="btn-primary-cta">
                <span>Request Service Consultation</span>
                <Icons.ArrowRight />
              </Link>
              <Link to="/resources" className="btn-secondary-cta">
                View Retainer Plans
              </Link>
            </div>

            {/* Quick Stats Bar — Pixel Perfect Mobile Grid */}
            <div className="hero-stats-row">
              <div className="stat-card">
                <span className="stat-number">3,500+</span>
                <span className="stat-label">Clients & Alumni</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-card">
                <span className="stat-number">99.8%</span>
                <span className="stat-label">Filing Accuracy</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-card">
                <span className="stat-number">₦5B+</span>
                <span className="stat-label">Reconciled Volume</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Column — Big Full-Height Executive Display */}
          <div className="hero-visual-col">
            <div className="image-frame-hero">
              <img 
                src="/hero-corporate.jpg" 
                alt="Donzen Accounting Hub Corporate Executive Reviewing Financial Reports" 
                className="hero-img-full"
              />
              
              {/* Overlay Glass Card */}
              <div className="floating-metric-card float-anim">
                <div className="metric-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <div>
                  <div className="metric-title">24/7 Financial Visibility</div>
                  <div className="metric-desc">Audited Reports & Tax Computation</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. TRUST / CORPORATE COMPLIANCE BAR (NO EMOJIS) ───────────── */}
      <section className="trust-bar-section">
        <div className="trust-container">
          <span className="trust-label">TRUSTED BOOKKEEPING & ACCOUNTING PARTNER FOR NIGERIAN BUSINESSES</span>
          <div className="trust-badges-row">
            <div className="trust-item">
              <Icons.Building />
              <span>CAC Business Incorporation</span>
            </div>
            <div className="trust-item">
              <Icons.Scale />
              <span>FIRS & LIRS Tax Compliance</span>
            </div>
            <div className="trust-item">
              <Icons.ChartTrend />
              <span>QuickBooks Pro Certified</span>
            </div>
            <div className="trust-item">
              <Icons.Briefcase />
              <span>Monthly Financial Statements</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. CORE SERVICES & SOLUTIONS SECTION ─────────────────────── */}
      <section className="services-section">
        <div className="services-pattern-bg" />
        
        <div className="section-header">
          <span className="section-pretitle">OUR SERVICE OFFERINGS</span>
          <h2 className="section-title">Comprehensive Accounting Solutions Tailored To Your Growth</h2>
          <p className="section-subtitle">
            From daily transaction recording to end-of-year tax returns, Donzen Accounting Hub delivers reliable financial management so you can focus on scaling.
          </p>
        </div>

        <div className="services-grid">
          
          {/* Card 1 */}
          <div className="service-card">
            <div className="service-card-header">
              <div className="service-num">01</div>
              <span className="service-tag">Monthly Retainer</span>
            </div>
            <h3 className="service-title">Done-For-You Bookkeeping & Monthly Financial Accounting</h3>
            <p className="service-desc">
              We manage day-to-day transaction entries, accounts receivable, payables, inventory up to 350 items, petty cash, and monthly bank reconciliations with real-time financial reporting.
            </p>
            <ul className="service-bullets">
              <li>General Ledger & COA Classification</li>
              <li>Bank Statement & Merchant Reconciliation</li>
              <li>Monthly Profit & Loss & Balance Sheet</li>
            </ul>
            <Link to="/services" className="service-link">
              <span>Explore Bookkeeping Plans</span>
              <Icons.ArrowRight />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="service-card">
            <div className="service-card-header">
              <div className="service-num">02</div>
              <span className="service-tag">Tax & Legal</span>
            </div>
            <h3 className="service-title">Tax Advisory & Corporate Compliance (FIRS / LIRS / CAC)</h3>
            <p className="service-desc">
              Stay fully compliant with Federal & State tax regulations. We calculate and file CIT, Withholding Tax (WHT), Value Added Tax (VAT), and PAYE for your employees on time.
            </p>
            <ul className="service-bullets">
              <li>Monthly VAT & WHT Remittance</li>
              <li>Annual CIT & Tax Clearance Certificates</li>
              <li>CAC Business Incorporation & Audit Support</li>
            </ul>
            <Link to="/services" className="service-link">
              <span>Learn Tax Solutions</span>
              <Icons.ArrowRight />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="service-card">
            <div className="service-card-header">
              <div className="service-num">03</div>
              <span className="service-tag">Software Setup</span>
            </div>
            <h3 className="service-title">Accounting Systems Setup & QuickBooks Integration</h3>
            <p className="service-desc">
              Transition from manual recordkeeping to automated cloud systems. We configure QuickBooks Online, Desktop, or customized Excel systems tailored specifically for your business workflow.
            </p>
            <ul className="service-bullets">
              <li>Chart of Accounts & System Migration</li>
              <li>Staff Training & User Access Control</li>
              <li>Multi-Currency & Inventory Configuration</li>
            </ul>
            <Link to="/services" className="service-link">
              <span>Request System Setup</span>
              <Icons.ArrowRight />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="service-card">
            <div className="service-card-header">
              <div className="service-num">04</div>
              <span className="service-tag">DIY Templates</span>
            </div>
            <h3 className="service-title">Donzen DIY Accounting Tools & Spreadsheet Templates</h3>
            <p className="service-desc">
              Designed for non-accountant business owners. Manage income, expenses, accounts payable, receivables, and vendor ledgers easily using our pre-formatted financial templates.
            </p>
            <ul className="service-bullets">
              <li>Profit & Loss DIY Template (₦55,000)</li>
              <li>Vendor Management Sheet (₦40,000)</li>
              <li>Client Receivables Ledger (₦40,000)</li>
            </ul>
            <Link to="/resources" className="service-link">
              <span>Browse Templates</span>
              <Icons.ArrowRight />
            </Link>
          </div>

          {/* Card 5 — Redesigned Premium Featured Corporate Banner */}
          <div className="service-card full-width-card">
            <div className="bootcamp-pattern-overlay" />
            <div className="full-card-inner">
              <div className="bootcamp-left-content">
                <div className="bootcamp-header-row">
                  <span className="bootcamp-num">05</span>
                  <span className="bootcamp-pill-badge">ACADEMY & TRAINING</span>
                </div>
                <h3 className="bootcamp-title">Donzen Accounting Experience Bootcamp (30-Day Academy)</h3>
                <p className="bootcamp-desc">
                  Our flagship 30-Day Online Practical Accounting Bootcamp equips aspiring bookkeepers, finance graduates, and SME owners with real-world QuickBooks, Excel, and corporate accounting skills with verifiable certification.
                </p>
              </div>

              <div className="bootcamp-right-cta">
                <div className="bootcamp-price-box">
                  <span className="current-price">₦50,000</span>
                  <span className="slashed-price">₦100,000</span>
                </div>
                <Link to="/products" className="btn-bootcamp-action">
                  <span>View Course Details & Register</span>
                  <Icons.ArrowRight />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. EXECUTIVE WHY CHOOSE DONZEN SECTION ───────────────────── */}
      <section className="why-section">
        <div className="why-container">
          <div className="why-img-col">
            <img 
              src="/advisory-team.jpg" 
              alt="Donzen Accounting Advisory Team Consultation" 
              className="why-img"
            />
            <div className="experience-badge">
              <div className="exp-num">10+</div>
              <div className="exp-text">Years Combined Industry Leadership</div>
            </div>
          </div>

          <div className="why-text-col">
            <span className="section-pretitle">THE DONZEN ADVANTAGE</span>
            <h2 className="why-heading">Why Leading Businesses Choose Donzen Accounting Hub</h2>
            <p className="why-lead-para">
              We bridge the gap between complex accounting regulations and practical business management. Our structured methodology ensures your books are accurate, compliant, and ready for bank loans, investors, or tax audits.
            </p>

            <div className="advantages-list">
              
              <div className="advantage-item">
                <div className="adv-icon-box">01</div>
                <div>
                  <h4 className="adv-title">Dedicated Account Manager</h4>
                  <p className="adv-desc">You are assigned a qualified lead accountant who understands your specific industry nuances, revenue model, and operational needs.</p>
                </div>
              </div>

              <div className="advantage-item">
                <div className="adv-icon-box">02</div>
                <div>
                  <h4 className="adv-title">Tax Protection & Fraud Prevention</h4>
                  <p className="adv-desc">Internal accounting controls, double-entry verification, and routine reconciliations prevent inventory leakage and eliminate tax penalty risks.</p>
                </div>
              </div>

              <div className="advantage-item">
                <div className="adv-icon-box">03</div>
                <div>
                  <h4 className="adv-title">Decisions Backed By Data</h4>
                  <p className="adv-desc">Receive monthly financial performance breakdowns detailing your gross margins, operating overheads, net cash flow, and tax liabilities.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. INTERACTIVE PLAN SELECTOR ───────────────────────────── */}
      <section className="estimator-section">
        <div className="estimator-container">
          <div className="estimator-header">
            <span className="section-pretitle text-center">INTERACTIVE SERVICE RECOMMENDATION</span>
            <h2>Find The Right Accounting Plan For Your Business</h2>
            <p>Select your business structure and transaction scale to instantly view our recommended retainer package.</p>
          </div>

          <div className="estimator-card">
            <div className="estimator-controls">
              
              {/* Control 1 */}
              <div className="control-group">
                <label className="control-label">1. Business Type</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`choice-btn ${businessType === 'micro' ? 'active' : ''}`}
                    onClick={() => setBusinessType('micro')}
                  >
                    Sole Proprietor / Freelancer
                  </button>
                  <button 
                    type="button"
                    className={`choice-btn ${businessType === 'sme' ? 'active' : ''}`}
                    onClick={() => setBusinessType('sme')}
                  >
                    Growing SME / Startup
                  </button>
                  <button 
                    type="button"
                    className={`choice-btn ${businessType === 'corporate' ? 'active' : ''}`}
                    onClick={() => setBusinessType('corporate')}
                  >
                    Limited Liability / NGO
                  </button>
                </div>
              </div>

              {/* Control 2 */}
              <div className="control-group">
                <label className="control-label">2. Monthly Transaction Volume</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`choice-btn ${txVolume === 'low' ? 'active' : ''}`}
                    onClick={() => setTxVolume('low')}
                  >
                    Up to 150 Transactions
                  </button>
                  <button 
                    type="button"
                    className={`choice-btn ${txVolume === 'medium' ? 'active' : ''}`}
                    onClick={() => setTxVolume('medium')}
                  >
                    150 – 1,000 Transactions
                  </button>
                  <button 
                    type="button"
                    className={`choice-btn ${txVolume === 'high' ? 'active' : ''}`}
                    onClick={() => setTxVolume('high')}
                  >
                    1,000+ Transactions
                  </button>
                </div>
              </div>

            </div>

            {/* Recommendation Result Box */}
            <div className="estimator-result">
              <div className="result-header">RECOMMENDED SOLUTION</div>
              <h3 className="result-title">{rec.title}</h3>
              <div className="result-price">{rec.price} <span className="period-text">/ month</span></div>
              <p className="result-subtext">{rec.subtext}</p>
              <Link to={rec.link} className="btn-primary-cta full-width">
                <span>Proceed With This Package</span>
                <Icons.ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. CLIENT TESTIMONIALS SECTION ─────────────────────────── */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-pretitle">CLIENT SUCCESS STORIES</span>
          <h2 className="section-title">Trusted By Entrepreneurs & Business Leaders</h2>
          <p className="section-subtitle">Read how Donzen Accounting Hub helps Nigerian businesses maintain clean financial records and achieve peace of mind.</p>
        </div>

        <div className="testimonials-grid">
          
          <div className="testimonial-card">
            <div className="stars-row">
              <Icons.Star /><Icons.Star /><Icons.Star /><Icons.Star /><Icons.Star />
            </div>
            <p className="testimonial-quote">
              "Before working with Donzen Accounting, managing inventory across 3 retail outlets in Lagos was a nightmare. Their team set up QuickBooks and now handles our monthly reconciliations smoothly."
            </p>
            <div className="client-info">
              <div className="client-avatar">AO</div>
              <div>
                <div className="client-name">Adewale O.</div>
                <div className="client-role">Founder, Retail Logistics Enterprise</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars-row">
              <Icons.Star /><Icons.Star /><Icons.Star /><Icons.Star /><Icons.Star />
            </div>
            <p className="testimonial-quote">
              "Donzen handled our FIRS tax filing and monthly PAYE for our staff with total precision. They saved us from heavy compliance fines and clarified our financial position."
            </p>
            <div className="client-info">
              <div className="client-avatar">CN</div>
              <div>
                <div className="client-name">Chidinma N.</div>
                <div className="client-role">Managing Director, Tech Services Ltd</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars-row">
              <Icons.Star /><Icons.Star /><Icons.Star /><Icons.Star /><Icons.Star />
            </div>
            <p className="testimonial-quote">
              "The Profit and Loss DIY template from Donzen is super clear! Even as a non-accountant, I can now track daily petty cash and know my exact monthly profits."
            </p>
            <div className="client-info">
              <div className="client-avatar">SO</div>
              <div>
                <div className="client-name">Samuel O.</div>
                <div className="client-role">CEO, E-Commerce Brand</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 7. FREQUENTLY ASKED QUESTIONS (SEO ACCORDION) ───────────── */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="section-header text-center">
            <span className="section-pretitle">HAVE QUESTIONS?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about our bookkeeping packages, tax advisory, and bank transfer options.</p>
          </div>

          <div className="faq-list">
            {[
              {
                q: "What is included in the Donzen DIY Remote vs. Done-For-You accounting plan?",
                a: "The DIY Remote plan (₦80,000/mo) is designed for business owners who want to record daily entries themselves using our tools, while we perform monthly bank reconciliations, inventory audits, tax calculations, and financial review. The Done-For-You plan (₦120,000/mo) is a hands-off service where our dedicated accountants handle all daily transaction entries, staff payroll, receivables/payables, and tax filings for you."
              },
              {
                q: "How does Donzen ensure FIRS and LIRS tax compliance for my business?",
                a: "Our team computes Company Income Tax (CIT), Value Added Tax (VAT), Withholding Tax (WHT), and PAYE according to current Nigerian tax laws. We prepare schedules for monthly tax remittances so your business avoids penalties and easily obtains Tax Clearance Certificates (TCC)."
              },
              {
                q: "Can I pay via Direct Bank Transfer in Nigeria?",
                a: "Yes! You can pay directly into our official corporate bank account:\nAccount Name: Donzen Accounting Hub\nAccount Number: 1211575347\nBank: Zenith Bank\nAfter transferring, simply send your receipt to +234 703 9999 842 on WhatsApp or info@donzenaccountinghub.com for instant confirmation."
              },
              {
                q: "Where is Donzen Accounting Hub located?",
                a: "Our corporate headquarters is located at Ikota Shopping Complex, Eti-Osa, Lekki 101001, Lagos, Nigeria. We serve clients physically across Lagos and remotely across Nigeria and Africa."
              }
            ].map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  <span className={`faq-toggle-icon ${openFaq === idx ? 'rotated' : ''}`}>
                    <Icons.ChevronDown />
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. FINAL EXECUTIVE CTA BANNER ──────────────────────────── */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <span className="section-pretitle light">YOUR BUSINESS IS OUR SUCCESS</span>
          <h2 className="final-cta-heading">Ready To Upgrade Your Business Financial Management?</h2>
          <p className="final-cta-desc">
            Speak directly with our senior accounting consultants today or request a custom proposal tailored to your operational budget.
          </p>

          <div className="final-cta-buttons">
            <Link to="/contact" className="btn-primary-cta">
              <span>Schedule A Free Consultation</span>
              <Icons.ArrowRight />
            </Link>
            <a 
              href="https://wa.me/message/XUEP2CGZ4FM6E1" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-whatsapp-cta"
            >
              <Icons.WhatsApp />
              <span>WhatsApp Direct Message</span>
            </a>
            <a href="tel:+2347039999842" className="btn-phone-cta">
              <Icons.Phone />
              <span>Call +234 703 9999 842</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── COMPREHENSIVE STYLESHEET ────────────────────────────────── */}
      <style>{`
        .home-corporate-root {
          font-family: var(--font, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif);
          background-color: #ffffff;
          color: #0f172a;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Keyframe Animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .float-anim {
          animation: float-slow 3s ease-in-out infinite;
        }

        /* Common Utility Styles */
        .section-pretitle {
          font-size: 0.78rem;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .section-pretitle.light {
          color: #ff1717;
        }
        .section-pretitle.text-center {
          text-align: center;
        }

        .section-header {
          max-width: 760px;
          margin: 0 auto 52px;
          text-align: center;
        }
        .section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.8px;
          line-height: 1.2;
          margin: 0 0 14px;
        }
        .section-subtitle {
          font-size: 1.05rem;
          color: #64748b;
          margin: 0;
        }

        /* Buttons */
        .btn-primary-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ff1717;
          color: #ffffff;
          padding: 15px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.98rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(255, 23, 23, 0.35);
        }
        .btn-primary-cta:hover {
          background: #d91414;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 23, 23, 0.45);
        }
        .btn-primary-cta.compact {
          padding: 12px 24px;
          font-size: 0.9rem;
        }
        .btn-primary-cta.full-width {
          width: 100%;
          justify-content: center;
        }

        .btn-secondary-cta {
          display: inline-flex;
          align-items: center;
          background: #ffffff;
          color: #0f172a;
          padding: 15px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.98rem;
          text-decoration: none;
          border: 1px solid #cbd5e1;
          transition: all 0.2s ease;
        }
        .btn-secondary-cta:hover {
          background: #f8fafc;
          border-color: #0f172a;
        }

        .btn-whatsapp-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #16a34a;
          color: #ffffff;
          padding: 15px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.98rem;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-whatsapp-cta:hover {
          background: #15803d;
        }

        .btn-phone-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 15px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.98rem;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: background 0.2s;
        }
        .btn-phone-cta:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        /* ── HERO STYLING ── */
        .hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #090d16 100%);
          color: #ffffff;
          padding: 80px 24px 72px;
          border-bottom: 3px solid #ff1717;
          position: relative;
          overflow: hidden;
        }
        
        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.6;
          pointer-events: none;
        }
        .hero-shape-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .glow-1 {
          top: -10%;
          right: 5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,23,23,0.18) 0%, transparent 70%);
          animation: pulse-glow 6s ease-in-out infinite;
        }
        .glow-2 {
          bottom: -15%;
          left: -5%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%);
          animation: pulse-glow 8s ease-in-out infinite;
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: stretch;
          position: relative;
          z-index: 2;
        }

        .hero-headline {
          font-size: clamp(2.4rem, 4.2vw, 3.6rem);
          font-weight: 900;
          line-height: 1.14;
          letter-spacing: -1.2px;
          color: #ffffff;
          margin: 0 0 20px;
        }
        .highlight-text {
          color: #ff1717;
        }
        .hero-description {
          font-size: 1.1rem;
          color: #94a3b8;
          line-height: 1.7;
          margin: 0 0 28px;
          max-width: 620px;
        }
        .hero-checklist {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          color: #e2e8f0;
          font-weight: 600;
        }
        .hero-cta-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        /* Quick Stats Bar */
        .hero-stats-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .stat-card {
          display: flex;
          flex-direction: column;
        }
        .stat-number {
          font-size: 1.6rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.5px;
        }
        .stat-label {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.12);
        }

        /* Hero Image Frame - Full Big Column Size */
        .hero-visual-col {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .image-frame-hero {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          height: 100%;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: #0f172a;
        }
        .hero-img-full {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s ease;
        }
        .image-frame-hero:hover .hero-img-full {
          transform: scale(1.03);
        }

        .floating-metric-card {
          position: relative;
          z-index: 3;
          margin: 20px;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }
        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 23, 23, 0.15);
          border: 1px solid rgba(255, 23, 23, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .metric-title {
          font-weight: 800;
          color: #ffffff;
          font-size: 1rem;
        }
        .metric-desc {
          font-size: 0.84rem;
          color: #94a3b8;
        }

        /* ── TRUST BAR ── */
        .trust-bar-section {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 28px 24px;
        }
        .trust-container {
          max-width: 1240px;
          margin: 0 auto;
          text-align: center;
        }
        .trust-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 20px;
        }
        .trust-badges-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
        }

        /* ── SERVICES SECTION WITH RICH GRAPHICS ── */
        .services-section {
          padding: 92px 24px;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }
        .services-pattern-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .services-grid {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 32px;
          position: relative;
          z-index: 2;
        }
        .service-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 38px 34px;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }
        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.07);
          border-color: #ff1717;
        }
        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }
        .service-num {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          opacity: 0.18;
        }
        .service-tag {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 5px 14px;
          border-radius: 20px;
          background: #f1f5f9;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .service-tag.highlight {
          background: rgba(255, 23, 23, 0.1);
          color: #ff1717;
        }
        .service-title {
          font-size: 1.28rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
          line-height: 1.35;
        }
        .service-desc {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.65;
          margin: 0 0 22px;
          flex: 1;
        }
        .service-bullets {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .service-bullets li {
          font-size: 0.88rem;
          color: #334155;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .service-bullets li::before {
          content: '•';
          color: #ff1717;
          font-weight: bold;
        }
        .service-link {
          font-size: 0.92rem;
          font-weight: 800;
          color: #ff1717;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s;
        }
        .service-link:hover {
          gap: 10px;
        }

        /* Bootcamp Banner Card 05 Redesigned */
        .full-width-card {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        }
        .bootcamp-pattern-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 23, 23, 0.15) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }
        .full-card-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
        }
        .bootcamp-left-content {
          max-width: 680px;
        }
        .bootcamp-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .bootcamp-num {
          font-size: 1.8rem;
          font-weight: 900;
          color: #ffffff;
          opacity: 0.3;
        }
        .bootcamp-pill-badge {
          background: rgba(255, 23, 23, 0.2);
          border: 1px solid rgba(255, 23, 23, 0.4);
          color: #ff1717;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 30px;
          letter-spacing: 1px;
        }
        .bootcamp-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 12px;
          line-height: 1.3;
        }
        .bootcamp-desc {
          font-size: 0.95rem;
          color: #94a3b8;
          line-height: 1.65;
          margin: 0;
        }

        .bootcamp-right-cta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 14px;
          flex-shrink: 0;
        }
        .bootcamp-price-box {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .current-price {
          font-size: 2.4rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.5px;
        }
        .slashed-price {
          font-size: 1.1rem;
          color: #94a3b8;
          text-decoration: line-through;
        }
        .btn-bootcamp-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ff1717;
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(255, 23, 23, 0.4);
          transition: all 0.2s;
        }
        .btn-bootcamp-action:hover {
          background: #d91414;
          transform: translateY(-2px);
        }

        /* ── WHY CHOOSE DONZEN SECTION ── */
        .why-section {
          padding: 92px 24px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        .why-container {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 64px;
          align-items: center;
        }
        .why-img-col {
          position: relative;
        }
        .why-img {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }
        .experience-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: #0f172a;
          color: #ffffff;
          border: 2px solid #ff1717;
          border-radius: 14px;
          padding: 20px 24px;
          max-width: 200px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .exp-num {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ff1717;
          line-height: 1;
        }
        .exp-text {
          font-size: 0.82rem;
          color: #e2e8f0;
          font-weight: 600;
          margin-top: 4px;
        }

        .why-heading {
          font-size: 2.2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 16px;
          letter-spacing: -0.5px;
        }
        .why-lead-para {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .advantages-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .advantage-item {
          display: flex;
          gap: 20px;
        }
        .adv-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #ff1717;
          font-weight: 900;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
        }
        .adv-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .adv-desc {
          font-size: 0.92rem;
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        /* ── ESTIMATOR WIDGET ── */
        .estimator-section {
          padding: 88px 24px;
          background: #f8fafc;
        }
        .estimator-container {
          max-width: 1040px;
          margin: 0 auto;
        }
        .estimator-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .estimator-header h2 {
          font-size: 2.2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 10px;
        }
        .estimator-header p {
          font-size: 1.05rem;
          color: #64748b;
        }

        .estimator-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 40px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }
        .estimator-controls {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .control-label {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          display: block;
        }
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .choice-btn {
          padding: 14px 20px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 600;
          color: #334155;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .choice-btn:hover {
          border-color: #0f172a;
        }
        .choice-btn.active {
          border-color: #ff1717;
          background: rgba(255, 23, 23, 0.06);
          color: #ff1717;
          font-weight: 800;
          box-shadow: 0 0 0 1px #ff1717;
        }

        .estimator-result {
          background: #0f172a;
          color: #ffffff;
          border-radius: 16px;
          padding: 36px 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 16px 36px rgba(0,0,0,0.2);
        }
        .result-header {
          font-size: 0.75rem;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }
        .result-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 12px;
          line-height: 1.3;
        }
        .result-price {
          font-size: 2.4rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .period-text {
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .result-subtext {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0 0 24px;
        }

        /* ── TESTIMONIALS SECTION ── */
        .testimonials-section {
          padding: 88px 24px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
        }
        .testimonials-grid {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
        }
        .testimonial-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }
        .stars-row {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
        }
        .testimonial-quote {
          font-size: 0.98rem;
          color: #334155;
          line-height: 1.65;
          font-style: italic;
          margin: 0 0 24px;
        }
        .client-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .client-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #0f172a;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .client-name {
          font-weight: 800;
          color: #0f172a;
          font-size: 0.95rem;
        }
        .client-role {
          font-size: 0.82rem;
          color: #64748b;
        }

        /* ── FAQ SECTION ── */
        .faq-section {
          padding: 88px 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .faq-container {
          max-width: 860px;
          margin: 0 auto;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .faq-item {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item.open {
          border-color: #ff1717;
        }
        .faq-question {
          width: 100%;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          text-align: left;
          cursor: pointer;
        }
        .faq-toggle-icon {
          color: #ff1717;
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }
        .faq-toggle-icon.rotated {
          transform: rotate(180deg);
        }
        .faq-answer {
          padding: 0 24px 20px;
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.65;
          white-space: pre-line;
        }

        /* ── FINAL CTA BANNER ── */
        .final-cta-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          padding: 92px 24px;
          text-align: center;
          border-top: 3px solid #ff1717;
        }
        .final-cta-container {
          max-width: 840px;
          margin: 0 auto;
        }
        .final-cta-heading {
          font-size: clamp(2rem, 3.8vw, 3rem);
          font-weight: 900;
          margin: 12px 0 16px;
          letter-spacing: -0.8px;
        }
        .final-cta-desc {
          font-size: 1.1rem;
          color: #94a3b8;
          margin: 0 0 36px;
          line-height: 1.7;
        }
        .final-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* ── RESPONSIVE BREAKPOINTS (TABLET & MOBILE) ── */
        @media (max-width: 1024px) {
          .hero-container,
          .why-container,
          .estimator-card {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .image-frame-hero {
            min-height: 380px;
          }
          .experience-badge {
            position: relative;
            bottom: auto;
            right: auto;
            margin-top: 16px;
            max-width: 100%;
          }
          .bootcamp-right-cta {
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 48px 18px 56px;
          }
          .hero-headline {
            font-size: 2.2rem;
            line-height: 1.2;
          }
          .hero-description {
            font-size: 1rem;
          }
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }
          .btn-primary-cta, .btn-secondary-cta {
            width: 100%;
            justify-content: center;
          }

          /* Mobile Stats Grid - Perfect 3-Column Fit */
          .hero-stats-row {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
            padding-top: 20px !important;
            border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
            width: 100% !important;
          }
          .stat-card {
            align-items: center;
            text-align: center;
          }
          .stat-number {
            font-size: 1.25rem !important;
            line-height: 1.2;
          }
          .stat-label {
            font-size: 0.68rem !important;
            line-height: 1.3;
            margin-top: 2px;
          }
          .stat-divider {
            display: none !important;
          }

          .image-frame-hero {
            min-height: 320px;
          }
          .floating-metric-card {
            margin: 12px;
            padding: 14px 16px;
          }
          .full-card-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .bootcamp-right-cta {
            align-items: flex-start;
            width: 100%;
          }
          .btn-bootcamp-action {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

    </div>
  )
}
