import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════════
   DONZEN ACCOUNTING HUB — ABOUT US PAGE
   Premium corporate about page with structured SEO,
   scroll animations, and professional design language.
   ═══════════════════════════════════════════════════════════════ */

// ─── Scroll-Reveal Hook ───
function useReveal(threshold = 0.15) {
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
function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useReveal(0.3)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = Math.max(1, Math.floor(end / (duration / 16)))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [visible, end, duration])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}


export default function AboutPage() {
  const [heroRef, heroVis] = useReveal(0.08)
  const [storyRef, storyVis] = useReveal(0.1)
  const [founderRef, founderVis] = useReveal(0.1)
  const [pillarsRef, pillarsVis] = useReveal(0.1)
  const [valuesRef, valuesVis] = useReveal(0.1)
  const [timelineRef, timelineVis] = useReveal(0.1)
  const [bootcampRef, bootcampVis] = useReveal(0.1)
  const [ctaRef, ctaVis] = useReveal(0.1)

  const values = [
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Integrity First', desc: 'Every transaction we handle is treated with the same care and transparency we would demand for our own businesses.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: 'Pan-African Vision', desc: 'We are building the infrastructure for African small businesses to compete globally through precision financial management.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Client Partnership', desc: 'We do not just process your numbers — we become an extension of your team, invested in your growth and long-term success.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: 'Precision & Accuracy', desc: 'Our processes are built on meticulous attention to detail, ensuring your financial records are always audit-ready and compliant.' },
  ]

  const timeline = [
    { year: '2019', title: 'Founded in Lagos', desc: 'Samuel Onainor established Donzen Accounting Hub from a shared workspace in Lekki, serving 3 clients.' },
    { year: '2020', title: 'Went Fully Digital', desc: 'Pivoted to remote-first bookkeeping during the pandemic, adopting QuickBooks Online and cloud-based workflows.' },
    { year: '2022', title: 'Launched the Bootcamp', desc: 'Introduced the Donzen Accounting Experience Program — a 30-day intensive bootcamp training fresh accountants.' },
    { year: '2024', title: '500+ Businesses Served', desc: 'Crossed the milestone of 500 SMEs served across Nigeria, expanded service offerings to include CAC incorporation and tax advisory.' },
  ]

  const services = [
    { num: '01', title: 'Bookkeeping & Accounting', desc: 'Comprehensive day-to-day transaction recording, bank reconciliation, and financial reporting using QuickBooks, Xero, and Excel.' },
    { num: '02', title: 'Tax Advisory & Compliance', desc: 'FIRS tax registration, VAT filing, annual returns, and strategic tax planning to ensure your business stays fully compliant.' },
    { num: '03', title: 'Business Incorporation', desc: 'CAC registration for Business Names, LLCs, and NGOs — complete with post-incorporation compliance and documentation.' },
    { num: '04', title: 'Financial Training', desc: 'Our signature 30-day bootcamp and DIY templates that equip entrepreneurs and aspiring accountants with real-world skills.' },
  ]

  return (
    <>
      <div className="ab-root">

        {/* ─── STRUCTURED DATA (SEO) ─── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Donzen Accounting Hub",
            "url": "https://www.donzenaccountinghub.com/about",
            "description": "Learn about Donzen Accounting Hub, Nigeria's trusted bookkeeping firm founded by Samuel Onainor. We provide expert bookkeeping, FIRS tax compliance, business incorporation, and professional accounting training across Africa.",
            "mainEntity": {
              "@type": "AccountingService",
              "name": "Donzen Accounting Hub",
              "founder": { "@type": "Person", "name": "Samuel Onainor", "jobTitle": "Founder & CEO" },
              "foundingDate": "2019",
              "areaServed": { "@type": "Country", "name": "Nigeria" },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ikota Shopping Complex, Eti-Osa",
                "addressLocality": "Lekki",
                "addressRegion": "Lagos",
                "postalCode": "101001",
                "addressCountry": "NG"
              }
            }
          })
        }} />


        {/* ════════════════════════════════════════════════════════════
            SECTION 1 — HERO
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-hero" ref={heroRef}>
          <div className="ab-hero-bg">
            <img src="/images/about-hero.jpg" alt="" aria-hidden="true" />
            <div className="ab-hero-overlay" />
          </div>
          <div className={`ab-hero-inner ${heroVis ? 'ab-vis' : ''}`}>
            <div className="ab-hero-badge">About Donzen Accounting Hub</div>
            <h1 className="ab-hero-title">
              We Build Financial<br />
              <span className="ab-hero-accent">Clarity for Africa</span>
            </h1>
            <p className="ab-hero-desc">
              Since 2019, we have helped over 500 small and medium-sized businesses across Nigeria gain complete control over their financial records, tax obligations, and growth trajectory.
            </p>
            <div className="ab-hero-ctas">
              <Link to="/contact" className="ab-btn ab-btn-red">
                Partner With Us
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link to="/services" className="ab-btn ab-btn-glass">
                Our Services
              </Link>
            </div>
          </div>
          <div className="ab-hero-shape-1" />
          <div className="ab-hero-shape-2" />
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 2 — IMPACT NUMBERS BAR
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-stats-bar">
          <div className="ab-stats-inner">
            {[
              { end: 500, suffix: '+', label: 'Businesses Served' },
              { end: 6, suffix: '+', label: 'Years of Experience' },
              { end: 98, suffix: '%', label: 'Client Retention Rate' },
              { end: 200, suffix: '+', label: 'Bootcamp Graduates' },
            ].map((s, i) => (
              <div key={i} className="ab-stat">
                <div className="ab-stat-val"><Counter end={s.end} suffix={s.suffix} /></div>
                <div className="ab-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 3 — OUR STORY
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-story" ref={storyRef}>
          <div className={`ab-story-inner ${storyVis ? 'ab-vis' : ''}`}>
            <div className="ab-story-text">
              <span className="ab-overline">Our Story</span>
              <h2 className="ab-section-title">We Are Bookkeeping<br />For Africa</h2>
              <p>
                Donzen Accounting Hub was born from a simple observation: millions of Nigerian small businesses were making strong revenue but had no structured way to track where their money was going. Profit and loss was a guess, not a science.
              </p>
              <p>
                Founded by <strong>Samuel Onainor</strong>, a seasoned accountant with cross-industry experience spanning real estate, hospitality, education, startups, and technology — Donzen set out to close the financial literacy and record-keeping gap for SMEs across Africa.
              </p>
              <p>
                Today, we are a fully digital, remote-first bookkeeping firm serving clients in all 36 states of Nigeria, with a growing community of trained bookkeeping professionals through our signature bootcamp programme.
              </p>
            </div>
            <div className="ab-story-visual">
              <div className="ab-story-img-wrap">
                <img src="/hero-corporate.jpg" alt="Donzen Accounting Hub team in a strategy meeting" />
                <div className="ab-story-accent-border" />
              </div>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 4 — FOUNDER SPOTLIGHT
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-founder" ref={founderRef}>
          <div className={`ab-founder-inner ${founderVis ? 'ab-vis' : ''}`}>
            <div className="ab-founder-img-col">
              <div className="ab-founder-img-wrap">
                <img src="/founder_portrait.jpg" alt="Samuel Onainor — Founder and CEO of Donzen Accounting Hub" />
              </div>
              <div className="ab-founder-nameplate">
                <div className="ab-founder-name">Samuel Onainor</div>
                <div className="ab-founder-role">Founder & Chief Executive Officer</div>
              </div>
            </div>
            <div className="ab-founder-content">
              <span className="ab-overline">Meet Our Founder</span>
              <h2 className="ab-section-title">Driven by Purpose,<br />Led by Precision</h2>
              <p>
                Samuel Onainor is a certified professional accountant with extensive industry experience across financial and management consulting, real estate, startups, SMEs, hospitality, education, and technology.
              </p>
              <p>
                As the Founder and CEO of Donzen Accounting Hub, Samuel leads a team of dedicated bookkeeping professionals committed to helping African businesses build sustainable financial foundations.
              </p>
              <blockquote className="ab-quote">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,23,23,0.12)"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                <p>
                  "A passionate individual driven by people, innovation, and technology to help small business owners, sole proprietors, small startups, and medium-sized businesses handle their financial record keeping with absolute confidence."
                </p>
              </blockquote>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 5 — WHAT WE DO (SERVICES PILLARS)
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-pillars" ref={pillarsRef}>
          <div className={`ab-pillars-inner ${pillarsVis ? 'ab-vis' : ''}`}>
            <div className="ab-pillars-header">
              <span className="ab-overline">What We Do</span>
              <h2 className="ab-section-title">Core Services</h2>
              <p className="ab-pillars-desc">Comprehensive financial solutions tailored for Nigerian small and medium-sized businesses.</p>
            </div>
            <div className="ab-pillars-grid">
              {services.map((s, i) => (
                <div key={i} className="ab-pillar-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="ab-pillar-num">{s.num}</div>
                  <h3 className="ab-pillar-title">{s.title}</h3>
                  <p className="ab-pillar-desc">{s.desc}</p>
                  <Link to="/services" className="ab-pillar-link">
                    Learn more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 6 — OUR VALUES
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-values" ref={valuesRef}>
          <div className={`ab-values-inner ${valuesVis ? 'ab-vis' : ''}`}>
            <div className="ab-values-content">
              <span className="ab-overline">Our Values</span>
              <h2 className="ab-section-title">The Principles That<br />Guide Everything We Do</h2>
              <div className="ab-values-list">
                {values.map((v, i) => (
                  <div key={i} className="ab-value-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="ab-value-icon">{v.icon}</div>
                    <div>
                      <h3 className="ab-value-title">{v.title}</h3>
                      <p className="ab-value-desc">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ab-values-visual">
              <div className="ab-values-img-wrap">
                <img src="/images/about-values.jpg" alt="Donzen Accounting professional reviewing client financials" />
              </div>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 7 — JOURNEY TIMELINE
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-timeline" ref={timelineRef}>
          <div className={`ab-timeline-inner ${timelineVis ? 'ab-vis' : ''}`}>
            <div className="ab-timeline-header">
              <span className="ab-overline">Our Journey</span>
              <h2 className="ab-section-title">Milestones That Define Us</h2>
            </div>
            <div className="ab-timeline-track">
              {timeline.map((t, i) => (
                <div key={i} className="ab-tl-item" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="ab-tl-dot" />
                  <div className="ab-tl-year">{t.year}</div>
                  <h3 className="ab-tl-title">{t.title}</h3>
                  <p className="ab-tl-desc">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 8 — BOOTCAMP / TALENT DEVELOPMENT
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-bootcamp" ref={bootcampRef}>
          <div className={`ab-bootcamp-inner ${bootcampVis ? 'ab-vis' : ''}`}>
            <div className="ab-bootcamp-text">
              <span className="ab-overline-light">Talent Development</span>
              <h2 className="ab-bootcamp-title">Empowering the Next Generation of African Accountants</h2>
              <p className="ab-bootcamp-desc">
                The Donzen Accounting Experience Programme is our signature 30-day intensive bootcamp designed for aspiring accountants and entrepreneurs who want to master real-world bookkeeping and financial management.
              </p>
              <ul className="ab-bootcamp-features">
                {[
                  'Hands-on QuickBooks & Excel training',
                  'Live client simulations and case studies',
                  'Mentorship from practising professionals',
                  'Job placement assistance and networking',
                ].map((f, i) => (
                  <li key={i}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/bootcamp" className="ab-btn ab-btn-white">
                Explore the Programme
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="ab-bootcamp-visual">
              <img src="/bootcamp_vision.jpg" alt="Donzen Accounting Experience Programme — bootcamp graduates in training" />
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            SECTION 9 — BOTTOM CTA
            ════════════════════════════════════════════════════════════ */}
        <section className="ab-bottom-cta" ref={ctaRef}>
          <div className={`ab-bottom-cta-inner ${ctaVis ? 'ab-vis' : ''}`}>
            <h2>Ready to Take Control of Your Finances?</h2>
            <p>
              Whether you are a startup founder, a sole proprietor, or a growing SME — we are here to give you financial clarity and peace of mind.
            </p>
            <div className="ab-bottom-btns">
              <Link to="/contact" className="ab-btn ab-btn-red">
                Get a Free Consultation
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-glass">
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
        .ab-root {
          --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --red: #ff1717;
          --dark: #09090b;
          --slate: #64748b;
          font-family: var(--font);
          color: #0f172a;
          background: #fff;
          overflow-x: hidden;
        }

        /* ─── ANIMATIONS ─── */
        .ab-vis { animation: abFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes abFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── SHARED ─── */
        .ab-overline {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: #ff1717;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .ab-overline-light {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .ab-section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1.15;
          margin: 0 0 20px;
          color: #0f172a;
        }
        .ab-btn {
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
        .ab-btn-red {
          background: #ff1717;
          color: #fff;
        }
        .ab-btn-red:hover {
          background: #d91414;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,23,23,0.3);
        }
        .ab-btn-glass {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .ab-btn-glass:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .ab-btn-white {
          background: #fff;
          color: #09090b;
        }
        .ab-btn-white:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }


        /* ════ HERO ════ */
        .ab-hero {
          position: relative;
          min-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 130px 24px 90px;
          overflow: hidden;
        }
        .ab-hero-bg {
          position: absolute;
          inset: 0;
        }
        .ab-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
        }
        .ab-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(170deg, rgba(9,9,11,0.93) 0%, rgba(9,9,11,0.8) 45%, rgba(9,9,11,0.9) 100%);
        }
        .ab-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 800px;
          text-align: center;
          opacity: 0;
        }
        .ab-hero-badge {
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
        .ab-hero-title {
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.08;
          letter-spacing: -2px;
          margin: 0 0 20px;
        }
        .ab-hero-accent {
          background: linear-gradient(135deg, #ff1717, #ff6b4a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ab-hero-desc {
          font-size: 1.08rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          max-width: 620px;
          margin: 0 auto 36px;
        }
        .ab-hero-ctas {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ab-hero-shape-1 {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.1) 0%, transparent 70%);
          top: -120px;
          right: -120px;
          z-index: 1;
          pointer-events: none;
        }
        .ab-hero-shape-2 {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,74,0.06) 0%, transparent 70%);
          bottom: -100px;
          left: -80px;
          z-index: 1;
          pointer-events: none;
        }


        /* ════ STATS BAR ════ */
        .ab-stats-bar {
          background: #09090b;
          padding: 0 24px;
          position: relative;
          z-index: 5;
        }
        .ab-stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .ab-stat {
          padding: 36px 24px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .ab-stat:last-child { border-right: none; }
        .ab-stat-val {
          font-size: 2.2rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
        }
        .ab-stat-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 500;
          margin-top: 6px;
        }


        /* ════ OUR STORY ════ */
        .ab-story {
          padding: 100px 24px;
          background: #fff;
        }
        .ab-story-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          opacity: 0;
        }
        .ab-story-text p {
          font-size: 1rem;
          color: #475569;
          line-height: 1.8;
          margin: 0 0 16px;
        }
        .ab-story-text p:last-child { margin-bottom: 0; }
        .ab-story-text strong { color: #0f172a; }
        .ab-story-visual {
          position: relative;
        }
        .ab-story-img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.1);
        }
        .ab-story-img-wrap img {
          display: block;
          width: 100%;
          height: 420px;
          object-fit: cover;
        }
        .ab-story-accent-border {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 100%;
          height: 100%;
          border: 2px solid #ff1717;
          border-radius: 20px;
          z-index: -1;
        }


        /* ════ FOUNDER ════ */
        .ab-founder {
          padding: 100px 24px;
          background: #fafafa;
        }
        .ab-founder-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.45fr 0.55fr;
          gap: 64px;
          align-items: start;
          opacity: 0;
        }
        .ab-founder-img-col {
          position: relative;
        }
        .ab-founder-img-wrap {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .ab-founder-img-wrap img {
          display: block;
          width: 100%;
          height: 480px;
          object-fit: cover;
          object-position: center 20%;
        }
        .ab-founder-nameplate {
          background: #09090b;
          padding: 16px 24px;
          border-radius: 14px;
          margin-top: -40px;
          position: relative;
          z-index: 2;
          margin-left: 20px;
          margin-right: 20px;
          text-align: center;
        }
        .ab-founder-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: #fff;
        }
        .ab-founder-role {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
          margin-top: 2px;
        }
        .ab-founder-content p {
          font-size: 1rem;
          color: #475569;
          line-height: 1.8;
          margin: 0 0 16px;
        }
        .ab-quote {
          background: #fefce8;
          border-left: 4px solid #ff1717;
          border-radius: 0 14px 14px 0;
          padding: 24px 28px 24px 24px;
          margin: 28px 0 0;
          position: relative;
        }
        .ab-quote svg {
          position: absolute;
          top: 16px;
          left: 20px;
          opacity: 0.6;
        }
        .ab-quote p {
          font-size: 0.95rem;
          font-style: italic;
          color: #78716c;
          line-height: 1.7;
          margin: 0;
          padding-left: 28px;
        }


        /* ════ SERVICES PILLARS ════ */
        .ab-pillars {
          padding: 100px 24px;
          background: #fff;
        }
        .ab-pillars-inner {
          max-width: 1100px;
          margin: 0 auto;
          opacity: 0;
        }
        .ab-pillars-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .ab-pillars-desc {
          font-size: 1.02rem;
          color: #64748b;
          max-width: 540px;
          margin: 0 auto;
        }
        .ab-pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .ab-pillar-card {
          background: #fafafa;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 32px 28px 28px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
        }
        .ab-pillar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #ff1717;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s;
        }
        .ab-pillar-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.08);
          border-color: transparent;
          background: #fff;
        }
        .ab-pillar-card:hover::before { transform: scaleX(1); }
        .ab-pillar-num {
          font-size: 2.4rem;
          font-weight: 900;
          color: rgba(255,23,23,0.1);
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 16px;
        }
        .ab-pillar-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
        }
        .ab-pillar-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.65;
          margin: 0 0 16px;
        }
        .ab-pillar-link {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ff1717;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s;
        }
        .ab-pillar-link:hover { gap: 8px; }


        /* ════ VALUES ════ */
        .ab-values {
          padding: 100px 24px;
          background: #fafafa;
        }
        .ab-values-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          gap: 64px;
          align-items: center;
          opacity: 0;
        }
        .ab-values-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 8px;
        }
        .ab-value-item {
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }
        .ab-value-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,23,23,0.06);
          color: #ff1717;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ab-value-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .ab-value-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }
        .ab-values-visual {
          position: relative;
        }
        .ab-values-img-wrap {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.1);
        }
        .ab-values-img-wrap img {
          display: block;
          width: 100%;
          height: 520px;
          object-fit: cover;
        }


        /* ════ TIMELINE ════ */
        .ab-timeline {
          padding: 100px 24px;
          background: #fff;
        }
        .ab-timeline-inner {
          max-width: 900px;
          margin: 0 auto;
          opacity: 0;
        }
        .ab-timeline-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .ab-timeline-track {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
        }
        .ab-timeline-track::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e2e8f0;
        }
        .ab-tl-item {
          padding: 0 16px;
          position: relative;
        }
        .ab-tl-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #ff1717;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }
        .ab-tl-year {
          font-size: 0.78rem;
          font-weight: 800;
          color: #ff1717;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .ab-tl-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .ab-tl-desc {
          font-size: 0.84rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }


        /* ════ BOOTCAMP ════ */
        .ab-bootcamp {
          padding: 100px 24px;
          background: #09090b;
          position: relative;
          overflow: hidden;
        }
        .ab-bootcamp::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.08) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          pointer-events: none;
        }
        .ab-bootcamp-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 2;
          opacity: 0;
        }
        .ab-bootcamp-title {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -1px;
          margin: 0 0 20px;
        }
        .ab-bootcamp-desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.75;
          margin: 0 0 28px;
        }
        .ab-bootcamp-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ab-bootcamp-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }
        .ab-bootcamp-visual {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }
        .ab-bootcamp-visual img {
          display: block;
          width: 100%;
          height: 420px;
          object-fit: cover;
        }


        /* ════ BOTTOM CTA ════ */
        .ab-bottom-cta {
          padding: 80px 24px;
          background: linear-gradient(135deg, #09090b 0%, #1a1a2e 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ab-bottom-cta::before {
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
        .ab-bottom-cta-inner {
          max-width: 650px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          opacity: 0;
        }
        .ab-bottom-cta h2 {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -1px;
        }
        .ab-bottom-cta p {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin: 0 0 36px;
        }
        .ab-bottom-btns {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }


        /* ════ RESPONSIVE ════ */
        @media (max-width: 1024px) {
          .ab-story-inner,
          .ab-founder-inner,
          .ab-values-inner,
          .ab-bootcamp-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .ab-pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .ab-timeline-track {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
          .ab-timeline-track::before { display: none; }
          .ab-stats-inner {
            grid-template-columns: repeat(2, 1fr);
          }
          .ab-hero { min-height: 480px; padding: 110px 24px 80px; }
        }
        @media (max-width: 768px) {
          .ab-pillars-grid { grid-template-columns: 1fr; }
          .ab-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .ab-stat { padding: 28px 16px; }
          .ab-stat-val { font-size: 1.8rem; }
          .ab-story, .ab-founder, .ab-pillars, .ab-values, .ab-timeline, .ab-bootcamp {
            padding: 64px 16px;
          }
          .ab-founder-img-wrap img { height: 360px; }
          .ab-story-img-wrap img { height: 320px; }
          .ab-values-img-wrap img { height: 360px; }
          .ab-bootcamp-visual img { height: 300px; }
          .ab-hero { min-height: 400px; padding: 100px 16px 60px; }
          .ab-hero-title { letter-spacing: -1px; }
        }
        @media (max-width: 480px) {
          .ab-stats-inner { grid-template-columns: 1fr 1fr; }
          .ab-stat { padding: 20px 12px; }
          .ab-stat-val { font-size: 1.5rem; }
          .ab-hero-title { font-size: 2rem; }
          .ab-hero-desc { font-size: 0.92rem; }
          .ab-hero-ctas { flex-direction: column; align-items: center; }
          .ab-section-title { font-size: 1.6rem; }
          .ab-timeline-track { grid-template-columns: 1fr; gap: 24px; }
          .ab-tl-dot { width: 12px; height: 12px; }
          .ab-founder-img-wrap img { height: 280px; }
          .ab-bottom-btns { flex-direction: column; align-items: stretch; }
          .ab-btn { justify-content: center; }
          .ab-bootcamp-visual img { height: 240px; }
        }
      `}} />
    </>
  )
}
