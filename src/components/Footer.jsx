import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation()

  const hideFooterOn = [
    '/dashboard',
    '/setup-account',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/checkout'
  ]

  const shouldHide = hideFooterOn.some(path => location.pathname === path) || location.pathname.startsWith('/course')
  if (shouldHide) return null

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #101010 0%, #050505 100%)',
      borderTop: '1px solid rgba(255,23,23,0.15)',
      fontFamily: 'var(--font)',
      position: 'relative',
      overflow: 'hidden',
      color: '#f8fafc'
    }}>

      {/* Modern Ambient Radial Glow Spotlights */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(255,23,23,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Main Footer Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 1240,
        margin: '0 auto',
        padding: '70px 30px 40px'
      }}>
        {/* Footer Navigation & Brand Columns */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1.8fr) 1fr 1fr 1.4fr',
          gap: '48px 36px'
        }}>
          
          {/* Column 1: Brand & Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Logo Wrapper */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: 52,
              width: '100%',
              flexShrink: 0
            }}>
              <img
                src="/logo.png"
                alt="Donzen Accounting Hub"
                onClick={scrollToTop}
                style={{
                  height: '100%',
                  width: 'auto',
                  maxWidth: '220px',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 2px 8px rgba(255,23,23,0.15))',
                  transition: 'opacity 0.2s'
                }}
              />
            </div>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              margin: 0
            }}>
              A bookkeeping firm and community dedicated to fostering the right skills, principles, and commitments for SME and corporate financial advancement. <strong>We Are Bookkeeping For Africa.</strong>
            </p>

            {/* Social SVG Icons (No Emojis) */}
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {[
                { 
                  label: 'Facebook', 
                  url: 'https://www.facebook.com/donzenaccountinghub', 
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> 
                },
                { 
                  label: 'Instagram', 
                  url: 'https://www.instagram.com/donzenaccountinghub/', 
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> 
                },
                { 
                  label: 'WhatsApp', 
                  url: 'https://wa.me/message/XUEP2CGZ4FM6E1', 
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> 
                }
              ].map(({ label, url, icon }) => (
                <a 
                  key={label} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label} 
                  className="footer-social-link"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,23,23,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff1717',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff1717',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 20
            }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Products & Templates', path: '/products' },
                { label: 'Resources & Pricing', path: '/resources' },
                { label: 'FAQs', path: '/faq' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Affiliate Program', path: '/affiliate' }
              ].map(({ label, path }) => (
                <Link key={label} to={path} onClick={scrollToTop} className="footer-nav-link"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Legal & Corporate Policies (Clean, No Bank Box) */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff1717',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 20
            }}>Legal & Policies</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Refund Policy', path: '/refund' }
              ].map(({ label, path }) => (
                <Link key={label} to={path} onClick={scrollToTop} className="footer-nav-link"
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Us (Clean SVG Icons, No Map Widget) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff1717',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 4
            }}>Contact Us</h4>
            
            <div style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Ikota Shopping Complex, Eti-Osa, Lekki 101001, Lagos, Nigeria</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:info@donzenaccountinghub.com" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}>
                  info@donzenaccountinghub.com
                </a>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+2347039999842" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                  +234 703 9999 842
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Legal Copyright Bar */}
      <div style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            &copy; {year} <strong style={{ color: '#fff', fontWeight: 600 }}>Donzen Accounting Hub</strong>. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/privacy" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/contact" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-social-link:hover {
          background: #ff1717 !important;
          color: #ffffff !important;
          border-color: #ff1717 !important;
          transform: translateY(-2px);
        }
        .footer-nav-link:hover {
          color: #ff1717 !important;
          transform: translateX(4px);
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
