import React from 'react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div style={{ background: '#FFFFFF', color: '#101010', fontFamily: 'var(--font)', minHeight: '100vh' }}>
      
      {/* ─── HEADER BANNER ────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #101010 0%, #18181B 100%)',
        color: '#FFFFFF',
        padding: '90px 24px 70px',
        textAlign: 'center',
        borderBottom: '3px solid #ff1717',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <span style={{
            color: '#ff1717',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.85rem'
          }}>
            About Donzen Accounting Hub
          </span>
          <h1 style={{
            fontSize: 'clamp(2.3rem, 4.5vw, 3.6rem)',
            fontWeight: 900,
            marginTop: '12px',
            marginBottom: '16px',
            color: '#FFFFFF'
          }}>
            We Take The Time To Understand Your Business & Individual Needs.
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7,
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            Providing top-quality bookkeeping and accounting services to help small businesses stay organized, tax compliant, and on track for long-term growth.
          </p>
        </div>
      </section>

      {/* ─── WHAT WE'RE ALL ABOUT ─────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '50px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.85rem' }}>
              Our Story & Philosophy
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '8px', marginBottom: '20px', color: '#101010' }}>
              What We're All About
            </h2>
            <p style={{ color: '#3F3F46', fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
              At <strong>Donzen Accounting Hub</strong>, we understand the struggles that small business owners face when it comes to keeping up with their finances. That’s why we started our brand – to provide top-quality bookkeeping and accounting services to help small businesses stay organized and on track.
            </p>
            <p style={{ color: '#3F3F46', fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
              Our team of experienced professionals is dedicated to providing personalized, reliable, and accurate services to our clients. We specialize in working with small businesses and understand the unique challenges they face in the world of finance.
            </p>
            <p style={{ color: '#3F3F46', fontSize: '1rem', lineHeight: 1.8, marginBottom: '24px' }}>
              With our services, you can focus on running your business while we handle the financial accounting side of things. We offer a range of services including bookkeeping, business accounting, monthly and year-end financial reporting, inventory management, accounting tools, and tax preparation. Our goal is to help you succeed and grow your business, and we are here to support you every step of the way.
            </p>

            <div style={{
              background: '#F7F3F5',
              padding: '20px 24px',
              borderRadius: '12px',
              borderLeft: '4px solid #ff1717',
              fontWeight: 600,
              color: '#101010'
            }}>
              If you’re a small business owner looking for expert bookkeeping and accounting services, look no further. Contact us today to see how we can help you achieve financial success.
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #101010, #18181B)',
            color: '#FFFFFF',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,23,23,0.3)'
          }}>
            <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
              Leadership & Founder
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '8px', marginBottom: '4px', color: '#FFFFFF' }}>
              Samuel Onainor
            </h3>
            <p style={{ color: '#ff1717', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>
              Founder / CEO — Donzen Accounting Hub
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#ff1717',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '20px'
            }}>
              We Are Bookkeeping For Africa
            </div>

            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '16px' }}>
              A professional accountant with knowledgeable years of industry experience across financial and management consulting, real estate, startups, SMEs, hospitality, education, I.T, and more!
            </p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '16px' }}>
              He is the Founder/CEO of Donzen Accounting Hub, a bookkeeping firm and a community dedicated to fostering the right skills, principles, and commitments to thrive in the new normal of business and professional accounting career advancement.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              A passionate individual driven by people, innovation and technology to help small business owners, sole proprietors, small startups, and medium-sized businesses with limited in-house financial resources handle their financial record keeping and reporting with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ─── EMPOWERING FUTURE ACCOUNTANTS ───────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F7F3F5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
              Talent Development & Career Advancement
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, marginTop: '8px', color: '#101010' }}>
              Empowering The Future Accountants: Learn, Network, Startup!
            </h2>
            <p style={{ maxWidth: '680px', margin: '12px auto 0', color: '#71717A', fontSize: '1.05rem' }}>
              We are the first choice of contact for fresh accountants and digital bookkeeping professionals.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            borderTop: '4px solid #ff1717',
            marginBottom: '50px'
          }}>
            <p style={{ color: '#3F3F46', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '16px' }}>
              At Donzen, we are in the business of creating digital accountants and bookkeepers looking to develop their talent and skills, who will provide bookkeeping solutions to small businesses, startup entrepreneurs, and business owners.
            </p>
            <p style={{ color: '#3F3F46', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '16px' }}>
              To enable us serve much better, we have incorporated a digitally-focused bootcamp in our online and physical business accounting training, allowing students to gain hands-on practical and relatable bookkeeping skills and business accounting experience for real-world career advancement.
            </p>
            <p style={{ color: '#3F3F46', fontSize: '1.02rem', lineHeight: 1.8 }}>
              It has been incredibly easy for anyone to learn, network and startup their business or career in accounting using developed technology, process, and data accounting skills. The idea not only helps to address the skills gap in the accounting profession but is highly recommended for all fresh accounting graduates, startup entrepreneurs, and SMEs even if you have no previous accounting knowledge.
            </p>
          </div>

          {/* How, Why, What Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            
            {/* How We Do It */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              borderLeft: '4px solid #ff1717'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#101010', marginBottom: '12px' }}>How We Do It</h3>
              <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.7 }}>
                With great skills in QuickBooks, Excel, and other accounting applications. We help clients in all aspects of bookkeeping including setting up chart of accounts, custom templates, and other relevant accounting tasks.
              </p>
            </div>

            {/* Why We Do It */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              borderLeft: '4px solid #101010'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#101010', marginBottom: '12px' }}>Why We Do It</h3>
              <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Organized real-time bookkeeping and accounting solutions to accurately track, report your day-to-day business transactions, reconcile accounts on a regular basis, and give you financial clarity.
              </p>
            </div>

            {/* What We Do */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              borderLeft: '4px solid #ff1717'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#101010', marginBottom: '12px' }}>What We Do</h3>
              <ul style={{ color: '#3F3F46', fontSize: '0.92rem', lineHeight: 1.8, paddingLeft: '18px', listStyleType: 'disc' }}>
                <li>Save money and avoid waste in business.</li>
                <li>Achieve more, better and faster.</li>
                <li>Save daunting pain and manual efforts.</li>
                <li>Build your dream business with strong internal controls.</li>
                <li>Block loopholes and improve financial processes.</li>
                <li>Scale your business finances using accurate recordkeeping.</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ─── COMMUNITY CTA ───────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #ff1717 0%, #d91414 100%)',
        color: '#FFFFFF',
        padding: '70px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 750, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '16px', color: '#FFFFFF' }}>
            Start Today — Join Our Community!
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.95 }}>
            Connect with accounting experts, business founders, and finance professionals across Africa.
          </p>
          <a
            href="https://wa.me/message/XUEP2CGZ4FM6E1"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#101010',
              color: '#FFFFFF',
              padding: '16px 36px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }}
          >
            Chat On WhatsApp 💬
          </a>
        </div>
      </section>

    </div>
  )
}
