import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════
   DONZEN ACCOUNTING HUB — CONTACT PAGE
   Premium corporate contact page with scroll animations,
   structured layout, and professional design language.
   ═══════════════════════════════════════════════════════════════ */

// Scroll-reveal hook
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// Animated counter
function AnimatedStat({ value, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useReveal(0.3)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const end = parseInt(value)
    const duration = 1800
    const step = Math.max(1, Math.floor(end / (duration / 16)))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [visible, value])
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '',
    service: 'Bookkeeping & Accounting', message: ''
  })

  // Reveal refs
  const [heroRef, heroVis] = useReveal(0.1)
  const [infoRef, infoVis] = useReveal(0.12)
  const [formRef, formVis] = useReveal(0.12)
  const [mapRef, mapVis] = useReveal(0.12)
  const [faqRef, faqVis] = useReveal(0.12)
  const [ctaRef, ctaVis] = useReveal(0.12)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', phone: '', company: '', service: 'Bookkeeping & Accounting', message: '' })
      }, 6000)
    }, 1500)
  }

  const [activeFaq, setActiveFaq] = useState(null)
  const faqs = [
    { q: 'What is your typical response time?', a: 'Our team responds to all enquiries within 2-4 business hours during working days (Mon-Fri, 9AM-5PM WAT). Urgent matters can be directed to our WhatsApp line for immediate attention.' },
    { q: 'Do you offer free initial consultations?', a: 'Yes. We offer a complimentary 15-minute discovery call to understand your business needs and recommend the right service package for you. No obligations attached.' },
    { q: 'Can I schedule a virtual meeting?', a: 'Absolutely. After submitting the contact form, our team will share a Google Meet or Zoom link for a scheduled consultation at your convenience.' },
    { q: 'What areas of Nigeria do you serve?', a: 'We serve clients across all 36 states in Nigeria and the FCT. Our remote bookkeeping services are available nationwide, and our in-person consultations are based in Lagos.' },
  ]

  const contactChannels = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      label: 'Visit Our Office',
      value: 'Ikota Shopping Complex, Eti-Osa, Lekki 101001, Lagos, Nigeria',
      href: 'https://maps.google.com/?q=Ikota+Shopping+Complex+Lekki+Lagos',
      color: '#0f172a'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      label: 'Email Us',
      value: 'info@donzenaccountinghub.com',
      href: 'mailto:info@donzenaccountinghub.com',
      color: '#ff1717'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
      label: 'Call Us',
      value: '+234 703 9999 842',
      href: 'tel:+2347039999842',
      color: '#0f172a'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
      label: 'WhatsApp',
      value: 'Chat with us instantly',
      href: 'https://wa.me/message/XUEP2CGZ4FM6E1',
      color: '#25d366'
    },
  ]

  const stats = [
    { value: '500', suffix: '+', label: 'Businesses Served' },
    { value: '24', suffix: 'hr', label: 'Response Time' },
    { value: '98', suffix: '%', label: 'Client Satisfaction' },
    { value: '6', suffix: '+', label: 'Years Experience' },
  ]

  return (
    <>
      <div className="cp-root">

        {/* ═══ HERO SECTION ═══ */}
        <section className="cp-hero" ref={heroRef}>
          <div className="cp-hero-bg">
            <img src="/images/contact-hero.jpg" alt="" aria-hidden="true" />
            <div className="cp-hero-overlay" />
          </div>
          <div className={`cp-hero-content ${heroVis ? 'cp-vis' : ''}`}>
            <div className="cp-hero-badge">Contact Us</div>
            <h1 className="cp-hero-title">
              Let's Talk About<br />
              <span className="cp-hero-accent">Your Business</span>
            </h1>
            <p className="cp-hero-desc">
              Whether you need professional bookkeeping, tax advisory, or financial consulting, our team of certified accountants is ready to help your business thrive.
            </p>
            <div className="cp-hero-stats">
              {stats.map((s, i) => (
                <div key={i} className="cp-hero-stat">
                  <div className="cp-hero-stat-val">
                    <AnimatedStat value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="cp-hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative geometric shapes */}
          <div className="cp-hero-shape cp-hero-shape-1" />
          <div className="cp-hero-shape cp-hero-shape-2" />
        </section>


        {/* ═══ CONTACT CHANNELS BAR ═══ */}
        <section className="cp-channels" ref={infoRef}>
          <div className={`cp-channels-grid ${infoVis ? 'cp-vis' : ''}`}>
            {contactChannels.map((ch, i) => (
              <a
                key={i}
                href={ch.href}
                target={ch.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="cp-channel-card"
                style={{ '--accent': ch.color, animationDelay: `${i * 0.1}s` }}
              >
                <div className="cp-channel-icon">{ch.icon}</div>
                <div className="cp-channel-label">{ch.label}</div>
                <div className="cp-channel-value">{ch.value}</div>
                <div className="cp-channel-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>
                </div>
              </a>
            ))}
          </div>
        </section>


        {/* ═══ MAIN CONTENT: FORM + MAP ═══ */}
        <section className="cp-main">
          <div className="cp-main-inner">

            {/* Left: Contact Form */}
            <div ref={formRef} className={`cp-form-col ${formVis ? 'cp-vis' : ''}`}>
              <div className="cp-form-card">
                <div className="cp-form-header">
                  <span className="cp-form-overline">Send a Message</span>
                  <h2 className="cp-form-title">Get a Free Consultation</h2>
                  <p className="cp-form-subtitle">
                    Fill out the form below and one of our financial consultants will reach out to you within 24 hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="cp-success">
                    <div className="cp-success-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <h3 className="cp-success-title">Message Sent Successfully</h3>
                    <p className="cp-success-desc">Thank you for reaching out. Our advisory team will review your enquiry and respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="cp-form">
                    <div className="cp-form-row">
                      <div className="cp-field">
                        <label>Full Name <span className="cp-req">*</span></label>
                        <input type="text" required placeholder="e.g. Samuel Okafor" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div className="cp-field">
                        <label>Company / Business Name</label>
                        <input type="text" placeholder="e.g. Okafor Ventures Ltd" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                      </div>
                    </div>

                    <div className="cp-form-row">
                      <div className="cp-field">
                        <label>Email Address <span className="cp-req">*</span></label>
                        <input type="email" required placeholder="name@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div className="cp-field">
                        <label>Phone Number</label>
                        <input type="tel" placeholder="+234 8XX XXX XXXX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                    </div>

                    <div className="cp-field">
                      <label>Service Interested In</label>
                      <select value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}>
                        <option value="Bookkeeping & Accounting">Bookkeeping & Accounting Services (DIY Remote)</option>
                        <option value="Done For You Accounting">Done-For-You Accounting Services</option>
                        <option value="Experience Program">Donzen Accounting Experience Program (Bootcamp)</option>
                        <option value="DIY Templates">DIY Accounting Templates (P&L, Vendors, Clients)</option>
                        <option value="CAC Business Incorporation">CAC Business Incorporation (Business Name, LLC, NGO)</option>
                        <option value="Tax Advisory">Tax Advisory & Financial Statements</option>
                        <option value="General Inquiry">General Enquiry</option>
                      </select>
                    </div>

                    <div className="cp-field">
                      <label>Your Message <span className="cp-req">*</span></label>
                      <textarea rows="5" required placeholder="Tell us about your business, your current challenges, and how we can help..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                    </div>

                    <button type="submit" className="cp-submit-btn" disabled={sending}>
                      {sending ? (
                        <span className="cp-btn-loading">
                          <span className="cp-spinner" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          Submit Enquiry
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </>
                      )}
                    </button>

                    <p className="cp-form-note">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Your information is secure and will never be shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Map + Working Hours */}
            <div ref={mapRef} className={`cp-info-col ${mapVis ? 'cp-vis' : ''}`}>
              {/* Map Card */}
              <div className="cp-map-card">
                <div className="cp-map-frame">
                  <iframe
                    title="Donzen Accounting Hub Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.673890288825!2d3.5590000000000006!3d6.435000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf705c7428f65%3A0xc3412cb7f784e1b8!2sIkota%20Shopping%20Complex%2C%20Lekki!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="cp-map-info">
                  <div className="cp-map-info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>Ikota Shopping Complex, Lekki, Lagos</span>
                  </div>
                  <a href="https://maps.google.com/?q=Ikota+Shopping+Complex+Lekki+Lagos" target="_blank" rel="noopener noreferrer" className="cp-map-link">
                    Get Directions
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="cp-hours-card">
                <h3 className="cp-hours-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Working Hours
                </h3>
                <div className="cp-hours-list">
                  {[
                    { day: 'Monday - Friday', time: '9:00 AM - 5:00 PM', active: true },
                    { day: 'Saturday', time: '10:00 AM - 2:00 PM', active: true },
                    { day: 'Sunday', time: 'Closed', active: false },
                  ].map((h, i) => (
                    <div key={i} className={`cp-hours-row ${h.active ? '' : 'cp-hours-closed'}`}>
                      <span className="cp-hours-day">{h.day}</span>
                      <span className="cp-hours-dot" />
                      <span className="cp-hours-time">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick CTA */}
              <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noopener noreferrer" className="cp-wa-cta">
                <div className="cp-wa-cta-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <div className="cp-wa-cta-title">Prefer WhatsApp?</div>
                  <div className="cp-wa-cta-desc">Chat with our team instantly for quick answers</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>

          </div>
        </section>


        {/* ═══ FAQ SECTION ═══ */}
        <section className="cp-faq" ref={faqRef}>
          <div className={`cp-faq-inner ${faqVis ? 'cp-vis' : ''}`}>
            <div className="cp-faq-header">
              <span className="cp-faq-overline">FAQ</span>
              <h2 className="cp-faq-title">Frequently Asked Questions</h2>
              <p className="cp-faq-desc">Common questions about working with Donzen Accounting Hub.</p>
            </div>

            <div className="cp-faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`cp-faq-item ${activeFaq === i ? 'cp-faq-open' : ''}`}>
                  <button className="cp-faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <svg className="cp-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div className="cp-faq-a">
                    <p>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ═══ BOTTOM CTA BANNER ═══ */}
        <section className="cp-bottom-cta" ref={ctaRef}>
          <div className={`cp-bottom-cta-inner ${ctaVis ? 'cp-vis' : ''}`}>
            <h2>Ready to Streamline Your Finances?</h2>
            <p>Schedule a free consultation and discover how Donzen Accounting Hub can transform your business operations.</p>
            <div className="cp-bottom-cta-btns">
              <a href="tel:+2347039999842" className="cp-cta-btn cp-cta-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call +234 703 9999 842
              </a>
              <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noopener noreferrer" className="cp-cta-btn cp-cta-btn-secondary">
                Chat on WhatsApp
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* ═══ STYLES ═══ */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ─── ROOT ─── */
        .cp-root {
          --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --red: #ff1717;
          --dark: #09090b;
          --slate: #64748b;
          font-family: var(--font);
          color: #0f172a;
          background: #fff;
          overflow-x: hidden;
        }

        /* ─── TRANSITIONS ─── */
        .cp-vis { animation: cpFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes cpFadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── HERO ─── */
        .cp-hero {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
          overflow: hidden;
        }
        .cp-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .cp-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
        }
        .cp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(165deg, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.78) 50%, rgba(9,9,11,0.88) 100%);
        }
        .cp-hero-content {
          position: relative;
          z-index: 2;
          max-width: 820px;
          text-align: center;
          opacity: 0;
        }
        .cp-hero-badge {
          display: inline-block;
          background: rgba(255,23,23,0.15);
          color: #ff1717;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 20px;
          border-radius: 100px;
          border: 1px solid rgba(255,23,23,0.25);
          margin-bottom: 24px;
        }
        .cp-hero-title {
          font-size: clamp(2.4rem, 5.5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 20px;
          letter-spacing: -1.5px;
        }
        .cp-hero-accent {
          background: linear-gradient(135deg, #ff1717 0%, #ff6b4a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cp-hero-desc {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.75;
          max-width: 600px;
          margin: 0 auto 40px;
        }
        .cp-hero-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .cp-hero-stat {
          text-align: center;
        }
        .cp-hero-stat-val {
          font-size: 1.8rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .cp-hero-stat-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .cp-hero-shape {
          position: absolute;
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
        }
        .cp-hero-shape-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255,23,23,0.12) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }
        .cp-hero-shape-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,107,74,0.08) 0%, transparent 70%);
          bottom: -80px;
          left: -80px;
        }

        /* ─── CONTACT CHANNELS ─── */
        .cp-channels {
          padding: 0 24px;
          margin-top: -48px;
          position: relative;
          z-index: 10;
        }
        .cp-channels-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          opacity: 0;
        }
        .cp-channel-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px 24px;
          text-decoration: none;
          color: inherit;
          position: relative;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .cp-channel-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .cp-channel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-color: var(--accent);
        }
        .cp-channel-card:hover::before { opacity: 1; }
        .cp-channel-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          margin-bottom: 16px;
        }
        .cp-channel-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
        }
        .cp-channel-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.5;
        }
        .cp-channel-arrow {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #cbd5e1;
          transition: all 0.3s;
        }
        .cp-channel-card:hover .cp-channel-arrow {
          color: var(--accent);
          transform: translate(2px, -2px);
        }

        /* ─── MAIN CONTENT ─── */
        .cp-main {
          padding: 80px 24px;
          background: #fafafa;
        }
        .cp-main-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 40px;
          align-items: start;
        }
        .cp-form-col, .cp-info-col { opacity: 0; }

        /* ─── FORM CARD ─── */
        .cp-form-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 32px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .cp-form-header {
          padding: 36px 40px 0;
        }
        .cp-form-overline {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ff1717;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .cp-form-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #0f172a;
          margin: 8px 0 8px;
          letter-spacing: -0.5px;
        }
        .cp-form-subtitle {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }
        .cp-form {
          padding: 28px 40px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cp-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .cp-field label {
          display: block;
          font-size: 0.84rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }
        .cp-req { color: #ff1717; }
        .cp-field input,
        .cp-field select,
        .cp-field textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          font-size: 0.92rem;
          font-family: var(--font);
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
        }
        .cp-field input:focus,
        .cp-field select:focus,
        .cp-field textarea:focus {
          border-color: #ff1717;
          box-shadow: 0 0 0 3px rgba(255,23,23,0.08);
          background: #fff;
        }
        .cp-field textarea {
          resize: vertical;
          min-height: 120px;
        }
        .cp-field select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }

        .cp-submit-btn {
          width: 100%;
          padding: 16px 24px;
          background: #09090b;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .cp-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ff1717 0%, #d91414 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .cp-submit-btn:hover::before { opacity: 1; }
        .cp-submit-btn > * { position: relative; z-index: 1; }
        .cp-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,23,23,0.25); }
        .cp-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .cp-btn-loading { display: flex; align-items: center; gap: 10px; }
        .cp-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cpSpin 0.7s linear infinite;
        }
        @keyframes cpSpin { to { transform: rotate(360deg); } }

        .cp-form-note {
          font-size: 0.78rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
        }

        /* ─── SUCCESS STATE ─── */
        .cp-success {
          padding: 60px 40px;
          text-align: center;
        }
        .cp-success-icon { margin-bottom: 20px; }
        .cp-success-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .cp-success-desc {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 380px;
          margin: 0 auto;
        }

        /* ─── MAP CARD ─── */
        .cp-map-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 32px rgba(0,0,0,0.04);
          overflow: hidden;
          margin-bottom: 20px;
        }
        .cp-map-frame {
          width: 100%;
          height: 280px;
        }
        .cp-map-frame iframe {
          display: block;
        }
        .cp-map-info {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
        }
        .cp-map-info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #334155;
        }
        .cp-map-link {
          font-size: 0.84rem;
          font-weight: 700;
          color: #ff1717;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s;
        }
        .cp-map-link:hover { gap: 8px; }

        /* ─── HOURS CARD ─── */
        .cp-hours-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 32px rgba(0,0,0,0.04);
          padding: 28px;
          margin-bottom: 20px;
        }
        .cp-hours-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 20px;
        }
        .cp-hours-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .cp-hours-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
        }
        .cp-hours-day {
          font-weight: 600;
          color: #334155;
          min-width: 140px;
        }
        .cp-hours-dot {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .cp-hours-time {
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
        }
        .cp-hours-closed .cp-hours-time {
          color: #ef4444;
        }

        /* ─── WHATSAPP CTA ─── */
        .cp-wa-cta {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          border-radius: 16px;
          text-decoration: none;
          color: #fff;
          transition: all 0.3s;
        }
        .cp-wa-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37,211,102,0.3);
        }
        .cp-wa-cta-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cp-wa-cta-title {
          font-size: 1rem;
          font-weight: 800;
        }
        .cp-wa-cta-desc {
          font-size: 0.82rem;
          opacity: 0.85;
          margin-top: 2px;
        }

        /* ─── FAQ SECTION ─── */
        .cp-faq {
          padding: 80px 24px;
          background: #fff;
        }
        .cp-faq-inner {
          max-width: 760px;
          margin: 0 auto;
          opacity: 0;
        }
        .cp-faq-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .cp-faq-overline {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ff1717;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .cp-faq-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 8px 0;
          letter-spacing: -0.5px;
        }
        .cp-faq-desc {
          font-size: 1rem;
          color: #64748b;
        }
        .cp-faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cp-faq-item {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s;
        }
        .cp-faq-item:hover {
          border-color: #cbd5e1;
        }
        .cp-faq-open {
          border-color: #ff1717 !important;
          box-shadow: 0 4px 20px rgba(255,23,23,0.06);
        }
        .cp-faq-q {
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
        .cp-faq-chevron {
          flex-shrink: 0;
          color: #94a3b8;
          transition: transform 0.3s, color 0.3s;
        }
        .cp-faq-open .cp-faq-chevron {
          transform: rotate(180deg);
          color: #ff1717;
        }
        .cp-faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cp-faq-open .cp-faq-a {
          max-height: 300px;
        }
        .cp-faq-a p {
          padding: 0 24px 20px;
          margin: 0;
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.7;
        }

        /* ─── BOTTOM CTA ─── */
        .cp-bottom-cta {
          padding: 80px 24px;
          background: #09090b;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cp-bottom-cta::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.1) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          pointer-events: none;
        }
        .cp-bottom-cta-inner {
          max-width: 680px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          opacity: 0;
        }
        .cp-bottom-cta h2 {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -1px;
        }
        .cp-bottom-cta p {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin: 0 0 32px;
        }
        .cp-bottom-cta-btns {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cp-cta-btn {
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
        }
        .cp-cta-btn-primary {
          background: #ff1717;
          color: #fff;
        }
        .cp-cta-btn-primary:hover {
          background: #d91414;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,23,23,0.3);
        }
        .cp-cta-btn-secondary {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .cp-cta-btn-secondary:hover {
          background: rgba(255,255,255,0.14);
          transform: translateY(-2px);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .cp-channels-grid { grid-template-columns: repeat(2, 1fr); }
          .cp-main-inner { grid-template-columns: 1fr; }
          .cp-hero { min-height: 440px; padding: 100px 24px 70px; }
        }
        @media (max-width: 768px) {
          .cp-channels-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .cp-channels { margin-top: -36px; }
          .cp-hero-stats { gap: 24px; }
          .cp-hero-stat-val { font-size: 1.4rem; }
          .cp-form-header { padding: 28px 24px 0; }
          .cp-form { padding: 20px 24px 28px; }
          .cp-form-row { grid-template-columns: 1fr; gap: 16px; }
          .cp-main { padding: 48px 16px; }
          .cp-faq { padding: 56px 16px; }
          .cp-bottom-cta { padding: 56px 16px; }
          .cp-hours-day { min-width: 110px; }
          .cp-map-info { flex-direction: column; gap: 8px; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .cp-channels-grid { grid-template-columns: 1fr; }
          .cp-hero { min-height: 400px; padding: 90px 16px 60px; }
          .cp-hero-title { font-size: 2rem; }
          .cp-hero-desc { font-size: 0.95rem; }
          .cp-hero-stats { gap: 16px; }
          .cp-hero-stat-val { font-size: 1.2rem; }
          .cp-hero-stat-label { font-size: 0.7rem; }
          .cp-form-title { font-size: 1.35rem; }
          .cp-faq-title { font-size: 1.5rem; }
          .cp-wa-cta { flex-direction: column; text-align: center; }
          .cp-wa-cta svg:last-child { display: none; }
          .cp-bottom-cta-btns { flex-direction: column; align-items: stretch; }
          .cp-cta-btn { justify-content: center; }
        }
      `}} />
    </>
  )
}
