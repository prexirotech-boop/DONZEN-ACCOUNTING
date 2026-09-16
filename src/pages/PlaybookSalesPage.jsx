import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCurrency } from '../context/CurrencyContext'

export default function PlaybookSalesPage() {
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState(null)
  const [bundleProduct, setBundleProduct] = useState(null)
  const [completeProduct, setCompleteProduct] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 14 * 60) // 2h 14m countdown
  const [showStickyCta, setShowStickyCta] = useState(false)

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 2 * 60 * 60))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sticky mobile CTA scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setShowStickyCta(true)
      } else {
        setShowStickyCta(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load Wistia scripts for 5t9i9o55vy
  useEffect(() => {
    const script1 = document.createElement('script')
    script1.src = 'https://fast.wistia.com/player.js'
    script1.async = true
    document.body.appendChild(script1)

    const script2 = document.createElement('script')
    script2.src = 'https://fast.wistia.com/embed/5t9i9o55vy.js'
    script2.async = true
    script2.type = 'module'
    document.body.appendChild(script2)

    return () => {
      try {
        document.body.removeChild(script1)
        document.body.removeChild(script2)
      } catch (e) {}
    }
  }, [])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Load single product and bundle product
  useEffect(() => {
    async function loadProducts() {
      try {
        const singleParam = searchParams.get('single') || searchParams.get('course') || searchParams.get('product')
        const bundleParam = searchParams.get('bundle')
        const completeParam = searchParams.get('complete')

        let configuredSingleId = null
        let configuredBundleId = null
        let configuredCompleteId = null
        try {
          const { data: siteConfigRow } = await supabase
            .from('settings')
            .select('value')
            .eq('id', 'site_config')
            .maybeSingle()
          if (siteConfigRow?.value) {
            configuredSingleId = siteConfigRow.value.landing_single_course_id
            configuredBundleId = siteConfigRow.value.landing_bundle_product_id
            configuredCompleteId = siteConfigRow.value.landing_complete_product_id
          }
        } catch (e) {}

        let singleProd = null
        if (singleParam) {
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(singleParam)
          const { data } = await supabase
            .from('products')
            .select('*')
            .eq(isUUID ? 'id' : 'slug', singleParam)
            .maybeSingle()
          if (data) singleProd = data
        }

        if (!singleProd && configuredSingleId) {
          const { data: cfgProd } = await supabase
            .from('products')
            .select('*')
            .eq('id', configuredSingleId)
            .maybeSingle()
          if (cfgProd) singleProd = cfgProd
        }

        if (!singleProd) {
          const { data: flagshipCourse } = await supabase
            .from('products')
            .select('*')
            .or('id.eq.60fc92d6-7bdc-42b7-b216-d95fcde36636,slug.eq.30-days-accounting,slug.eq.accounting-experience-programme')
            .eq('is_published', true)
            .limit(1)
            .maybeSingle()
          if (flagshipCourse) singleProd = flagshipCourse
        }

        if (!singleProd) {
          const { data: featuredCourse } = await supabase
            .from('products')
            .select('*')
            .eq('type', 'course')
            .eq('is_featured', true)
            .eq('is_published', true)
            .limit(1)
            .maybeSingle()
          if (featuredCourse) singleProd = featuredCourse
        }

        if (!singleProd) {
          const { data: latestCourse } = await supabase
            .from('products')
            .select('*')
            .eq('type', 'course')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (latestCourse) singleProd = latestCourse
        }

        if (singleProd) setProduct(singleProd)

        let bundleProd = null
        if (bundleParam) {
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bundleParam)
          const { data } = await supabase
            .from('products')
            .select('*')
            .eq(isUUID ? 'id' : 'slug', bundleParam)
            .maybeSingle()
          if (data) bundleProd = data
        }

        if (!bundleProd && configuredBundleId) {
          const { data: cfgBndl } = await supabase
            .from('products')
            .select('*')
            .eq('id', configuredBundleId)
            .maybeSingle()
          if (cfgBndl) bundleProd = cfgBndl
        }

        if (!bundleProd) {
          const { data: bySlug } = await supabase
            .from('products')
            .select('*')
            .or('slug.eq.30-days-bundle,slug.eq.master-course-bundle,slug.eq.accounting-mastery-bundle')
            .eq('is_published', true)
            .limit(1)
            .maybeSingle()
          if (bySlug) bundleProd = bySlug
        }

        if (!bundleProd) {
          const { data: featuredBundle } = await supabase
            .from('products')
            .select('*')
            .eq('type', 'bundle')
            .eq('is_featured', true)
            .eq('is_published', true)
            .limit(1)
            .maybeSingle()
          if (featuredBundle) bundleProd = featuredBundle
        }

        if (!bundleProd) {
          const { data: latestBundle } = await supabase
            .from('products')
            .select('*')
            .eq('type', 'bundle')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (latestBundle) bundleProd = latestBundle
        }

        if (bundleProd) setBundleProduct(bundleProd)

        let completeProd = null
        if (completeParam) {
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(completeParam)
          const { data } = await supabase
            .from('products')
            .select('*')
            .eq(isUUID ? 'id' : 'slug', completeParam)
            .maybeSingle()
          if (data) completeProd = data
        }

        if (!completeProd && configuredCompleteId) {
          const { data: cfgCmpl } = await supabase
            .from('products')
            .select('*')
            .eq('id', configuredCompleteId)
            .maybeSingle()
          if (cfgCmpl) completeProd = cfgCmpl
        }

        if (!completeProd) {
          const { data: bySlug } = await supabase
            .from('products')
            .select('*')
            .or('slug.eq.complete-experience,slug.eq.accounting-experience-complete,slug.eq.complete-package')
            .eq('is_published', true)
            .limit(1)
            .maybeSingle()
          if (bySlug) completeProd = bySlug
        }

        if (completeProd) setCompleteProduct(completeProd)
      } catch (err) {
        console.error('Error loading product:', err)
      }
    }
    loadProducts()
  }, [searchParams])

  const scrollToPricing = () => {
    const el = document.getElementById('pricing-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/checkout')
    }
  }

  const scrollToCurriculum = () => {
    const el = document.getElementById('curriculum-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSelectPlan = (planName) => {
    let target = '/checkout'
    if (planName === 'foundation') {
      target = product ? `/checkout?product=${product.id}&plan=foundation` : '/checkout?plan=foundation'
    } else if (planName === 'professional') {
      target = bundleProduct 
        ? `/checkout?product=${bundleProduct.id}&plan=professional` 
        : (product ? `/checkout?product=${product.id}&plan=professional` : '/checkout?plan=professional')
    } else if (planName === 'complete') {
      target = completeProduct 
        ? `/checkout?product=${completeProduct.id}&plan=complete` 
        : (bundleProduct ? `/checkout?product=${bundleProduct.id}&plan=complete` : (product ? `/checkout?product=${product.id}&plan=complete` : '/checkout?plan=complete'))
    }
    navigate(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <div className="cf-root">
      {/* Top Warning Hook */}
      <div className="cf-top-warning">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ATTENTION: Accounting Students, Graduates, Aspiring Accountants, Bookkeepers &amp; Finance Professionals...
        </span>
      </div>

      {/* Evergreen Urgent Timer Banner */}
      <div className="cf-timer-banner">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          REGISTRATION ONGOING: Cohort filling fast! Early-registration rate secures in <strong className="cf-timer">{formatTime(timeLeft)}</strong>
        </span>
      </div>

      {/* Main Funnel Container */}
      <div className="cf-container">
        
        {/* Minimal Header with Certificate Dark Style Logo */}
        <header className="cf-header">
          <Link to="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#09090b', padding: '10px 20px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img src="/logo.png" alt="Donzen Accounting Hub" style={{ height: 38, width: 'auto', display: 'block' }} />
            </div>
          </Link>
        </header>

        {/* Hero Section */}
        <section className="cf-hero">
          <div className="cf-hero-badge">
            <span>DONZEN ACCOUNTING EXPERIENCE PROGRAM</span>
          </div>

          <h1 className="cf-title">You Know Accounting. Now Learn How to Actually Do It.</h1>
          <p className="cf-subtitle">
            Turn accounting knowledge into practical workplace capability in 30 days.
          </p>

          {/* Real Embedded Wistia Video Sales Letter */}
          <div className="cf-vsl-wrapper">
            <div className="cf-vsl-player">
              <wistia-player media-id="5t9i9o55vy" aspect="0.5625"></wistia-player>
            </div>
          </div>

          {/* First Block of Content */}
          <div className="cf-sales-intro-block">
            <p>
              The <strong>Donzen Accounting Experience Program</strong> is a practical workplace online accounting experience designed to help accounting students, graduates, aspiring accountants, bookkeepers and finance professionals bridge the gap between learning accounting and actually performing accounting work.
            </p>
            <p className="cf-highlight-text">
              You won't just watch accounting lessons.
            </p>
            <p>
              You will learn the process, practise the work, review your output and build the confidence to perform practical accounting tasks in real-world business situations.
            </p>
          </div>

          {/* Signature Mechanism Ribbon */}
          <div className="cf-mechanism-ribbon">
            <div className="cf-mechanism-item">
              <span className="cf-mech-num">01</span>
              <span className="cf-mech-name">LEARN</span>
            </div>
            <span className="cf-mech-arrow">→</span>
            <div className="cf-mechanism-item">
              <span className="cf-mech-num">02</span>
              <span className="cf-mech-name">PRACTISE</span>
            </div>
            <span className="cf-mech-arrow">→</span>
            <div className="cf-mechanism-item">
              <span className="cf-mech-num">03</span>
              <span className="cf-mech-name">REVIEW</span>
            </div>
            <span className="cf-mech-arrow">→</span>
            <div className="cf-mechanism-item">
              <span className="cf-mech-num">04</span>
              <span className="cf-mech-name">PERFORM</span>
            </div>
          </div>

          {/* Primary CTA 01 (Immediately after hero) */}
          <div style={{ marginTop: 32, marginBottom: 12 }}>
            <button className="cf-cta-btn pulsing-cta" onClick={scrollToPricing}>
              <span>JOIN THE NEXT COHORT</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <div style={{ marginTop: 12 }}>
              <button 
                type="button" 
                onClick={scrollToCurriculum}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                SEE WHAT YOU'LL LEARN ↓
              </button>
            </div>
          </div>

          {/* Trust Features Bar */}
          <div className="cf-trust-feature-bar">
            <span>Practical assignments</span>
            <span>•</span>
            <span>Realistic business scenarios</span>
            <span>•</span>
            <span>Accounting software exposure</span>
            <span>•</span>
            <span>Templates &amp; tools</span>
            <span>•</span>
            <span>Guided learning</span>
            <span>•</span>
            <span>Certificate upon completion</span>
          </div>
        </section>
      </div>

      {/* Section 2: The Reality Check */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>You Can Know Accounting and Still Not Know How to Do the Work.</h2>
          </div>

          <div className="cf-text-block">
            <p>You passed the accounting courses.</p>
            <p>You understand debits and credits.</p>
            <p>You may even have a degree, diploma or professional qualification.</p>
            <p className="cf-bold-callout">
              But then someone hands you real workplace documents:
            </p>
          </div>

          <div className="cf-bullets-container">
            <div className="cf-bullets-grid">
              {[
                'A bank statement',
                'Sales invoices',
                'Purchase invoices',
                'Receipts',
                'Payment vouchers',
                'Supplier balances',
                'Customer balances',
                'Inventory records',
                'Payroll information',
                'Expenses',
                'Accounting software',
                'A pile of transactions'
              ].map((doc, i) => (
                <div key={i} className="cf-bullet-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cf-bullet-icon"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cf-question-box">
            <p className="cf-q-text">&hellip;and suddenly the question becomes:</p>
            <h3 className="cf-q-highlight">&ldquo;Where do I start?&rdquo;</h3>
            <p>That's the problem. And it is much bigger than not knowing accounting theory.</p>
            <p className="cf-callout-red">It's the knowledge–experience gap.</p>
          </div>
        </div>
      </section>

      {/* Section 3: The Knowledge-Experience Gap */}
      <section className="cf-section cf-bg-cream">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>The Knowledge–Experience Gap</h2>
          </div>

          <div className="cf-split-table-grid">
            <div className="cf-table-col cf-col-left">
              <h3 className="cf-table-header">Traditional Accounting Education Teaches:</h3>
              <div className="cf-table-content">
                <p className="cf-table-big-label">WHAT accounting is.</p>
                <p className="cf-table-subtext">Memorising textbook definitions, academic equations, and standard classroom rules.</p>
              </div>
            </div>

            <div className="cf-table-col cf-col-right">
              <h3 className="cf-table-header">The Workplace Expects You to Know:</h3>
              <div className="cf-table-content">
                <p className="cf-table-big-label red">HOW accounting is done.</p>
                <p className="cf-table-subtext">Handling live invoices, reconciling ledgers, operating software, and producing accurate reports.</p>
              </div>
            </div>
          </div>

          <div className="cf-gap-questions-card">
            <h4>In the real workplace, you need to know:</h4>
            <div className="cf-gap-questions-grid">
              {[
                'What should be recorded?',
                'Which document supports the transaction?',
                'Which account should be affected?',
                'How should the transaction be entered?',
                'How does it affect the ledger?',
                'How do you reconcile it?',
                'How do you identify an error?',
                'How do you correct it?',
                'What report does it affect?',
                'How do you explain the numbers?',
                'How do you use accounting software to complete the process?'
              ].map((q, i) => (
                <div key={i} className="cf-gap-q-item">
                  <span className="cf-gap-q-bullet">?</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cf-summary-box">
            <p>That is the difference between knowing accounting and being able to perform accounting work.</p>
          </div>

          {/* CTA 02: After explaining the knowledge–experience gap */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="cf-cta-btn cf-btn-secondary" onClick={scrollToCurriculum}>
              <span>SEE WHAT YOU'LL LEARN</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Where Many Careers Get Stuck */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>And This Is Where Many Accounting Careers Get Stuck.</h2>
          </div>

          <div className="cf-stuck-grid">
            <div className="cf-stuck-card">
              <div className="cf-stuck-icon">🎓</div>
              <p>You may have the qualification. <strong>But employers ask for experience.</strong></p>
            </div>
            <div className="cf-stuck-card">
              <div className="cf-stuck-icon">💻</div>
              <p>You may have studied QuickBooks or Sage. <strong>But you've never managed a realistic set of business transactions.</strong></p>
            </div>
            <div className="cf-stuck-card">
              <div className="cf-stuck-icon">📊</div>
              <p>You may understand financial statements. <strong>But you've never built them from source documents.</strong></p>
            </div>
            <div className="cf-stuck-card">
              <div className="cf-stuck-icon">📑</div>
              <p>You may know bookkeeping. <strong>But you've never handled a complete accounting workflow from beginning to end.</strong></p>
            </div>
          </div>

          <div className="cf-confidence-punch">
            <p>You may be applying for accounting jobs. But your confidence disappears when someone asks:</p>
            <blockquote className="cf-punch-quote">&ldquo;Have you actually done this before?&rdquo;</blockquote>
            <p className="cf-punch-footer">Donzen was built to address that gap.</p>
          </div>
        </div>
      </section>

      {/* Section 5: Meet The Program & The 5 Pillars */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <span className="cf-section-tag">A COMPLETE SYSTEM</span>
            <h2>Meet the Donzen Accounting Experience Program</h2>
            <p className="cf-section-lead">This isn't just another accounting course. It is a practical workplace accounting experience system.</p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 16, color: '#475569', maxWidth: 680, margin: '0 auto 36px' }}>
            The Donzen Accounting Experience Program combines 5 essential workplace pillars:
          </p>

          <div className="cf-pillars-grid">
            <div className="cf-pillar-card">
              <div className="cf-pillar-badge">01</div>
              <h3>KNOWLEDGE</h3>
              <p>Understand the accounting principles behind the work.</p>
            </div>
            <div className="cf-pillar-card">
              <div className="cf-pillar-badge">02</div>
              <h3>SKILLS</h3>
              <p>Learn how to perform practical workplace accounting tasks.</p>
            </div>
            <div className="cf-pillar-card">
              <div className="cf-pillar-badge">03</div>
              <h3>EXPERIENCE</h3>
              <p>Work through realistic business situations and accounting workflows.</p>
            </div>
            <div className="cf-pillar-card">
              <div className="cf-pillar-badge">04</div>
              <h3>TECHNOLOGY</h3>
              <p>Build exposure to modern accounting tools and cloud-based workflows.</p>
            </div>
            <div className="cf-pillar-card">
              <div className="cf-pillar-badge">05</div>
              <h3>CONFIDENCE</h3>
              <p>Develop the ability to approach accounting tasks with structure and clarity.</p>
            </div>
          </div>

          <div className="cf-goal-banner">
            <span>Our goal is simple:</span>
            <h3 style={{ margin: '8px 0 0', color: '#09090b', fontSize: 'clamp(1.2rem, 3vw, 1.7rem)' }}>
              Turn &ldquo;I studied accounting&rdquo; into &ldquo;I can perform practical workplace accounting work.&rdquo;
            </h3>
          </div>
        </div>
      </section>

      {/* Section 6: Our Signature Method */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <span className="cf-section-tag red">OUR SIGNATURE METHOD</span>
            <h2>LEARN → PRACTISE → REVIEW → PERFORM</h2>
            <p className="cf-section-lead">Most courses stop at Learn. Donzen doesn't.</p>
          </div>

          <div className="cf-steps-row">
            <div className="cf-step-box">
              <span className="cf-step-num">01</span>
              <h4>LEARN</h4>
              <p>Understand the accounting concept, process and reason behind the task.</p>
            </div>
            <div className="cf-step-box">
              <span className="cf-step-num">02</span>
              <h4>PRACTISE</h4>
              <p>Apply what you've learned to practical workplace accounting exercises and realistic business scenarios.</p>
            </div>
            <div className="cf-step-box">
              <span className="cf-step-num">03</span>
              <h4>REVIEW</h4>
              <p>Examine your work. Identify errors. Understand what went wrong. Learn how to improve.</p>
            </div>
            <div className="cf-step-box">
              <span className="cf-step-num">04</span>
              <h4>PERFORM</h4>
              <p>Build the confidence to complete similar accounting tasks independently.</p>
            </div>
          </div>

          <div className="cf-standard-box">
            <h4>THIS IS HOW WE TURN KNOWLEDGE INTO EXPERIENCE.</h4>
            <p className="cf-standard-sub">
              Instead of simply asking: <em>&ldquo;Did you finish the lesson?&rdquo;</em>
            </p>
            <p className="cf-standard-main">
              We ask: <strong>&ldquo;Can you perform the task?&rdquo;</strong>
            </p>
            <span className="cf-standard-tag">That's the Donzen standard.</span>
          </div>
        </div>
      </section>

      {/* Section 7: Before vs After 30 Days */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Imagine the Difference 30 Days Can Make.</h2>
          </div>

          <div className="cf-before-after-grid">
            {/* Before Column */}
            <div className="cf-ba-col cf-ba-before">
              <div className="cf-ba-header">
                <span className="cf-ba-icon">✕</span>
                <h3>BEFORE DONZEN</h3>
              </div>
              <ul className="cf-ba-list">
                <li>You know accounting theory.</li>
                <li>You struggle to apply it.</li>
                <li>You lack practical exposure.</li>
                <li>You are unfamiliar with complete accounting workflows.</li>
                <li>You aren't confident using accounting software.</li>
                <li>You hesitate when asked to perform unfamiliar accounting tasks.</li>
                <li>You keep hearing: <strong>&ldquo;Experience required.&rdquo;</strong></li>
              </ul>
            </div>

            {/* After Column */}
            <div className="cf-ba-col cf-ba-after">
              <div className="cf-ba-header">
                <span className="cf-ba-icon">✓</span>
                <h3>AFTER DONZEN</h3>
              </div>
              <ul className="cf-ba-list">
                <li>You understand the accounting process.</li>
                <li>You can work with source documents.</li>
                <li>You can record and classify transactions.</li>
                <li>You understand customer and supplier accounting.</li>
                <li>You can perform bank reconciliation.</li>
                <li>You can work with accounting software.</li>
                <li>You understand how transactions flow into financial reports.</li>
                <li>You have practised realistic accounting scenarios.</li>
                <li>You approach accounting work with greater structure and confidence.</li>
              </ul>
            </div>
          </div>

          <div className="cf-transformation-strip">
            <span>THE TRANSFORMATION:</span>
            <h3>FROM KNOWING ACCOUNTING → TO BEING ABLE TO DO ACCOUNTING.</h3>
          </div>
        </div>
      </section>

      {/* Section 8: Curriculum Section */}
      <section className="cf-section cf-bg-gray" id="curriculum-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <span className="cf-section-tag red">WHAT YOU WILL LEARN</span>
            <h2>A Practical Accounting Curriculum Built Around the Workplace</h2>
            <p className="cf-section-lead">
              The Donzen Accounting Experience Program brings together the practical systems an accountant, bookkeeper or finance professional needs to understand.
            </p>
          </div>

          <div className="cf-modules-list">
            {/* Module 1 */}
            <div className="cf-module-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 01</span>
                <h3>ACCOUNTING OPERATIONS</h3>
                <p className="cf-mod-tagline">Build the foundation for professional accounting work.</p>
              </div>
              <div className="cf-mod-body">
                <h4>You'll learn about:</h4>
                <div className="cf-mod-bullets">
                  <span>Accounting principles in practical business situations</span>
                  <span>Accounting records</span>
                  <span>Source documents</span>
                  <span>Filing systems</span>
                  <span>Payment vouchers</span>
                  <span>Receipt documentation</span>
                  <span>Transaction documentation</span>
                  <span>Accounting workflows</span>
                  <span>Office administration</span>
                  <span>Accounting procedures</span>
                  <span>Standard operating procedures</span>
                  <span>Data accuracy</span>
                  <span>Data security</span>
                  <span>Accounting process controls</span>
                </div>
                <div className="cf-mod-objective">
                  <strong>The objective:</strong> Understand how accounting information enters a business and how it should be organised.
                </div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="cf-module-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 02</span>
                <h3>BOOKKEEPING OPERATIONS</h3>
                <p className="cf-mod-tagline">Turn transactions into organised accounting records.</p>
              </div>
              <div className="cf-mod-body">
                <h4>You'll work with:</h4>
                <div className="cf-mod-bullets">
                  <span>Income recording</span>
                  <span>Expense recording</span>
                  <span>Cash transactions</span>
                  <span>Bank transactions</span>
                  <span>Sales</span>
                  <span>Purchases</span>
                  <span>Receipts</span>
                  <span>Payments</span>
                  <span>General ledger</span>
                  <span>Chart of accounts</span>
                  <span>Account classification</span>
                  <span>Transaction processing</span>
                  <span>Bank reconciliation</span>
                  <span>Error identification</span>
                  <span>Accounting adjustments</span>
                </div>
                <div className="cf-mod-objective">
                  <strong>The objective:</strong> Understand the complete flow from transaction → record → ledger → reconciliation → report.
                </div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="cf-module-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 03</span>
                <h3>CUSTOMERS, SUPPLIERS &amp; WORKING CAPITAL</h3>
                <p className="cf-mod-tagline">Learn how businesses manage the money coming in and going out.</p>
              </div>
              <div className="cf-mod-body">
                <div className="cf-mod-subgrid">
                  <div>
                    <h4 style={{ color: '#09090b', fontWeight: 800 }}>Accounts Receivable:</h4>
                    <div className="cf-mod-bullets">
                      <span>Customer records</span>
                      <span>Sales invoices</span>
                      <span>Customer payments</span>
                      <span>Outstanding balances</span>
                      <span>Receivables reconciliation</span>
                      <span>Customer statements</span>
                      <span>Aging analysis</span>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ color: '#09090b', fontWeight: 800 }}>Accounts Payable:</h4>
                    <div className="cf-mod-bullets">
                      <span>Supplier records</span>
                      <span>Purchase invoices</span>
                      <span>Supplier payments</span>
                      <span>Outstanding balances</span>
                      <span>Payables reconciliation</span>
                      <span>Supplier statements</span>
                      <span>Aging analysis</span>
                    </div>
                  </div>
                </div>
                <div className="cf-mod-objective">
                  <strong>The objective:</strong> Understand how customer and supplier transactions affect the financial position of a business.
                </div>
              </div>
            </div>

            {/* Module 4 */}
            <div className="cf-module-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 04</span>
                <h3>INVENTORY &amp; BUSINESS CONTROLS</h3>
                <p className="cf-mod-tagline">Accounting doesn't happen in isolation. For businesses that sell products, inventory can determine whether the numbers make sense.</p>
              </div>
              <div className="cf-mod-body">
                <h4>You'll learn about:</h4>
                <div className="cf-mod-bullets">
                  <span>Inventory records</span>
                  <span>Purchases &amp; Sales</span>
                  <span>Stock movement</span>
                  <span>Cost of goods</span>
                  <span>Inventory reconciliation</span>
                  <span>Inventory controls</span>
                  <span>Stock documentation</span>
                  <span>Inventory reporting</span>
                  <span>Identifying discrepancies</span>
                </div>
                <div className="cf-mod-objective">
                  <strong>The objective:</strong> Understand how inventory transactions connect with accounting records and financial reporting.
                </div>
              </div>
            </div>

            {/* Module 5 */}
            <div className="cf-module-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 05</span>
                <h3>PAYROLL &amp; TAX</h3>
                <p className="cf-mod-tagline">Understand the accounting processes surrounding employees and statutory obligations.</p>
              </div>
              <div className="cf-mod-body">
                <h4>You'll explore:</h4>
                <div className="cf-mod-bullets">
                  <span>Payroll accounting</span>
                  <span>Payroll records</span>
                  <span>Staff-related expenses</span>
                  <span>Payroll templates</span>
                  <span>Basic payroll processing</span>
                  <span>VAT (Value Added Tax)</span>
                  <span>Withholding Tax (WHT)</span>
                  <span>Company income tax concepts</span>
                  <span>Tax-related accounting records</span>
                  <span>Compliance documentation</span>
                </div>
                <div className="cf-disclaimer-note">
                  <strong>Important:</strong> This programme is designed to build practical accounting understanding. It does not replace professional tax, legal or regulatory advice where such advice is required.
                </div>
              </div>
            </div>

            {/* Module 6 */}
            <div className="cf-module-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 06</span>
                <h3>FINANCIAL REPORTING</h3>
                <p className="cf-mod-tagline">Move beyond recording transactions. Learn how accounting information becomes useful financial information.</p>
              </div>
              <div className="cf-mod-body">
                <h4>You'll work with:</h4>
                <div className="cf-mod-bullets">
                  <span>Trial balance concepts</span>
                  <span>Profit &amp; Loss statement</span>
                  <span>Balance Sheet</span>
                  <span>General ledger reconciliation</span>
                  <span>Accounts receivable reports</span>
                  <span>Accounts payable reports</span>
                  <span>Cash-flow information</span>
                  <span>Management reports</span>
                  <span>Financial analysis</span>
                  <span>Year-end accounting support</span>
                  <span>Financial projections</span>
                </div>
                <div className="cf-mod-objective">
                  <strong>The objective:</strong> Understand not only how numbers are recorded, but also what the numbers are telling the business.
                </div>
              </div>
            </div>

            {/* Module 7 */}
            <div className="cf-module-card cf-tech-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 07</span>
                <h3>ACCOUNTING TECHNOLOGY</h3>
                <p className="cf-mod-tagline">Because modern accounting is no longer just about spreadsheets. Gain practical exposure to digital workflows.</p>
              </div>
              <div className="cf-mod-body">
                <div className="cf-tech-grid">
                  {/* Sage */}
                  <div className="cf-tech-block">
                    <div className="cf-tech-tag">SAGE ONLINE</div>
                    <p className="cf-tech-desc">Learn how cloud accounting software can be used to manage real business records.</p>
                    <div className="cf-tech-sublist">
                      <span>Setup and navigation</span>
                      <span>Dashboard and workflow</span>
                      <span>Customers &amp; Suppliers</span>
                      <span>Sales invoices &amp; Purchases</span>
                      <span>Receipts, Payments &amp; Expenses</span>
                      <span>Accounts receivable &amp; payable</span>
                      <span>Bank transactions &amp; reconciliation</span>
                      <span>Chart of accounts &amp; reports</span>
                      <span>Profit &amp; Loss &amp; Balance Sheet</span>
                    </div>
                    <div className="cf-tech-callout">
                      <strong>From Software Training to Workplace Experience:</strong> Understand what should be recorded, why, where, what effect it will have, and which report it impacts.
                    </div>
                  </div>

                  {/* QuickBooks */}
                  <div className="cf-tech-block">
                    <div className="cf-tech-tag">QUICKBOOKS</div>
                    <p className="cf-tech-desc">Develop practical familiarity with one of the world's widely used accounting platforms.</p>
                    <div className="cf-tech-sublist">
                      <span>Company setup</span>
                      <span>Customers &amp; Vendors</span>
                      <span>Products &amp; services setup</span>
                      <span>Sales, Expenses, Invoices &amp; Bills</span>
                      <span>Payments &amp; Banking</span>
                      <span>Bank reconciliation</span>
                      <span>Financial statements &amp; reports</span>
                    </div>
                    <div className="cf-tech-callout">
                      <strong>The objective is not merely:</strong> &ldquo;I watched a QuickBooks course.&rdquo; The objective is: <strong>&ldquo;I understand how QuickBooks can be used to perform accounting work.&rdquo;</strong>
                    </div>
                  </div>

                  {/* Excel */}
                  <div className="cf-tech-block">
                    <div className="cf-tech-tag">MICROSOFT EXCEL</div>
                    <p className="cf-tech-desc">Build the spreadsheet skills required for everyday accounting work.</p>
                    <div className="cf-tech-sublist">
                      <span>Data organisation</span>
                      <span>Transaction schedules</span>
                      <span>Accounting templates</span>
                      <span>Reconciliation calculations</span>
                      <span>Financial reporting &amp; analysis</span>
                      <span>Spreadsheet-based workflows</span>
                    </div>
                  </div>

                  {/* Toolkit */}
                  <div className="cf-tech-block">
                    <div className="cf-tech-tag">DONZEN ACCOUNTING TOOLKIT</div>
                    <p className="cf-tech-desc">
                      Gain exposure to practical accounting templates and tools designed to help organise business records and financial information.
                    </p>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 0' }}>
                      Donzen's broader technology ecosystem includes ready tools for sales, expenses, inventory, payables, receivables, payroll, reconciliation and reporting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 8 */}
            <div className="cf-module-card cf-project-card">
              <div className="cf-module-header">
                <span className="cf-mod-badge">MODULE 08</span>
                <h3>PRACTICAL BUSINESS PROJECTS</h3>
                <p className="cf-mod-tagline" style={{ fontWeight: 800, color: '#ff1717' }}>THIS IS WHERE THE EXPERIENCE COMES TOGETHER.</p>
              </div>
              <div className="cf-mod-body">
                <div className="cf-simulation-box">
                  <h4>Simulated Workplace Scenario: ABC RETAIL LTD.</h4>
                  <p>Imagine you are hired or supporting a realistic business. You receive:</p>
                  <div className="cf-mod-bullets" style={{ margin: '14px 0 18px' }}>
                    <span>Bank statements</span>
                    <span>Sales invoices</span>
                    <span>Purchase invoices</span>
                    <span>Customer receipts</span>
                    <span>Supplier payments</span>
                    <span>Expense receipts</span>
                    <span>Inventory records</span>
                    <span>Payroll information</span>
                    <span>Business expenses</span>
                    <span>Customer balances</span>
                    <span>Supplier balances</span>
                  </div>
                  <p style={{ fontWeight: 700, color: '#09090b', margin: '16px 0 10px' }}>
                    Your job isn't to read about accounting. Your job is to execute the 10-step workplace accounting process:
                  </p>
                  <div className="cf-steps-ten-grid">
                    {[
                      'Review the source documents.',
                      'Identify and classify transactions.',
                      'Record the transactions.',
                      'Update the appropriate accounts.',
                      'Review customer and supplier balances.',
                      'Reconcile the bank.',
                      'Identify discrepancies.',
                      'Make appropriate adjustments.',
                      'Generate financial reports.',
                      'Review and interpret the results.'
                    ].map((step, idx) => (
                      <div key={idx} className="cf-ten-step-item">
                        <span className="cf-step-tag">STEP {String(idx + 1).padStart(2, '0')}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#09090b', margin: 0 }}>
                      That's practical accounting. Not just watching. Doing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Section: What does practical actually mean? */}
          <div className="cf-practical-breakdown">
            <h3>WHAT DOES &ldquo;PRACTICAL&rdquo; ACTUALLY MEAN?</h3>
            <div className="cf-practical-grid">
              <div className="cf-practical-item">
                <div className="cf-prac-bad">It means you aren't only learning:</div>
                <div className="cf-prac-quote">&ldquo;A bank reconciliation is...&rdquo;</div>
                <div className="cf-prac-good">You're learning:</div>
                <div className="cf-prac-action">
                  &ldquo;Here is a bank statement. Here are the accounting records. Find the difference. Investigate it. Reconcile the account. Explain the result.&rdquo;
                </div>
              </div>

              <div className="cf-practical-item">
                <div className="cf-prac-bad">You're not only learning:</div>
                <div className="cf-prac-quote">&ldquo;Accounts receivable means...&rdquo;</div>
                <div className="cf-prac-good">You're learning:</div>
                <div className="cf-prac-action">
                  &ldquo;Here are five customer invoices and three payments. Determine the outstanding balances and identify the overdue accounts.&rdquo;
                </div>
              </div>

              <div className="cf-practical-item">
                <div className="cf-prac-bad">You're not only learning:</div>
                <div className="cf-prac-quote">&ldquo;Profit &amp; Loss shows...&rdquo;</div>
                <div className="cf-prac-good">You're learning:</div>
                <div className="cf-prac-action">
                  &ldquo;Here are the transactions. Organise them correctly and produce the financial information needed to understand the business.&rdquo;
                </div>
              </div>
            </div>
            <div className="cf-difference-banner">That is the Donzen difference.</div>
          </div>

          {/* CTA 03 & 05: Curriculum closure */}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button className="cf-cta-btn pulsing-cta" onClick={scrollToPricing}>
              <span>START YOUR 30-DAY EXPERIENCE</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section 9: The 30-Day Experience Roadmap */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <span className="cf-section-tag">FOUR WEEKS OF STRUCTURE</span>
            <h2>The 30-Day Donzen Experience</h2>
            <p className="cf-section-lead">Four weeks of structured practical development designed around real workplace rhythms.</p>
          </div>

          <div className="cf-weeks-grid">
            <div className="cf-week-card">
              <div className="cf-week-header">
                <span className="cf-week-label">WEEK 1</span>
                <h3>BUILD THE FOUNDATION</h3>
              </div>
              <p className="cf-week-body">
                Understand accounting operations, source documents, records, processes and transaction flows.
              </p>
              <div className="cf-week-focus">Focus: Understand the work.</div>
            </div>

            <div className="cf-week-card">
              <div className="cf-week-header">
                <span className="cf-week-label">WEEK 2</span>
                <h3>PERFORM THE CORE TASKS</h3>
              </div>
              <p className="cf-week-body">
                Work with income, expenses, sales, purchases, customers, suppliers, receivables, payables and bank transactions.
              </p>
              <div className="cf-week-focus">Focus: Practise the work.</div>
            </div>

            <div className="cf-week-card">
              <div className="cf-week-header">
                <span className="cf-week-label">WEEK 3</span>
                <h3>APPLY ACCOUNTING TECH</h3>
              </div>
              <p className="cf-week-body">
                Work with accounting software (Sage Online, QuickBooks), spreadsheets, templates and digital accounting workflows.
              </p>
              <div className="cf-week-focus">Focus: Use the tools.</div>
            </div>

            <div className="cf-week-card">
              <div className="cf-week-header">
                <span className="cf-week-label">WEEK 4</span>
                <h3>PUT IT ALL TOGETHER</h3>
              </div>
              <p className="cf-week-body">
                Work through practical business scenarios, review your work and develop confidence in completing accounting processes.
              </p>
              <div className="cf-week-focus">Focus: Perform the work.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: What You Get */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>What You Get</h2>
            <p className="cf-section-lead">Your Donzen experience is more than access to video lessons.</p>
          </div>

          <div className="cf-get-grid">
            {[
              { title: 'The 30-Day Accounting Experience', desc: 'A structured practical learning journey designed to build competence.' },
              { title: 'Practical Assignments', desc: 'Hands-on exercises designed to help you immediately apply what you learn.' },
              { title: 'Accounting Workflows', desc: 'Understand how individual accounting tasks connect across an entire business.' },
              { title: 'Software Training', desc: 'Practical exposure to industry cloud accounting technology and tools.' },
              { title: 'Templates & Tools', desc: 'Use professional workplace resources to support your accounting work.' },
              { title: 'Business Scenarios', desc: 'Work through realistic accounting situations simulated from actual firms.' },
              { title: 'Review & Support', desc: 'Receive guidance, community support, and feedback throughout your experience.' },
              { title: 'Verified Certificate', desc: 'Receive an official certificate upon meeting the programme\'s completion requirements.' },
              { title: 'One (1) Year Extended Access', desc: 'Enjoy full 365 days of platform access so you can revisit exercises anytime.' }
            ].map((item, idx) => (
              <div key={idx} className="cf-get-card">
                <div className="cf-get-check">✓</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: Who Is This For / Not For */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <span className="cf-section-tag red">AUDIENCE ALIGNMENT</span>
            <h2>Who Is This For?</h2>
            <p className="cf-section-lead">The Donzen Accounting Experience Program is built for:</p>
          </div>

          <div className="cf-who-grid">
            {[
              { role: 'ACCOUNTING STUDENTS', text: 'You\'ve learned the theory. Now you want practical experience.' },
              { role: 'FRESH GRADUATES', text: 'You\'re ready to enter the workplace and want more than a certificate.' },
              { role: 'ASPIRING ACCOUNTANTS', text: 'You want to build practical accounting competence that commands respect.' },
              { role: 'BOOKKEEPERS', text: 'You want to strengthen your bookkeeping systems, speed, and workflow.' },
              { role: 'EARLY-CAREER PROFESSIONALS', text: 'You want to become more confident performing real accounting tasks.' },
              { role: 'CAREER SWITCHERS', text: 'You want a structured, practical introduction to real workplace accounting work.' },
              { role: 'FINANCE & ADMIN PROFESSIONALS', text: 'You want to understand the accounting processes connected to your role.' },
              { role: 'FREELANCERS & ENTREPRENEURS', text: 'You want to understand how accounting works inside a real business.' }
            ].map((who, i) => (
              <div key={i} className="cf-who-card">
                <div className="cf-who-badge">TARGET PROFILE</div>
                <h4>{who.role}</h4>
                <p>{who.text}</p>
              </div>
            ))}
          </div>

          {/* Who this is not for */}
          <div className="cf-not-for-box">
            <h3>WHO THIS PROGRAM IS NOT FOR</h3>
            <p className="cf-not-for-sub">This programme is probably not for you if:</p>
            <div className="cf-not-for-list">
              <span>✕ You only want theoretical accounting lectures.</span>
              <span>✕ You are looking for a guaranteed job without putting in effort.</span>
              <span>✕ You expect a certificate without doing the work.</span>
              <span>✕ You want an instant-income scheme.</span>
              <span>✕ You are unwilling to practise.</span>
              <span>✕ You are looking for a &ldquo;get rich quick&rdquo; programme.</span>
              <span>✕ You want someone else to complete your assignments.</span>
            </div>
            <div className="cf-not-for-conclusion">
              Donzen is for people who want to build capability. You don't need to know everything before you start. But you do need to be willing to learn, practise and improve.
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: Why Donzen & Stats */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <span className="cf-section-tag red">THE DONZEN ADVANTAGE</span>
            <h2>Why Donzen?</h2>
          </div>

          <div className="cf-why-text-block">
            <p>There are plenty of accounting courses.</p>
            <p>There are plenty of YouTube tutorials.</p>
            <p>There are plenty of accounting software demonstrations.</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#09090b', margin: '20px 0' }}>So why Donzen?</p>
            <p>Because we don't believe the biggest problem is a lack of information. The internet already has information everywhere.</p>
            <p className="cf-highlight-text" style={{ fontSize: 18 }}>
              The bigger problem is knowing how to turn information into practical ability.
            </p>
            <p>
              That's why Donzen brings together:
            </p>
            <div className="cf-eq-banner">
              KNOWLEDGE + SKILLS + EXPERIENCE + TECHNOLOGY
            </div>
            <p style={{ marginTop: 14 }}>
              into one unified practical learning environment.
            </p>
          </div>

          {/* 4 Stats */}
          <div className="cf-stats-grid">
            <div className="cf-stat-card">
              <div className="cf-stat-num">500+</div>
              <div className="cf-stat-label">PEOPLE TRAINED</div>
            </div>
            <div className="cf-stat-card">
              <div className="cf-stat-num">30</div>
              <div className="cf-stat-label">DAYS PRACTICAL EXPERIENCE</div>
            </div>
            <div className="cf-stat-card">
              <div className="cf-stat-num">4</div>
              <div className="cf-stat-label">CORE ELEMENTS</div>
            </div>
            <div className="cf-stat-card">
              <div className="cf-stat-num">100%</div>
              <div className="cf-stat-label">ONLINE LEARN FROM ANYWHERE</div>
            </div>
          </div>

          <div className="cf-show-box">
            <h3>DON'T JUST TELL PEOPLE YOU KNOW ACCOUNTING. SHOW THEM WHAT YOU CAN DO.</h3>
            <p>A qualification can tell someone what you studied. A certificate can tell someone what you completed. But practical capability shows what you can actually do. That's what we're building at Donzen.</p>
          </div>

          {/* What learners say */}
          <div className="cf-sayings-card">
            <h4>What our learners should be able to say after Donzen:</h4>
            <div className="cf-sayings-grid">
              {[
                'I understand how accounting transactions flow through a business.',
                'I know how to work with source documents.',
                'I can record and classify transactions.',
                'I understand customer and supplier accounting.',
                'I can work through a bank reconciliation.',
                'I understand how accounting software connects with accounting processes.',
                'I can generate and interpret basic financial reports.',
                'I have actually practised accounting work.'
              ].map((saying, idx) => (
                <div key={idx} className="cf-saying-item">
                  <span className="cf-saying-quote">&ldquo;</span>
                  <span>{saying}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Proof Wall */}
          <div className="cf-proof-wall" style={{ marginTop: 40 }}>
            <h3 style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, color: '#09090b', marginBottom: 24 }}>
              THE DONZEN PROOF WALL
            </h3>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <img 
                src="/donzen-proof-wall.png" 
                alt="Donzen Wall of Proof - Real Learning. Real Work. Real Results." 
                className="cf-proof-wall-img"
                style={{ 
                  width: '100%', 
                  maxWidth: 960, 
                  height: 'auto', 
                  borderRadius: 12, 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  display: 'inline-block' 
                }} 
              />
            </div>
            <div className="cf-reviews-grid">
              <div className="cf-review-card">
                <div className="cf-rev-stars">★★★★★</div>
                <p className="cf-rev-body">&ldquo;During my NYSC, I kept failing interviews because I had zero software exposure. After 30 days with Donzen working through actual bank reconciliations and Sage, I cleared my first interview with a logistics firm in Ikeja!&rdquo;</p>
                <div className="cf-rev-author">
                  <strong>Adeola B.</strong>
                  <span>Graduate Trainee Accountant, Lagos</span>
                </div>
              </div>

              <div className="cf-review-card">
                <div className="cf-rev-stars">★★★★★</div>
                <p className="cf-rev-body">&ldquo;Textbooks never taught me how to handle messy client receipts and missing invoices. Module 8's ABC Retail project gave me the exact confidence I needed to manage my boss's business accounts without panicking.&rdquo;</p>
                <div className="cf-rev-author">
                  <strong>Emeka N.</strong>
                  <span>Bookkeeper &amp; Financial Assistant, Abuja</span>
                </div>
              </div>

              <div className="cf-review-card">
                <div className="cf-rev-stars">★★★★★</div>
                <p className="cf-rev-body">&ldquo;I transitioned from a teaching background into accounting. The Learn → Practise → Review → Perform framework works. Samuel breaks down QuickBooks and General Ledgers so clearly.&rdquo;</p>
                <div className="cf-rev-author">
                  <strong>Fatima Y.</strong>
                  <span>Junior Accountant, Port Harcourt</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA 04 */}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button className="cf-cta-btn pulsing-cta" onClick={scrollToPricing}>
              <span>JOIN DONZEN TODAY</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section 13: Meet Your Instructor */}
      <section className="cf-section cf-bg-cream">
        <div className="cf-container">
          <div className="cf-instructor-container">
            <div className="cf-instructor-photo-box">
              <img src="/donzen-man.jpeg" alt="Samuel Onainor" />
              <span className="cf-instructor-title-badge">Lead Instructor</span>
            </div>
            <div className="cf-instructor-details">
              <span className="cf-instructor-intro-tag">Founder &amp; CEO, Donzen Accounting Hub</span>
              <h2>Samuel Onainor</h2>
              <p>
                Samuel Onainor is the founder and CEO of Donzen Accounting Hub, a bookkeeping and accounting education platform focused on helping individuals and businesses develop practical accounting capability.
              </p>
              <p>
                His experience spans financial and management consulting, aviation, banking, real estate, startups, SMEs, hospitality, education, IT and other business environments.
              </p>
              <p style={{ fontWeight: 800, color: '#09090b', marginTop: 12 }}>
                His philosophy is simple:
              </p>
              <blockquote className="cf-instructor-quote">
                &ldquo;Accounting should not remain something you study. It should become something you can use.&rdquo;
              </blockquote>
              <p>
                Donzen was built around that belief. The goal isn't to create people who can simply repeat accounting definitions.
              </p>
              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
                The goal is to develop people who can understand the numbers, perform the process and use accounting information in real business situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 14: Choose Your Donzen Experience & Pricing */}
      <section className="cf-section cf-pricing-offer-section" id="pricing-section">
        <div className="cf-container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="cf-pricing-header-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="12 6 12 12 16 14"/></svg>
              CHOOSE YOUR DONZEN EXPERIENCE
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#0f172a', fontWeight: 900, marginTop: 12 }}>
              Three Ways to Join
            </h2>
            <p className="cf-pricing-subheader" style={{ maxWidth: 680, margin: '8px auto 0' }}>
              Select the plan that matches your current stage and where you want your accounting career to go.
            </p>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div className="cf-three-plans-grid">

            {/* PLAN 01 — STANDARD: FOUNDATION */}
            <div className="cf-pricing-card">
              <div className="cf-plan-badge">PLAN 01 — STANDARD</div>
              <h3 className="cf-plan-title">FOUNDATION</h3>
              <p className="cf-plan-desc">For learners who want the essential Donzen practical workplace accounting experience.</p>

              <div className="cf-plan-price-row">
                <span className="cf-plan-price">{formatPrice ? formatPrice(product?.price != null ? product.price : 53750) : `₦${Number(product?.price != null ? product.price : 53750).toLocaleString()}`}</span>
                <span className="cf-plan-duration">/ one-time</span>
              </div>

              <div className="cf-plan-features">
                <div className="cf-pf-item">✓ 30-Day Workplace Accounting Experience Program</div>
                <div className="cf-pf-item">✓ Core practical workplace accounting curriculum</div>
                <div className="cf-pf-item">✓ Practical assignments</div>
                <div className="cf-pf-item">✓ Accounting fundamentals</div>
                <div className="cf-pf-item">✓ Bookkeeping workflows</div>
                <div className="cf-pf-item">✓ Customer &amp; supplier accounting</div>
                <div className="cf-pf-item">✓ Financial reporting fundamentals</div>
                <div className="cf-pf-item">✓ Certificate upon completion</div>
                <div className="cf-pf-item">✓ One (1) year access duration</div>
                <div className="cf-pf-item">✓ Live support exclusive community</div>
              </div>

              <button className="cf-plan-btn cf-btn-foundation" onClick={() => handleSelectPlan('foundation')}>
                <span>CHOOSE FOUNDATION</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>

              <div className="cf-plan-note">
                <strong>Important:</strong> Regardless of which option you choose, you will definitely be able to perform workplace accounting tasks.
              </div>
            </div>

            {/* PLAN 02 — ADVANCED: PROFESSIONAL (MOST POPULAR) */}
            <div className="cf-pricing-card cf-card-featured">
              <div className="cf-ribbon-featured">MOST POPULAR</div>
              <div className="cf-plan-badge" style={{ color: '#ff1717' }}>PLAN 02 — ADVANCED</div>
              <h3 className="cf-plan-title">PROFESSIONAL</h3>
              <p className="cf-plan-desc">For learners who want deeper practical exposure and broader accounting technology experience.</p>

              <div className="cf-plan-price-row">
                <span className="cf-plan-price" style={{ color: '#ff1717' }}>
                  {formatPrice 
                    ? formatPrice(bundleProduct?.price != null ? bundleProduct.price : 187500) 
                    : `₦${Number(bundleProduct?.price != null ? bundleProduct.price : 187500).toLocaleString()}`}
                </span>
                <span className="cf-plan-duration">/ one-time</span>
              </div>

              <div className="cf-plan-features">
                <div className="cf-pf-lead">Includes everything in Foundation, plus:</div>
                <div className="cf-pf-item">✓ Expanded practical assignments</div>
                <div className="cf-pf-item">✓ Sage Online training</div>
                <div className="cf-pf-item">✓ QuickBooks training</div>
                <div className="cf-pf-item">✓ Excel accounting workflows</div>
                <div className="cf-pf-item">✓ Additional business scenarios</div>
                <div className="cf-pf-item">✓ Advanced templates/tools</div>
                <div className="cf-pf-item">✓ Additional practical project</div>
                <div className="cf-pf-item">✓ Certificate upon completion</div>
                <div className="cf-pf-item">✓ One (1) year access duration</div>
                <div className="cf-pf-item" style={{ fontWeight: 800, color: '#b91c1c' }}>✓ FREE Payroll template</div>
                <div className="cf-pf-item">✓ Live support exclusive community</div>
              </div>

              <div className="cf-best-for-tag">
                <strong>Best for:</strong> Accounting students • Graduates • Aspiring accountants • Bookkeepers • Early-career professionals
              </div>

              <button className="cf-plan-btn cf-btn-professional" onClick={() => handleSelectPlan('professional')}>
                <span>CHOOSE PROFESSIONAL</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>

              <div className="cf-plan-note">
                <strong>Important:</strong> Regardless of which option you choose, you will definitely be able to perform workplace accounting tasks.
              </div>
            </div>

            {/* PLAN 03 — PREMIUM: COMPLETE EXPERIENCE */}
            <div className="cf-pricing-card">
              <div className="cf-plan-badge">PLAN 03 — PREMIUM</div>
              <h3 className="cf-plan-title">COMPLETE EXPERIENCE</h3>
              <p className="cf-plan-desc">For learners who want the most comprehensive Donzen experience available.</p>

              <div className="cf-plan-price-row">
                <span className="cf-plan-price">
                  {formatPrice 
                    ? formatPrice(completeProduct?.price != null ? completeProduct.price : 350000) 
                    : `₦${Number(completeProduct?.price != null ? completeProduct.price : 350000).toLocaleString()}`}
                </span>
                <span className="cf-plan-duration">/ one-time</span>
              </div>

              <div className="cf-plan-features">
                <div className="cf-pf-lead">Includes everything in Professional, plus:</div>
                <div className="cf-pf-item">✓ Full practical accounting curriculum</div>
                <div className="cf-pf-item">✓ Full software training stack</div>
                <div className="cf-pf-item">✓ Advanced practical projects</div>
                <div className="cf-pf-item">✓ Additional business/accounting scenarios</div>
                <div className="cf-pf-item">✓ Enhanced support</div>
                <div className="cf-pf-item">✓ Certificate upon completion</div>
                <div className="cf-pf-item">✓ One (1) year access duration</div>
                <div className="cf-pf-item" style={{ fontWeight: 800, color: '#b91c1c' }}>✓ FREE Payroll template</div>
                <div className="cf-pf-item" style={{ fontWeight: 800, color: '#b91c1c' }}>✓ FREE selected Donzen accounting tools/templates</div>
                <div className="cf-pf-item">✓ Live support exclusive community</div>
                <div className="cf-pf-item" style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: 4, marginTop: 4 }}>
                  ✓ <strong>MENTORSHIP:</strong> One (1) Month with other industry experts (5 Sessions, max 2h each)
                </div>
                <div className="cf-pf-item" style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: 4 }}>
                  ✓ <strong>CAREER SUPPORT:</strong> with industry experts (5 Sessions, max 2h each)
                </div>
                <div className="cf-pf-item" style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: 4 }}>
                  ✓ <strong>PORTFOLIO SUPPORT:</strong> with industry experts (5 Sessions, max 2h each)
                </div>
                <div className="cf-pf-item">✓ Additional Tools &amp; Resources</div>
              </div>

              <div className="cf-best-for-tag">
                <strong>Best for:</strong> Freelancers • Aspiring entrepreneurs • Early Startup Bookkeepers &amp; Accountants
              </div>

              <button className="cf-plan-btn cf-btn-complete" onClick={() => handleSelectPlan('complete')}>
                <span>CHOOSE COMPLETE EXPERIENCE</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>

              <div className="cf-plan-note">
                <strong>Important:</strong> Regardless of which option you choose, you will definitely be able to perform workplace accounting tasks.
              </div>
            </div>

          </div>

          {/* Comparison Matrix Table: WHICH PLAN IS RIGHT FOR YOU? */}
          <div className="cf-matrix-wrapper">
            <h3 className="cf-matrix-title">WHICH PLAN IS RIGHT FOR YOU?</h3>
            <div className="cf-table-scroll">
              <table className="cf-plan-matrix-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="cf-th-center">FOUNDATION</th>
                    <th className="cf-th-center cf-th-hl">PROFESSIONAL</th>
                    <th className="cf-th-center">COMPLETE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Core accounting curriculum', '✓', '✓', '✓'],
                    ['Practical assignments', '✓', '✓', '✓'],
                    ['Bookkeeping workflows', '✓', '✓', '✓'],
                    ['Financial reporting', '✓', '✓', '✓'],
                    ['Accounting tools', '✓', '✓', '✓'],
                    ['Sage Online', '—', '✓', '✓'],
                    ['QuickBooks', '—', '✓', '✓'],
                    ['Excel workflows', '—', '✓', '✓'],
                    ['Practical projects', '✓', '✓', '✓'],
                    ['Advanced resources', '—', '✓', '✓'],
                    ['Enhanced support', '—', '— / ✓', '✓'],
                    ['Additional benefits', '—', '—', '✓'],
                    ['Certificate', '✓', '✓', '✓'],
                  ].map(([feat, f, p, c], idx) => (
                    <tr key={idx}>
                      <td className="cf-td-feat">{feat}</td>
                      <td className="cf-td-val">{f}</td>
                      <td className="cf-td-val cf-td-hl">{p}</td>
                      <td className="cf-td-val">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investment Advisory Block */}
          <div className="cf-investment-advice-box">
            <h3>DON'T CHOOSE BASED ONLY ON PRICE.</h3>
            <p>Choose based on where you are going.</p>
            <p>If you only need the foundation, start there.</p>
            <p>If you want deeper software and practical exposure, choose <strong>Professional</strong>.</p>
            <p>If you want the complete Donzen experience and the additional support/resources included in the premium plan, choose <strong>Complete</strong>.</p>
            <p style={{ fontWeight: 800, color: '#09090b', margin: '14px 0 0' }}>There is no need to buy more than you need.</p>
          </div>

          {/* What Your Investment Gives You */}
          <div className="cf-investment-checklist-card">
            <h4>WHAT YOUR INVESTMENT GIVES YOU</h4>
            <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 16px' }}>You're not simply paying for 30 days of videos. You're investing in:</p>
            <div className="cf-inv-check-grid">
              {[
                'Practical accounting knowledge',
                'Structured learning',
                'Hands-on assignments',
                'Realistic business scenarios',
                'Accounting software exposure',
                'Practical tools and templates',
                'Financial reporting experience',
                'Accounting workflow understanding',
                'A structured environment to practise',
                'Increased confidence performing accounting tasks'
              ].map((item, i) => (
                <div key={i} className="cf-inv-item">
                  <span className="cf-inv-check">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="cf-inv-footer">
              Knowledge is useful. <strong>Knowledge + practice is capability.</strong>
            </div>
          </div>

          {/* Safe Checkout Badge */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Safe 256-bit encrypted checkout via Paystack · Direct Bank Transfer Also Accepted
          </p>
        </div>
      </section>

      {/* Section 15: Our Commitment / Transparent Promise */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-commitment-box">
            <span className="cf-commitment-tag">OUR COMMITMENT TO YOU</span>
            <h2>WE WILL NEVER PROMISE YOU A JOB.</h2>
            <p className="cf-commitment-sub">And that's intentional.</p>
            <div className="cf-commitment-body">
              <p>Donzen cannot guarantee that a company will hire you.</p>
              <p>We cannot guarantee a specific salary.</p>
              <p>We cannot guarantee that completing the programme alone will produce a particular career outcome.</p>
              <div className="cf-commitment-promise-box">
                <h4>What we can promise is what is within our control:</h4>
                <ul>
                  <li>We will give you a structured environment to learn, practise, review and perform practical accounting work.</li>
                  <li>We will help you understand how accounting knowledge connects with real business processes.</li>
                  <li>We will expose you to practical accounting workflows and technology included in your selected plan.</li>
                  <li>And we will give you the tools and framework to keep developing beyond the programme.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 16: Common Concerns / Objections */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Common Questions &amp; Hesitations Answered</h2>
          </div>

          <div className="cf-concerns-grid">
            <div className="cf-concern-card">
              <h4>&ldquo;BUT I ALREADY STUDIED ACCOUNTING.&rdquo;</h4>
              <p>Perfect. Then you already have the foundation. The question is: <strong>Can you apply it?</strong></p>
              <p>Donzen isn't designed to replace accounting education. It's designed to help you translate accounting knowledge into practical capability.</p>
            </div>

            <div className="cf-concern-card">
              <h4>&ldquo;CAN'T I LEARN THIS ON YOUTUBE?&rdquo;</h4>
              <p>You can learn a lot from YouTube. But information isn't the same as a structured experience.</p>
              <p>YouTube gives you videos. Donzen gives you a framework: <strong>Learn → Practise → Review → Perform</strong>. Instead of spending hours trying to figure out what to learn next, you follow a structured practical journey.</p>
            </div>

            <div className="cf-concern-card">
              <h4>&ldquo;I DON'T KNOW ACCOUNTING SOFTWARE.&rdquo;</h4>
              <p>That's okay. You don't need to arrive as an expert. The programme is designed to help you understand the relationship between accounting concepts and accounting technology.</p>
              <p>You'll learn the <em>why</em> behind the process, not simply the buttons to press.</p>
            </div>

            <div className="cf-concern-card">
              <h4>&ldquo;I'M A COMPLETE BEGINNER.&rdquo;</h4>
              <p>The programme is designed to be accessible to learners at different stages. However, your results will depend on your commitment to learning and completing the practical work.</p>
              <p>If you are willing to learn and practise, you can build from the foundation upward.</p>
            </div>

            <div className="cf-concern-card">
              <h4>&ldquo;WILL THIS GUARANTEE ME A JOB?&rdquo;</h4>
              <p>No. And no credible training provider should promise that. What Donzen can do is help you become more practically prepared for accounting work.</p>
              <p>Your career outcome will also depend on your qualifications, applications, interview performance, employer requirements and many other factors.</p>
            </div>

            <div className="cf-concern-card">
              <h4>&ldquo;I'M TOO BUSY.&rdquo;</h4>
              <p>That's exactly why the programme is structured around a defined 30-day experience. Instead of trying to learn everything at once, you follow a structured journey.</p>
              <p>Give yourself a defined period. Give yourself a defined goal. Give yourself the opportunity to practise.</p>
            </div>

            <div className="cf-concern-card" style={{ gridColumn: '1 / -1' }}>
              <h4>&ldquo;WHAT IF I DON'T UNDERSTAND SOMETHING?&rdquo;</h4>
              <p>That's what the learning and support structure is designed to address.</p>
              <p>Should you have any concerns, do not hesitate to reach us via email, WhatsApp, community, live sessions, instructor support, and Q&amp;A. The objective isn't to leave you alone with a collection of videos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 17: FAQ Accordion */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <span className="cf-section-tag">GOT QUESTIONS?</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="cf-faq-accordion">
            {[
              {
                q: 'What is the Donzen Accounting Experience Program?',
                a: 'It is a 30-day online practical accounting training and certification programme designed to help learners turn accounting knowledge into practical workplace capability. Donzen publicly describes the programme as focused on hands-on practical experience applicable to professional careers and business.'
              },
              {
                q: 'Is this a course or an internship?',
                a: 'It is a practical workplace accounting training/experience programme.'
              },
              {
                q: 'How long is the programme?',
                a: 'The core experience is designed around 30 days and unlimited access continues till one full year.'
              },
              {
                q: 'Is the programme online?',
                a: 'Yes. You can participate remotely using an internet-connected device on either a laptop or iPad.'
              },
              {
                q: 'Do I need accounting experience?',
                a: 'No previous professional accounting experience is required for the beginner-level pathway. However, learners should be prepared to practise.'
              },
              {
                q: 'Is the programme only for accountants?',
                a: 'No. It is designed for accounting students, graduates, aspiring accountants, bookkeepers, finance professionals and other people who want practical accounting capability.'
              },
              {
                q: 'Will I learn Sage Online?',
                a: 'Yes, where included in the selected programme plan (Professional and Complete plans). The Sage component focuses on understanding how cloud accounting software connects with real accounting workflows.'
              },
              {
                q: 'Will I learn QuickBooks?',
                a: 'Yes, where included in the selected programme plan. The focus is practical application rather than simply watching software demonstrations.'
              },
              {
                q: 'Will I learn Excel?',
                a: 'Yes, where included in the selected programme plan. Excel is used to support practical accounting workflows, calculations, schedules and reporting.'
              },
              {
                q: 'Will I receive a certificate?',
                a: 'Yes, learners who meet the programme\'s completion requirements receive an official Certificate of Completion.'
              },
              {
                q: 'Is this a job placement programme?',
                a: 'No. It is a practical workplace accounting education and experience programme. We do not guarantee employment.'
              },
              {
                q: 'Can I take this while working or studying?',
                a: 'Yes. The programme is designed to be completed online and structured around a defined 30-day journey. We strongly recommend one hour daily that is convenient for you.'
              },
              {
                q: 'What happens after I enrol?',
                a: 'You\'ll immediately receive your programme access and onboarding information via email, student portal, Telegram, WhatsApp, LMS, etc.'
              },
              {
                q: 'When does the next cohort begin?',
                a: 'Registration is currently ongoing for the next batch.'
              },
              {
                q: 'How do I pay?',
                a: 'You can choose to either pay online via the Paystack Merchant Checkout (card, USSD, bank transfer) or by direct bank transfer.'
              },
              {
                q: 'What happens if I miss a session?',
                a: 'You can always start from where you previously left off because your lessons and practical resources are recorded and saved.'
              },
              {
                q: 'What happens if I don\'t complete the 30 days?',
                a: 'We understand that events happen and we encourage you to dedicate time to study, but you have unlimited one year access so you can finish on your schedule.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="cf-faq-block">
                <button className="cf-faq-toggle" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  <span className="cf-faq-arrow-icon" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {openFaq === idx && (
                  <div className="cf-faq-answer-content">
                    <p style={{ margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 18: Final Urgency & Closing Call to Action */}
      <section className="cf-closing-cta">
        <div className="cf-container">
          <div className="cf-closing-box">
            <h2>DON'T WAIT FOR EXPERIENCE TO APPEAR. BUILD IT.</h2>
            <div className="cf-closing-prose">
              <p>You could spend another six months:</p>
              <ul>
                <li>Watching accounting videos.</li>
                <li>Saving tutorials.</li>
                <li>Reading textbooks.</li>
                <li>Collecting certificates.</li>
                <li>Applying for jobs.</li>
              </ul>
              <p style={{ fontWeight: 800, color: '#09090b', marginTop: 14 }}>
                And still wonder: <em>&ldquo;Why don't I feel confident doing the work?&rdquo;</em>
              </p>
              <p style={{ color: '#ff1717', fontWeight: 800 }}>
                Or you can give yourself a structured opportunity to practise.
              </p>
            </div>

            <div className="cf-quote-strip">
              <h4>THE NEXT 30 DAYS ARE GOING TO PASS ANYWAY.</h4>
              <p>The question is: What will you have built by the end of them? More theory? More saved videos? Another certificate? Or practical accounting capability?</p>
            </div>

            <div className="cf-final-pitch">
              <h3>YOUR ACCOUNTING CAREER DOESN'T NEED MORE INFORMATION. IT NEEDS APPLICATION.</h3>
              <p>Learn the accounting. Practise the process. Review your work. Build the confidence to perform.</p>
              <div className="cf-final-tag">THAT IS THE DONZEN EXPERIENCE.</div>
            </div>

            {/* CTA 07 */}
            <div style={{ marginTop: 28 }}>
              <button className="cf-cta-btn pulsing-cta" onClick={scrollToPricing} style={{ maxWidth: 440 }}>
                <span>JOIN THE NEXT COHORT</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Trust Block */}
      <footer className="cf-footer-section">
        <div className="cf-container">
          <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#f8fafc', fontWeight: 800 }}>Donzen Accounting Hub</h4>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#94a3b8' }}>
            A bookkeeping firm and accounting education platform helping individuals and businesses develop practical accounting capability.
          </p>
          <div style={{ color: '#ff1717', fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
            Bookkeeping for Africa.
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: '#64748b' }}>
            &copy; 2026 Donzen Accounting Hub. All Rights Reserved.
          </p>
          <div className="cf-footer-links-row" style={{ marginTop: 12, marginBottom: 20 }}>
            <span onClick={() => navigate('/terms')}>Terms &amp; Conditions</span>
            <span>&bull;</span>
            <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span>&bull;</span>
            <span onClick={() => navigate('/refund')}>Refund Policy</span>
            <span>&bull;</span>
            <span onClick={() => navigate('/contact')}>Contact</span>
          </div>

          <div className="cf-advertising-disclaimer">
            <p>
              <strong>Disclaimer:</strong> This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc. Google is a trademark of Google LLC.
            </p>
            <p>
              <strong>Professional Disclaimer:</strong> The information and training provided by Donzen Accounting Hub are for educational purposes to build practical skills. Individual results may vary based on effort, commitment, and application.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      {showStickyCta && (
        <div className="cf-sticky-mobile-cta">
          <button onClick={scrollToPricing} className="cf-sticky-btn">
            <span>JOIN THE DONZEN EXPERIENCE</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      )}

      {/* Embedded High-Converting Stylesheet */}
      <style dangerouslySetInnerHTML={{__html: `
        .cf-root {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          background-color: #ffffff;
          line-height: 1.6;
          overflow-x: hidden;
          padding-bottom: 70px;
        }

        .cf-container {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Top Warning & Timer Banners */
        .cf-top-warning {
          background: #09090b;
          color: #fef08a;
          text-align: center;
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cf-timer-banner {
          background: #fee2e2;
          color: #991b1b;
          text-align: center;
          padding: 9px 16px;
          font-size: 13.5px;
          font-weight: 600;
          border-bottom: 1px solid #fecaca;
        }
        .cf-timer {
          font-weight: 850;
          color: #ff1717;
          letter-spacing: 0.5px;
        }

        /* Header */
        .cf-header {
          padding: 24px 0 12px;
          text-align: center;
        }

        /* Hero */
        .cf-hero {
          text-align: center;
          padding: 16px 0 36px;
        }
        .cf-hero-badge {
          display: inline-block;
          background: rgba(255, 23, 23, 0.08);
          color: #ff1717;
          border: 1px solid rgba(255, 23, 23, 0.2);
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .cf-title {
          font-size: clamp(2.1rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.15;
          color: #09090b;
          margin: 0 auto 16px;
          max-width: 860px;
          letter-spacing: -0.02em;
        }
        .cf-subtitle {
          font-size: clamp(1.15rem, 2.4vw, 1.45rem);
          color: #ff1717;
          font-weight: 800;
          margin: 0 auto 28px;
          max-width: 740px;
          line-height: 1.35;
        }

        /* VSL Video Wrapper */
        .cf-vsl-wrapper {
          max-width: 820px;
          margin: 0 auto 30px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
          border: 1px solid #e2e8f0;
          background: #000;
        }
        .cf-vsl-player {
          position: relative;
          width: 100%;
          line-height: 0;
        }

        /* Sales Intro Block */
        .cf-sales-intro-block {
          max-width: 760px;
          margin: 0 auto;
          text-align: left;
          font-size: 16.5px;
          color: #334155;
          line-height: 1.7;
        }
        .cf-sales-intro-block p {
          margin-bottom: 16px;
        }
        .cf-highlight-text {
          font-size: 19px !important;
          font-weight: 900 !important;
          color: #ff1717 !important;
          margin: 16px 0 !important;
          line-height: 1.4 !important;
        }

        /* Signature Mechanism Ribbon */
        .cf-mechanism-ribbon {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin: 28px auto 0;
          padding: 16px 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          max-width: 680px;
        }
        .cf-mechanism-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cf-mech-num {
          font-size: 11px;
          font-weight: 900;
          background: #ff1717;
          color: #fff;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .cf-mech-name {
          font-size: 14px;
          font-weight: 850;
          color: #0f172a;
          letter-spacing: 0.5px;
        }
        .cf-mech-arrow {
          color: #94a3b8;
          font-weight: 800;
          font-size: 14px;
        }

        /* CTA Buttons */
        .cf-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(180deg, #ff2a2a 0%, #e00b0b 100%);
          color: #ffffff;
          font-size: 17px;
          font-weight: 900;
          padding: 18px 36px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          width: 100%;
          max-width: 460px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(255, 23, 23, 0.38);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          letter-spacing: 0.3px;
        }
        .cf-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(255, 23, 23, 0.48);
        }
        .cf-btn-secondary {
          background: #0f172a !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25) !important;
        }
        .cf-btn-secondary:hover {
          background: #1e293b !important;
        }

        /* Pulsing animation */
        .pulsing-cta {
          animation: cta-pulse 2.2s infinite;
        }
        @keyframes cta-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        /* Trust Feature Bar */
        .cf-trust-feature-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          font-size: 12.5px;
          color: #64748b;
          font-weight: 600;
          margin-top: 24px;
        }

        /* Sections Common */
        .cf-section {
          padding: 60px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .cf-bg-gray {
          background-color: #f8fafc;
        }
        .cf-bg-cream {
          background-color: #fbfbf9;
        }
        .cf-section-heading {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 36px;
        }
        .cf-section-heading h2 {
          font-size: clamp(1.8rem, 3.4vw, 2.5rem);
          font-weight: 900;
          color: #09090b;
          line-height: 1.25;
          margin: 0 0 10px;
          letter-spacing: -0.015em;
        }
        .cf-section-tag {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .cf-section-tag.red {
          color: #ff1717;
        }
        .cf-section-lead {
          font-size: 16px;
          color: #64748b;
          margin: 0 auto;
        }

        /* Text Blocks */
        .cf-text-block {
          max-width: 760px;
          margin: 0 auto;
          font-size: 16px;
          color: #334155;
          line-height: 1.7;
        }
        .cf-text-block p {
          margin-bottom: 14px;
        }
        .cf-bold-callout {
          font-size: 18px;
          font-weight: 800;
          color: #09090b;
          margin-top: 20px;
        }

        /* Bullets Container */
        .cf-bullets-container {
          max-width: 760px;
          margin: 24px auto 0;
        }
        .cf-bullets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          background: #ffffff;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .cf-bullet-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14.5px;
          color: #1e293b;
          font-weight: 600;
        }
        .cf-bullet-icon {
          flex-shrink: 0;
        }

        /* Question Box */
        .cf-question-box {
          max-width: 760px;
          margin: 28px auto 0;
          background: #fffdf5;
          border: 2px dashed #f59e0b;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }
        .cf-q-text {
          font-size: 15px;
          color: #64748b;
          margin: 0 0 4px;
          font-style: italic;
        }
        .cf-q-highlight {
          font-size: clamp(1.8rem, 3vw, 2.2rem);
          font-weight: 900;
          color: #09090b;
          margin: 4px 0 12px;
        }
        .cf-callout-red {
          font-size: 18px;
          font-weight: 900;
          color: #ff1717;
          margin: 12px 0 0;
        }

        /* Split Comparison Grid */
        .cf-split-table-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          max-width: 820px;
          margin: 0 auto;
        }
        .cf-table-col {
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .cf-table-header {
          margin: 0;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #0f172a;
          color: #ffffff;
          text-align: center;
        }
        .cf-col-right .cf-table-header {
          background: #ff1717;
        }
        .cf-table-content {
          padding: 24px;
          text-align: center;
        }
        .cf-table-big-label {
          font-size: 26px;
          font-weight: 900;
          color: #09090b;
          margin: 0 0 10px;
        }
        .cf-table-big-label.red {
          color: #ff1717;
        }
        .cf-table-subtext {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        /* Gap Questions Card */
        .cf-gap-questions-card {
          max-width: 820px;
          margin: 28px auto 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }
        .cf-gap-questions-card h4 {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 850;
          color: #09090b;
        }
        .cf-gap-questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
        .cf-gap-q-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 14px;
          color: #334155;
          font-weight: 600;
        }
        .cf-gap-q-bullet {
          color: #ff1717;
          font-weight: 900;
          flex-shrink: 0;
        }

        /* Summary Box */
        .cf-summary-box {
          text-align: center;
          font-size: 17px;
          font-weight: 800;
          color: #09090b;
          max-width: 820px;
          margin: 28px auto 0;
          background: #fef3c7;
          padding: 16px 20px;
          border-radius: 8px;
          border: 1px solid #fde68a;
        }
        .cf-summary-box p {
          margin: 0;
        }

        /* Career Stuck Grid */
        .cf-stuck-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          max-width: 860px;
          margin: 0 auto;
        }
        .cf-stuck-card {
          background: #ffffff;
          padding: 22px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .cf-stuck-icon {
          font-size: 28px;
          margin-bottom: 12px;
        }
        .cf-stuck-card p {
          margin: 0;
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
        }

        .cf-confidence-punch {
          max-width: 740px;
          margin: 36px auto 0;
          text-align: center;
        }
        .cf-confidence-punch p {
          font-size: 16px;
          color: #475569;
          margin-bottom: 12px;
        }
        .cf-punch-quote {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 900;
          color: #ff1717;
          margin: 12px 0 16px;
          font-style: italic;
        }
        .cf-punch-footer {
          font-size: 18px !important;
          font-weight: 900 !important;
          color: #09090b !important;
        }

        /* 5 Pillars Grid */
        .cf-pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          max-width: 940px;
          margin: 0 auto;
        }
        .cf-pillar-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px 18px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          transition: transform 0.2s ease;
        }
        .cf-pillar-card:hover {
          transform: translateY(-3px);
          border-color: #ff1717;
        }
        .cf-pillar-badge {
          width: 36px;
          height: 36px;
          background: #fee2e2;
          color: #ff1717;
          font-weight: 900;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 13px;
        }
        .cf-pillar-card h3 {
          font-size: 16px;
          font-weight: 850;
          color: #09090b;
          margin: 0 0 8px;
        }
        .cf-pillar-card p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        .cf-goal-banner {
          max-width: 820px;
          margin: 36px auto 0;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px;
          text-align: center;
        }
        .cf-goal-banner span {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          color: #ff1717;
          letter-spacing: 0.5px;
        }

        /* Steps Row */
        .cf-steps-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px;
          max-width: 940px;
          margin: 0 auto 30px;
        }
        .cf-step-box {
          background: #ffffff;
          padding: 22px 18px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          position: relative;
        }
        .cf-step-num {
          font-size: 12px;
          font-weight: 900;
          color: #ff1717;
          background: #fee2e2;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 10px;
        }
        .cf-step-box h4 {
          font-size: 16px;
          font-weight: 850;
          color: #09090b;
          margin: 0 0 8px;
        }
        .cf-step-box p {
          font-size: 13.5px;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        .cf-standard-box {
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          border: 1.5px solid #ff1717;
          border-radius: 12px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(255, 23, 23, 0.08);
        }
        .cf-standard-box h4 {
          margin: 0 0 12px;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #ff1717;
        }
        .cf-standard-sub {
          font-size: 16px;
          color: #64748b;
          margin: 0 0 6px;
        }
        .cf-standard-main {
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          color: #09090b;
          margin: 0 0 12px;
        }
        .cf-standard-tag {
          display: inline-block;
          font-size: 13px;
          font-weight: 800;
          background: #09090b;
          color: #ffffff;
          padding: 4px 12px;
          border-radius: 999px;
        }

        /* Before vs After */
        .cf-before-after-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 860px;
          margin: 0 auto;
        }
        .cf-ba-col {
          border-radius: 12px;
          padding: 28px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
        }
        .cf-ba-before {
          border-top: 5px solid #64748b;
          background: #f8fafc;
        }
        .cf-ba-after {
          border-top: 5px solid #ff1717;
          background: #ffffff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.04);
        }
        .cf-ba-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .cf-ba-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 900;
          color: #09090b;
        }
        .cf-ba-before .cf-ba-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #fee2e2;
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
        }
        .cf-ba-after .cf-ba-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #dcfce7;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
        }
        .cf-ba-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cf-ba-list li {
          font-size: 14.5px;
          color: #334155;
          line-height: 1.5;
          position: relative;
          padding-left: 20px;
        }
        .cf-ba-before .cf-ba-list li::before {
          content: "—";
          position: absolute;
          left: 0;
          color: #94a3b8;
          font-weight: 800;
        }
        .cf-ba-after .cf-ba-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #ff1717;
          font-weight: 900;
        }

        .cf-transformation-strip {
          max-width: 860px;
          margin: 30px auto 0;
          background: #09090b;
          color: #ffffff;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }
        .cf-transformation-strip span {
          font-size: 11.5px;
          letter-spacing: 1px;
          font-weight: 800;
          color: #ff1717;
        }
        .cf-transformation-strip h3 {
          margin: 6px 0 0;
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 850;
        }

        /* Modules List */
        .cf-modules-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 860px;
          margin: 0 auto;
        }
        .cf-module-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .cf-module-header {
          padding: 18px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .cf-mod-badge {
          font-size: 11.5px;
          font-weight: 900;
          color: #ff1717;
          background: #fee2e2;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 6px;
        }
        .cf-module-header h3 {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 850;
          color: #09090b;
        }
        .cf-mod-tagline {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
        }
        .cf-mod-body {
          padding: 22px 24px;
        }
        .cf-mod-body h4 {
          margin: 0 0 12px;
          font-size: 14px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .cf-mod-bullets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .cf-mod-bullets span {
          background: #f1f5f9;
          color: #1e293b;
          font-size: 13px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .cf-mod-objective {
          background: #fffdf2;
          border-left: 3px solid #f59e0b;
          padding: 10px 14px;
          font-size: 13.5px;
          color: #78350f;
          border-radius: 4px;
        }
        .cf-mod-subgrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        .cf-disclaimer-note {
          background: #f8fafc;
          border-left: 3px solid #64748b;
          padding: 10px 14px;
          font-size: 13px;
          color: #475569;
          border-radius: 4px;
        }

        /* Tech Card & Grid */
        .cf-tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .cf-tech-block {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 18px;
        }
        .cf-tech-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 900;
          color: #ffffff;
          background: #0f172a;
          padding: 3px 10px;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .cf-tech-desc {
          font-size: 13px;
          color: #475569;
          margin: 0 0 12px;
          line-height: 1.5;
        }
        .cf-tech-sublist {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }
        .cf-tech-sublist span {
          font-size: 12.5px;
          color: #334155;
          font-weight: 600;
        }
        .cf-tech-sublist span::before {
          content: "• ";
          color: #ff1717;
          font-weight: 900;
        }
        .cf-tech-callout {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 10px;
          border-radius: 6px;
          font-size: 12.5px;
          color: #1e293b;
          line-height: 1.4;
        }

        /* Simulation Box */
        .cf-simulation-box {
          background: #fffdfa;
          border: 1.5px solid #fed7aa;
          border-radius: 10px;
          padding: 22px;
        }
        .cf-simulation-box h4 {
          margin: 0 0 6px;
          font-size: 17px;
          font-weight: 900;
          color: #9a3412;
        }
        .cf-steps-ten-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 8px;
        }
        .cf-ten-step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #fed7aa;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }
        .cf-step-tag {
          font-size: 10.5px;
          font-weight: 900;
          background: #ea580c;
          color: #ffffff;
          padding: 2px 5px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        /* Practical Breakdown */
        .cf-practical-breakdown {
          max-width: 860px;
          margin: 36px auto 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 30px 24px;
        }
        .cf-practical-breakdown h3 {
          text-align: center;
          margin: 0 0 24px;
          font-size: 18px;
          font-weight: 900;
          color: #09090b;
          letter-spacing: 0.5px;
        }
        .cf-practical-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }
        .cf-practical-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 18px;
        }
        .cf-prac-bad {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
        }
        .cf-prac-quote {
          font-size: 14px;
          color: #64748b;
          font-style: italic;
          margin: 4px 0 10px;
        }
        .cf-prac-good {
          font-size: 12px;
          color: #ff1717;
          font-weight: 800;
          text-transform: uppercase;
        }
        .cf-prac-action {
          font-size: 13.5px;
          color: #09090b;
          font-weight: 600;
          margin-top: 4px;
          line-height: 1.5;
        }
        .cf-difference-banner {
          text-align: center;
          margin-top: 24px;
          font-size: 16px;
          font-weight: 900;
          color: #ff1717;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* 4 Weeks Grid */
        .cf-weeks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          max-width: 940px;
          margin: 0 auto;
        }
        .cf-week-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px 18px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .cf-week-header {
          margin-bottom: 12px;
        }
        .cf-week-label {
          font-size: 11px;
          font-weight: 900;
          color: #ff1717;
          background: #fee2e2;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .cf-week-header h3 {
          margin: 8px 0 0;
          font-size: 15.5px;
          font-weight: 850;
          color: #09090b;
        }
        .cf-week-body {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 16px;
          flex: 1;
        }
        .cf-week-focus {
          font-size: 12.5px;
          font-weight: 800;
          color: #09090b;
          background: #f1f5f9;
          padding: 6px 10px;
          border-radius: 6px;
          text-align: center;
        }

        /* What You Get Grid */
        .cf-get-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          max-width: 880px;
          margin: 0 auto;
        }
        .cf-get-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 18px;
          border-radius: 10px;
        }
        .cf-get-check {
          color: #ff1717;
          font-weight: 900;
          font-size: 16px;
          background: #fee2e2;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cf-get-card h4 {
          margin: 0 0 4px;
          font-size: 14.5px;
          font-weight: 800;
          color: #09090b;
        }
        .cf-get-card p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Who Is This For Grid */
        .cf-who-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
          max-width: 880px;
          margin: 0 auto 36px;
        }
        .cf-who-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 18px;
          border-radius: 10px;
        }
        .cf-who-badge {
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .cf-who-card h4 {
          margin: 0 0 6px;
          font-size: 14.5px;
          font-weight: 850;
          color: #09090b;
        }
        .cf-who-card p {
          margin: 0;
          font-size: 13px;
          color: #475569;
          line-height: 1.45;
        }

        /* Who Not For Box */
        .cf-not-for-box {
          max-width: 800px;
          margin: 0 auto;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 28px;
        }
        .cf-not-for-box h3 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 900;
          color: #dc2626;
          letter-spacing: 0.5px;
        }
        .cf-not-for-sub {
          font-size: 13.5px;
          color: #64748b;
          margin: 0 0 16px;
        }
        .cf-not-for-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13.5px;
          color: #475569;
        }
        .cf-not-for-conclusion {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
          font-size: 14px;
          font-weight: 700;
          color: #09090b;
        }

        /* Why Donzen Blocks */
        .cf-why-text-block {
          max-width: 760px;
          margin: 0 auto 30px;
          text-align: center;
          font-size: 16.5px;
          color: #334155;
          line-height: 1.7;
        }
        .cf-eq-banner {
          display: inline-block;
          background: #09090b;
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.8px;
          padding: 10px 20px;
          border-radius: 999px;
          margin-top: 14px;
        }

        .cf-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          max-width: 860px;
          margin: 0 auto 36px;
        }
        .cf-stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px 16px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .cf-stat-num {
          font-size: 36px;
          font-weight: 900;
          color: #ff1717;
          line-height: 1;
          margin-bottom: 8px;
        }
        .cf-stat-label {
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          letter-spacing: 0.5px;
        }

        .cf-show-box {
          max-width: 780px;
          margin: 0 auto 32px;
          background: #fffdf5;
          border: 1.5px solid #fef3c7;
          border-left: 4px solid #ff1717;
          border-radius: 8px;
          padding: 22px;
          text-align: left;
        }
        .cf-show-box h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 900;
          color: #09090b;
        }
        .cf-show-box p {
          margin: 0;
          font-size: 14.5px;
          color: #475569;
          line-height: 1.6;
        }

        .cf-sayings-card {
          max-width: 820px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 26px;
        }
        .cf-sayings-card h4 {
          margin: 0 0 16px;
          font-size: 15px;
          font-weight: 850;
          color: #09090b;
          text-align: center;
        }
        .cf-sayings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
        .cf-saying-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 13.5px;
          color: #334155;
          font-weight: 600;
          line-height: 1.45;
        }
        .cf-saying-quote {
          color: #ff1717;
          font-weight: 900;
          font-size: 18px;
          line-height: 1;
        }

        /* Proof Wall Reviews */
        .cf-reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          max-width: 860px;
          margin: 0 auto;
        }
        .cf-review-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }
        .cf-rev-stars {
          color: #f59e0b;
          font-size: 15px;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .cf-rev-body {
          font-size: 13.5px;
          color: #334155;
          line-height: 1.5;
          margin: 0 0 14px;
          flex: 1;
          font-style: italic;
        }
        .cf-rev-author {
          display: flex;
          flex-direction: column;
          font-size: 12.5px;
        }
        .cf-rev-author strong {
          color: #09090b;
        }
        .cf-rev-author span {
          color: #64748b;
        }

        /* Instructor Section */
        .cf-instructor-container {
          display: flex;
          align-items: center;
          gap: 36px;
          max-width: 820px;
          margin: 0 auto;
        }
        .cf-instructor-photo-box {
          position: relative;
          flex-shrink: 0;
          width: 240px;
        }
        .cf-instructor-photo-box img {
          width: 100%;
          height: auto;
          border-radius: 12px;
          border: 4px solid #ffffff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          display: block;
        }
        .cf-instructor-title-badge {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff1717;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 4px 12px;
          border-radius: 999px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .cf-instructor-details {
          flex: 1;
        }
        .cf-instructor-intro-tag {
          font-size: 12px;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .cf-instructor-details h2 {
          font-size: clamp(1.6rem, 2.5vw, 2.1rem);
          font-weight: 900;
          color: #09090b;
          margin: 4px 0 12px;
        }
        .cf-instructor-details p {
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .cf-instructor-quote {
          border-left: 3px solid #ff1717;
          margin: 14px 0;
          padding-left: 14px;
          font-size: 15.5px;
          font-weight: 700;
          color: #09090b;
          font-style: italic;
        }

        /* 3 Plans Grid */
        .cf-three-plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 24px;
          max-width: 960px;
          margin: 0 auto;
          align-items: stretch;
        }
        .cf-pricing-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 4px 14px rgba(0,0,0,0.03);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .cf-pricing-card:hover {
          border-color: #cbd5e1;
        }
        .cf-card-featured {
          border: 2px solid #ff1717 !important;
          box-shadow: 0 8px 30px rgba(255, 23, 23, 0.12) !important;
          transform: scale(1.02);
        }
        .cf-ribbon-featured {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff1717;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.5px;
          padding: 4px 14px;
          border-radius: 999px;
          box-shadow: 0 2px 8px rgba(255,23,23,0.3);
          white-space: nowrap;
        }
        .cf-plan-badge {
          font-size: 11px;
          font-weight: 850;
          color: #64748b;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .cf-plan-title {
          margin: 0 0 6px;
          font-size: 22px;
          font-weight: 900;
          color: #09090b;
        }
        .cf-plan-desc {
          margin: 0 0 16px;
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
          min-height: 38px;
        }
        .cf-plan-price-row {
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 14px 0;
          margin-bottom: 20px;
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .cf-plan-price {
          font-size: 28px;
          font-weight: 900;
          color: #09090b;
        }
        .cf-plan-duration {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 600;
        }
        .cf-plan-features {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 22px;
          flex: 1;
        }
        .cf-pf-lead {
          font-size: 12.5px;
          font-weight: 800;
          color: #09090b;
          margin-bottom: 4px;
        }
        .cf-pf-item {
          font-size: 13px;
          color: #1e293b;
          font-weight: 600;
          line-height: 1.4;
        }
        .cf-best-for-tag {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 11.5px;
          color: #475569;
          margin-bottom: 16px;
          line-height: 1.35;
        }
        .cf-plan-btn {
          width: 100%;
          padding: 14px 20px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .cf-btn-foundation {
          background: #0f172a;
          color: #ffffff;
        }
        .cf-btn-foundation:hover {
          background: #1e293b;
        }
        .cf-btn-professional {
          background: #ff1717;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(255,23,23,0.35);
        }
        .cf-btn-professional:hover {
          background: #d91414;
        }
        .cf-btn-complete {
          background: #09090b;
          color: #ffffff;
          border: 1px solid #334155;
        }
        .cf-btn-complete:hover {
          background: #1e293b;
        }
        .cf-plan-note {
          font-size: 11px;
          color: #64748b;
          text-align: center;
          margin-top: 12px;
          line-height: 1.4;
        }

        /* Matrix Table */
        .cf-matrix-wrapper {
          max-width: 860px;
          margin: 48px auto 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 28px;
        }
        .cf-matrix-title {
          text-align: center;
          margin: 0 0 20px;
          font-size: 17px;
          font-weight: 900;
          color: #09090b;
          letter-spacing: 0.5px;
        }
        .cf-table-scroll {
          overflow-x: auto;
        }
        .cf-plan-matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }
        .cf-plan-matrix-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 850;
          color: #09090b;
          border-bottom: 2px solid #e2e8f0;
        }
        .cf-th-center {
          text-align: center !important;
        }
        .cf-th-hl {
          background: #fee2e2;
          color: #ff1717;
          border-radius: 6px 6px 0 0;
        }
        .cf-plan-matrix-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .cf-td-feat {
          color: #334155;
          font-weight: 600;
        }
        .cf-td-val {
          text-align: center;
          font-weight: 800;
          color: #09090b;
        }
        .cf-td-hl {
          background: #fff5f5;
          color: #ff1717;
          font-weight: 900;
        }

        /* Investment Advice */
        .cf-investment-advice-box {
          max-width: 760px;
          margin: 36px auto 0;
          background: #fffdf5;
          border: 1px solid #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          padding: 22px;
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
        }
        .cf-investment-advice-box h3 {
          margin: 0 0 10px;
          font-size: 16px;
          font-weight: 900;
          color: #92400e;
        }
        .cf-investment-advice-box p {
          margin: 4px 0;
        }

        /* Investment Checklist Card */
        .cf-investment-checklist-card {
          max-width: 760px;
          margin: 24px auto 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 26px;
        }
        .cf-investment-checklist-card h4 {
          margin: 0;
          font-size: 15px;
          font-weight: 850;
          color: #09090b;
        }
        .cf-inv-check-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 10px;
        }
        .cf-inv-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: #334155;
          font-weight: 600;
        }
        .cf-inv-check {
          color: #ff1717;
          font-weight: 900;
        }
        .cf-inv-footer {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          font-size: 14.5px;
          color: #09090b;
          text-align: center;
        }

        /* Commitment Box */
        .cf-commitment-box {
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          padding: 32px;
        }
        .cf-commitment-tag {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
          color: #ff1717;
          text-transform: uppercase;
        }
        .cf-commitment-box h2 {
          margin: 6px 0 4px;
          font-size: clamp(1.4rem, 2.6vw, 1.9rem);
          font-weight: 900;
          color: #09090b;
        }
        .cf-commitment-sub {
          font-size: 15px;
          color: #64748b;
          font-style: italic;
          margin: 0 0 16px;
        }
        .cf-commitment-body p {
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .cf-commitment-promise-box {
          margin-top: 18px;
          background: #f8fafc;
          border-radius: 8px;
          padding: 18px;
          border: 1px solid #e2e8f0;
        }
        .cf-commitment-promise-box h4 {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 850;
          color: #09090b;
        }
        .cf-commitment-promise-box ul {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cf-commitment-promise-box li {
          font-size: 13.5px;
          color: #334155;
          line-height: 1.5;
        }

        /* Concerns Grid */
        .cf-concerns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          max-width: 860px;
          margin: 0 auto;
        }
        .cf-concern-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 22px;
        }
        .cf-concern-card h4 {
          margin: 0 0 8px;
          font-size: 14px;
          font-weight: 850;
          color: #ff1717;
          letter-spacing: 0.3px;
        }
        .cf-concern-card p {
          font-size: 13.5px;
          color: #334155;
          line-height: 1.55;
          margin: 0 0 8px;
        }
        .cf-concern-card p:last-child {
          margin-bottom: 0;
        }

        /* FAQ Accordion */
        .cf-faq-accordion {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cf-faq-block {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .cf-faq-toggle {
          width: 100%;
          text-align: left;
          padding: 16px 20px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 800;
          color: #09090b;
          gap: 12px;
        }
        .cf-faq-toggle:hover {
          background-color: #fafafa;
        }
        .cf-faq-arrow-icon {
          font-size: 11px;
          color: #ff1717;
          transition: transform 0.2s ease;
        }
        .cf-faq-answer-content {
          padding: 0 20px 18px;
          font-size: 14.5px;
          color: #475569;
          line-height: 1.6;
          border-top: 1px solid #f8fafc;
        }

        /* Closing CTA Section */
        .cf-closing-cta {
          padding: 60px 0;
          background: #09090b;
          color: #ffffff;
        }
        .cf-closing-box {
          max-width: 780px;
          margin: 0 auto;
          text-align: center;
        }
        .cf-closing-box h2 {
          font-size: clamp(1.8rem, 3.4vw, 2.5rem);
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 20px;
          letter-spacing: -0.015em;
        }
        .cf-closing-prose {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 24px;
          text-align: left;
          font-size: 15px;
          color: #cbd5e1;
        }
        .cf-closing-prose ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        .cf-closing-prose li {
          margin-bottom: 4px;
        }
        .cf-quote-strip {
          margin: 28px 0;
          padding: 20px;
          background: rgba(255, 23, 23, 0.12);
          border-radius: 10px;
          border: 1px solid rgba(255, 23, 23, 0.3);
        }
        .cf-quote-strip h4 {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 900;
          color: #ff1717;
        }
        .cf-quote-strip p {
          margin: 0;
          font-size: 14px;
          color: #e2e8f0;
          line-height: 1.5;
        }
        .cf-final-pitch h3 {
          font-size: 16px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 6px;
        }
        .cf-final-pitch p {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }
        .cf-final-tag {
          display: inline-block;
          font-size: 13px;
          font-weight: 900;
          color: #ff1717;
          margin-top: 8px;
          letter-spacing: 0.5px;
        }
        .cf-closing-sub {
          margin-top: 36px;
        }
        .cf-closing-sub h4 {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 900;
          color: #ff1717;
        }
        .cf-closing-sub p {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
        }
        .cf-closing-checklist {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 12px;
          color: #94a3b8;
          margin-top: 10px;
        }
        .cf-brand-mantra {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .cf-brand-mantra h3 {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 900;
          color: #ff1717;
        }
        .cf-brand-mantra p {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.5px;
        }
        .cf-mantra-sub {
          display: block;
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
          letter-spacing: 0.5px;
        }
        .cf-social-links-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 20px;
          font-size: 13px;
        }
        .cf-social-links-row a {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s ease;
        }
        .cf-social-links-row a:hover {
          color: #ffffff;
        }
        .cf-social-links-row span {
          color: #475569;
        }

        /* Footer Section */
        .cf-footer-section {
          padding: 36px 0 24px;
          background: #000000;
          color: #94a3b8;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .cf-footer-links-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 12.5px;
          flex-wrap: wrap;
        }
        .cf-footer-links-row span:not(:nth-child(even)) {
          cursor: pointer;
          color: #cbd5e1;
        }
        .cf-footer-links-row span:not(:nth-child(even)):hover {
          color: #ffffff;
        }
        .cf-advertising-disclaimer {
          max-width: 820px;
          margin: 20px auto 0;
          font-size: 11px;
          color: #475569;
          line-height: 1.5;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 16px;
        }

        /* Sticky Mobile CTA Bar */
        .cf-sticky-mobile-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #09090b;
          border-top: 1px solid rgba(255, 23, 23, 0.4);
          padding: 10px 16px;
          z-index: 9999;
          display: flex;
          justify-content: center;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.3);
        }
        .cf-sticky-btn {
          width: 100%;
          max-width: 480px;
          background: #ff1717;
          color: #ffffff;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 14.5px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(255,23,23,0.35);
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .cf-instructor-container {
            flex-direction: column;
            text-align: center;
          }
          .cf-instructor-photo-box {
            width: 200px;
            margin: 0 auto;
          }
          .cf-instructor-quote {
            text-align: left;
          }
          .cf-mechanism-ribbon {
            flex-direction: column;
            gap: 8px;
          }
          .cf-mech-arrow {
            display: none;
          }
          .cf-three-plans-grid {
            grid-template-columns: 1fr;
          }
          .cf-card-featured {
            transform: none;
          }
          .cf-cta-btn {
            padding: 16px 20px;
            font-size: 15px;
          }
        }
      `}} />
    </div>
  )
}
