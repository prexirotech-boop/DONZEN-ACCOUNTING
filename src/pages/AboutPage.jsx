import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

// High-Grade SVG Vector Icons (No Emojis)
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
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  ),
  Award: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export default function AboutPage() {
  
  // Smooth Scroll-Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.12 }
    )

    const hiddenElements = document.querySelectorAll('.scroll-reveal')
    hiddenElements.forEach((el) => observer.observe(el))

    return () => hiddenElements.forEach((el) => observer.unobserve(el))
  }, [])

  return (
    <div className="about-root-container">

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

      {/* ─── 1. EXECUTIVE HERO BANNER ───────────────────────────────────── */}
      <section className="about-hero-section">
        <div className="about-hero-bg-grid" />
        <div className="about-glow-1" />
        <div className="about-glow-2" />

        <div className="about-hero-content scroll-reveal">
          <span className="about-hero-pretitle">ABOUT DONZEN ACCOUNTING HUB</span>
          <h1 className="about-hero-headline">
            We Take The Time To Understand Your Business & Individual Needs.
          </h1>
          <p className="about-hero-subtitle">
            Providing top-quality bookkeeping and accounting services to help small businesses stay organized, tax compliant, and on track for long-term growth.
          </p>
        </div>
      </section>

      {/* ─── 2. OUR STORY & LEADERSHIP FOUNDER SPOTLIGHT ─────────────────── */}
      <section className="story-section">
        <div className="story-container">
          
          {/* Story Copy Column */}
          <div className="story-text-col scroll-reveal">
            <span className="section-pretitle">OUR STORY & PHILOSOPHY</span>
            <h2 className="story-heading">What We're All About</h2>
            
            <p className="story-para">
              At <strong>Donzen Accounting Hub</strong>, we understand the struggles that small business owners face when it comes to keeping up with their finances. That’s why we started our brand – to provide top-quality bookkeeping and accounting services to help small businesses stay organized and on track.
            </p>
            
            <p className="story-para">
              Our team of experienced professionals is dedicated to providing personalized, reliable, and accurate services to our clients. We specialize in working with small businesses and understand the unique challenges they face in the world of finance.
            </p>

            <p className="story-para">
              With our services, you can focus on running your business while we handle the financial accounting side of things. We offer a range of services including bookkeeping, business accounting, monthly and year-end financial reporting, inventory management, accounting tools, and tax preparation. Our goal is to help you succeed and grow your business, and we are here to support you every step of the way.
            </p>

            {/* Highlighted Executive Quote Callout Box */}
            <div className="story-callout-box">
              <div className="callout-indicator" />
              <p className="callout-text">
                If you’re a small business owner looking for expert bookkeeping and accounting services, look no further. Contact us today to see how we can help you achieve financial success.
              </p>
            </div>
          </div>

          {/* Founder Executive Card */}
          <div className="founder-card-col scroll-reveal">
            <div className="founder-card">
              <div className="founder-card-header">
                <span className="founder-badge-small">LEADERSHIP & FOUNDER</span>
                <h3 className="founder-name">Samuel Onainor</h3>
                <div className="founder-title">Founder / CEO — Donzen Accounting Hub</div>
              </div>

              <div className="founder-motto-pill">
                <Icons.Award />
                <span>WE ARE BOOKKEEPING FOR AFRICA</span>
              </div>

              <div className="founder-bio">
                <p>
                  A professional accountant with knowledgeable years of industry experience across financial and management consulting, real estate, startups, SMEs, hospitality, education, I.T, and more!
                </p>
                <p>
                  He is the Founder/CEO of Donzen Accounting Hub, a bookkeeping firm and a community dedicated to fostering the right skills, principles, and commitments to thrive in the new normal of business and professional accounting career advancement.
                </p>
                <p>
                  A passionate individual driven by people, innovation and technology to help small business owners, sole proprietors, small startups, and medium-sized businesses with limited in-house financial resources handle their financial record keeping and reporting with confidence.
                </p>
              </div>

              <div className="founder-card-footer">
                <Link to="/contact" className="btn-founder-connect">
                  <span>Connect With Our Team</span>
                  <Icons.ArrowRight />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. TALENT DEVELOPMENT & CAREER ADVANCEMENT ─────────────────── */}
      <section className="talent-section">
        <div className="talent-container">
          
          <div className="section-header text-center scroll-reveal">
            <span className="section-pretitle">TALENT DEVELOPMENT & CAREER ADVANCEMENT</span>
            <h2 className="section-title">Empowering The Future Accountants: Learn, Network, Startup!</h2>
            <p className="section-subtitle">
              We are the first choice of contact for fresh accountants and digital bookkeeping professionals.
            </p>
          </div>

          {/* Core Vision Card */}
          <div className="talent-vision-card scroll-reveal">
            <p>
              At Donzen, we are in the business of creating digital accountants and bookkeepers looking to develop their talent and skills, who will provide bookkeeping solutions to small businesses, startup entrepreneurs, and business owners.
            </p>
            <p>
              To enable us serve much better, we have incorporated a digitally-focused bootcamp in our online and physical business accounting training, allowing students to gain hands-on practical and relatable bookkeeping skills and business accounting experience for real-world career advancement.
            </p>
            <p className="last-para">
              It has been incredibly easy for anyone to learn, network and startup their business or career in accounting using developed technology, process, and data accounting skills. The idea not only helps to address the skills gap in the accounting profession but is highly recommended for all fresh accounting graduates, startup entrepreneurs, and SMEs even if you have no previous accounting knowledge.
            </p>
          </div>

          {/* 3 Pillar Cards: How, Why, What */}
          <div className="pillars-grid">
            
            {/* How We Do It */}
            <div className="pillar-card pillar-red scroll-reveal">
              <div className="pillar-header">
                <div className="pillar-icon-box">
                  <Icons.Target />
                </div>
                <h3 className="pillar-title">How We Do It</h3>
              </div>
              <p className="pillar-desc">
                With great skills in QuickBooks, Excel, and other accounting applications. We help clients in all aspects of bookkeeping including setting up chart of accounts, custom templates, and other relevant accounting tasks.
              </p>
            </div>

            {/* Why We Do It */}
            <div className="pillar-card pillar-dark scroll-reveal">
              <div className="pillar-header">
                <div className="pillar-icon-box dark">
                  <Icons.Users />
                </div>
                <h3 className="pillar-title">Why We Do It</h3>
              </div>
              <p className="pillar-desc">
                Organized real-time bookkeeping and accounting solutions to accurately track, report your day-to-day business transactions, reconcile accounts on a regular basis, and give you financial clarity.
              </p>
            </div>

            {/* What We Do */}
            <div className="pillar-card pillar-red scroll-reveal">
              <div className="pillar-header">
                <div className="pillar-icon-box">
                  <Icons.Award />
                </div>
                <h3 className="pillar-title">What We Do</h3>
              </div>
              <ul className="pillar-bullets">
                <li>Save money and avoid waste in business.</li>
                <li>Achieve more, better and faster results.</li>
                <li>Save daunting pain and manual efforts.</li>
                <li>Build your dream business with strong internal controls.</li>
                <li>Block loopholes and improve financial processes.</li>
                <li>Scale your business finances using accurate recordkeeping.</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 4. EXECUTIVE COMMUNITY CTA BANNER ──────────────────────────── */}
      <section className="community-cta-section">
        <div className="community-cta-container scroll-reveal">
          <h2 className="community-cta-heading">Start Today — Join Our Community!</h2>
          <p className="community-cta-desc">
            Connect with accounting experts, business founders, and finance professionals across Africa.
          </p>

          <a 
            href="https://wa.me/message/XUEP2CGZ4FM6E1" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-community-whatsapp"
          >
            <Icons.WhatsApp />
            <span>Chat On WhatsApp</span>
          </a>
        </div>
      </section>

      {/* ─── COMPREHENSIVE STYLESHEET ────────────────────────────────── */}
      <style>{`
        .about-root-container {
          font-family: var(--font, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif);
          background-color: #ffffff;
          color: #0f172a;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Scroll Reveal Observer Animation */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hero Section */
        .about-hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #090d16 100%);
          color: #ffffff;
          padding: 92px 24px 76px;
          border-bottom: 3px solid #ff1717;
          position: relative;
          text-align: center;
          overflow: hidden;
        }
        .about-hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.6;
          pointer-events: none;
        }
        .about-glow-1 {
          position: absolute;
          top: -20%;
          left: 30%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(255,23,23,0.15) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .about-glow-2 {
          position: absolute;
          bottom: -20%;
          right: 20%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
        }

        .about-hero-content {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .about-hero-pretitle {
          font-size: 0.8rem;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
        }
        .about-hero-headline {
          font-size: clamp(2.3rem, 4.2vw, 3.5rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -1px;
          color: #ffffff;
          margin: 0 0 18px;
        }
        .about-hero-subtitle {
          font-size: 1.15rem;
          color: #94a3b8;
          line-height: 1.7;
          margin: 0 auto;
          max-width: 700px;
        }

        /* Utility Section Pretitle & Header */
        .section-pretitle {
          font-size: 0.78rem;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .section-header {
          max-width: 760px;
          margin: 0 auto 52px;
        }
        .section-header.text-center {
          text-align: center;
        }
        .section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.4rem);
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.8px;
          line-height: 1.25;
          margin: 0 0 12px;
        }
        .section-subtitle {
          font-size: 1.05rem;
          color: #64748b;
          margin: 0;
        }

        /* Story & Founder Section */
        .story-section {
          padding: 92px 24px;
          background: #ffffff;
        }
        .story-container {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 56px;
          align-items: center;
        }
        .story-heading {
          font-size: 2.2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 20px;
          letter-spacing: -0.5px;
        }
        .story-para {
          font-size: 1rem;
          color: #475569;
          line-height: 1.75;
          margin-bottom: 18px;
        }

        .story-callout-box {
          position: relative;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 24px 28px;
          margin-top: 28px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
        }
        .callout-indicator {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 5px;
          background: #ff1717;
          border-top-left-radius: 14px;
          border-bottom-left-radius: 14px;
        }
        .callout-text {
          font-size: 0.98rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.6;
          margin: 0;
        }

        /* Founder Executive Card */
        .founder-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }
        .founder-badge-small {
          font-size: 0.75rem;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .founder-name {
          font-size: 2rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }
        .founder-title {
          font-size: 0.92rem;
          color: #ff1717;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .founder-motto-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 23, 23, 0.12);
          border: 1px solid rgba(255, 23, 23, 0.3);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 24px;
        }
        .founder-bio p {
          font-size: 0.94rem;
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .btn-founder-connect {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ff1717;
          color: #ffffff;
          padding: 13px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(255, 23, 23, 0.35);
          margin-top: 8px;
        }
        .btn-founder-connect:hover {
          background: #d91414;
          transform: translateY(-2px);
        }

        /* Talent Section */
        .talent-section {
          padding: 92px 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .talent-container {
          max-width: 1240px;
          margin: 0 auto;
        }
        .talent-vision-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 4px solid #ff1717;
          border-radius: 20px;
          padding: 44px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          margin-bottom: 48px;
        }
        .talent-vision-card p {
          font-size: 1.02rem;
          color: #475569;
          line-height: 1.75;
          margin-bottom: 18px;
        }
        .talent-vision-card p.last-para {
          margin-bottom: 0;
        }

        /* Pillars Grid: How, Why, What */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .pillar-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 36px 30px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .pillar-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
        }
        .pillar-card.pillar-red {
          border-top: 4px solid #ff1717;
        }
        .pillar-card.pillar-dark {
          border-top: 4px solid #0f172a;
        }

        .pillar-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .pillar-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(255, 23, 23, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pillar-icon-box.dark {
          background: rgba(15, 23, 42, 0.08);
        }
        .pillar-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }
        .pillar-desc {
          font-size: 0.94rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        .pillar-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pillar-bullets li {
          font-size: 0.9rem;
          color: #334155;
          font-weight: 600;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .pillar-bullets li::before {
          content: '•';
          color: #ff1717;
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 1;
        }

        /* Community CTA Banner */
        .community-cta-section {
          background: linear-gradient(135deg, #ff1717 0%, #d91414 100%);
          color: #ffffff;
          padding: 92px 24px;
          text-align: center;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
        }
        .community-cta-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .community-cta-heading {
          font-size: clamp(2rem, 3.8vw, 3rem);
          font-weight: 900;
          margin: 0 0 14px;
          letter-spacing: -0.8px;
          color: #ffffff;
        }
        .community-cta-desc {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.92);
          margin: 0 0 36px;
          line-height: 1.6;
        }
        .btn-community-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #0f172a;
          color: #ffffff;
          padding: 16px 36px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 1rem;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        .btn-community-whatsapp:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .story-container {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .about-hero-section {
            padding: 56px 18px 60px;
          }
          .story-section, .talent-section {
            padding: 56px 18px;
          }
          .founder-card {
            padding: 28px 20px;
          }
          .talent-vision-card {
            padding: 28px 20px;
          }
          .pillars-grid {
            grid-template-columns: 1fr;
          }
          .community-cta-section {
            padding: 64px 18px;
          }
          .btn-community-whatsapp {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

    </div>
  )
}
