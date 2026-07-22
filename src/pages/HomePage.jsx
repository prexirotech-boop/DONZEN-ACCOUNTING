import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#FFFFFF', color: '#101010', fontFamily: 'var(--font)', minHeight: '100vh' }}>
      
      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #101010 0%, #18181B 60%, #050505 100%)',
        color: '#FFFFFF',
        padding: '100px 24px 90px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '3px solid #ff1717'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,23,23,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,23,23,0.12)',
              border: '1px solid rgba(255,23,23,0.3)',
              color: '#ff1717',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '10px' }}>🔴</span> Welcome To Donzen Accounting Hub
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-1px',
              color: '#FFFFFF'
            }}>
              A Bookkeeping Firm & Community Dedicated To <span style={{ color: '#ff1717' }}>Your Financial Success</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.7,
              marginBottom: '32px',
              maxWidth: '620px'
            }}>
              Donzen is a place for every Startup, SME, and Entrepreneur looking for a one-stop shop for easy business accounting. We offer comprehensive bookkeeping and accounting services tailored for businesses of all sizes across Nigeria and Africa.
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderLeft: '4px solid #ff1717',
              padding: '14px 20px',
              borderRadius: '0 8px 8px 0',
              marginBottom: '36px',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#F7F3F5'
            }}>
              Our Mission: To make bookkeeping solutions and accounting education more accessible! <br />
              <strong style={{ color: '#ff1717', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.95rem' }}>We Are Bookkeeping For Africa.</strong>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/contact" style={{
                background: '#ff1717',
                color: '#FFFFFF',
                padding: '16px 36px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(255,23,23,0.4)',
                transition: 'all 0.25s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Request A Service ➔
              </Link>
              <Link to="/resources" style={{
                background: '#F7F3F5',
                color: '#101010',
                padding: '16px 32px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                border: '1px solid #E4E4E7'
              }}>
                Our Plans & Pricing
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img 
                src="/logo.png" 
                alt="Donzen Accounting Hub Logo" 
                style={{ height: '56px', width: 'auto', margin: '0 auto 16px', objectFit: 'contain' }} 
              />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>You Think It, We Fix It At Donzen!</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Your trusted partner in financial recordkeeping & tax compliance.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { title: 'Trusted Expertise', desc: 'Knowledgeable years of industry experience across startups, SMEs & corporate sectors.' },
                { title: 'Real-Time Financial Reports', desc: '24/7 access to your profit & loss statements, balance sheets, and tax reports.' },
                { title: 'Custom DIY Accounting Tools', desc: 'Custom Excel & QuickBooks templates built specifically for non-accountant business owners.' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  borderLeft: '3px solid #ff1717'
                }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <a 
                href="https://wa.me/message/XUEP2CGZ4FM6E1" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  color: '#22c55e',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                💬 Chat On WhatsApp With Our Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATEMENT / TAGLINE BAR ─────────────────────────────────── */}
      <section style={{
        background: '#ff1717',
        color: '#FFFFFF',
        padding: '24px 20px',
        textAlign: 'center',
        fontWeight: 800,
        fontSize: '1.2rem',
        letterSpacing: '0.5px'
      }}>
        At Donzen, We Can Help You Achieve The Best Results In Business Accounting. Our Business Is Your Success!
      </section>

      {/* ─── 5 CORE OFFERINGS GRID ───────────────────────────────────── */}
      <section style={{ padding: '90px 24px', background: '#F7F3F5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
              What We Do Best
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', color: '#101010' }}>
              Our Core Services & Accounting Solutions
            </h2>
            <p style={{ maxWidth: '650px', margin: '12px auto 0', color: '#71717A', fontSize: '1.05rem' }}>
              We are your choice partner with the best experience in providing exceptional and relatable bookkeeping solutions you need to succeed.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            
            {/* 01. Bookkeeping Services */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              borderTop: '4px solid #ff1717',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ff1717', opacity: 0.85, marginBottom: '12px' }}>01.</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#101010', marginBottom: '14px' }}>
                  Bookkeeping & Accounting Services for Small Business
                </h3>
                <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  At Donzen Accounting Hub, we offer comprehensive, accurate, and reliable bookkeeping services to help your business stay on top of financial records and make informed decisions.
                </p>
              </div>
              <Link to="/services" style={{ color: '#ff1717', fontWeight: 700, textDecoration: 'none' }}>
                Read More ➔
              </Link>
            </div>

            {/* 02. Experience Program */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              borderTop: '4px solid #101010',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#101010', opacity: 0.85, marginBottom: '12px' }}>02.</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#101010', marginBottom: '14px' }}>
                  Donzen Accounting Experience Program
                </h3>
                <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  A 30-Day Online Accounting Training and Certification Academy where you learn lifetime practical skills needed in any workplace, with hands-on QuickBooks & Excel training.
                </p>
              </div>
              <Link to="/about" style={{ color: '#ff1717', fontWeight: 700, textDecoration: 'none' }}>
                Learn More ➔
              </Link>
            </div>

            {/* 03. Tools & Resources */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              borderTop: '4px solid #ff1717',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ff1717', opacity: 0.85, marginBottom: '12px' }}>03.</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#101010', marginBottom: '14px' }}>
                  Accounting Tools & Resources
                </h3>
                <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  Intuitive financial tools designed specifically for small business owners with no accounting background to track income, automate tasks, and remain tax compliant.
                </p>
              </div>
              <Link to="/resources" style={{ color: '#ff1717', fontWeight: 700, textDecoration: 'none' }}>
                Read More ➔
              </Link>
            </div>

            {/* 04. Systems & Procedures */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              borderTop: '4px solid #101010',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#101010', opacity: 0.85, marginBottom: '12px' }}>04.</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#101010', marginBottom: '14px' }}>
                  Accounting Systems & Procedures for SMEs
                </h3>
                <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  Customized procedures that streamline financial processes, eliminate errors, prevent internal fraud, and ensure timely financial statement delivery.
                </p>
              </div>
              <Link to="/services" style={{ color: '#ff1717', fontWeight: 700, textDecoration: 'none' }}>
                Read More ➔
              </Link>
            </div>

            {/* 05. Templates */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              borderTop: '4px solid #ff1717',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gridColumn: '1 / -1'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ff1717', opacity: 0.85, marginBottom: '12px' }}>05.</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#101010', marginBottom: '14px' }}>
                  Donzen Accounting Templates for Small Business
                </h3>
                <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  Know exactly what’s happening with your business finances. Our custom P&L statements, vendor management, and client management DIY templates eliminate complexity so you can focus on growing your business.
                </p>
              </div>
              <Link to="/resources" style={{ color: '#ff1717', fontWeight: 700, textDecoration: 'none' }}>
                Learn More ➔
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── THREE FEATURE PILLARS ───────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '36px'
          }}>
            
            <div style={{
              background: '#F7F3F5',
              borderRadius: '16px',
              padding: '36px',
              textAlign: 'center',
              border: '1px solid #E4E4E7'
            }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>🎧</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#101010', marginBottom: '10px' }}>Dedicated Support</h3>
              <p style={{ color: '#71717A', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Our team of experienced accountants is ready and waiting to help online, on WhatsApp, and over the phone whenever you need advice.
              </p>
            </div>

            <div style={{
              background: '#F7F3F5',
              borderRadius: '16px',
              padding: '36px',
              textAlign: 'center',
              border: '1px solid #E4E4E7'
            }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>📱</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#101010', marginBottom: '10px' }}>Business On The Go</h3>
              <p style={{ color: '#71717A', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Take your business anywhere in the world. Collaborate effortlessly with your accountant or bookkeeper to share books securely across devices.
              </p>
            </div>

            <div style={{
              background: '#F7F3F5',
              borderRadius: '16px',
              padding: '36px',
              textAlign: 'center',
              border: '1px solid #E4E4E7'
            }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>🔒</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#101010', marginBottom: '10px' }}>Secure Cloud Storage</h3>
              <p style={{ color: '#71717A', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Safely store and retrieve your business records, invoices, bank reconciliations, and financial statements 24/7 with end-to-end security.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ───────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #101010 0%, #18181B 100%)',
        color: '#FFFFFF',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
            Hello — Make The Right Call
          </span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, margin: '16px 0', color: '#FFFFFF' }}>
            Ready To Streamline Your Business Finances?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '36px', lineHeight: 1.6 }}>
            Join hundreds of African small businesses, startups, and accounting professionals who trust Donzen Accounting Hub for accurate recordkeeping and growth.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              background: '#ff1717',
              color: '#FFFFFF',
              padding: '16px 36px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(255,23,23,0.4)'
            }}>
              Start Today — Get Started
            </Link>
            <a href="tel:+2347039999842" style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              padding: '16px 28px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Call Us: +234 703 9999 842
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
