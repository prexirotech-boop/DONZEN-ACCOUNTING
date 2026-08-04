import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function VerifyCertificatePage() {
  const [searchParams] = useSearchParams()
  const certId = searchParams.get('id')
  const [loading, setLoading] = useState(true)
  const [certData, setCertData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function doVerify() {
      if (!certId) {
        setError('No certificate ID provided for verification.')
        setLoading(false)
        return
      }

      try {
        const { data, error: rpcErr } = await supabase
          .rpc('verify_certificate', { p_cert_number: certId.trim() })
          .maybeSingle()

        if (rpcErr) throw rpcErr

        if (!data) {
          setError('This certificate number is invalid or could not be found in our directory.')
        } else {
          setCertData(data)
        }
      } catch (err) {
        console.error('Verification error:', err)
        setError('An unexpected error occurred during validation. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    doVerify()
  }, [certId])

  const mainFont = { fontFamily: 'var(--font, Montserrat, "Helvetica Neue", sans-serif)' }

  return (
    <div style={{
      ...mainFont,
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#09090f',
      padding: '40px 24px',
      color: '#e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background spotlights */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,23,23,0.08) 0%, transparent 70%)',
        filter: 'blur(45px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        filter: 'blur(55px)', pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 580,
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(16px)',
        textAlign: 'center'
      }}>
        {/* Branding header */}
        <div style={{ marginBottom: 32 }}>
          <img src="/logo.png" alt="Donzen Accounting Hub" style={{ height: 48, objectFit: 'contain', margin: '0 auto 16px', filter: 'drop-shadow(0 2px 8px rgba(255,23,23,0.15))' }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Accreditation Directory</div>
        </div>

        {loading ? (
          <div style={{ padding: '40px 0' }}>
            <div className="verify-spinner" />
            <div style={{ marginTop: 20, color: '#94a3b8', fontSize: 14 }}>Cryptographic validation in progress...</div>
            <style dangerouslySetInnerHTML={{__html: `
              .verify-spinner {
                width: 40px; height: 40px;
                border: 3px solid rgba(255,255,255,0.05);
                border-top-color: #ff1717;
                border-radius: 50%;
                margin: 0 auto;
                animation: spin 0.85s linear infinite;
              }
              @keyframes spin { to { transform: rotate(360deg); } }
            `}} />
          </div>
        ) : error ? (
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171', fontSize: 32, marginBottom: 24
            }}>
              ✕
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f87171', marginBottom: 12 }}>Verification Failed</h2>
            <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32 }}>{error}</p>
            <Link to="/" style={{
              display: 'inline-flex', background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff', border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '12px 28px', borderRadius: 12, fontSize: 14,
              fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s'
            }} className="verify-btn-hover">
              Return to Platform
            </Link>
          </div>
        ) : (
          <div>
            {/* Status indicator */}
            <div style={{ marginBottom: 28 }}>
              {certData.is_valid ? (
                <div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 76, height: 76, borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80', fontSize: 36, marginBottom: 16,
                    boxShadow: '0 0 20px rgba(34,197,94,0.15)'
                  }}>
                    ✓
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Credentials</div>
                </div>
              ) : (
                <div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 76, height: 76, borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#fbbf24', fontSize: 36, marginBottom: 16
                  }}>
                    ⚠️
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px' }}>Revoked / Expired</div>
                </div>
              )}
            </div>

            {/* Certificate Details card */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              padding: '24px 20px',
              textAlign: 'left',
              marginBottom: 32
            }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>RECIPIENT</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{certData.student_name}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>ACCREDITED COURSE</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#cbd5e1', lineHeight: 1.4 }}>{certData.course_title}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>DATE ISSUED</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#94a3b8' }}>{new Date(certData.issued_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>ID NUMBER</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f1f5f9', fontFamily: 'monospace' }}>{certData.certificate_number}</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 32 }}>
              {certData.is_valid 
                ? 'This record confirms the completion of course requirements and authenticates the student’s certificate issued directly by the Donzen Accounting Hub.'
                : 'This certificate has been marked as inactive by the administration and is no longer valid.'
              }
            </div>

            <Link to="/" style={{
              display: 'inline-flex', background: 'linear-gradient(135deg, #ff1717 0%, #d32f2f 100%)',
              color: '#fff', padding: '12px 32px', borderRadius: 12, fontSize: 14.5,
              fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(255,23,23,0.2)'
            }} className="verify-btn-primary">
              Visit Donzen Hub
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .verify-btn-hover:hover { background: rgba(255, 255, 255, 0.14) !important; }
        .verify-btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); }
      `}</style>
    </div>
  )
}
