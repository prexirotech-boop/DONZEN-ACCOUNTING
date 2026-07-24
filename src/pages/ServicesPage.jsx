import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('type', ['service', 'template'])
          .eq('is_published', true)
          .order('price', { ascending: false })
        
        if (data) setServices(data)
      } catch (err) {
        console.error('Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

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
            Our Professional Solutions
          </span>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)', fontWeight: 900, marginTop: '12px', marginBottom: '16px', color: '#FFFFFF' }}>
            Comprehensive Bookkeeping & Financial Services
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '650px', margin: '0 auto' }}>
            We are your choice partner with the best experience in providing exceptional and relatable bookkeeping solutions you need to succeed.
          </p>
        </div>
      </section>

      {/* ─── SERVICES LIST ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F7F3F5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div className="spinner" style={{ margin: '0 auto 16px', width: 40, height: 40, border: '4px solid rgba(255,23,23,0.2)', borderTop: '4px solid #ff1717', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p>Loading services from database...</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <p>No services currently available.</p>
            </div>
          ) : (
            services.map((svc, index) => (
              <div key={svc.id} style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                borderLeft: '5px solid #ff1717',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '36px',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ff1717' }}>0{index + 1}.</span>
                  <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#101010', margin: '8px 0 16px' }}>
                    {svc.title}
                  </h2>
                  <p style={{ color: '#3F3F46', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
                    {svc.description}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to="/resources" style={{
                      background: '#ff1717',
                      color: '#FFFFFF',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      fontSize: '0.92rem'
                    }}>
                      View Plans & Pricing
                    </Link>
                    <Link to="/contact" style={{
                      background: '#101010',
                      color: '#FFFFFF',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      fontSize: '0.92rem'
                    }}>
                      Request Service
                    </Link>
                  </div>
                </div>

                <div style={{
                  background: '#F7F3F5',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #E4E4E7'
                }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#101010', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                    Key Service Highlights:
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', margin: 0, padding: 0 }}>
                    {svc.features && svc.features.length > 0 ? svc.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.9rem', color: '#27272A', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5 }}>
                        <span style={{ color: '#ff1717', fontWeight: 800 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    )) : (
                      <li style={{ fontSize: '0.9rem', color: '#64748b' }}>Standard features included.</li>
                    )}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ─── BOTTOM CTA ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #101010 0%, #18181B 100%)',
        color: '#FFFFFF',
        padding: '70px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 750, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '16px', color: '#FFFFFF' }}>
            Need Custom Accounting Advice?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
            Get in touch with our team of expert accountants today to discuss your business accounting requirements.
          </p>
          <Link to="/contact" style={{
            background: '#ff1717',
            color: '#FFFFFF',
            padding: '16px 36px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Contact Us Now
          </Link>
        </div>
      </section>

    </div>
  )
}
