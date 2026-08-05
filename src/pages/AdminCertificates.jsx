import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const generateCertNumber = () => {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `AS-${ts}-${rand}`
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [revokeLoading, setRevokeLoading] = useState(null)

  // Sub-tab: 'list' | 'settings'
  const [activeSubTab, setActiveSubTab] = useState('list')
  const [savingConfig, setSavingConfig] = useState(false)
  
  // Custom Certificate Config State
  const [config, setConfig] = useState({
    default_template: 'coursera',
    instructor_name: 'Samuel Onainor',
    instructor_title: 'Founder & CEO, Donzen Accounting Hub',
    signature_url: '',
    use_signature_image: false
  })

  const sigUploadRef = useRef(null)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const isMobile = windowWidth < 768

  const [issueForm, setIssueForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem('draft_certIssue') || '{}') } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem('draft_certIssue', JSON.stringify(issueForm))
  }, [issueForm])

  const [emailSuggestions, setEmailSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleEmailChange = async (val) => {
    setIssueForm(f => ({ ...f, user_email: val }))
    if (!val.trim()) {
      setEmailSuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, full_name')
        .ilike('email', `%${val}%`)
        .limit(6)
      if (!error && data) {
        setEmailSuggestions(data)
        setShowSuggestions(data.length > 0)
      }
    } catch (err) {
      console.error('Error fetching email suggestions:', err)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // 1. Fetch certificates
      const { data: certs, error: certError } = await supabase
        .from('certificates')
        .select('*')
        .order('issued_at', { ascending: false })

      if (certError) throw certError

      // Get unique user and course IDs
      const userIds = Array.from(new Set((certs || []).map(c => c.user_id).filter(Boolean)))
      const courseIds = Array.from(new Set((certs || []).map(c => c.course_id).filter(Boolean)))

      // 2. Fetch profiles and products in parallel
      const [profilesRes, productsRes] = await Promise.all([
        userIds.length > 0 ? supabase.from('profiles').select('id, full_name, email').in('id', userIds) : { data: [] },
        courseIds.length > 0 ? supabase.from('products').select('id, title').in('id', courseIds) : { data: [] }
      ])

      const profilesMap = {}
      ;(profilesRes.data || []).forEach(p => { profilesMap[p.id] = p })

      const productsMap = {}
      ;(productsRes.data || []).forEach(p => { productsMap[p.id] = p })

      // 3. Assemble certificates list
      const assembled = (certs || []).map(c => {
        const profile = profilesMap[c.user_id] || { full_name: '—', email: '' }
        const product = productsMap[c.course_id] || { title: 'Accredited Certification' }
        
        const certNumber = c.certificate_number || `AS-${new Date(c.issued_at || Date.now()).getTime().toString(36).toUpperCase()}-${String(c.id || '').slice(-5).toUpperCase()}`
        const isValid = c.is_valid !== undefined && c.is_valid !== null ? c.is_valid : true

        return {
          ...c,
          certificate_number: certNumber,
          is_valid: isValid,
          profiles: profile,
          courses: {
            id: c.course_id,
            products: product
          }
        }
      })

      // 4. Assemble courses list
      const { data: allCourses } = await supabase.from('courses').select('id')
      const { data: allProducts } = await supabase.from('products').select('id, title')
      
      const allProductsMap = {}
      ;(allProducts || []).forEach(p => { allProductsMap[p.id] = p })
      
      const assembledCourses = (allCourses || []).map(c => ({
        id: c.id,
        products: allProductsMap[c.id] || { title: 'Untitled Course' }
      }))

      setCertificates(assembled)
      setCourses(assembledCourses)

      // 5. Fetch certificate template configuration
      const { data: configRow } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'certificate_config')
        .maybeSingle()
      
      if (configRow?.value) {
        setConfig(configRow.value)
      }
    } catch (err) {
      console.error('Error fetching certificates data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleIssue = async (e) => {
    e.preventDefault()
    if (!issueForm.user_email?.trim() || !issueForm.course_id) return
    setSubmitting(true)
    try {
      const { data: userProfile, error: uErr } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('email', issueForm.user_email.trim())
        .single()

      if (uErr || !userProfile) throw new Error('No user found with that email address.')

      let insertData = { 
        user_id: userProfile.id, 
        course_id: issueForm.course_id, 
        certificate_number: generateCertNumber(), 
        is_valid: true 
      }

      let { error } = await supabase.from('certificates').insert(insertData)

      // Retry without certificate_number and is_valid if columns do not exist (error code 42703)
      if (error && error.code === '42703') {
        const fallbackInsertData = {
          user_id: userProfile.id,
          course_id: issueForm.course_id
        }
        const { error: fallbackErr } = await supabase.from('certificates').insert(fallbackInsertData)
        error = fallbackErr
      }

      if (error) {
        if (error.code === '23505') throw new Error('This student already has a certificate for this course.')
        throw error
      }

      localStorage.removeItem('draft_certIssue')
      setIssueForm({})
      setShowIssueModal(false)
      loadData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleRevoke = async (certId, currentlyValid) => {
    if (!confirm(currentlyValid ? 'Revoke this certificate? The student will lose access.' : 'Restore this certificate?')) return
    setRevokeLoading(certId)
    const { error } = await supabase.from('certificates').update({ is_valid: !currentlyValid }).eq('id', certId)
    if (error) {
      console.error('Error updating certificate validity:', error)
      alert('Failed to update certificate status. Your database table is missing the "is_valid" column.')
    }
    setRevokeLoading(null)
    loadData()
  }

  // Save Settings Config Handler
  const handleSaveConfig = async (e) => {
    e.preventDefault()
    setSavingConfig(true)
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'certificate_config',
          value: config,
          updated_at: new Date().toISOString()
        })
      if (error) throw error
      alert('Certificate templates preferences saved successfully!')
    } catch (err) {
      alert('Error saving preferences: ' + err.message)
    } finally {
      setSavingConfig(false)
    }
  }

  // Signature PC File Upload
  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fileExt = file.name.split('.').pop()
    const fileName = `sig-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const filePath = `signatures/${fileName}`
    
    setSavingConfig(true)
    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-attachments')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-attachments')
        .getPublicUrl(filePath)
        
      setConfig(prev => ({ 
        ...prev, 
        signature_url: publicUrl, 
        use_signature_image: true 
      }))
    } catch (err) {
      alert('Failed to upload signature: ' + err.message)
    } finally {
      setSavingConfig(false)
    }
  }

  // HTML Template Print Preview
  const handlePreviewTemplate = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=680')
    if (!printWindow) {
      alert("Please allow popups to view preview.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview Certificate Style</title>
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
            .preview-label-tag {
              position: fixed;
              top: 20px;
              left: 20px;
              background-color: #0f172a;
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 700;
            }
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
          <div class="preview-label-tag">TEMPLATE PREVIEW MODE</div>

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
                <div class="coursera-name">Student Full Name</div>
                <div class="coursera-reason">
                  successfully completed and received passing grades in the professional training curriculum for
                  <br>
                  <span class="coursera-course">Advanced Financial Modeling & Bookkeeping Masterclass</span>
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
                <div>Verification ID: <span>AS-PREVIEW-00000</span></div>
                <div>Date Issued: <span>${new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
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
              <div class="classic-name">Student Full Name</div>
              
              <div class="classic-reason">
                for successfully completing the core training curriculum and executing the project blueprints for
                <br>
                <span class="classic-course">Advanced Financial Modeling & Bookkeeping Masterclass</span>
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
              
              <div class="classic-meta-id">Verification ID: AS-PREVIEW-00000</div>
              <div class="classic-meta-date">Date Issued: ${new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
          `}
        </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  const filtered = certificates.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.profiles?.full_name?.toLowerCase().includes(q) ||
      c.profiles?.email?.toLowerCase().includes(q) ||
      c.courses?.products?.title?.toLowerCase().includes(q) ||
      c.certificate_number?.toLowerCase().includes(q)
    )
  })

  const totalIssued = certificates.length
  const totalActive = certificates.filter(c => c.is_valid).length
  const totalRevoked = certificates.filter(c => !c.is_valid).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font)' }}>
      {/* Hidden file input for signature upload */}
      <input type="file" ref={sigUploadRef} onChange={handleSignatureUpload} accept="image/*" style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1f36', margin: 0 }}>Certificates</h2>
          <p style={{ color: '#697386', marginTop: 4, fontSize: 13.5, margin: '4px 0 0' }}>
            Auto-issued on course completion. Manually issue or customize defaults.
          </p>
        </div>
        
        {activeSubTab === 'list' && (
          <button
            onClick={() => setShowIssueModal(true)}
            style={{ background: '#ff1717', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Issue Certificate
          </button>
        )}
      </div>

      {/* Sub tabs navigation */}
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 2 }}>
        <button 
          onClick={() => setActiveSubTab('list')}
          style={{
            background: 'none', border: 'none',
            borderBottom: activeSubTab === 'list' ? '2px solid #ff1717' : '2px solid transparent',
            color: activeSubTab === 'list' ? '#ff1717' : '#64748b',
            padding: '8px 12px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Issued Certificates
        </button>
        <button 
          onClick={() => setActiveSubTab('settings')}
          style={{
            background: 'none', border: 'none',
            borderBottom: activeSubTab === 'settings' ? '2px solid #ff1717' : '2px solid transparent',
            color: activeSubTab === 'settings' ? '#ff1717' : '#64748b',
            padding: '8px 12px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Template Settings
        </button>
      </div>

      {activeSubTab === 'list' ? (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 8 : 16 }}>
            {[
              { label: 'Total Issued', value: totalIssued, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>, color: '#ff1717', bg: 'rgba(255, 23, 23,0.08)' },
              { label: 'Active', value: totalActive, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, color: '#00875a', bg: 'rgba(0,135,90,0.08)' },
              { label: 'Revoked', value: totalRevoked, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>, color: '#ae2a19', bg: 'rgba(174,42,25,0.08)' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #e3e8ee', borderRadius: 8, padding: isMobile ? '12px 10px' : '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, marginBottom: isMobile ? 4 : 10 }}>
                  <div style={{ width: isMobile ? 24 : 32, height: isMobile ? 24 : 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {isMobile ? <span style={{ transform: 'scale(0.8)', display: 'flex' }}>{s.icon}</span> : s.icon}
                  </div>
                  <span style={{ fontSize: isMobile ? 9 : 11, fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
                </div>
                <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #e3e8ee', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                <input
                  type="text"
                  placeholder="Search student, course, certificate #..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12.5, outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
                />
              </div>
              <span style={{ fontSize: 12, color: '#697386', whiteSpace: 'nowrap' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            <div style={{ overflowX: 'auto', width: '100%' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#697386', fontSize: 13 }}>Loading certificates...</div>
              ) : (
                <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e3e8ee' }}>
                      {['Student', 'Course', 'Certificate #', 'Issued', 'Status', ''].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#697386', fontSize: 13 }}>
                        No certificates found. {certificates.length === 0 ? 'Issue certificates manually or they auto-issue on completion.' : ''}
                      </td></tr>
                    ) : (
                      filtered.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f7f8f9' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1f36', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.profiles?.full_name || '—'}</div>
                            <div style={{ fontSize: 11, color: '#697386', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.profiles?.email}</div>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#3c4257', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.courses?.products?.title || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#4f566b', whiteSpace: 'nowrap' }}>
                            {c.certificate_number}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 12, color: '#697386', whiteSpace: 'nowrap' }}>
                            {new Date(c.issued_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                              background: c.is_valid ? '#e3fcef' : '#fff0f0',
                              color: c.is_valid ? '#00875a' : '#ae2a19'
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                              {c.is_valid ? 'Active' : 'Revoked'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleToggleRevoke(c.id, c.is_valid)}
                              disabled={revokeLoading === c.id}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                                borderRadius: 4, fontSize: 11.5, fontWeight: 550,
                                color: c.is_valid ? '#ae2a19' : '#00875a',
                                opacity: revokeLoading === c.id ? 0.5 : 1
                              }}
                            >
                              {c.is_valid ? 'Revoke' : 'Restore'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Template Settings Workspace */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24, alignItems: 'start' }}>
          
          {/* Main Form Settings */}
          <form onSubmit={handleSaveConfig} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Certificate Layout Preferences</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Default Template Style</label>
              <select
                value={config.default_template}
                onChange={e => setConfig(prev => ({ ...prev, default_template: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13.5, background: '#fff', outline: 'none' }}
              >
                <option value="coursera">Coursera Style (Clean & Modern Layout)</option>
                <option value="classic">Classic Premium Style (Traditional Ornate Border)</option>
              </select>
              <p style={{ color: '#64748b', fontSize: 11.5, marginTop: 4 }}>Select the layout template you want automatically applied to all student course completion certificates.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Instructor Name</label>
                <input
                  type="text"
                  required
                  value={config.instructor_name}
                  onChange={e => setConfig(prev => ({ ...prev, instructor_name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13.5, boxSizing: 'border-box', outline: 'none' }}
                  placeholder="e.g. Samuel Onainor"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Instructor Description Title</label>
                <input
                  type="text"
                  required
                  value={config.instructor_title}
                  onChange={e => setConfig(prev => ({ ...prev, instructor_title: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13.5, boxSizing: 'border-box', outline: 'none' }}
                  placeholder="e.g. Founder & CEO, Donzen Hub"
                />
              </div>
            </div>

            {/* Signature Upload Settings */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Instructor Signature</label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <input 
                  type="checkbox" 
                  id="use_sig_img"
                  checked={config.use_signature_image}
                  onChange={e => setConfig(prev => ({ ...prev, use_signature_image: e.target.checked }))}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="use_sig_img" style={{ fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>Use Uploaded Signature Image (Otherwise, fallbacks to typed serif signature)</label>
              </div>

              {config.signature_url ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <img src={config.signature_url} alt="Signature Preview" style={{ height: 44, maxWidth: 150, objectFit: 'contain', background: '#fff', border: '1px solid #e2e8f0', padding: 4, borderRadius: 4 }} />
                  <div>
                    <button 
                      type="button" 
                      onClick={() => setConfig(prev => ({ ...prev, signature_url: '', use_signature_image: false }))}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Delete Signature
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => sigUploadRef.current.click()}
                  style={{ border: '2px dashed #cbd5e1', borderRadius: 8, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', color: '#64748b' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ff1717'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>✍️</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>Upload Handwritten Signature Image</div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>PNG image transparent background recommended</div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button 
                type="submit"
                disabled={savingConfig}
                style={{ background: '#ff1717', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: savingConfig ? 'not-allowed' : 'pointer', fontSize: 13.5 }}
              >
                {savingConfig ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Sidebar controls (Preview widget) */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Live Template Preview</h3>
            <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5, margin: 0 }}>Open a mock certificate page populated with your active configurations to test font alignments and signature displays.</p>
            <button
              onClick={handlePreviewTemplate}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 14px', background: '#0f172a', border: 'none',
                borderRadius: 8, color: '#fff', fontSize: 12.5, fontWeight: 700,
                cursor: 'pointer', textAlign: 'center', width: '100%', boxShadow: '0 4px 10px rgba(15,23,42,0.15)'
              }}
            >
              Preview Template 👁️
            </button>
          </div>

        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 440, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Issue Certificate</h3>
              <p style={{ fontSize: 13, color: '#697386', marginTop: 6 }}>Manually grant a course certificate to a student by their email.</p>
            </div>

            <form onSubmit={handleIssue} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontWeight: 500, fontSize: 13, marginBottom: 6, color: '#3c4257' }}>Student Email *</label>
                <input
                  type="text"
                  required
                  placeholder="Type student email..."
                  value={issueForm.user_email || ''}
                  onChange={e => handleEmailChange(e.target.value)}
                  onFocus={() => { if (emailSuggestions.length > 0) setShowSuggestions(true) }}
                  onBlur={() => { setTimeout(() => setShowSuggestions(false), 200) }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
                {showSuggestions && emailSuggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: 6,
                    maxHeight: 180, overflowY: 'auto', zIndex: 1010, marginTop: 4,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }}>
                    {emailSuggestions.map(s => (
                      <div
                        key={s.email}
                        onClick={() => {
                          setIssueForm(f => ({ ...f, user_email: s.email }))
                          setEmailSuggestions([])
                          setShowSuggestions(false)
                        }}
                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: 12.5 }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                      >
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{s.email}</div>
                        {s.full_name && <div style={{ fontSize: 11, color: '#64748b' }}>{s.full_name}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500, fontSize: 13, marginBottom: 6, color: '#3c4257' }}>Course *</label>
                <select
                  required
                  value={issueForm.course_id || ''}
                  onChange={e => setIssueForm(f => ({ ...f, course_id: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="">Select a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.products?.title || 'Untitled'}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, background: '#ff1717', color: '#fff', border: 'none', padding: '10px', borderRadius: 6, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 13, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Issuing...' : 'Issue Certificate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  style={{ flex: 1, background: '#f7f8f9', color: '#4f566b', border: '1px solid #e2e8f0', padding: '10px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
