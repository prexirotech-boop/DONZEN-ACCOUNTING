import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function StudentCertificates({ user, profile }) {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCertificates() {
      if (!user) return
      try {
        const { data: certData, error: certError } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)

        if (certError) throw certError

        const courseIds = (certData || []).map(c => c.course_id).filter(Boolean)

        if (courseIds.length === 0) {
          setCertificates([])
          return
        }

        const [coursesRes, productsRes] = await Promise.all([
          supabase.from('courses').select('id, instructor').in('id', courseIds),
          supabase.from('products').select('id, title, cover_image').in('id', courseIds)
        ])

        const coursesData = coursesRes.data || []
        const productsData = productsRes.data || []

        const courseMap = {}
        coursesData.forEach(c => { courseMap[c.id] = c })

        const productMap = {}
        productsData.forEach(p => { productMap[p.id] = p })

        const assembled = (certData || []).map(cert => {
          const course = courseMap[cert.course_id] || { id: cert.course_id, instructor: 'Instructor' }
          const product = productMap[cert.course_id]

          return {
            ...cert,
            courses: {
              ...course,
              products: product || { title: 'Accredited Certification', cover_image: null }
            }
          }
        })

        setCertificates(assembled)
      } catch (err) {
        console.error('Error fetching student certificates:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCertificates()
  }, [user])

  const handleDownload = async (cert) => {
    // 1. Fetch certificate configuration settings
    let config = {
      default_template: 'coursera',
      instructor_name: cert.courses?.instructor || 'Samuel Onainor',
      instructor_title: 'Lead Instructor, Donzen Accounting Hub',
      signature_url: '',
      use_signature_image: false
    }

    try {
      const { data: configRow } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'certificate_config')
        .maybeSingle()
      if (configRow?.value) {
        config = configRow.value
      }
    } catch (e) {
      console.warn('Error loading certificate config, using fallbacks:', e)
    }

    // Generate a beautiful certificate HTML print window
    const printWindow = window.open('', '_blank', 'width=950,height=680')
    if (!printWindow) {
      alert("Please allow popups to view and print your certificate.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Completion - ${cert.certificate_number}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Montserrat:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f1f5f9;
              font-family: 'Montserrat', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-btn-container {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 100;
            }
            .print-btn {
              background-color: #ff1717;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(255,23,23,0.2);
              font-family: 'Montserrat', sans-serif;
            }
            .print-btn:hover {
              background-color: #d91414;
            }

            /* ═════ COMMON PRINTER SETTINGS ═════ */
            @media print {
              body { background-color: #fff; }
              .print-btn-container { display: none; }
              .certificate-container { box-shadow: none !important; margin: 0 !important; }
            }

            /* ═════ COURSERA TEMPLATE STYLE ═════ */
            .style-coursera {
              width: 860px;
              height: 590px;
              padding: 50px 60px;
              background-color: #ffffff;
              box-shadow: 0 10px 30px rgba(0,0,0,0.06);
              box-sizing: border-box;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
            }
            .coursera-accent-bar {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 14px;
              background: linear-gradient(to bottom, #ff1717 0%, #b91c1c 100%);
            }
            .coursera-logo {
              display: flex;
              align-items: center;
              margin-top: 10px;
            }
            .coursera-body {
              margin-top: 20px;
              text-align: left;
            }
            .coursera-label {
              font-size: 11px;
              font-weight: 800;
              color: #ff1717;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 24px;
            }
            .coursera-presented {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 8px;
            }
            .coursera-name {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 38px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 20px;
            }
            .coursera-reason {
              font-size: 14.5px;
              color: #334155;
              line-height: 1.6;
              max-width: 600px;
            }
            .coursera-course {
              font-weight: 800;
              color: #0f172a;
              border-bottom: 1.5px solid #ff1717;
              padding-bottom: 1px;
            }
            .coursera-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 10px;
            }
            .coursera-signature {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              min-width: 220px;
            }
            .coursera-sig-line {
              width: 180px;
              border-top: 1.5px solid #cbd5e1;
              margin-top: 6px;
              margin-bottom: 6px;
            }
            .coursera-sig-name {
              font-size: 13px;
              font-weight: 700;
              color: #0f172a;
            }
            .coursera-sig-title {
              font-size: 11px;
              color: #64748b;
              margin-top: 2px;
            }
            .coursera-seal-block {
              margin-right: 20px;
            }
            .coursera-seal {
              width: 72px;
              height: 72px;
              border-radius: 50%;
              background: radial-gradient(circle, #fef08a 0%, #ca8a04 100%);
              border: 3px double #facc15;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(202,138,4,0.2);
              position: relative;
            }
            .coursera-seal-inner {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              border: 1px dashed rgba(0,0,0,0.3);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #000000;
              font-size: 9px;
              font-weight: 800;
              letter-spacing: 0.5px;
              text-align: center;
            }
            .coursera-meta {
              display: flex;
              justify-content: space-between;
              font-size: 10.5px;
              color: #94a3b8;
              border-top: 1px solid #f1f5f9;
              padding-top: 14px;
              font-family: monospace;
            }

            /* ═════ CLASSIC PREMIUM TEMPLATE STYLE ═════ */
            .style-classic {
              width: 860px;
              height: 590px;
              padding: 40px;
              background-color: #ffffff;
              border: 16px double #7f1d1d;
              box-shadow: 0 10px 25px rgba(0,0,0,0.06);
              box-sizing: border-box;
              position: relative;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .classic-border-inner {
              position: absolute;
              top: 10px;
              bottom: 10px;
              left: 10px;
              right: 10px;
              border: 2px solid #b45309;
              pointer-events: none;
            }
            .classic-logo-container {
              display: flex;
              justify-content: center;
              margin-top: 10px;
            }
            .classic-title {
              font-family: 'Cinzel', serif;
              font-size: 38px;
              font-weight: 800;
              color: #7f1d1d;
              letter-spacing: 3px;
              margin: 10px 0 0;
            }
            .classic-subtitle {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 4px;
              color: #b45309;
              font-weight: 700;
              margin-bottom: 20px;
            }
            .classic-presented {
              font-size: 13px;
              font-style: italic;
              color: #64748b;
              margin-bottom: 4px;
            }
            .classic-name {
              font-size: 32px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 10px;
              border-bottom: 2px solid #f1f5f9;
              display: inline-block;
              padding-bottom: 4px;
              min-width: 320px;
            }
            .classic-reason {
              font-size: 13.5px;
              color: #475569;
              line-height: 1.6;
              max-width: 580px;
              margin: 10px auto 20px;
            }
            .classic-course {
              font-weight: 700;
              color: #7f1d1d;
            }
            .classic-footer {
              display: flex;
              justify-content: space-between;
              padding: 0 40px;
              margin-top: 10px;
              align-items: flex-end;
            }
            .classic-sig-block {
              display: flex;
              flex-direction: column;
              align-items: center;
              min-width: 180px;
            }
            .classic-sig-line {
              width: 180px;
              border-top: 1.5px solid #cbd5e1;
              margin-top: 6px;
              margin-bottom: 4px;
            }
            .classic-sig-title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
            }
            .classic-meta-id {
              position: absolute;
              bottom: 20px;
              left: 50px;
              font-size: 10px;
              color: #94a3b8;
              font-family: monospace;
            }
            .classic-meta-date {
              position: absolute;
              bottom: 20px;
              right: 50px;
              font-size: 11px;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="print-btn-container">
            <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
          </div>

          ${config.default_template === 'coursera' ? `
            <!-- ═════ COURSERA STYLE TEMPLATE ═════ -->
            <div class="certificate-container style-coursera">
              <div class="coursera-accent-bar"></div>
              
              <div class="coursera-logo">
                <div style="background-color: #09090b; padding: 6px 12px; border-radius: 8px; display: inline-flex; align-items: center;">
                  <img src="${window.location.origin}/logo.png" alt="Logo" style="height: 26px; width: auto; display: block;" />
                </div>
              </div>
              
              <div class="coursera-body">
                <div class="coursera-label">Course Certificate</div>
                <div class="coursera-presented">This is to certify that</div>
                <div class="coursera-name">${profile?.full_name || user.user_metadata?.full_name || 'Alumnus'}</div>
                <div class="coursera-reason">
                  successfully completed and received passing grades in the professional training curriculum for
                  <br>
                  <span class="coursera-course">${cert.courses?.products?.title || 'Advanced Masterclass'}</span>
                  <br>
                  <span style="font-size: 12.5px; color: #64748b; margin-top: 8px; display: inline-block;">
                    A professional training programme offered by Donzen Accounting Hub.
                  </span>
                </div>
              </div>
              
              <div class="coursera-footer">
                <div class="coursera-signature">
                  ${config.use_signature_image && config.signature_url ? `
                    <img src="${config.signature_url}" alt="Signature" style="height: 48px; width: auto; max-width: 180px; object-fit: contain; margin-bottom: 2px;" />
                  ` : `
                    <div style="font-family: 'Cinzel', serif; font-style: italic; font-size: 18px; color: #7f1d1d; height: 48px; line-height: 48px;">${config.instructor_name}</div>
                  `}
                  <div class="coursera-sig-line"></div>
                  <div class="coursera-sig-name">${config.instructor_name}</div>
                  <div class="coursera-sig-title">${config.instructor_title}</div>
                </div>
                
                <div class="coursera-seal-block">
                  <div class="coursera-seal">
                    <div class="coursera-seal-inner">
                      <span>DONZEN</span>
                      <span style="font-size: 5px; opacity: 0.85; margin-top: 2px;">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="coursera-meta">
                <div>Verification ID: <span>${cert.certificate_number}</span></div>
                <div>Date Issued: <span>${new Date(cert.issued_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
              </div>
            </div>
          ` : `
            <!-- ═════ CLASSIC PREMIUM TEMPLATE ═════ -->
            <div class="certificate-container style-classic">
              <div class="classic-border-inner"></div>
              
              <div class="classic-logo-container">
                <div style="background-color: #09090b; padding: 6px 12px; border-radius: 8px; display: inline-flex; align-items: center;">
                  <img src="${window.location.origin}/logo.png" alt="Logo" style="height: 26px; width: auto; display: block;" />
                </div>
              </div>
              <div class="classic-title">CERTIFICATE</div>
              <div class="classic-subtitle">of completion</div>
              
              <div class="classic-presented">This is proudly presented to</div>
              <div class="classic-name">${profile?.full_name || user.user_metadata?.full_name || 'Alumnus'}</div>
              
              <div class="classic-reason">
                for successfully completing the core training curriculum and executing the project blueprints for
                <br>
                <span class="classic-course">${cert.courses?.products?.title || 'Advanced Masterclass'}</span>
              </div>
              
              <div class="classic-footer">
                <div class="classic-sig-block">
                  ${config.use_signature_image && config.signature_url ? `
                    <img src="${config.signature_url}" alt="Signature" style="height: 44px; width: auto; max-width: 180px; object-fit: contain; margin-bottom: 2px;" />
                  ` : `
                    <div style="font-family: 'Cinzel', serif; font-style: italic; font-size: 16px; color: #7f1d1d; height: 44px; line-height: 44px;">${config.instructor_name}</div>
                  `}
                  <div class="classic-sig-line"></div>
                  <div class="classic-sig-title">${config.instructor_title}</div>
                </div>
                
                <div class="classic-sig-block">
                  <div style="font-family: 'Cinzel', serif; font-size: 16px; color: #7f1d1d; font-weight: 800; height: 44px; line-height: 44px;">APPROVED</div>
                  <div class="classic-sig-line"></div>
                  <div class="classic-sig-title">Donzen Executive Board</div>
                </div>
              </div>
              
              <div class="classic-meta-id">Verification ID: ${cert.certificate_number}</div>
              <div class="classic-meta-date">Date Issued: ${new Date(cert.issued_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
          `}
        </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  const handleShare = (cert) => {
    const url = `${window.location.origin}/verify-certificate?id=${cert.certificate_number}`
    navigator.clipboard.writeText(url)
    alert(`Verification link copied to clipboard: ${url}`)
  }

  if (loading) return <div style={{ padding: '40px 0', color: '#64748b' }}>Loading certificates...</div>

  if (certificates.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
        <svg style={{ width: 64, height: 64, color: '#94a3b8', margin: '0 auto 16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>No Certificates Yet</h2>
        <p style={{ color: '#64748b', marginBottom: 8, fontSize: 15 }}>Certificates are awarded upon scoring over the threshold in final course lessons and modules.</p>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>Complete curriculum modules at 100% to qualify for your accreditation.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
      {certificates.map((cert) => (
        <div key={cert.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: '#fef3c7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                🎓
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{cert.courses?.products?.title}</h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>Accredited Certification</span>
              </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Certificate No:</span>
                <span style={{ fontWeight: 600, color: '#334155', fontFamily: 'monospace' }}>{cert.certificate_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#64748b' }}>Issued On:</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{new Date(cert.issued_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => handleDownload(cert)}
              style={{ flex: 1, background: '#ff1717', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              📥 Download PDF
            </button>
            <button 
              onClick={() => handleShare(cert)}
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              title="Copy Verification Link"
            >
              🔗 Share
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
