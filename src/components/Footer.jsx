import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation()
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

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

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

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
          gridTemplateColumns: 'minmax(280px, 1.8fr) 1fr 1fr 1.6fr',
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

            {/* Social Icons */}
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
                { label: 'Resources & Pricing', path: '/resources' },
                { label: 'FAQs', path: '/faq' },
                { label: 'Contact Us', path: '/contact' }
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

          {/* Column 3: Direct Bank Details & Legal */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff1717',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 20
            }}>Direct Payment</h4>
            
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,23,23,0.2)',
              borderRadius: 10,
              padding: 14,
              fontSize: '13px',
              color: '#e2e8f0',
              lineHeight: 1.6,
              marginBottom: 20
            }}>
              <div style={{ fontWeight: 700, color: '#ff1717', marginBottom: 4 }}>Zenith Bank Transfer</div>
              <div>Account Name: <strong>Donzen Accounting Hub</strong></div>
              <div>Account No: <strong style={{ color: '#fff', fontSize: '14px', letterSpacing: '1px' }}>1211575347</strong></div>
              <div>Bank: <strong>Zenith Bank</strong></div>
            </div>

            <h4 style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 10
            }}>Legal Policies</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Refund Policy', path: '/refund' }
              ].map(({ label, path }) => (
                <Link key={label} to={path} onClick={scrollToTop} className="footer-nav-link"
                  style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Google Map Embed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff1717',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 4
            }}>Contact Us</h4>
            
            <div style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#ff1717', flexShrink: 0 }}>📍</span>
                <span>Ikota Shopping Complex, Eti-Osa, Lekki 101001, Lagos, Nigeria</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#ff1717', flexShrink: 0 }}>✉️</span>
                <a href="mailto:info@donzenaccountinghub.com" style={{ color: '#fff', textDecoration: 'underline' }}>info@donzenaccountinghub.com</a>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#ff1717', flexShrink: 0 }}>📞</span>
                <a href="tel:+2347039999842" style={{ color: '#fff', fontWeight: 600 }}>+234 703 9999 842</a>
              </div>
            </div>

            {/* Google Map Embed for Ikota Shopping Complex Lekki */}
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(255,23,23,0.3)',
              marginTop: 6
            }}>
              <iframe
                title="Donzen Accounting Hub Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.673890288825!2d3.5590000000000006!3d6.435000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf705c7428f65%3A0xc3412cb7f784e1b8!2sIkota%20Shopping%20Complex%2C%20Lekki!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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
            <Link to="/privacy" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Terms of Service</Link>
            <Link to="/contact" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Contact</Link>
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
