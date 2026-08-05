import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  
  // View states: 'list' | 'new' | 'edit'
  const [view, setView] = useState('list')
  const [showHtml, setShowHtml] = useState(false) // Toggle view HTML source in editor

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
    is_published: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    focus_keyword: ''
  })

  const editorRef = useRef(null)
  const coverInputRef = useRef(null)
  const editorImgInputRef = useRef(null)
  const editorVidInputRef = useRef(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (view === 'new' && form.title) {
      const generatedSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setForm(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [form.title, view])

  // Sync editor content editable value initially
  useEffect(() => {
    if (editorRef.current && (view === 'new' || view === 'edit')) {
      if (editorRef.current.innerHTML !== form.content) {
        editorRef.current.innerHTML = form.content
      }
    }
  }, [view])

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
      is_published: true,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      focus_keyword: ''
    })
    setView('new')
    setShowHtml(false)
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
      is_published: post.is_published === undefined ? true : post.is_published,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || '',
      focus_keyword: post.focus_keyword || ''
    })
    setView('edit')
    setShowHtml(false)
  }

  // Cover Image PC File Upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fileExt = file.name.split('.').pop()
    const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const filePath = `covers/${fileName}`
    
    setSubmitting(true)
    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-attachments')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-attachments')
        .getPublicUrl(filePath)
        
      setForm(prev => ({ ...prev, cover_image: publicUrl }))
    } catch (err) {
      alert('Failed to upload cover image: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Editor Images PC File Upload
  const handleEditorImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fileExt = file.name.split('.').pop()
    const fileName = `editor-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const filePath = `content/${fileName}`
    
    setSubmitting(true)
    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-attachments')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-attachments')
        .getPublicUrl(filePath)
        
      // Focus the editor before executing insertion
      if (editorRef.current) {
        editorRef.current.focus()
        document.execCommand('insertHTML', false, `<img src="${publicUrl}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 24px auto; display: block;" alt="Article Image" />`)
        setForm(prev => ({ ...prev, content: editorRef.current.innerHTML }))
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message)
    } finally {
      setSubmitting(false)
      e.target.value = ''
    }
  }

  // Editor Video PC File Upload
  const handleEditorVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fileExt = file.name.split('.').pop()
    const fileName = `editor-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const filePath = `content/${fileName}`
    
    setSubmitting(true)
    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-attachments')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-attachments')
        .getPublicUrl(filePath)
        
      if (editorRef.current) {
        editorRef.current.focus()
        document.execCommand('insertHTML', false, `<video controls src="${publicUrl}" style="max-width: 100%; border-radius: 8px; margin: 24px auto; display: block;"></video>`)
        setForm(prev => ({ ...prev, content: editorRef.current.innerHTML }))
      }
    } catch (err) {
      alert('Failed to upload video: ' + err.message)
    } finally {
      setSubmitting(false)
      e.target.value = ''
    }
  }

  // Run format commands in contentEditable
  const runCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, value)
      setForm(prev => ({ ...prev, content: editorRef.current.innerHTML }))
    }
  }

  const handleInsertLink = () => {
    const url = prompt('Enter the link URL (e.g. https://google.com):')
    if (url) {
      runCommand('createLink', url)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    // Grab the editor value
    const finalContent = showHtml ? form.content : (editorRef.current?.innerHTML || '')

    if (!form.title.trim() || !form.slug.trim() || !finalContent.trim()) {
      alert('Please fill in Title, Slug, and Article Content fields.')
      return
    }
    setSubmitting(true)

    // Compute dynamic read time (roughly 200 words per minute)
    const textOnly = finalContent.replace(/<[^>]*>/g, '')
    const wordCount = textOnly.split(/\s+/).filter(Boolean).length
    const computedReadTime = Math.max(1, Math.ceil(wordCount / 200))

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      summary: form.summary.trim(),
      content: finalContent,
      category: form.category,
      cover_image: form.cover_image.trim() || null,
      is_published: form.is_published,
      read_time: computedReadTime,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      meta_keywords: form.meta_keywords.trim() || null,
      focus_keyword: form.focus_keyword.trim() || null,
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
      setView('list')
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

  if (view === 'list') {
    return (
      <div style={{ fontFamily: 'var(--font)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Insight Blog Manager</h2>
            <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Create, edit, and publish SEO-optimized resources and bookkeeping tutorials.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            style={{ background: '#ff1717', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,23,23,0.18)' }}
          >
            + Write Article
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#64748b', fontSize: 13, padding: '40px 0' }}>Loading articles...</div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '14px 18px' }}>Title & Cover</th>
                  <th style={{ padding: '14px 18px' }}>Category</th>
                  <th style={{ padding: '14px 18px' }}>Read Time</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px' }}>Date</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '48px 18px', textAlign: 'center', color: '#64748b' }}>
                      No articles found. Click "Write Article" to start blogging!
                    </td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                      <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 36, borderRadius: 6, overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                          {post.cover_image ? (
                            <img src={post.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ff1717', color: '#fff', fontSize: 10, fontWeight: 700 }}>BLOG</div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{post.title}</div>
                          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', marginTop: 2 }}>/blog/{post.slug}</div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 650 }}>
                          {post.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>{post.read_time || 5} min read</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ 
                          background: post.is_published ? '#dcfce7' : '#f1f5f9', 
                          color: post.is_published ? '#15803d' : '#475569', 
                          padding: '4px 8px', 
                          borderRadius: 6, 
                          fontSize: 11, 
                          fontWeight: 700 
                        }}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748b', fontSize: 12.5 }}>
                        {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 14 }}>
                          {post.is_published && (
                            <a 
                              href={`/blog/${post.slug}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ color: '#ff1717', fontWeight: 700, fontSize: 12.5, textDecoration: 'none' }}
                            >
                              View
                            </a>
                          )}
                          <button 
                            onClick={() => handleOpenEdit(post)}
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: 12.5 }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: 12.5 }}
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
      </div>
    )
  }

  // 'new' or 'edit' view
  return (
    <div style={{ fontFamily: 'var(--font)', paddingBottom: 60 }}>
      {/* Hidden File Selectors */}
      <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" style={{ display: 'none' }} />
      <input type="file" ref={editorImgInputRef} onChange={handleEditorImageUpload} accept="image/*" style={{ display: 'none' }} />
      <input type="file" ref={editorVidInputRef} onChange={handleEditorVideoUpload} accept="video/*" style={{ display: 'none' }} />

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <button 
            onClick={() => setView('list')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '0 0 8px 0' }}
          >
            &larr; Back to articles list
          </button>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {view === 'new' ? 'Create Blog Article' : 'Edit Blog Article'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setView('list')}
            style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#475569', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13.5 }}
          >
            Discard
          </button>
          
          <button 
            onClick={handleSave}
            disabled={submitting}
            style={{ background: '#ff1717', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 13.5, opacity: submitting ? 0.75 : 1, boxShadow: '0 4px 12px rgba(255,23,23,0.18)' }}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
        
        {/* Main Column (Writing Workspace) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Title & Slug Container */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Article Title *</label>
              <input 
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14.5, boxSizing: 'border-box', outline: 'none' }}
                placeholder="e.g. How Nigerian SMEs Should Manage Cash Flow"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Slug URL path *</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRight: 'none', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, color: '#64748b', fontSize: 13.5 }}>/blog/</span>
                <input 
                  type="text"
                  required
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderTopRightRadius: 8, borderBottomRightRadius: 8, fontSize: 13.5, boxSizing: 'border-box', outline: 'none', fontFamily: 'monospace' }}
                  placeholder="how-nigerian-smes-manage-cash-flow"
                />
              </div>
            </div>
          </div>

          {/* Excerpt / Summary */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Excerpt / Summary</label>
            <textarea 
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', height: 72, resize: 'vertical', outline: 'none', lineHeight: 1.5 }}
              placeholder="Provide a brief summary for card displays and search snippet description..."
            />
          </div>

          {/* Classic Text Editor */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Editor Toolbar */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" onClick={() => runCommand('bold')} title="Bold" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer', fontSize: 13 }}>B</button>
              <button type="button" onClick={() => runCommand('italic')} title="Italic" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, fontStyle: 'italic', cursor: 'pointer', fontSize: 13 }}>I</button>
              <button type="button" onClick={() => runCommand('underline')} title="Underline" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, textDecoration: 'underline', cursor: 'pointer', fontSize: 13 }}>U</button>
              
              <div style={{ width: 1, height: 20, background: '#cbd5e1', margin: '0 4px' }} />

              <button type="button" onClick={() => runCommand('formatBlock', '<h2>')} title="Heading 2" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>H2</button>
              <button type="button" onClick={() => runCommand('formatBlock', '<h3>')} title="Heading 3" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>H3</button>
              <button type="button" onClick={() => runCommand('formatBlock', '<p>')} title="Paragraph" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Para</button>
              <button type="button" onClick={() => runCommand('formatBlock', '<blockquote>')} title="Blockquote" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontStyle: 'italic' }}>Quote</button>

              <div style={{ width: 1, height: 20, background: '#cbd5e1', margin: '0 4px' }} />

              <button type="button" onClick={() => runCommand('insertUnorderedList')} title="Bullet List" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>&bull; List</button>
              <button type="button" onClick={() => runCommand('insertOrderedList')} title="Numbered List" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>1. List</button>
              
              <div style={{ width: 1, height: 20, background: '#cbd5e1', margin: '0 4px' }} />

              <button type="button" onClick={handleInsertLink} title="Link" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', color: '#2563eb', fontSize: 13 }}>Link</button>
              
              {/* Media Upload Buttons */}
              <button type="button" onClick={() => editorImgInputRef.current.click()} title="Insert Image from PC" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', color: '#059669', fontSize: 13, fontWeight: 600 }}>+ Image</button>
              <button type="button" onClick={() => editorVidInputRef.current.click()} title="Insert Video from PC" style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', color: '#d97706', fontSize: 13, fontWeight: 600 }}>+ Video</button>

              <div style={{ marginLeft: 'auto' }} />
              
              {/* Toggle HTML view */}
              <button 
                type="button" 
                onClick={() => {
                  if (!showHtml && editorRef.current) {
                    setForm(f => ({ ...f, content: editorRef.current.innerHTML }))
                  }
                  setShowHtml(!showHtml)
                }} 
                style={{ padding: '6px 12px', background: showHtml ? '#0f172a' : '#fff', border: '1px solid #cbd5e1', borderRadius: 4, color: showHtml ? '#fff' : '#0f172a', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                {showHtml ? 'Show Visual' : 'Edit HTML'}
              </button>
            </div>

            {/* Editor Workspace */}
            <div style={{ padding: 20, minHeight: 320, background: '#fff' }}>
              {showHtml ? (
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  style={{
                    width: '100%',
                    height: '320px',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: 13.5,
                    resize: 'none',
                    lineHeight: 1.6,
                    padding: 0
                  }}
                  placeholder="HTML source code..."
                />
              ) : (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={e => setForm(prev => ({ ...prev, content: e.target.innerHTML }))}
                  style={{
                    minHeight: '320px',
                    border: 'none',
                    outline: 'none',
                    fontSize: 15.5,
                    lineHeight: 1.7,
                    fontFamily: 'inherit',
                    overflowY: 'auto'
                  }}
                  placeholder="Start formatting and writing your article details here..."
                />
              )}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
              [contenteditable]:empty:before {
                content: attr(placeholder);
                color: #94a3b8;
                cursor: text;
              }
              .blog-attachments-container img {
                max-width: 100%;
                border-radius: 6px;
              }
            ` }} />
          </div>

          {/* Full SEO Configuration */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Search Engine Optimization (SEO)</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>SEO Meta Title</label>
                <input 
                  type="text"
                  value={form.meta_title}
                  onChange={e => setForm({ ...form, meta_title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  placeholder="Defaults to article title if empty"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Focus Keyword</label>
                <input 
                  type="text"
                  value={form.focus_keyword}
                  onChange={e => setForm({ ...form, focus_keyword: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  placeholder="e.g. cash flow management"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>SEO Meta Description</label>
              <textarea 
                value={form.meta_description}
                onChange={e => setForm({ ...form, meta_description: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', height: 56, resize: 'vertical' }}
                placeholder="Highly recommended for Google search results ranking..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Meta Keywords (comma separated)</label>
              <input 
                type="text"
                value={form.meta_keywords}
                onChange={e => setForm({ ...form, meta_keywords: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                placeholder="e.g. bookkeeping, bookkeeping tutorial, nigeria SMEs"
              />
            </div>
          </div>

        </div>

        {/* Sidebar Configuration Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Status & Preview Card */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Publish Status</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div 
                onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: form.is_published ? '#ff1717' : '#cbd5e1',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, left: form.is_published ? 23 : 3,
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#334155' }}>
                {form.is_published ? 'Visible (Published)' : 'Hidden (Draft)'}
              </span>
            </div>

            {view === 'edit' && form.is_published && (
              <a 
                href={`/blog/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1',
                  borderRadius: 8, color: '#0f172a', fontSize: 12.5, fontWeight: 700,
                  textDecoration: 'none', textAlign: 'center'
                }}
              >
                View Live Article ↗
              </a>
            )}
          </div>

          {/* Category Configuration */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Category</h3>
            <select 
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Featured Cover Image Upload */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Featured Cover Image</h3>
            
            {form.cover_image ? (
              <div style={{ position: 'relative', width: '100%', height: 130, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src={form.cover_image} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button" 
                  onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                  style={{
                    position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(15,23,42,0.7)', border: 'none', color: '#fff', fontSize: 14,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  &times;
                </button>
              </div>
            ) : (
              <div 
                onClick={() => coverInputRef.current.click()}
                style={{
                  border: '2px dashed #cbd5e1', borderRadius: 8, padding: '24px 16px',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  color: '#64748b'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#ff1717'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>Upload Featured Image</div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 4 }}>PNG, JPG or WEBP up to 5MB</div>
              </div>
            )}

            {/* Custom URL Input fallback */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Or paste Cover Image URL</label>
              <input 
                type="text"
                value={form.cover_image}
                onChange={e => setForm({ ...form, cover_image: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 11.5, boxSizing: 'border-box' }}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
