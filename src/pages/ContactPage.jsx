import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Bookkeeping & Accounting',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', phone: '', service: 'Bookkeeping & Accounting', message: '' })
      }, 5000)
    }
  }

  return (
    <div style={{ background: '#FFFFFF', color: '#101010', fontFamily: 'var(--font)', minHeight: '100vh' }}>
      
      {/* ─── BANNER ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #101010 0%, #18181B 100%)',
        color: '#FFFFFF',
        padding: '90px 24px 70px',
        textAlign: 'center',
        borderBottom: '3px solid #ff1717'
      }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)', fontWeight: 900, marginTop: '12px', marginBottom: '16px', color: '#FFFFFF' }}>
            Contact Donzen Accounting Hub
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '650px', margin: '0 auto' }}>
            Our team is ready and waiting to help online, on WhatsApp, and on the phone. Reach out today to see how we can assist your business finances.
          </p>
        </div>
      </section>

      {/* ─── CONTACT CONTENT GRID ───────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F7F3F5' }}>
        <div style={{ maxWidth: 1150, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'start' }}>
          
          {/* Contact Details & Map */}
          <div>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              borderTop: '4px solid #ff1717',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#101010', marginBottom: '24px' }}>
                Contact Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '1rem' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,23,23,0.1)',
                    color: '#ff1717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>📍</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#101010' }}>Office Address</div>
                    <div style={{ color: '#3F3F46', lineHeight: 1.5, marginTop: '2px' }}>
                      Ikota Shopping Complex, Eti-Osa, Lekki 101001, Lagos, Nigeria
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,23,23,0.1)',
                    color: '#ff1717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>✉️</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#101010' }}>Email Us</div>
                    <a href="mailto:info@donzenaccountinghub.com" style={{ color: '#ff1717', fontWeight: 700, textDecoration: 'none' }}>
                      info@donzenaccountinghub.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,23,23,0.1)',
                    color: '#ff1717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>📞</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#101010' }}>Call Us / Phone</div>
                    <a href="tel:+2347039999842" style={{ color: '#101010', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none' }}>
                      +234 703 9999 842
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(34,197,94,0.1)',
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>💬</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#101010' }}>WhatsApp Direct</div>
                    <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noreferrer" style={{ color: '#22c55e', fontWeight: 800, textDecoration: 'none' }}>
                      Chat On WhatsApp ➔
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              border: '1px solid #E4E4E7'
            }}>
              <div style={{ padding: '16px 20px', fontWeight: 800, color: '#101010', borderBottom: '1px solid #E4E4E7' }}>
                📍 Our Location on Google Maps
              </div>
              <div style={{ width: '100%', height: '240px' }}>
                <iframe
                  title="Donzen Accounting Hub Map"
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

          {/* Contact Form */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            borderTop: '4px solid #101010'
          }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#101010', marginBottom: '8px' }}>
              Send Us A Message
            </h2>
            <p style={{ color: '#71717A', fontSize: '0.95rem', marginBottom: '28px' }}>
              Fill out the form below and one of our accounting consultants will reach out to you within 24 hours.
            </p>

            {submitted ? (
              <div style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1.5px solid #22c55e',
                borderRadius: '12px',
                padding: '24px',
                color: '#15803d',
                textAlign: 'center',
                fontWeight: 700
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
                Thank you! Your message has been sent successfully. We will get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#101010', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Okafor"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #D4D4D8',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#101010', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #D4D4D8',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#101010', marginBottom: '6px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+234..."
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #D4D4D8',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#101010', marginBottom: '6px' }}>
                    Service Interested In
                  </label>
                  <select
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #D4D4D8',
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="Bookkeeping & Accounting">Bookkeeping & Accounting Services (DIY Remote)</option>
                    <option value="Done For You Accounting">Done For You Accounting Services</option>
                    <option value="Experience Program">Donzen Accounting Experience Program (Bootcamp)</option>
                    <option value="DIY Templates">DIY Accounting Templates (P&L, Vendors, Clients)</option>
                    <option value="CAC Business Incorporation">CAC Business Incorporation (Business Name, LLC, NGO)</option>
                    <option value="Tax Advisory">Tax Advisory & Financial Statements</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#101010', marginBottom: '6px' }}>
                    Message / Business Details
                  </label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Tell us about your business and accounting needs..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #D4D4D8',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#ff1717',
                    color: '#FFFFFF',
                    padding: '16px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(255,23,23,0.3)'
                  }}
                >
                  Send Message Now ➔
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

    </div>
  )
}
