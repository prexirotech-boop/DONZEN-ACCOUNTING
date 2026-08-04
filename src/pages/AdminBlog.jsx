import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  
  const categories = [
    'Cash Flow',
    'Excel',
    'QuickBooks',
    'Financial Reporting',
    'Inventory',
    'Career',
    'General'
  ]

  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Cash Flow',
    cover_image: '',
    is_published: true
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingPost && form.title) {
      const generatedSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setForm(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [form.title, editingPost])

  const loadPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading posts:', error.message)
    } else if (data) {
      setPosts(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleOpenAdd = () => {
    setEditingPost(null)
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: 'Cash Flow',
      cover_image: '',
      is_published: true
    })
    setShowModal(true)
  }

  const handleOpenEdit = (post) => {
    setEditingPost(post)
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      summary: post.summary || '',
      content: post.content || '',
      category: post.category || 'Cash Flow',
      cover_image: post.cover_image || '',
      is_published: post.is_published === undefined ? true : post.is_published
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      alert('Please fill in Title, Slug, and Content fields.')
      return
    }
    setSubmitting(true)

    // Compute dynamic read time (roughly 200 words per minute)
    const wordCount = form.content.split(/\s+/).filter(Boolean).length
    const computedReadTime = Math.max(1, Math.ceil(wordCount / 200))

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      category: form.category,
      cover_image: form.cover_image.trim() || null,
      is_published: form.is_published,
      read_time: computedReadTime,
      updated_at: new Date().toISOString()
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editingPost.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(payload)
        if (error) throw error
      }
      setShowModal(false)
      loadPosts()
    } catch (err) {
      alert('Error saving post: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
      if (error) throw error
      loadPosts()
    } catch (err) {
      alert('Error deleting post: ' + err.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1a1f36', margin: 0 }}>Insight Blog Manager</h2>
          <p style={{ color: '#697386', marginTop: 4, fontSize: 14 }}>Create, edit, and publish SEO-optimized resources and bookkeeping tutorials.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ background: '#e12b2b', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)' }}
        >
          + Write Article
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#697386', fontSize: 13 }}>Loading articles...</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e3e8ee', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: '#f7f8f9', borderBottom: '1px solid #e3e8ee', color: '#4f566b', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px' }}>Title & Cover</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Read Time</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px 16px', textAlign: 'center', color: '#697386' }}>
                    No articles found. Click "Write Article" to start blogging!
                  </td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} style={{ borderBottom: '1px solid #e3e8ee', color: '#3c4257' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 32, borderRadius: 4, overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e3e8ee', flexShrink: 0 }}>
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e12b2b', color: '#fff', fontSize: 10, fontWeight: 700 }}>BLOG</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1a1f36' }}>{post.title}</div>
                        <div style={{ fontSize: 11, color: '#697386', fontFamily: 'monospace' }}>/{post.slug}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f0f4f9', color: '#1a1f36', padding: '3px 8px', borderRadius: 4, fontSize: 11.5, fontWeight: 600 }}>
                        {post.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{post.read_time || 5} min read</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        background: post.is_published ? '#e6f4ea' : '#f1f3f4', 
                        color: post.is_published ? '#137333' : '#3c4043', 
                        padding: '3px 8px', 
                        borderRadius: 4, 
                        fontSize: 11, 
                        fontWeight: 600 
                      }}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#697386', fontSize: 12.5 }}>
                      {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 10 }}>
                        <button 
                          onClick={() => handleOpenEdit(post)}
                          style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: 12.5 }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          style={{ background: 'none', border: 'none', color: '#e12b2b', fontWeight: 600, cursor: 'pointer', fontSize: 12.5 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e3e8ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1f36' }}>
                {editingPost ? 'Edit Blog Post' : 'Write New Blog Post'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8792a2' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4257', marginBottom: 6 }}>Title *</label>
                  <input 
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5, boxSizing: 'border-box' }}
                    placeholder="e.g. QuickBooks Tips for Nigerian SMEs"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4257', marginBottom: 6 }}>Slug (URL path) *</label>
                  <input 
                    type="text"
                    required
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5, boxSizing: 'border-box', fontFamily: 'monospace' }}
                    placeholder="e.g. quickbooks-tips-smes"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4257', marginBottom: 6 }}>Category *</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5, boxSizing: 'border-box', background: '#fff' }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4257', marginBottom: 6 }}>Cover Image URL (optional)</label>
                  <input 
                    type="text"
                    value={form.cover_image}
                    onChange={e => setForm({ ...form, cover_image: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5, boxSizing: 'border-box' }}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4257', marginBottom: 6 }}>Excerpt / Summary</label>
                <textarea 
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5, boxSizing: 'border-box', height: 60, resize: 'vertical' }}
                  placeholder="Provide a brief 1-2 sentence description of the article..."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3c4257', marginBottom: 6 }}>Article Content *</label>
                <textarea 
                  required
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5, boxSizing: 'border-box', height: 220, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                  placeholder="Write the full content of your article here. You can paste text directly..."
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input 
                  type="checkbox"
                  id="is_published"
                  checked={form.is_published}
                  onChange={e => setForm({ ...form, is_published: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="is_published" style={{ fontSize: 13, fontWeight: 600, color: '#3c4257', cursor: 'pointer' }}>
                  Publish this article immediately (visible on public resources hub)
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8, borderTop: '1px solid #e3e8ee', paddingTop: 16 }}>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#4f566b', padding: '9px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#e12b2b', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 6, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 13, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
