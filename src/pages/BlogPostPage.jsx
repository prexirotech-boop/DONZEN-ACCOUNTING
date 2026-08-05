import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single()

        if (!error && data) {
          setPost(data)
          
          // Inject SEO Title
          document.title = data.meta_title || `${data.title} | Donzen Accounting Hub`

          // Inject SEO Meta Description
          let metaDesc = document.querySelector('meta[name="description"]')
          if (!metaDesc) {
            metaDesc = document.createElement('meta')
            metaDesc.setAttribute('name', 'description')
            document.head.appendChild(metaDesc)
          }
          metaDesc.setAttribute('content', data.meta_description || data.summary || '')

          // Inject SEO Meta Keywords
          let metaKeys = document.querySelector('meta[name="keywords"]')
          if (!metaKeys) {
            metaKeys = document.createElement('meta')
            metaKeys.setAttribute('name', 'keywords')
            document.head.appendChild(metaKeys)
          }
          metaKeys.setAttribute('content', data.meta_keywords || data.category || 'accounting, nigeria, CAC, bookkeeping')
        }
      } catch (err) {
        console.error('Error fetching blog post:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b', fontFamily: 'var(--font)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(0,0,0,0.05)', borderTopColor: '#ff1717', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        Loading article...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0f172a', fontFamily: 'var(--font)', padding: 20, textAlign: 'center' }}>
        <span style={{ fontSize: 50, marginBottom: 16 }}>🔍</span>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Article Not Found</h2>
        <p style={{ color: '#64748b', maxWidth: 400, marginBottom: 24, lineHeight: 1.5 }}>
          The article you are looking for does not exist or has been moved.
        </p>
        <Link to="/resources" style={{ background: '#ff1717', color: '#fff', textDecoration: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
          Back to Resource Hub
        </Link>
      </div>
    )
  }

  // Calculate reading time roughly: ~200 words per minute
  const wordCount = (post.content || '').split(/\s+/).length
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#292929', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 100 }}>
      {/* ─── BREADCRUMBS & NAVIGATION ─── */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '40px 20px 20px' }}>
        <Link to="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#ff1717', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Resource Hub
        </Link>
      </div>

      {/* ─── POST HEADER ─── */}
      <header style={{ maxWidth: 740, margin: '0 auto', padding: '20px 20px 0' }}>
        {post.category && (
          <span style={{ 
            color: '#ff1717', 
            fontSize: 13, 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            display: 'block', 
            marginBottom: 12 
          }}>
            {post.category}
          </span>
        )}
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5.5vw, 3.2rem)', 
          fontWeight: 800, 
          color: '#0f172a', 
          lineHeight: 1.15, 
          letterSpacing: '-1.5px', 
          margin: '0 0 20px',
          fontFamily: 'Outfit, Georgia, serif'
        }}>
          {post.title}
        </h1>
        {post.summary && (
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', 
            color: '#64748b', 
            lineHeight: 1.5, 
            margin: '0 0 32px',
            fontWeight: 450
          }}>
            {post.summary}
          </p>
        )}

        {/* Author / Metadata Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #f1f5f9', paddingBottom: 28, marginBottom: 40 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #ff1717 0%, #b91c1c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>
            AS
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14.5 }}>Precious & Samuel</div>
            <div style={{ fontSize: 13, color: '#64748b', display: 'flex', gap: 8, marginTop: 2 }}>
              <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>&bull;</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── FEATURED IMAGE ─── */}
      {post.cover_image && (
        <div style={{ maxWidth: 960, margin: '0 auto 48px', padding: '0 20px' }}>
          <img 
            src={post.cover_image} 
            alt={post.title} 
            style={{ width: '100%', maxHeight: 520, objectFit: 'cover', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }} 
          />
        </div>
      )}

      {/* ─── PUBLIC BODY CONTENT ─── */}
      <article style={{ maxWidth: 740, margin: '0 auto', padding: '0 20px' }}>
        <div 
          className="medium-body"
          dangerouslySetInnerHTML={{ __html: post.content }} 
          style={{
            fontSize: 'clamp(1.05rem, 2.2vw, 1.22rem)',
            lineHeight: 1.8,
            color: '#292929',
            fontFamily: 'Inter, system-ui, sans-serif',
            wordBreak: 'break-word'
          }}
        />
      </article>

      {/* ─── FOOTER CTA ─── */}
      <div style={{ maxWidth: 740, margin: '60px auto 0', padding: '40px 20px 0', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
        <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Need expert financial advice for your business?</h4>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Our advisory team is ready to help you CAC register, file taxes, or handle remote bookkeeping.</p>
        <Link to="/contact" style={{ display: 'inline-block', background: '#ff1717', color: '#fff', textDecoration: 'none', padding: '11px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14.5, boxShadow: '0 4px 12px rgba(255,23,23,0.18)' }}>
          Contact Our Advisory Team
        </Link>
      </div>

      {/* Medium Typography Global Styling overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .medium-body p {
          margin-bottom: 24px;
        }
        .medium-body h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 40px;
          margin-bottom: 16px;
          letter-spacing: -0.6px;
        }
        .medium-body h3 {
          font-size: 1.45rem;
          font-weight: 750;
          color: #0f172a;
          margin-top: 32px;
          margin-bottom: 12px;
          letter-spacing: -0.4px;
        }
        .medium-body ul, .medium-body ol {
          margin-bottom: 24px;
          padding-left: 24px;
        }
        .medium-body li {
          margin-bottom: 10px;
        }
        .medium-body blockquote {
          border-left: 4px solid #ff1717;
          padding-left: 20px;
          font-style: italic;
          color: #475569;
          margin: 32px 0;
          font-size: 1.25rem;
          line-height: 1.6;
        }
        .medium-body img, .medium-body video {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 36px auto;
          border-radius: 8px;
        }
        .medium-body a {
          color: #ff1717;
          text-decoration: underline;
          font-weight: 500;
        }
        .medium-body a:hover {
          opacity: 0.85;
        }
      `}} />
    </div>
  )
}
