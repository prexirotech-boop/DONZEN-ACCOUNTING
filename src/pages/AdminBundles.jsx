import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, calculateAccessDurationDates } from '../lib/supabase'
import { useCurrency } from '../context/CurrencyContext'

export default function AdminBundles() {
  const { formatPrice } = useCurrency()
  const [bundles, setBundles] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBundle, setEditingBundle] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const isMobile = windowWidth < 768

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    compare_price: '',
    cover_image: '',
    is_published: true,
    is_featured: false,
    selectedCourseIds: [],
    // Batch Enrollment settings
    batch_enrollment_enabled: false,
    batch_start_date: '',
    batch_name: '',
    // Access Duration Limit settings
    access_duration_type: 'lifetime',
    access_duration_days: ''
  })

  const loadData = async () => {
    setLoading(true)
    try {
      // 1. Fetch all published/draft courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          id,
          level,
          products (
            id,
            title,
            price,
            old_price,
            cover_image,
            is_published
          )
        `)
        .order('created_at', { ascending: false })

      if (coursesData) {
        const formattedCourses = coursesData.map(c => ({
          id: c.id,
          title: c.products?.title || 'Untitled Course',
          price: c.products?.price || 0,
          cover_image: c.products?.cover_image,
          is_published: c.products?.is_published
        }))
        setAvailableCourses(formattedCourses)
      }

      // 2. Fetch all bundles with their bundle_items
      const { data: bundlesData, error: bErr } = await supabase
        .from('products')
        .select(`
          *,
          bundle_items (
            id,
            course_id,
            order_index,
            products:course_id (
              id,
              title,
              price,
              cover_image
            )
          )
        `)
        .eq('type', 'bundle')
        .order('created_at', { ascending: false })

      if (!bErr && bundlesData) {
        setBundles(bundlesData)
      }
    } catch (err) {
      console.error('Error loading bundles data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleOpenAdd = () => {
    setEditingBundle(null)
    setForm({
      title: '',
      slug: '',
      description: '',
      price: '',
      compare_price: '',
      cover_image: '',
      is_published: true,
      is_featured: false,
      selectedCourseIds: [],
      batch_enrollment_enabled: false,
      batch_start_date: '',
      batch_name: '',
      access_duration_type: 'lifetime',
      access_duration_days: ''
    })
    setShowModal(true)
  }

  const handleOpenEdit = (b) => {
    setEditingBundle(b)
    const currentCourseIds = (b.bundle_items || []).map(bi => bi.course_id)
    
    // Format date for datetime-local input
    let formattedStartDate = ''
    if (b.batch_start_date) {
      const d = new Date(b.batch_start_date)
      if (!isNaN(d.getTime())) {
        formattedStartDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      }
    }

    setForm({
      title: b.title || '',
      slug: b.slug || '',
      description: b.description || '',
      price: b.price || '',
      compare_price: b.old_price || '',
      cover_image: b.cover_image || '',
      is_published: b.is_published ?? true,
      is_featured: b.is_featured ?? false,
      selectedCourseIds: currentCourseIds,
      batch_enrollment_enabled: b.batch_enrollment_enabled ?? false,
      batch_start_date: formattedStartDate,
      batch_name: b.batch_name || '',
      access_duration_type: b.access_duration_type || 'lifetime',
      access_duration_days: b.access_duration_days || ''
    })
    setShowModal(true)
  }

  const handleToggleCourseSelect = (courseId) => {
    setForm(prev => {
      const exists = prev.selectedCourseIds.includes(courseId)
      const updated = exists 
        ? prev.selectedCourseIds.filter(id => id !== courseId)
        : [...prev.selectedCourseIds, courseId]
      
      // Auto compute total individual prices to suggest compare_price
      const totalIndividual = updated.reduce((sum, id) => {
        const found = availableCourses.find(c => c.id === id)
        return sum + (found?.price || 0)
      }, 0)

      return {
        ...prev,
        selectedCourseIds: updated,
        compare_price: prev.compare_price || (totalIndividual > 0 ? totalIndividual : '')
      }
    })
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `bundle-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `course-covers/${fileName}`

      const { error: uploadErr } = await supabase.storage
        .from('course-assets')
        .upload(filePath, file)

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('course-assets')
        .getPublicUrl(filePath)

      setForm(prev => ({ ...prev, cover_image: publicUrl }))
    } catch (err) {
      alert('Cover upload failed: ' + err.message)
    } finally {
      setUploadingCover(false)
    }
  }

  const handleSaveBundle = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.slug.trim()) {
      alert('Please provide a title and slug.')
      return
    }
    if (form.selectedCourseIds.length === 0) {
      alert('Please select at least one course to include in this bundle.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        type: 'bundle',
        description: form.description.trim(),
        price: parseInt(form.price) || 0,
        old_price: form.compare_price ? parseInt(form.compare_price) : null,
        cover_image: form.cover_image.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        is_published: form.is_published,
        is_featured: form.is_featured,
        batch_enrollment_enabled: form.batch_enrollment_enabled,
        batch_start_date: form.batch_enrollment_enabled && form.batch_start_date ? new Date(form.batch_start_date).toISOString() : null,
        batch_name: form.batch_enrollment_enabled ? form.batch_name.trim() : null,
        access_duration_type: form.access_duration_type,
        access_duration_days: form.access_duration_type === 'custom' ? parseInt(form.access_duration_days) : null
      }

      let bundleId = editingBundle?.id

      if (editingBundle) {
        // 1. Update Product
        const { error: pErr } = await supabase
          .from('products')
          .update(payload)
          .eq('id', bundleId)

        if (pErr) throw pErr
      } else {
        // 1. Insert Product
        const { data: newProd, error: pErr } = await supabase
          .from('products')
          .insert(payload)
          .select('id')
          .single()

        if (pErr) throw pErr
        bundleId = newProd.id
      }

      // 2. Sync bundle_items (delete old & insert new)
      await supabase.from('bundle_items').delete().eq('bundle_id', bundleId)

      const itemsToInsert = form.selectedCourseIds.map((courseId, idx) => ({
        bundle_id: bundleId,
        course_id: courseId,
        order_index: idx
      }))

      const { error: bItemsErr } = await supabase
        .from('bundle_items')
        .insert(itemsToInsert)

      if (bItemsErr) throw bItemsErr

      setShowModal(false)
      loadData()
    } catch (err) {
      alert('Error saving bundle: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBundle = async (bundleId) => {
    if (!confirm('Are you sure you want to delete this bundle? Customers already enrolled will maintain course access.')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', bundleId)
      if (error) throw error
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleTogglePublish = async (b) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_published: !b.is_published })
        .eq('id', b.id)
      if (error) throw error
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const selectedTotal = form.selectedCourseIds.reduce((sum, id) => {
    const found = availableCourses.find(c => c.id === id)
    return sum + (found?.price || 0)
  }, 0)

  const discountPercent = form.price && selectedTotal > 0 && Number(form.price) < selectedTotal
    ? Math.round(((selectedTotal - Number(form.price)) / selectedTotal) * 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#121212', margin: 0 }}>Course Bundles</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Package multiple courses together as 1 high-value product with custom batch release & access duration limits.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{
            background: '#ff1717',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(255, 23, 23, 0.25)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Bundle
        </button>
      </div>

      {/* Stats summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Total Bundles</span>
          <span style={statValStyle}>{bundles.length}</span>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Published Bundles</span>
          <span style={{ ...statValStyle, color: '#16a34a' }}>
            {bundles.filter(b => b.is_published).length}
          </span>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Batch-Scheduled Bundles</span>
          <span style={{ ...statValStyle, color: '#d97706' }}>
            {bundles.filter(b => b.batch_enrollment_enabled).length}
          </span>
        </div>
      </div>

      {/* Bundles Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading course bundles...</div>
      ) : bundles.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>No Course Bundles Created Yet</h3>
          <p style={{ color: '#64748b', fontSize: 14, maxWidth: 450, margin: '0 auto 20px' }}>
            Create your first bundle to sell multiple complementary courses together at a special promotional price.
          </p>
          <button
            onClick={handleOpenAdd}
            style={{ background: '#ff1717', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
          >
            Create Bundle
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {bundles.map(b => {
            const bundledCourses = (b.bundle_items || []).map(bi => bi.products).filter(Boolean)
            const sumIndividual = bundledCourses.reduce((s, c) => s + (c?.price || 0), 0)

            return (
              <div key={b.id} style={{
                background: '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                {/* Cover & Header Badge */}
                <div style={{ position: 'relative', height: 160, background: '#0f172a' }}>
                  <img
                    src={b.cover_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
                    alt={b.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    <span style={{ background: '#ff1717', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                      Bundle ({bundledCourses.length} Courses)
                    </span>
                    <span style={{
                      background: b.is_published ? '#16a34a' : '#64748b',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: 4
                    }}>
                      {b.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>{b.title}</h3>
                  </div>

                  {b.description && (
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {b.description}
                    </p>
                  )}

                  {/* Pricing Info */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#ff1717' }}>{formatPrice(b.price)}</span>
                    {sumIndividual > b.price && (
                      <span style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'line-through' }}>
                        Value: {formatPrice(sumIndividual)}
                      </span>
                    )}
                  </div>

                  {/* Included Courses list pills */}
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      Included Courses:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {bundledCourses.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#334155', background: '#f8fafc', padding: '4px 8px', borderRadius: 4 }}>
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</span>
                          <span style={{ color: '#94a3b8', fontSize: 11 }}>({formatPrice(c.price)})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Batch & Duration Details */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#475569' }}>
                    {b.batch_enrollment_enabled ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706', fontWeight: 600 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Batch: {b.batch_name || 'Scheduled'} ({b.batch_start_date ? new Date(b.batch_start_date).toLocaleDateString() : 'Date TBD'})</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <span>Instant Access upon purchase</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span>
                        Access Limit: {
                          b.access_duration_type === '1_month' ? '1 Month (30 Days)' :
                          b.access_duration_type === '3_months' ? '3 Months (90 Days)' :
                          b.access_duration_type === '6_months' ? '6 Months (180 Days)' :
                          b.access_duration_type === '1_year' ? '1 Year (365 Days)' :
                          b.access_duration_type === 'custom' ? `${b.access_duration_days} Days` :
                          'Lifetime / Forever'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 12 }}>
                    <button
                      onClick={() => handleOpenEdit(b)}
                      style={{ flex: 1, background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 4, fontWeight: 600, fontSize: 12.5, cursor: 'pointer', color: '#1e293b' }}
                    >
                      Edit Bundle
                    </button>
                    <button
                      onClick={() => handleTogglePublish(b)}
                      style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 4, fontWeight: 600, fontSize: 12.5, cursor: 'pointer', color: b.is_published ? '#ea580c' : '#16a34a' }}
                    >
                      {b.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDeleteBundle(b.id)}
                      style={{ background: '#fee2e2', border: 'none', padding: '8px 12px', borderRadius: 4, fontWeight: 600, fontSize: 12.5, cursor: 'pointer', color: '#dc2626' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 8,
            maxWidth: 720,
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {editingBundle ? 'Edit Course Bundle' : 'Create Course Bundle'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveBundle} style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Bundle Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Bundle Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => {
                      const t = e.target.value
                      setForm(p => ({
                        ...p,
                        title: t,
                        slug: p.slug ? p.slug : generateSlug(t)
                      }))
                    }}
                    placeholder="e.g. Master Financial Analyst Bundle"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>URL Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Short Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what students gain by getting all included courses in this bundle..."
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Course Selection Area */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>
                    Select Included Courses ({form.selectedCourseIds.length} Selected) *
                  </label>
                  {selectedTotal > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>
                      Combined Value: {formatPrice(selectedTotal)}
                    </span>
                  )}
                </div>

                <div style={{
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 6,
                  maxHeight: 180,
                  overflowY: 'auto',
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  background: '#f8fafc'
                }}>
                  {availableCourses.map(c => {
                    const isSelected = form.selectedCourseIds.includes(c.id)
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleToggleCourseSelect(c.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '8px 12px',
                          background: isSelected ? '#eff6ff' : '#fff',
                          border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                          borderRadius: 4,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by div click
                          style={{ cursor: 'pointer', accentColor: '#ff1717' }}
                        />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: isSelected ? 600 : 500, color: '#1e293b' }}>
                          {c.title}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                          {formatPrice(c.price)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pricing & Discount info */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Bundle Price (NGN) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 25000"
                    required
                    style={inputStyle}
                  />
                  {discountPercent > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', display: 'block', marginTop: 4 }}>
                      🔥 {discountPercent}% discount vs purchasing courses separately!
                    </span>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Original Value / Strikethrough Price (NGN)</label>
                  <input
                    type="number"
                    value={form.compare_price}
                    onChange={e => setForm({ ...form, compare_price: e.target.value })}
                    placeholder={selectedTotal > 0 ? String(selectedTotal) : 'e.g. 50000'}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label style={labelStyle}>Bundle Cover Image URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="url"
                    value={form.cover_image}
                    onChange={e => setForm({ ...form, cover_image: e.target.value })}
                    placeholder="https://..."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <label style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: uploadingCover ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: '#334155'
                  }}>
                    {uploadingCover ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* ── BATCH ENROLLMENT SECTION ── */}
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 6,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>⏳</span>
                    <div>
                      <strong style={{ fontSize: 14, color: '#92400e', display: 'block' }}>
                        Batch Enrollment (Scheduled Access & Release)
                      </strong>
                      <span style={{ fontSize: 12, color: '#b45309' }}>
                        Students who purchase will see a countdown timer until the scheduled release date.
                      </span>
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 6, fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                    <input
                      type="checkbox"
                      checked={form.batch_enrollment_enabled}
                      onChange={e => setForm({ ...form, batch_enrollment_enabled: e.target.checked })}
                      style={{ width: 16, height: 16, accentColor: '#d97706' }}
                    />
                    Enable Batch
                  </label>
                </div>

                {form.batch_enrollment_enabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 12, marginTop: 4 }}>
                    <div>
                      <label style={{ ...labelStyle, color: '#92400e' }}>Scheduled Batch Start Date & Time *</label>
                      <input
                        type="datetime-local"
                        value={form.batch_start_date}
                        onChange={e => setForm({ ...form, batch_start_date: e.target.value })}
                        required={form.batch_enrollment_enabled}
                        style={{ ...inputStyle, borderColor: '#fde68a' }}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, color: '#92400e' }}>Batch Label / Cohort Name</label>
                      <input
                        type="text"
                        value={form.batch_name}
                        onChange={e => setForm({ ...form, batch_name: e.target.value })}
                        placeholder="e.g. Cohort 5 - October 2026"
                        style={{ ...inputStyle, borderColor: '#fde68a' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── ACCESS DURATION LIMIT SECTION ── */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>⏱️</span>
                  <div>
                    <strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>
                      Access Duration Limit & Expiration
                    </strong>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      Once expired, students are redirected to checkout to renew access.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Duration Limit</label>
                    <select
                      value={form.access_duration_type}
                      onChange={e => setForm({ ...form, access_duration_type: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="lifetime">Forever / Lifetime (No Expiration)</option>
                      <option value="1_month">1 Month (30 Days)</option>
                      <option value="3_months">3 Months (90 Days)</option>
                      <option value="6_months">6 Months (180 Days)</option>
                      <option value="1_year">1 Year (365 Days)</option>
                      <option value="custom">Custom Duration in Days</option>
                    </select>
                  </div>

                  {form.access_duration_type === 'custom' && (
                    <div>
                      <label style={labelStyle}>Custom Number of Days</label>
                      <input
                        type="number"
                        value={form.access_duration_days}
                        onChange={e => setForm({ ...form, access_duration_days: e.target.value })}
                        placeholder="e.g. 45"
                        required
                        style={inputStyle}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Publish & Feature Flags */}
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={e => setForm({ ...form, is_published: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: '#ff1717' }}
                  />
                  Published (Visible in Storefront)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: '#ff1717' }}
                  />
                  Feature on Homepage
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: '#ff1717',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(255, 23, 23, 0.3)'
                  }}
                >
                  {submitting ? 'Saving...' : editingBundle ? 'Update Bundle' : 'Create Bundle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 12.5,
  fontWeight: 600,
  color: '#334155',
  marginBottom: 6
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  border: '1.5px solid #cbd5e1',
  fontSize: 13.5,
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box'
}

const statCardStyle = {
  background: '#fff',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 6
}

const statLabelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'uppercase'
}

const statValStyle = {
  fontSize: 24,
  fontWeight: 800,
  color: '#0f172a'
}
