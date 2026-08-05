import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCurrency } from '../context/CurrencyContext'

export default function PlaybookSalesPage() {
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 14 * 60) // 2h 14m countdown
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 2 * 60 * 60))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Load product
  useEffect(() => {
    async function loadProduct() {
      try {
        let { data } = await supabase
          .from('products')
          .select('*')
          .eq('slug', 'accounting-experience-programme')
          .maybeSingle()

        if (!data) {
          const res = await supabase
            .from('products')
            .select('*')
            .eq('type', 'course')
            .maybeSingle()
          data = res.data
        }
        if (data) {
          setProduct(data)
        }
      } catch (err) {
        console.error('Error loading product:', err)
      }
    }
    loadProduct()
  }, [])

  const handleEnroll = () => {
    const target = product ? `/checkout?product=${product.id}` : '/checkout'
    navigate(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const price = product?.price || 45000
  const oldPrice = product?.old_price || 120000

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <div className="vsl-root">
      {/* Urgency Bar */}
      <div className="vsl-urgency-bar">
        <span className="vsl-alert-icon">⚡</span>
        <span>SPECIAL ENROLLMENT: Spots filling fast! Price increases in <strong className="vsl-timer">{formatTime(timeLeft)}</strong></span>
      </div>

      {/* Main Container */}
      <div className="vsl-main-container">
        
        {/* Header Logo */}
        <header className="vsl-header">
          <img src="/logo.png" alt="Donzen Accounting Hub" className="vsl-logo" />
        </header>

        {/* Hero Section */}
        <section className="vsl-hero">
          <div className="vsl-badge">FLAGSHIP PROGRAMME</div>
          <h1 className="vsl-title">Become the Accountant Employers Trust</h1>
          <p className="vsl-subtitle">
            Gain Real Workplace Accounting Experience in Just 30 Days—Without Waiting Years for Someone to Hire You.
          </p>

          {/* VSL Video Player Mock */}
          <div className="vsl-video-wrapper">
            <div className="vsl-video-player">
              {!isVideoPlaying ? (
                <div className="vsl-video-poster" onClick={() => setIsVideoPlaying(true)}>
                  <div className="vsl-video-glow" />
                  <img src="/images/about-hero.jpg" alt="Workplace simulation course preview" className="vsl-poster-img" />
                  <div className="vsl-poster-overlay">
                    <div className="vsl-play-btn">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                    <span className="vsl-play-text">WATCH THE EXPLAINER VIDEO (5 MINS)</span>
                  </div>
                </div>
              ) : (
                <div className="vsl-video-playing">
                  <div className="vsl-video-loader">
                    <div className="vsl-spinner" />
                    <span>Loading Video Stream...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="vsl-video-bar">
              <span className="vsl-dot green" />
              <span>Verified Programme Presentation &bull; Interactive Overview</span>
            </div>
          </div>

          <p className="vsl-hero-description">
            Whether you are a fresh graduate, an accounting student, a bookkeeper, an entrepreneur, or an accountant looking to advance your career, the Donzen Accounting Experience Program equips you with the practical workplace skills, systems, confidence, and real-world experience employers value most.
          </p>
          <p className="vsl-hero-emphasis">
            You will learn by doing—not just by watching. You will work on realistic business scenarios, use professional accounting tools, complete practical projects, and develop the confidence to perform like an experienced accountant from your very first day on the job.
          </p>

          <button className="vsl-cta-button" onClick={handleEnroll}>
            ENROLL IN THE PROGRAMME NOW
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </section>

        {/* Section 2: Core Gap */}
        <section className="vsl-section">
          <div className="vsl-section-heading">
            <h2>More Than an Accounting Course.</h2>
            <span className="vsl-section-subtitle red">This Is Your Workplace Accounting Experience</span>
          </div>

          <div className="vsl-cards-grid">
            <div className="vsl-card">
              <h3>Academic vs. Practical Gap</h3>
              <p>At Donzen Accounting Hub, we believe something fundamental is missing in accounting education. Most people do not struggle because they lack intelligence—they struggle because they lack exposure.</p>
            </div>
            <div className="vsl-card">
              <h3>What Schools Do Not Teach</h3>
              <p>Universities teach accounting principles. Professional bodies teach accounting standards. Textbooks explain accounting concepts. But very few teach you how accounting actually works inside a business.</p>
            </div>
            <div className="vsl-card">
              <h3>What Employers Pay For</h3>
              <p>Employers do not hire people simply because they understand debit and credit. They hire people who can confidently run business workflows, process payroll, file taxes, and reconcile statements.</p>
            </div>
          </div>

          <div className="vsl-capabilities-container">
            <h4>Employers hire people who can confidently:</h4>
            <div className="vsl-bullets-grid">
              {[
                'Process daily business transactions',
                'Manage accounts receivable and accounts payable',
                'Reconcile bank statements accurately',
                'Prepare financial reports',
                'Maintain inventory records',
                'Process payroll correctly',
                'Use accounting software efficiently',
                'Solve accounting problems independently',
                'Support business decision-making with reliable financial information'
              ].map((bullet, i) => (
                <div key={i} className="vsl-bullet-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="vsl-bullet-icon"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: First Day */}
        <section className="vsl-section vsl-section-dark">
          <div className="vsl-section-heading">
            <h2>Imagine Your First Day at Work…</h2>
            <p className="vsl-section-intro">Your manager hands you the accounts ledger and requests specific updates. Instead of feeling overwhelmed...</p>
          </div>

          <div className="vsl-split-view">
            <div className="vsl-split-card red-border">
              <h3>Without Donzen</h3>
              <p>You feel a wave of anxiety. You know the theoretical debit/credit rules, but you have never opened a live QuickBooks portal, recorded supplier invoices, processed payroll, or reconciled real bank transactions. You feel stuck and pray you do not make a mistake.</p>
            </div>
            <div className="vsl-split-card green-border">
              <h3>With Donzen</h3>
              <p>You smile. You open the workspace with confidence. You have already completed these exact tasks dozens of times before inside our simulations. You know which files to organize, how to run reconciliations, and how to format reports. You are ready from hour one.</p>
            </div>
          </div>
        </section>

        {/* Section 4: The Struggle */}
        <section className="vsl-section">
          <div className="vsl-section-heading font-large">
            <h2>Why Thousands of Accounting Graduates Still Struggle</h2>
            <span className="vsl-section-subtitle">The Reality Nobody Talks About</span>
          </div>

          <div className="vsl-text-block">
            <p>Every year, thousands of talented accounting graduates complete their education with high hopes. They have earned degrees, passed exams, completed certifications, and watched hours of videos.</p>
            <p>Yet many still hear the same frustrating response: <strong>&quot;We are looking for someone with practical experience.&quot;</strong></p>
            <p>It feels unfair. How can you gain experience if every employer expects you to already have it? This challenge affects fresh graduates, NYSC members, early-career accountants, and business owners managing their own finances.</p>
            <p>Donzen was created to break this cycle and close the gap between classroom knowledge and workplace execution.</p>
          </div>
        </section>

        {/* Section 5: The Donzen Method */}
        <section className="vsl-section vsl-section-dark">
          <div className="vsl-section-heading">
            <h2>The Donzen Method</h2>
            <span className="vsl-section-subtitle red">Learn Accounting the Way Employers Expect You to Work</span>
          </div>

          <h3 className="vsl-sub-heading">The Workplace Accounting Experience System™</h3>
          <div className="vsl-process-steps">
            {[
              { num: '1', title: 'Learn', desc: 'Build a solid understanding of workplace accounting principles, business processes, and financial workflows.' },
              { num: '2', title: 'Practice', desc: 'Apply what you have learned through guided exercises, business scenarios, and hands-on activities.' },
              { num: '3', title: 'Perform', desc: 'Complete real-world accounting tasks that mirror what accountants do every day.' },
              { num: '4', title: 'Review', desc: 'Receive structured feedback to improve your accuracy, efficiency, and professional judgment.' },
              { num: '5', title: 'Improve', desc: 'Strengthen weak areas, refine your skills, and develop workplace confidence.' },
              { num: '6', title: 'Excel', desc: 'Graduate with practical experience that prepares you to contribute from your first day on the job.' }
            ].map(step => (
              <div key={step.num} className="vsl-step-card">
                <div className="vsl-step-number">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="vsl-sub-heading" style={{ marginTop: 40 }}>The Donzen Employability Framework™</h3>
          <div className="vsl-framework-grid">
            {[
              { title: 'Technical Competence', desc: 'Learn practical bookkeeping, accounting workflows, financial reporting, payroll, inventory management, and reconciliations.' },
              { title: 'Software Proficiency', desc: 'Gain hands-on experience with Microsoft Excel, QuickBooks, Sage, and modern accounting tools.' },
              { title: 'Business Understanding', desc: 'Understand how accounting supports decision-making, cash flow, profitability, and business growth.' },
              { title: 'Professional Confidence', desc: 'Develop the confidence to complete accounting tasks accurately and communicate effectively in the workplace.' },
              { title: 'Workplace Readiness', desc: 'Learn the systems, discipline, and professional mindset expected in modern accounting roles.' }
            ].map((f, idx) => (
              <div key={idx} className="vsl-framework-card">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Mastery & Toolkit */}
        <section className="vsl-section">
          <div className="vsl-section-heading">
            <h2>What You Will Master</h2>
            <p>Our curriculum focuses entirely on tasks that companies expect their finance teams to handle on a daily basis.</p>
          </div>

          <div className="vsl-mastery-list">
            {[
              'Recording daily business transactions',
              'Bank reconciliations & statement matching',
              'Accounts Receivable ledger management',
              'Accounts Payable bill tracking',
              'Payroll processing & payslip creation',
              'Inventory management & stock valuation',
              'Fixed asset register maintenance',
              'Financial statement preparation (P&L, Balance Sheets)',
              'Budgeting and cash flow tracking',
              'Month-end closing procedures',
              'Financial data analysis & management reporting',
              'Accounting documentation and record keeping'
            ].map((item, idx) => (
              <div key={idx} className="vsl-mastery-item">
                <span className="vsl-mastery-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="vsl-toolkit-box">
            <h3>Your Workplace Accounting Toolkit Includes:</h3>
            <p>Every participant receives access to these professional formats and files:</p>
            <div className="vsl-toolkit-grid">
              <span>✓ Practical accounting templates</span>
              <span>✓ Business transaction exercises</span>
              <span>✓ Financial reporting formats</span>
              <span>✓ Payroll templates</span>
              <span>✓ Inventory management tools</span>
              <span>✓ Bank reconciliation templates</span>
              <span>✓ Accounts receivable tracker</span>
              <span>✓ Accounts payable tracker</span>
              <span>✓ Excel practice files</span>
              <span>✓ Professional checklists</span>
            </div>
          </div>
        </section>

        {/* Instructor Section */}
        <section className="vsl-section vsl-section-dark">
          <div className="vsl-instructor-card">
            <div className="vsl-instructor-avatar-col">
              <img src="/founder_portrait.jpg" alt="Samuel Nkemchor Onainor" className="vsl-instructor-img" />
              <div className="vsl-instructor-badge">LEAD INSTRUCTOR</div>
            </div>
            <div className="vsl-instructor-info-col">
              <span className="vsl-instructor-overline">Meet Your Instructor</span>
              <h2>Samuel Nkemchor Onainor</h2>
              <p className="vsl-instructor-title">Founder &amp; Principal Consultant, Donzen Accounting Hub</p>
              <p className="vsl-instructor-bio">
                Samuel is an accounting professional, workplace accounting trainer, and business consultant passionate about helping aspiring accountants bridge the gap between academic learning and workplace performance.
              </p>
              <p className="vsl-instructor-bio">
                Having worked across multiple industries and trained accountants, graduates, and business owners, he understands one challenge better than most: People do not struggle because they lack accounting knowledge—they struggle because they lack practical experience. That insight led to the creation of Donzen Accounting Hub.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing & Value Section */}
        <section className="vsl-pricing-section">
          <div className="vsl-pricing-card">
            <span className="vsl-pricing-badge">BOOTCAMP SPECIAL OFFER</span>
            <h2>Complete 30-Day Practical Accounting Experience</h2>
            <div className="vsl-pricing-prices">
              <span className="vsl-old-price">{formatPrice(oldPrice)}</span>
              <span className="vsl-current-price">{formatPrice(price)}</span>
            </div>
            <p className="vsl-pricing-desc">
              Get immediate access to the 30-Day Practical Training Program, all assignments, files, downloadable checklists, live templates, certificate of completion, and community learning support.
            </p>
            <button className="vsl-pricing-cta" onClick={handleEnroll}>
              ENROLL &amp; START LEARNING NOW
            </button>
            <p className="vsl-pricing-guarantee">✓ Secured connection &bull; Instant activation in student dashboard</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="vsl-section">
          <div className="vsl-section-heading">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="vsl-faq-list">
            {[
              { q: 'Is this program suitable for beginners?', a: 'Yes. The program starts with the fundamental processes and gradually builds up to practical daily workplace accounting scenarios.' },
              { q: 'Do I need prior workplace experience?', a: 'No. This program is specifically designed for individuals who want to gain practical experience before applying for their first job.' },
              { q: 'Will I learn accounting software?', a: 'Yes. You will gain hands-on experience and workflows in Microsoft Excel, QuickBooks, Sage, and other workplace accounting resources.' },
              { q: 'Is the program practical?', a: 'Absolutely. The focus is entirely on completing realistic business simulations, projects, reconciliations, and reporting tasks rather than watching video theory.' },
              { q: 'Will I receive a certificate?', a: 'Yes. Participants who successfully complete all assignments and case reviews will receive a Certificate of Completion.' },
              { q: 'Can I learn while working or studying?', a: 'Yes. The program is structured to provide flexibility while maintaining a clear, daily progression path.' }
            ].map((faq, idx) => (
              <div key={idx} className="vsl-faq-item">
                <button className="vsl-faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  <span className="vsl-faq-arrow" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {openFaq === idx && (
                  <div className="vsl-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer Prompts */}
        <section className="vsl-bottom-prompt">
          <h2>Take the First Step Today</h2>
          <p>Your career doesn't change because you wish for more opportunities. It changes when you prepare for them.</p>
          <button className="vsl-cta-button" onClick={handleEnroll} style={{ marginTop: 24 }}>
            JOIN THE DONZEN WORKPLACE EXPERIENCE NOW
          </button>
        </section>

        <footer className="vsl-footer">
          <p>&copy; {new Date().getFullYear()} Donzen Accounting Hub. All rights reserved.</p>
          <div className="vsl-footer-links">
            <span onClick={() => navigate('/terms')}>Terms of Service</span>
            <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span onClick={() => navigate('/refund')}>Refund Policy</span>
          </div>
        </footer>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .vsl-root {
          background: #09090b;
          color: #f4f4f5;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          padding-bottom: 60px;
        }

        /* Urgency Bar */
        .vsl-urgency-bar {
          background: #ff1717;
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          text-align: center;
          padding: 12px 20px;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(255, 23, 23, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .vsl-alert-icon {
          animation: pulse 1s infinite alternate;
        }
        .vsl-timer {
          font-family: monospace;
          background: rgba(0,0,0,0.25);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 4px;
        }

        /* Container */
        .vsl-main-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header */
        .vsl-header {
          display: flex;
          justify-content: center;
          padding: 40px 0 20px;
        }
        .vsl-logo {
          height: 48px;
          width: auto;
        }

        /* Hero */
        .vsl-hero {
          text-align: center;
          padding: 40px 0 60px;
        }
        .vsl-badge {
          display: inline-block;
          background: rgba(255, 23, 23, 0.1);
          border: 1px solid rgba(255, 23, 23, 0.3);
          color: #ff1717;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 24px;
        }
        .vsl-title {
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 900;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -1px;
        }
        .vsl-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: #a1a1aa;
          max-width: 720px;
          margin: 0 auto 40px;
          line-height: 1.4;
        }

        /* Video Mockup */
        .vsl-video-wrapper {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          margin-bottom: 40px;
        }
        .vsl-video-player {
          aspect-ratio: 16/9;
          position: relative;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vsl-video-poster {
          position: absolute;
          inset: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vsl-poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
        }
        .vsl-poster-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 90%);
          gap: 16px;
        }
        .vsl-play-btn {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #ff1717;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px rgba(255, 23, 23, 0.4);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(1);
        }
        .vsl-video-poster:hover .vsl-play-btn {
          transform: scale(1.1);
          background: #e01212;
          box-shadow: 0 12px 35px rgba(255, 23, 23, 0.6);
        }
        .vsl-play-text {
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          background: rgba(0,0,0,0.6);
          padding: 8px 16px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }
        .vsl-video-playing {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #09090b;
        }
        .vsl-video-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          color: #a1a1aa;
          font-size: 13px;
        }
        .vsl-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #ff1717;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .vsl-video-bar {
          background: #09090b;
          border-top: 1px solid #27272a;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12.5px;
          color: #71717a;
        }
        .vsl-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .vsl-dot.green {
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        /* Descriptions */
        .vsl-hero-description {
          font-size: 17px;
          color: #e4e4e7;
          line-height: 1.6;
          max-width: 780px;
          margin: 0 auto 20px;
        }
        .vsl-hero-emphasis {
          font-size: 16px;
          color: #a1a1aa;
          line-height: 1.6;
          max-width: 780px;
          margin: 0 auto 36px;
        }

        /* Buttons */
        .vsl-cta-button {
          background: #ff1717;
          color: #fff;
          border: none;
          padding: 18px 40px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 1px;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(255, 23, 23, 0.35);
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: pulse-button 2.5s infinite;
        }
        .vsl-cta-button:hover {
          background: #e01212;
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(255, 23, 23, 0.5);
        }

        /* Section Layouts */
        .vsl-section {
          padding: 60px 0;
          border-top: 1px solid #18181b;
        }
        .vsl-section-dark {
          background: #0c0c0e;
          margin: 0 -20px;
          padding: 60px 20px;
          border-radius: 12px;
        }
        .vsl-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }
        .vsl-section-heading h2 {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 10px;
        }
        .vsl-section-subtitle {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #a1a1aa;
        }
        .vsl-section-subtitle.red {
          color: #ff1717;
        }

        /* Cards Grid */
        .vsl-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .vsl-card {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 24px;
        }
        .vsl-card h3 {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 12px;
          border-left: 3px solid #ff1717;
          padding-left: 10px;
        }
        .vsl-card p {
          font-size: 13.5px;
          color: #a1a1aa;
          line-height: 1.5;
          margin: 0;
        }

        /* Capabilities List */
        .vsl-capabilities-container {
          background: rgba(255, 23, 23, 0.03);
          border: 1px solid rgba(255, 23, 23, 0.15);
          border-radius: 12px;
          padding: 30px;
        }
        .vsl-capabilities-container h4 {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 20px;
        }
        .vsl-bullets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
        .vsl-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #e4e4e7;
        }
        .vsl-bullet-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Split View */
        .vsl-split-view {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .vsl-split-card {
          background: #18181b;
          border-radius: 12px;
          padding: 30px;
          border: 1.5px solid transparent;
        }
        .vsl-split-card.red-border {
          border-color: rgba(239, 68, 68, 0.2);
          background: linear-gradient(to bottom, rgba(239, 68, 68, 0.02), transparent);
        }
        .vsl-split-card.green-border {
          border-color: rgba(16, 185, 129, 0.2);
          background: linear-gradient(to bottom, rgba(16, 185, 129, 0.02), transparent);
        }
        .vsl-split-card h3 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 14px;
        }
        .vsl-split-card.red-border h3 { color: #ef4444; }
        .vsl-split-card.green-border h3 { color: #10b981; }
        .vsl-split-card p {
          font-size: 13.5px;
          color: #a1a1aa;
          line-height: 1.6;
          margin: 0;
        }

        /* Text Block */
        .vsl-text-block {
          max-width: 780px;
          margin: 0 auto;
          font-size: 15px;
          color: #d4d4d8;
          line-height: 1.6;
        }
        .vsl-text-block p {
          margin: 0 0 16px;
        }

        /* Process Steps */
        .vsl-process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }
        .vsl-step-card {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 24px;
          position: relative;
        }
        .vsl-step-number {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 32px;
          font-weight: 900;
          color: rgba(255, 23, 23, 0.15);
        }
        .vsl-step-card h4 {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px;
        }
        .vsl-step-card p {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.5;
          margin: 0;
        }

        /* Framework */
        .vsl-framework-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .vsl-framework-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid #27272a;
          border-radius: 10px;
          padding: 20px;
        }
        .vsl-framework-card h4 {
          font-size: 14.5px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
        }
        .vsl-framework-card p {
          font-size: 12.5px;
          color: #71717a;
          line-height: 1.4;
          margin: 0;
        }
        .vsl-sub-heading {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin: 30px 0 0;
          text-align: center;
        }

        /* Mastery List */
        .vsl-mastery-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
          margin-bottom: 40px;
        }
        .vsl-mastery-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #e4e4e7;
        }
        .vsl-mastery-dot {
          width: 6px;
          height: 6px;
          background: #ff1717;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Toolkit Box */
        .vsl-toolkit-box {
          background: linear-gradient(135deg, #18181b 0%, #101012 100%);
          border: 1px solid #27272a;
          border-radius: 14px;
          padding: 32px;
        }
        .vsl-toolkit-box h3 {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px;
        }
        .vsl-toolkit-box p {
          font-size: 13.5px;
          color: #71717a;
          margin: 0 0 20px;
        }
        .vsl-toolkit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          font-size: 13.5px;
          color: #e4e4e7;
          font-weight: 600;
        }

        /* Instructor */
        .vsl-instructor-card {
          display: flex;
          flex-direction: row;
          gap: 40px;
          align-items: center;
        }
        .vsl-instructor-avatar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .vsl-instructor-img {
          width: 180px;
          height: 220px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #27272a;
        }
        .vsl-instructor-badge {
          background: #ff1717;
          color: #fff;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .vsl-instructor-info-col {
          display: flex;
          flex-direction: column;
        }
        .vsl-instructor-overline {
          font-size: 11px;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .vsl-instructor-info-col h2 {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 4px;
        }
        .vsl-instructor-title {
          font-size: 13.5px;
          color: #a1a1aa;
          margin: 0 0 16px;
          font-weight: 600;
        }
        .vsl-instructor-bio {
          font-size: 13.5px;
          color: #71717a;
          line-height: 1.5;
          margin: 0 0 10px;
        }

        /* Pricing Section */
        .vsl-pricing-section {
          padding: 80px 0;
          display: flex;
          justify-content: center;
        }
        .vsl-pricing-card {
          width: 100%;
          max-width: 500px;
          background: linear-gradient(135deg, #18181b 0%, #09090b 100%);
          border: 2.5px solid #ff1717;
          border-radius: 18px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 15px 40px rgba(255, 23, 23, 0.1);
        }
        .vsl-pricing-badge {
          display: inline-block;
          background: #ff1717;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          padding: 6px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .vsl-pricing-card h2 {
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 16px;
          line-height: 1.3;
        }
        .vsl-pricing-prices {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .vsl-old-price {
          font-size: 20px;
          color: #71717a;
          text-decoration: line-through;
          font-weight: 600;
        }
        .vsl-current-price {
          font-size: 38px;
          color: #fff;
          font-weight: 900;
        }
        .vsl-pricing-desc {
          font-size: 13.5px;
          color: #a1a1aa;
          line-height: 1.5;
          margin: 0 0 30px;
        }
        .vsl-pricing-cta {
          width: 100%;
          background: #ff1717;
          color: #fff;
          border: none;
          padding: 16px;
          font-size: 14.5px;
          font-weight: 800;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .vsl-pricing-cta:hover {
          background: #e01212;
        }
        .vsl-pricing-guarantee {
          font-size: 11.5px;
          color: #71717a;
          margin: 12px 0 0;
        }

        /* FAQ */
        .vsl-faq-list {
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .vsl-faq-item {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 10px;
          overflow: hidden;
        }
        .vsl-faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          color: #fff;
          font-size: 14.5px;
          font-weight: 700;
          text-align: left;
        }
        .vsl-faq-arrow {
          font-size: 10px;
          color: #71717a;
          transition: transform 0.2s;
        }
        .vsl-faq-answer {
          padding: 0 24px 20px;
          border-top: 1px solid #27272a;
          font-size: 13.5px;
          color: #a1a1aa;
          line-height: 1.5;
        }

        /* Bottom Prompts */
        .vsl-bottom-prompt {
          text-align: center;
          padding: 80px 0;
          border-top: 1px solid #18181b;
        }
        .vsl-bottom-prompt h2 {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 10px;
        }
        .vsl-bottom-prompt p {
          font-size: 15px;
          color: #a1a1aa;
          margin: 0;
        }

        /* Footer */
        .vsl-footer {
          border-top: 1px solid #18181b;
          padding: 40px 0 20px;
          text-align: center;
          font-size: 12px;
          color: #71717a;
        }
        .vsl-footer p {
          margin: 0 0 10px;
        }
        .vsl-footer-links {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .vsl-footer-links span {
          cursor: pointer;
          transition: color 0.15s;
        }
        .vsl-footer-links span:hover {
          color: #fff;
        }

        /* Animations */
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-button {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 23, 23, 0.4);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(255, 23, 23, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 23, 23, 0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .vsl-instructor-card {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
          .vsl-instructor-info-col h2 {
            font-size: 20px;
          }
        }
      ` }} />
    </div>
  )
}
