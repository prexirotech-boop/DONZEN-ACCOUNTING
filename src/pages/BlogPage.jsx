import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Persistent Search State
  const [search, setSearch] = useState(() => {
    return localStorage.getItem('blog_search_query') || ''
  })
  
  // Persistent Category State
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem('blog_active_category') || 'All'
  })

  useEffect(() => {
    localStorage.setItem('blog_search_query', search)
  }, [search])

  useEffect(() => {
    localStorage.setItem('blog_active_category', activeCategory)
  }, [activeCategory])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
        
        if (!error && data) {
          setPosts(data)
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const categories = ['All', 'Cash Flow', 'Excel', 'QuickBooks', 'Financial Reporting', 'Inventory', 'Career']

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.summary || '').toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
    
    const matchesCategory = 
      activeCategory === 'All' || 
      (post.category || '').toLowerCase() === activeCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#334155', fontFamily: "var(--font)" }}>
      {/* ════ HERO SECTION ════ */}
      <section className="blog-hero">
        <div className="blog-hero-bg">
          <img src="/images/home-hero-3.jpg" alt="" aria-hidden="true" />
          <div className="blog-hero-overlay" />
        </div>
        <div className="blog-hero-inner">
          <span className="blog-hero-badge">Resource Hub & Tutorials</span>
          <h1 className="blog-hero-title">
            Donzen Accounting Hub<br />
            <span className="blog-hero-accent">Insight Blog & Guides</span>
          </h1>
          <p className="blog-hero-desc">
            Expert articles, student onboarding guides, and business blueprints on Cash Flow, Excel, QuickBooks, and Financial Reporting.
          </p>
        </div>
      </section>

      {/* ════ MAIN CONTENT ════ */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px 80px' }}>
        
        {/* Search & Categories Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 50 }}>
          <div style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
            <input 
              type="text"
              placeholder="Search articles and blueprints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '16px 20px',
                fontSize: 15,
                color: '#0f172a',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#ff1717'
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 23, 23, 0.12)'
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? '#ff1717' : '#ffffff',
                  border: activeCategory === cat ? '1px solid #ff1717' : '1px solid #e2e8f0',
                  padding: '8px 18px',
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 600,
                  color: activeCategory === cat ? '#ffffff' : '#64748b',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(0,0,0,0.05)', borderTopColor: '#ff1717', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            Loading resources...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 16 }}>📖</span>
            <h3 style={{ fontSize: 20, color: '#0f172a', marginBottom: 8, fontWeight: 700 }}>No articles found</h3>
            <p style={{ color: '#64748b' }}>Try adjusting your filters or search terms. New blueprints are published regularly.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {filteredPosts.map(post => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="blog-card"
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 16, 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
                  textDecoration: 'none'
                }}
              >
                <div style={{ height: 180, overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                  {post.cover_image ? (
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="blog-card-img"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff1717 0%, #b91c1c 100%)', color: '#ffffff', fontWeight: 800, fontSize: 32 }}>
                      AS
                    </div>
                  )}
                  <span style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: 'rgba(255, 23, 23, 0.08)',
                    border: '1px solid rgba(255, 23, 23, 0.15)',
                    color: '#ff1717',
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {post.category || 'Blueprint'}
                  </span>
                </div>
                
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                    <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>&bull;</span>
                    <span>5 min read</span>
                  </div>
                  <h3 style={{ fontSize: 18, color: '#0f172a', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.4, transition: 'color 0.2s' }} className="blog-title">
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.5, margin: '0 0 20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.summary || 'No summary available. Click to open and read full article contents.'}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: '#ff1717', fontSize: 13.5, fontWeight: 700 }}>
                    Read Blueprint
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Global Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { to { transform: rotate(360deg); } }
          
          /* ════ HERO SECTION STYLING ════ */
          .blog-hero {
            position: relative;
            min-height: 480px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 120px 24px 80px;
            overflow: hidden;
          }
          .blog-hero-bg {
            position: absolute;
            inset: 0;
          }
          .blog-hero-bg img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 40%;
          }
          .blog-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(170deg, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.85) 50%, rgba(9,9,11,0.95) 100%);
          }
          .blog-hero-inner {
            position: relative;
            z-index: 2;
            max-width: 780px;
            text-align: center;
          }
          .blog-hero-badge {
            display: inline-block;
            background: rgba(255,23,23,0.12);
            border: 1px solid rgba(255,23,23,0.2);
            color: #ff1717;
            font-size: 0.76rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 6px 20px;
            border-radius: 100px;
            margin-bottom: 24px;
          }
          .blog-hero-title {
            font-size: clamp(2.4rem, 5.5vw, 3.5rem);
            font-weight: 900;
            color: #fff;
            line-height: 1.12;
            letter-spacing: -1.5px;
            margin: 0 0 20px;
          }
          .blog-hero-accent {
            background: linear-gradient(135deg, #ff1717, #ff6b6b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .blog-hero-desc {
            font-size: clamp(0.98rem, 2vw, 1.15rem);
            color: #94a3b8;
            line-height: 1.6;
            max-width: 620px;
            margin: 0 auto;
          }

          .blog-card:hover {
            transform: translateY(-6px);
            border-color: rgba(255, 23, 23, 0.3) !important;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08), 0 0 15px rgba(255, 23, 23, 0.04) !important;
            background: #ffffff !important;
          }
          .blog-card:hover .blog-card-img {
            transform: scale(1.05);
          }
          .blog-card:hover .blog-title {
            color: #ff1717 !important;
          }

          @media (max-width: 768px) {
            .blog-hero { min-height: 380px; padding: 100px 16px 60px; }
            .blog-hero-title { font-size: 2rem; letter-spacing: -1px; }
          }
        `}} />

      </div>
    </div>
  )
}
