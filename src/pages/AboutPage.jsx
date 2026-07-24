import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

// High-Grade SVG Vector Icons (No Emojis)
const Icons = {
  ArrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  ),
  Quote: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255, 23, 23, 0.15)">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function AboutPage() {
  
  // Advanced Scroll-Reveal Observer for Staggered Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const hiddenElements = document.querySelectorAll('.scroll-reveal')
    hiddenElements.forEach((el) => observer.observe(el))

    return () => hiddenElements.forEach((el) => observer.unobserve(el))
  }, [])

  return (
    <div className="about-modern-root">

      {/* Structured Schema.org SEO for AI Engines & Google Knowledge Graph */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Donzen Accounting Hub",
          "url": "https://www.donzenaccountinghub.com/about",
          "description": "Learn about Donzen Accounting Hub, our founder Samuel Onainor, our mission to provide expert bookkeeping, FIRS tax compliance, and digital accounting training across Nigeria and Africa.",
          "mainEntity": {
            "@type": "AccountingService",
            "name": "Donzen Accounting Hub",
            "founder": {
              "@type": "Person",
              "name": "Samuel Onainor",
              "jobTitle": "Founder & CEO"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Ikota Shopping Complex, Eti-Osa",
              "addressLocality": "Lekki",
              "addressRegion": "Lagos",
              "addressCountry": "NG"
            }
          }
        })
      }} />

      {/* ─── 1. SPLIT ASYMMETRICAL HERO SECTION ───────────────────────────── */}
      <section className="about-hero-modern">
        <div className="hero-bg-texture" />
        <div className="about-hero-container">
          
          <div className="hero-content-left scroll-reveal">
            <span className="premium-badge">OUR MISSION & VISION</span>
            <h1 className="hero-headline">
              Elevating African Businesses Through Precision Accounting
            </h1>
            <p className="hero-subtitle">
              We take the time to understand your unique business architecture. We provide top-quality bookkeeping and tax compliance services to help SMEs scale with total financial clarity.
            </p>
            <div className="hero-cta-wrapper">
              <Link to="/contact" className="btn-solid-red">
                <span>Partner With Us</span>
                <Icons.ArrowRight />
              </Link>
            </div>
          </div>

          <div className="hero-visual-right scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="image-stack-wrapper">
              <img src="/hero-corporate.jpg" alt="Corporate Financial Consulting" className="img-main-hero" />
              <div className="floating-stat-card">
                <span className="stat-value">₦5B+</span>
                <span className="stat-label">Reconciled Volume</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. THE FOUNDER SPOTLIGHT (SAMUEL ONAINOR) ────────────────────── */}
      <section className="founder-spotlight-section">
        <div className="founder-container">
          
          <div className="founder-image-col scroll-reveal">
            <div className="founder-image-wrapper">
              <img src="/founder_portrait.jpg" alt="Samuel Onainor - CEO Donzen Accounting Hub" className="founder-img" />
              <div className="founder-nameplate">
                <div className="nameplate-title">Samuel Onainor</div>
                <div className="nameplate-role">Founder & CEO</div>
              </div>
            </div>
            <div className="decorative-shape-red"></div>
          </div>

          <div className="founder-text-col scroll-reveal" style={{ transitionDelay: '0.15s' }}>
            <Icons.Quote />
            <h2 className="founder-heading">We Are Bookkeeping For Africa.</h2>
            
            <p className="founder-bio-text">
              <strong>Samuel Onainor</strong> is a professional accountant with knowledgeable years of industry experience across financial and management consulting, real estate, startups, SMEs, hospitality, education, I.T, and more.
            </p>
            
            <p className="founder-bio-text">
              He is the Founder/CEO of Donzen Accounting Hub, a bookkeeping firm and a community dedicated to fostering the right skills, principles, and commitments to thrive in the new normal of business and professional accounting career advancement.
            </p>

            <div className="founder-highlight-box">
              <p>
                "A passionate individual driven by people, innovation and technology to help small business owners, sole proprietors, small startups, and medium-sized businesses handle their financial record keeping with absolute confidence."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. TALENT DEVELOPMENT & BOOTCAMP VISION ──────────────────────── */}
      <section className="talent-vision-section">
        <div className="talent-bg-layer"></div>
        <div className="talent-container">
          
          <div className="talent-header scroll-reveal">
            <span className="premium-badge light">TALENT DEVELOPMENT</span>
            <h2 className="talent-title">Empowering The Future Accountants</h2>
            <p className="talent-subtitle">
              We are the first choice of contact for fresh accountants and digital bookkeeping professionals. Learn, Network, Startup!
            </p>
          </div>

          <div className="talent-image-panorama scroll-reveal">
            <img src="/bootcamp_vision.jpg" alt="Donzen Accounting Experience Program" className="panorama-img" />
            <div className="panorama-overlay-card">
              <h3>The 30-Day Practical Bootcamp</h3>
              <p>
                We have incorporated a digitally-focused bootcamp allowing students to gain hands-on practical and relatable bookkeeping skills for real-world career advancement.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. HOW, WHY, WHAT (PILLARS OF EXCELLENCE) ────────────────────── */}
      <section className="pillars-section">
        <div className="pillars-container">
          
          <div className="pillar-modern-card scroll-reveal">
            <div className="pillar-num">01</div>
            <h3 className="pillar-header">How We Do It</h3>
            <p className="pillar-text">
              With great skills in QuickBooks, Excel, and other accounting applications, we help clients in all aspects of bookkeeping, including setting up chart of accounts and custom templates.
            </p>
          </div>

          <div className="pillar-modern-card dark scroll-reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="pillar-num dark-num">02</div>
            <h3 className="pillar-header text-white">Why We Do It</h3>
            <p className="pillar-text text-light">
              We provide organized real-time bookkeeping solutions to accurately track day-to-day transactions, reconcile accounts, and give you total financial clarity.
            </p>
          </div>

          <div className="pillar-modern-card scroll-reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="pillar-num">03</div>
            <h3 className="pillar-header">What We Do</h3>
            <ul className="pillar-checklist">
              <li><Icons.Check /> Save money and avoid waste in business.</li>
              <li><Icons.Check /> Build strong internal financial controls.</li>
              <li><Icons.Check /> Block loopholes & improve processes.</li>
              <li><Icons.Check /> Scale using accurate recordkeeping.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─── 5. COMMUNITY CTA ─────────────────────────────────────────────── */}
      <section className="about-cta-section scroll-reveal">
        <div className="about-cta-card">
          <div className="cta-bg-pattern"></div>
          <div className="cta-content">
            <h2>Start Today — Join Our Community!</h2>
            <p>Connect with accounting experts, business founders, and finance professionals across Africa.</p>
            <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noreferrer" className="btn-whatsapp-cta">
              <Icons.WhatsApp />
              <span>Chat On WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── COMPREHENSIVE STYLESHEET ────────────────────────────────── */}
      <style>{`
        .about-modern-root {
          font-family: var(--font, 'Inter', sans-serif);
          background-color: #ffffff;
          color: #0f172a;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Animations */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(35px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .premium-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
          background: rgba(255, 23, 23, 0.08);
          padding: 6px 14px;
          border-radius: 4px;
          border-left: 2px solid #ff1717;
        }
        .premium-badge.light {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          border-left: 2px solid #ffffff;
        }

        /* 1. Hero Section */
        .about-hero-modern {
          position: relative;
          padding: 100px 24px 80px;
          background: #f8fafc;
          overflow: hidden;
        }
        .hero-bg-texture {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.4;
          z-index: 0;
        }
        .about-hero-container {
          position: relative;
          z-index: 2;
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: center;
        }
        .hero-headline {
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -1px;
          margin: 0 0 20px;
        }
        .hero-subtitle {
          font-size: 1.12rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 580px;
        }
        .btn-solid-red {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ff1717;
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 8px 24px rgba(255, 23, 23, 0.25);
        }
        .btn-solid-red:hover {
          background: #d91414;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 23, 23, 0.35);
        }

        .image-stack-wrapper {
          position: relative;
          width: 100%;
        }
        .img-main-hero {
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.12);
          display: block;
          object-fit: cover;
          height: 500px;
        }
        .floating-stat-card {
          position: absolute;
          bottom: -20px;
          left: -30px;
          background: #0f172a;
          color: #ffffff;
          padding: 24px 32px;
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          animation: floatSlow 6s ease-in-out infinite;
        }
        .stat-value {
          display: block;
          font-size: 2.2rem;
          font-weight: 900;
          color: #ff1717;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #cbd5e1;
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        /* 2. Founder Spotlight */
        .founder-spotlight-section {
          padding: 100px 24px;
          background: #ffffff;
        }
        .founder-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 450px 1fr;
          gap: 80px;
          align-items: center;
        }
        .founder-image-col {
          position: relative;
        }
        .founder-image-wrapper {
          position: relative;
          z-index: 2;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        .founder-img {
          width: 100%;
          height: 600px;
          object-fit: cover;
          display: block;
        }
        .founder-nameplate {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.95), transparent);
          padding: 40px 24px 24px;
          color: #ffffff;
        }
        .nameplate-title {
          font-size: 1.8rem;
          font-weight: 900;
          line-height: 1.2;
        }
        .nameplate-role {
          font-size: 0.95rem;
          color: #ff1717;
          font-weight: 700;
          margin-top: 4px;
        }
        .decorative-shape-red {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100%;
          height: 100%;
          border: 3px solid #ff1717;
          border-radius: 20px;
          z-index: 1;
        }
        
        .founder-heading {
          font-size: 2.4rem;
          font-weight: 900;
          color: #0f172a;
          margin: 16px 0 24px;
          letter-spacing: -0.5px;
        }
        .founder-bio-text {
          font-size: 1.05rem;
          color: #475569;
          line-height: 1.75;
          margin-bottom: 20px;
        }
        .founder-highlight-box {
          margin-top: 32px;
          padding: 24px;
          background: #f8fafc;
          border-left: 4px solid #ff1717;
          border-radius: 0 12px 12px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.6;
        }

        /* 3. Talent Section */
        .talent-vision-section {
          position: relative;
          padding: 100px 24px;
          background: #0f172a;
          color: #ffffff;
        }
        .talent-bg-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at right center, rgba(255,23,23,0.08), transparent 60%);
        }
        .talent-container {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
        }
        .talent-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .talent-title {
          font-size: 2.6rem;
          font-weight: 900;
          margin: 0 0 16px;
        }
        .talent-subtitle {
          font-size: 1.1rem;
          color: #94a3b8;
          max-width: 700px;
          margin: 0 auto;
        }
        .talent-image-panorama {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }
        .panorama-img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          display: block;
        }
        .panorama-overlay-card {
          position: absolute;
          bottom: 30px;
          left: 30px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 16px;
          max-width: 450px;
          color: #0f172a;
        }
        .panorama-overlay-card h3 {
          font-size: 1.4rem;
          font-weight: 900;
          margin: 0 0 10px;
          color: #ff1717;
        }
        .panorama-overlay-card p {
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
        }

        /* 4. Pillars Section */
        .pillars-section {
          padding: 80px 24px 100px;
          background: #ffffff;
        }
        .pillars-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: -60px; /* Pull up to overlap talent section slightly */
          position: relative;
          z-index: 10;
        }
        .pillar-modern-card {
          background: #ffffff;
          padding: 40px 32px;
          border-radius: 20px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
        }
        .pillar-modern-card.dark {
          background: #0f172a;
        }
        .pillar-num {
          font-size: 3.5rem;
          font-weight: 900;
          color: rgba(255, 23, 23, 0.15);
          line-height: 1;
          margin-bottom: 16px;
        }
        .pillar-num.dark-num {
          color: rgba(255,255,255,0.1);
        }
        .pillar-header {
          font-size: 1.4rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 16px;
        }
        .text-white { color: #ffffff; }
        .text-light { color: #cbd5e1 !important; }
        .pillar-text {
          font-size: 1rem;
          color: #475569;
          line-height: 1.7;
          margin: 0;
        }
        .pillar-checklist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pillar-checklist li {
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        /* 5. CTA Section */
        .about-cta-section {
          padding: 0 24px 100px;
          background: #ffffff;
        }
        .about-cta-card {
          max-width: 1000px;
          margin: 0 auto;
          background: linear-gradient(135deg, #ff1717 0%, #d91414 100%);
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 48px rgba(255, 23, 23, 0.25);
        }
        .cta-bg-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
        .cta-content {
          position: relative;
          z-index: 2;
        }
        .cta-content h2 {
          font-size: 2.6rem;
          font-weight: 900;
          margin: 0 0 16px;
        }
        .cta-content p {
          font-size: 1.15rem;
          opacity: 0.9;
          margin: 0 auto 32px;
          max-width: 600px;
        }
        .btn-whatsapp-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #0f172a;
          color: #ffffff;
          padding: 16px 36px;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-whatsapp-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.3);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .about-hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
          .hero-subtitle {
            margin: 0 auto 32px;
          }
          .floating-stat-card {
            left: 20px;
          }
          .founder-container {
            grid-template-columns: 1fr;
            gap: 50px;
          }
          .founder-img {
            height: 500px;
          }
          .decorative-shape-red {
            display: none;
          }
          .pillars-container {
            grid-template-columns: 1fr;
            margin-top: 40px;
          }
        }

        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.2rem;
          }
          .panorama-overlay-card {
            position: relative;
            bottom: auto;
            left: auto;
            max-width: 100%;
            border-radius: 0 0 24px 24px;
          }
          .panorama-img {
            border-radius: 24px 24px 0 0;
            height: 300px;
          }
          .talent-image-panorama {
            background: #ffffff;
          }
          .about-cta-card {
            padding: 40px 24px;
          }
          .cta-content h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
