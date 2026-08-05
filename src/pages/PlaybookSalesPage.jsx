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
    <div className="cf-root">
      {/* Top Warning Hook */}
      <div className="cf-top-warning">
        <span>⚠️ ATTENTION: Accounting Graduates, NYSC Members, Early-Career Professionals, Freelancers, &amp; Business Owners...</span>
      </div>

      {/* Evergreen Urgent Timer Banner */}
      <div className="cf-timer-banner">
        <span>⚡ SPECIAL ENROLLMENT: Spots filling fast! Price increases in <strong className="cf-timer">{formatTime(timeLeft)}</strong></span>
      </div>

      {/* Main Funnel Container */}
      <div className="cf-container">
        
        {/* Minimal Header with Certificate Dark Style Logo */}
        <header className="cf-header">
          <div style={{ backgroundColor: '#09090b', padding: '10px 20px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <img src="/logo.png" alt="Donzen Accounting Hub" style={{ height: 38, width: 'auto', display: 'block' }} />
          </div>
        </header>

        {/* Hero Section */}
        <section className="cf-hero">
          <h1 className="cf-title">Become the Accountant Employers Trust</h1>
          <p className="cf-subtitle">
            Gain Real Workplace Accounting Experience in Just 30 Days—Without Waiting Years for Someone to Hire You.
          </p>

          {/* Real Embedded YouTube Video Sales Letter */}
          <div className="cf-vsl-wrapper">
            <div className="cf-vsl-player">
              <iframe
                className="cf-vsl-iframe"
                src="https://www.youtube.com/embed/eVCCANkGYac?rel=0&modestbranding=1"
                title="Donzen Accounting Hub Presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* First Block of Content */}
          <div className="cf-sales-intro-block">
            <p>
              Whether you are a fresh graduate, an accounting student, a bookkeeper, an entrepreneur, or an accountant looking to advance your career, the <strong>Donzen Accounting Experience Program</strong> equips you with the practical workplace skills, systems, confidence, and real-world experience employers value most.
            </p>
            <p className="cf-highlight-text">
              You will learn by doing—not just by watching.
            </p>
            <p>
              You will work on realistic business scenarios, use professional accounting tools, complete practical projects, and develop the confidence to perform like an experienced accountant from your very first day on the job.
            </p>
            <p>
              Join hundreds of aspiring accountants, professionals, and business owners who have chosen practical experience over theory. Your journey from knowing accounting to doing accounting starts today.
            </p>
          </div>

          {/* Primary CTA Button */}
          <div style={{ marginTop: 40, marginBottom: 10 }}>
            <button className="cf-cta-btn pulsing-cta" onClick={handleEnroll}>
              👉 ENROLL NOW &amp; GET INSTANT ACCESS 👈
            </button>
            <p className="cf-cta-subtext">Instant Activation &bull; 100% Secured Connection</p>
          </div>
        </section>
      </div>

      {/* Section 2: Core Exposure Gap */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>More Than an Accounting Course.</h2>
            <span className="cf-section-subtitle red">This Is Your Workplace Accounting Experience.</span>
          </div>

          <div className="cf-text-block">
            <p>At Donzen Accounting Hub, we believe something fundamental is missing in accounting education.</p>
            <p>Most people do not struggle because they lack intelligence. They struggle because they lack exposure.</p>
            <p>Universities teach accounting principles. Professional bodies teach accounting standards. Textbooks explain accounting concepts. But very few teach you how accounting actually works inside a business.</p>
            <p className="cf-bold-callout">
              Employers do not hire people simply because they understand debit and credit. They hire people who can confidently execute:
            </p>
          </div>

          <div className="cf-bullets-container">
            <div className="cf-bullets-grid">
              {[
                'Process daily business transactions.',
                'Manage accounts receivable and accounts payable.',
                'Reconcile bank statements accurately.',
                'Prepare financial reports.',
                'Maintain inventory records.',
                'Process payroll correctly.',
                'Use accounting software efficiently.',
                'Solve accounting problems independently.',
                'Support business decision-making with reliable financial information.'
              ].map((bullet, i) => (
                <div key={i} className="cf-bullet-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="cf-bullet-icon"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cf-summary-box">
            <p>This is the difference between learning accounting and practicing accounting. And that difference is exactly why Donzen exists.</p>
          </div>
        </div>
      </section>

      {/* Section 3: First Day Simulation */}
      <section className="cf-section cf-bg-cream">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Imagine Your First Day at Work…</h2>
            <p className="cf-section-subtitle">Imagine walking into your new accounting job with confidence instead of fear.</p>
          </div>

          <div className="cf-text-block">
            <p className="text-center font-semibold" style={{ marginBottom: 20 }}>Your manager asks you to:</p>
            <div className="cf-checkbox-grid">
              {[
                'Prepare the month\'s bank reconciliation.',
                'Record supplier invoices.',
                'Process payroll.',
                'Update inventory records.',
                'Generate financial reports.',
                'Follow up outstanding customer balances.',
                'Organize accounting documents.',
                'Prepare management reports.'
              ].map((item, idx) => (
                <div key={idx} className="cf-checkbox-item">
                  <span className="cf-checked-icon">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <div className="cf-highlight-callout-box">
              <p>
                Instead of feeling overwhelmed... <strong>You smile.</strong>
              </p>
              <p style={{ margin: 0 }}>
                Because you have already done these tasks before. Not in theory. Not on paper. But through structured workplace simulations designed to mirror the responsibilities of a modern accountant. That is the confidence Donzen helps you build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: The Reality */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Why Thousands of Accounting Graduates Still Struggle to Find Good Jobs</h2>
            <span className="cf-section-subtitle red">The Reality Nobody Talks About</span>
          </div>

          <div className="cf-text-block">
            <p>Every year, thousands of talented accounting graduates complete their education with high hopes. They have earned degrees, passed professional exams, completed certifications, and attended seminars.</p>
            <p>Yet many still hear the same frustrating response: <strong>&quot;We are looking for someone with practical experience.&quot;</strong></p>
            <p>It feels unfair. How can you gain experience if every employer expects you to already have it?</p>

            <div className="cf-target-box">
              <h4>This challenge affects:</h4>
              <div className="cf-target-list">
                <span>&bull; Fresh graduates entering the workforce</span>
                <span>&bull; NYSC members preparing for employment</span>
                <span>&bull; Early-career accountants seeking their first role</span>
                <span>&bull; Professionals transitioning into accounting</span>
                <span>&bull; Business owners managing their own finances</span>
                <span>&bull; Freelance bookkeepers looking to serve clients</span>
              </div>
            </div>

            <p style={{ marginTop: 24 }}>
              The issue isn't your potential. It's the gap between academic knowledge and workplace execution. That gap costs talented people opportunities every single day. <strong>Donzen was created to close that gap.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Why Traditional Isn't Enough */}
      <section className="cf-section cf-bg-slate">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Why Traditional Accounting Education Isn't Enough</h2>
            <p className="cf-section-subtitle">Let's be honest. Traditional education teaches concepts, not execution.</p>
          </div>

          <div className="cf-split-table-grid">
            <div className="cf-table-col">
              <h3 className="cf-table-header red-bg">What Traditional Courses Teach:</h3>
              <ul className="cf-table-list">
                <li>Accounting principles</li>
                <li>Financial accounting theory</li>
                <li>Cost accounting methods</li>
                <li>Taxation structures</li>
                <li>Auditing rules</li>
                <li>Economics &amp; business law</li>
                <li>Financial management theory</li>
              </ul>
            </div>
            <div className="cf-table-col">
              <h3 className="cf-table-header green-bg">What Employers Expect You to Know:</h3>
              <ul className="cf-table-list">
                <li>Record daily business transactions</li>
                <li>Manage accounting documents</li>
                <li>Maintain customer ledgers &amp; vendor bills</li>
                <li>Handle petty cash &amp; bank reconciliations</li>
                <li>Organize accounting files</li>
                <li>Generate management &amp; cash flow reports</li>
                <li>Maintain inventory &amp; process payroll</li>
                <li>Work confidently with accounting software</li>
              </ul>
            </div>
          </div>

          <div className="cf-text-block" style={{ marginTop: 30, textAlign: 'center' }}>
            <p>
              Unfortunately, many graduates have never practiced these tasks before entering the workplace. The result? Even brilliant graduates often feel uncertain during interviews and anxious on their first day at work.
            </p>
            <p style={{ fontWeight: 700, color: '#ff1717', fontSize: 17 }}>
              Knowledge alone does not create confidence. Practice does.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Introducing Donzen */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Introducing Donzen Accounting Hub</h2>
            <span className="cf-section-subtitle red">Nigeria's Workplace Accounting Experience Platform</span>
          </div>

          <div className="cf-text-block text-center">
            <p className="cf-lead-text">
              &quot;People do not become great accountants by studying accounting alone. They become great accountants by practicing accounting.&quot;
            </p>
            <p>
              Our mission is to bridge the gap between classroom education and workplace performance by helping aspiring accountants develop the practical knowledge, professional habits, technical competence, and confidence needed to succeed in today's business environment.
            </p>
            <p>
              We are not simply another online training provider. We are building a new standard for workplace accounting education in Africa. One that prepares people for real work—not just examinations.
            </p>
            <div className="cf-purpose-box">
              <p style={{ margin: 0, fontWeight: 700, color: '#ff1717' }}>
                Every lesson, exercise, template, case study, project, and resource has one purpose: To prepare you to perform confidently in a real accounting role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: The Donzen Method */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>The Donzen Method</h2>
            <p className="cf-section-subtitle">Learn Accounting the Way Employers Expect You to Work</p>
          </div>

          <div className="cf-text-block">
            <p>At Donzen, we don't just teach accounting concepts—we help you develop the habits, systems, and practical confidence to perform in a real workplace.</p>
            
            <div style={{ textAlign: 'center' }}>
              <h3 className="cf-block-title">The Workplace Accounting Experience System™</h3>
            </div>
            <p className="cf-block-subtitle text-center">Our signature learning framework ensures every student progresses through six practical stages:</p>
            
            <div className="cf-process-steps">
              {[
                { num: '1', title: 'Learn', desc: 'Build a solid understanding of workplace accounting principles, business processes, and financial workflows.' },
                { num: '2', title: 'Practice', desc: 'Apply what you have learned through guided exercises, business scenarios, and hands-on activities.' },
                { num: '3', title: 'Perform', desc: 'Complete real-world accounting tasks that mirror what accountants do every day.' },
                { num: '4', title: 'Review', desc: 'Receive structured feedback to improve your accuracy, efficiency, and professional judgment.' },
                { num: '5', title: 'Improve', desc: 'Strengthen weak areas, refine your skills, and develop workplace confidence.' },
                { num: '6', title: 'Excel', desc: 'Graduate with practical experience that prepares you to contribute from your first day on the job.' }
              ].map(step => (
                <div key={step.num} className="cf-step-card">
                  <div className="cf-step-num">{step.num}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 className="cf-block-title" style={{ marginTop: 50 }}>The Donzen Employability Framework™</h3>
            </div>
            <p className="cf-block-subtitle text-center">Employers don't hire certificates—they hire capability. We focus on 5 essential areas:</p>

            <div className="cf-framework-list">
              {[
                { title: 'Technical Competence', desc: 'Learn practical bookkeeping, accounting workflows, financial reporting, payroll, inventory management, and reconciliations.' },
                { title: 'Software Proficiency', desc: 'Gain hands-on experience with Microsoft Excel, QuickBooks, Sage, and modern accounting tools.' },
                { title: 'Business Understanding', desc: 'Understand how accounting supports decision-making, cash flow, profitability, and business growth.' },
                { title: 'Professional Confidence', desc: 'Develop the confidence to complete accounting tasks accurately and communicate effectively in the workplace.' },
                { title: 'Workplace Readiness', desc: 'Learn the systems, discipline, and professional mindset expected in modern accounting roles.' }
              ].map((f, i) => (
                <div key={i} className="cf-framework-item">
                  <div className="cf-framework-dot" />
                  <div>
                    <strong>{f.title}:</strong> {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: What You'll Master */}
      <section className="cf-section cf-bg-cream">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>What You'll Master</h2>
            <p className="cf-section-subtitle">Practical responsibilities businesses expect accountants to handle daily.</p>
          </div>

          <div className="cf-mastery-grid">
            {[
              'Recording daily business transactions',
              'Bank reconciliations',
              'Accounts Receivable management',
              'Accounts Payable management',
              'Payroll processing',
              'Inventory management',
              'Fixed asset management',
              'Financial statement preparation',
              'Budgeting and cash flow reporting',
              'Month-end closing procedures',
              'Financial data analysis',
              'Accounting documentation and record keeping'
            ].map((item, i) => (
              <div key={i} className="cf-mastery-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="3" className="cf-check-green"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Section 9: Inside the 30-Day Program */}
          <div className="cf-curriculum-container">
            <h3>Inside the 30-Day Accounting Experience Program</h3>
            <div className="cf-phases-grid">
              {[
                { phase: 'Phase 1', title: 'Build the Foundation', desc: 'Understand workplace accounting processes, documentation, business transactions, and workflows.' },
                { phase: 'Phase 2', title: 'Develop Practical Skills', desc: 'Learn bookkeeping, reconciliations, payroll, inventory, receivables, payables, and reporting.' },
                { phase: 'Phase 3', title: 'Simulate the Workplace', desc: 'Work through realistic business scenarios using professional accounting tools and templates.' },
                { phase: 'Phase 4', title: 'Become Career Ready', desc: 'Complete practical projects, improve your confidence, and prepare for interviews.' }
              ].map(p => (
                <div key={p.phase} className="cf-phase-card">
                  <span className="cf-phase-tag">{p.phase}</span>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Toolkit */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Your Workplace Accounting Toolkit</h2>
            <p className="cf-section-subtitle">Every participant receives access to practical resources designed for immediate workplace application.</p>
          </div>

          <div className="cf-toolkit-wrapper">
            <h4 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#0f172a', fontWeight: 800 }}>Included Resources:</h4>
            <div className="cf-toolkit-list-grid">
              {[
                'Practical accounting templates',
                'Business transaction exercises',
                'Financial reporting formats',
                'Payroll templates',
                'Inventory management tools',
                'Bank reconciliation templates',
                'Accounts receivable tracker',
                'Accounts payable tracker',
                'Excel practice files',
                'Professional checklists',
                'Downloadable learning resources'
              ].map((tool, i) => (
                <div key={i} className="cf-toolkit-item">
                  <span className="cf-toolkit-bullet">✓</span>
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Who This Program Is For */}
      <section className="cf-section cf-bg-gray">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Who This Program Is For</h2>
            <p className="cf-section-subtitle">This program is designed for people who want more than theoretical knowledge.</p>
          </div>

          <div className="cf-target-students-grid">
            {[
              'Accounting graduates seeking practical experience',
              'Students preparing for the workplace',
              'NYSC members building career-ready skills',
              'Job seekers looking to improve employability',
              'Bookkeepers wanting to strengthen practical competence',
              'Business owners managing their own finances',
              'Professionals transitioning into accounting',
              'Freelancers offering bookkeeping services',
              'Anyone determined to become a confident workplace accountant'
            ].map((target, idx) => (
              <div key={idx} className="cf-target-student-card">
                <div className="cf-target-bullet-badge">{idx + 1}</div>
                <p>{target}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 12: Comparison */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Why Donzen Is Different</h2>
            <p className="cf-section-subtitle">Most training programs stop at teaching concepts. Donzen goes further.</p>
          </div>

          <div className="cf-comparison-table-wrapper">
            <table className="cf-comparison-table">
              <thead>
                <tr>
                  <th>Feature / Outcome</th>
                  <th className="th-traditional">Traditional Training</th>
                  <th className="th-donzen">The Donzen Experience</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Core Focus', trad: 'Focuses on theory', donzen: 'Focuses on workplace application' },
                  { feature: 'Outcome Goal', trad: 'Explains accounting', donzen: 'Develops accounting competence' },
                  { feature: 'Methodology', trad: 'Provides lectures', donzen: 'Provides practical experience' },
                  { feature: 'Completion Reward', trad: 'Ends with a certificate', donzen: 'Ends with career-ready confidence' },
                  { feature: 'Software Approach', trad: 'Teaches software features', donzen: 'Teaches business workflows using software' },
                  { feature: 'Ultimate Benefit', trad: 'Builds knowledge', donzen: 'Builds capability' }
                ].map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.feature}</strong></td>
                    <td className="td-traditional">{row.trad}</td>
                    <td className="td-donzen">{row.donzen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 13: Meet Your Instructor */}
      <section className="cf-section cf-bg-cream">
        <div className="cf-container">
          <div className="cf-instructor-container">
            <div className="cf-instructor-photo-box">
              <img src="/donzen-man.jpeg" alt="Samuel Nkemchor Onainor" />
              <span className="cf-instructor-title-badge">Lead Instructor</span>
            </div>
            <div className="cf-instructor-details">
              <span className="cf-instructor-intro-tag">Founder &amp; Principal Consultant</span>
              <h2>Samuel Nkemchor Onainor</h2>
              <p>
                Samuel is an accounting professional, workplace accounting trainer, and business consultant passionate about helping aspiring accountants bridge the gap between academic learning and workplace performance.
              </p>
              <p>
                Having worked across multiple industries and trained accountants, graduates, and business owners, he understands one challenge better than most:
              </p>
              <blockquote className="cf-instructor-quote">
                &quot;People do not struggle because they lack accounting knowledge—they struggle because they lack practical experience.&quot;
              </blockquote>
              <p style={{ margin: 0 }}>
                His mission is simple: To develop confident, competent, and career-ready accounting professionals who can create value from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 14: What You'll Receive & Pricing Offer */}
      <section className="cf-section cf-pricing-offer-section">
        <div className="cf-container">
          <div className="cf-pricing-box">
            <span className="cf-pricing-header-tag">30-DAY SPECIAL ACCESS</span>
            <h2>Start Your Workplace Accounting Journey Today</h2>
            <p className="cf-pricing-subheader">Gain access to the entire practical program, downloadable templates, and real simulations.</p>
            
            <div className="cf-pricing-features">
              <div className="cf-pricing-feat-item">✔ 30-Day Practical Training Program</div>
              <div className="cf-pricing-feat-item">✔ Workplace Accounting Projects</div>
              <div className="cf-pricing-feat-item">✔ Practical Accounting Templates</div>
              <div className="cf-pricing-feat-item">✔ Excel Practice Files</div>
              <div className="cf-pricing-feat-item">✔ QuickBooks &amp; Sage Exposure</div>
              <div className="cf-pricing-feat-item">✔ Downloadable Resources</div>
              <div className="cf-pricing-feat-item">✔ Practical Assignments</div>
              <div className="cf-pricing-feat-item">✔ Certificate of Completion</div>
              <div className="cf-pricing-feat-item">✔ Community Learning &amp; Support</div>
              <div className="cf-pricing-feat-item">✔ Access to Structured Learning</div>
            </div>

            <div className="cf-pricing-grid">
              <span className="cf-old-price-val">{formatPrice(oldPrice)}</span>
              <span className="cf-new-price-val">{formatPrice(price)}</span>
            </div>

            <div style={{ marginTop: 28 }}>
              <button className="cf-enroll-cta pulsing-cta-yellow" onClick={handleEnroll}>
                👉 CLICK HERE TO ENROLL NOW 👈
              </button>
              <p className="cf-enroll-desc-text">Secure checkout and immediate access in your student dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 15: FAQ Accordion */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-section-heading">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="cf-faq-accordion">
            {[
              { q: 'Is this program suitable for beginners?', a: 'Yes. The program starts with the fundamentals and gradually builds practical competence.' },
              { q: 'Do I need workplace experience?', a: 'No. This program is specifically designed for individuals who want to gain practical workplace experience.' },
              { q: 'Will I learn accounting software?', a: 'Yes. You\'ll be introduced to practical tools such as Microsoft Excel, QuickBooks, Sage, and other workplace accounting resources used in modern businesses.' },
              { q: 'Is the program practical?', a: 'Absolutely. The focus is on completing realistic accounting tasks, solving business scenarios, and developing workplace confidence—not simply watching video lessons.' },
              { q: 'Will I receive a certificate?', a: 'Yes. Participants who successfully complete the program will receive a Certificate of Completion.' },
              { q: 'Can I learn while working or studying?', a: 'Yes. The program is structured to provide flexibility while maintaining a clear learning path.' }
            ].map((faq, idx) => (
              <div key={idx} className="cf-faq-block">
                <button className="cf-faq-toggle" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  <span className="cf-faq-arrow-icon" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {openFaq === idx && (
                  <div className="cf-faq-answer-content">
                    <p style={{ margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Closure Section */}
      <section className="cf-closing-cta cf-bg-gray">
        <div className="cf-container">
          <h2>Your Future Starts with Practical Experience</h2>
          <p className="cf-closing-desc">
            The question isn't whether practical accounting skills matter. The question is: When will you decide to build them? Take the first step today.
          </p>
          <button className="cf-cta-btn pulsing-cta" onClick={handleEnroll} style={{ marginTop: 24 }}>
            👉 JOIN THE WORKPLACE EXPERIENCE TODAY 👈
          </button>
        </div>
      </section>

      {/* Minimal Footer with Advertising Disclaimers */}
      <footer className="cf-footer-section">
        <div className="cf-container">
          <p>&copy; {new Date().getFullYear()} Donzen Accounting Hub. All rights reserved.</p>
          <div className="cf-footer-links-row" style={{ marginBottom: 20 }}>
            <span onClick={() => navigate('/terms')}>Terms of Service</span>
            <span>&bull;</span>
            <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span>&bull;</span>
            <span onClick={() => navigate('/refund')}>Refund Policy</span>
          </div>
          
          {/* Ad Networks Disclaimer */}
          <div className="cf-ad-disclaimer">
            <p>
              Disclaimer: This site is not a part of the Google, Facebook, or Meta website. Additionally, this site is NOT endorsed by Google, Facebook, or Meta in any way. GOOGLE is a trademark of GOOGLE, Inc. FACEBOOK and META are trademarks of META Platforms, Inc.
            </p>
            <p>
              We believe in utility and capability, not magic schemes. Our training is designed to help you build real skills to thrive in your career. We do not make any guarantees about your ability to get results or earn money with our ideas, information, tools, or strategies. As required by law, we cannot and do not make any guarantees of your future success.
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .cf-root {
          background: #ffffff;
          color: #1e293b;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          padding-bottom: 60px;
          line-height: 1.6;
        }

        /* Top Yellow Warning */
        .cf-top-warning {
          background: #fef08a;
          color: #854d0e;
          font-size: 13.5px;
          font-weight: 800;
          text-align: center;
          padding: 10px 16px;
          border-bottom: 2px solid #fef3c7;
        }

        /* Timer Banner */
        .cf-timer-banner {
          background: #ff1717;
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          text-align: center;
          padding: 12px 20px;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(255, 23, 23, 0.15);
        }
        .cf-timer {
          font-family: monospace;
          background: rgba(0,0,0,0.25);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 4px;
        }

        /* Main Container */
        .cf-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        /* Header Logo */
        .cf-header {
          display: flex;
          justify-content: center;
          padding: 40px 0 20px;
        }

        /* Hero Layout */
        .cf-hero {
          text-align: center;
          padding: 30px 0 50px;
        }
        .cf-title {
          font-size: clamp(2.2rem, 5.5vw, 3.6rem);
          font-weight: 950;
          line-height: 1.1;
          color: #09090b;
          margin: 0 0 16px;
          letter-spacing: -1.5px;
        }
        .cf-subtitle {
          font-size: clamp(1.15rem, 2.5vw, 1.45rem);
          color: #475569;
          max-width: 820px;
          margin: 0 auto 36px;
          line-height: 1.45;
          font-weight: 700;
          font-style: italic;
        }

        /* VSL Video Player */
        .cf-vsl-wrapper {
          background: #09090b;
          border: 4px solid #09090b;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
          margin-bottom: 40px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        .cf-vsl-player {
          aspect-ratio: 16/9;
          position: relative;
          width: 100%;
          background: #000000;
        }
        .cf-vsl-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 12px;
        }

        /* Text Block copy style */
        .cf-sales-intro-block {
          max-width: 800px;
          margin: 0 auto;
          text-align: left;
          font-size: 16.5px;
          color: #334155;
        }
        .cf-sales-intro-block p {
          margin: 0 0 18px;
        }
        .cf-highlight-text {
          font-size: 21px;
          font-weight: 900;
          color: #ff1717;
          text-align: center;
          margin: 24px 0 !important;
        }

        /* CTA buttons */
        .cf-cta-btn {
          background: #ff1717;
          color: #fff;
          border: none;
          padding: 20px 48px;
          font-size: clamp(14px, 2.5vw, 18px);
          font-weight: 900;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-bottom: 4px solid #b91c1c;
          box-shadow: 0 8px 24px rgba(255, 23, 23, 0.2);
        }
        .cf-cta-btn:hover {
          background: #e01212;
          transform: translateY(-1px);
        }
        .cf-cta-subtext {
          font-size: 12px;
          color: #64748b;
          margin: 10px 0 0;
          font-weight: 600;
        }

        /* Pulsing animations */
        .pulsing-cta {
          animation: cf-pulse 2.2s infinite;
        }
        @keyframes cf-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 23, 23, 0.4); }
          70% { box-shadow: 0 0 0 14px rgba(255, 23, 23, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 23, 23, 0); }
        }

        /* Sections */
        .cf-section {
          padding: 70px 0;
          border-top: 1px dashed #cbd5e1;
        }
        .cf-bg-gray {
          background: #f8fafc;
        }
        .cf-bg-cream {
          background: #fffdf5;
        }
        .cf-bg-slate {
          background: #f1f5f9;
        }
        .cf-section-heading {
          max-width: 800px;
          margin: 0 auto 44px;
          text-align: center;
        }
        .cf-section-heading h2 {
          font-size: clamp(20px, 4.5vw, 29px);
          font-weight: 900;
          color: #09090b;
          margin: 0 0 12px;
          line-height: 1.25;
        }
        .cf-section-subtitle {
          font-size: 14.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #64748b;
        }
        .cf-section-subtitle.red {
          color: #ff1717;
        }

        .cf-text-block {
          max-width: 800px;
          margin: 0 auto;
          font-size: 16px;
          color: #334155;
          text-align: left;
        }
        .cf-text-block p {
          margin: 0 0 18px;
        }
        .cf-bold-callout {
          font-weight: 800;
          font-size: 17px;
          color: #09090b;
          margin-top: 28px !important;
        }

        /* Bullets */
        .cf-bullets-container {
          max-width: 800px;
          margin: 28px auto 30px;
          background: #fff;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .cf-bullets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .cf-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14.5px;
          color: #1e293b;
        }
        .cf-bullet-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .cf-summary-box {
          text-align: center;
          font-size: 17px;
          font-weight: 800;
          color: #09090b;
          max-width: 800px;
          margin: 30px auto 0;
          background: #fef08a;
          padding: 16px 20px;
          border-radius: 8px;
          border: 1px dashed rgba(133, 77, 14, 0.3);
        }

        /* Checkbox Grid */
        .cf-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 14px;
          margin: 24px 0 30px;
        }
        .cf-checkbox-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14.5px;
          color: #334155;
          font-weight: 700;
        }
        .cf-checked-icon {
          color: #ff1717;
          font-weight: 900;
          font-size: 18px;
        }

        /* Highlight Callout Box */
        .cf-highlight-callout-box {
          background: #fffdf2;
          border-left: 4.5px solid #ff1717;
          padding: 22px 26px;
          border-radius: 6px;
          margin-top: 24px;
          border-top: 1px solid #fef3c7;
          border-right: 1px solid #fef3c7;
          border-bottom: 1px solid #fef3c7;
        }
        .cf-highlight-callout-box p {
          font-size: 15.5px;
          color: #334155;
        }

        /* Target list */
        .cf-target-box {
          background: #fff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 28px;
          margin-top: 24px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .cf-target-box h4 {
          margin: 0 0 18px 0;
          font-size: 16.5px;
          font-weight: 800;
          color: #09090b;
        }
        .cf-target-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
          font-size: 14px;
          color: #475569;
          font-weight: 700;
        }

        /* Split Table */
        .cf-split-table-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
          max-width: 800px;
          margin: 30px auto 0;
        }
        .cf-table-col {
          background: #fff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .cf-table-header {
          margin: 0;
          padding: 15px 22px;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
        }
        .cf-table-header.red-bg { background: #ff1717; }
        .cf-table-header.green-bg { background: #10b981; }
        .cf-table-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .cf-table-list li {
          padding: 13px 22px;
          border-bottom: 1.5px solid #e2e8f0;
          font-size: 14px;
          color: #475569;
          font-weight: 600;
        }

        /* Lead Text */
        .cf-lead-text {
          font-size: 21px;
          font-weight: 900;
          font-style: italic;
          color: #09090b;
          line-height: 1.5;
          margin-bottom: 24px;
          border-bottom: 1px dashed #cbd5e1;
          padding-bottom: 20px;
        }
        .cf-purpose-box {
          background: rgba(255, 23, 23, 0.03);
          border: 1.5px solid rgba(255, 23, 23, 0.12);
          border-radius: 8px;
          padding: 22px;
          margin-top: 24px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        /* block settings */
        .cf-block-title {
          font-size: 18.5px;
          font-weight: 900;
          color: #09090b;
          margin: 36px auto 6px;
          border-bottom: 3.5px solid #ff1717;
          display: inline-block;
          padding-bottom: 2px;
        }
        .cf-block-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 24px 0;
          font-weight: 700;
        }

        /* Steps */
        .cf-process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 18px;
          margin-top: 20px;
        }
        .cf-step-card {
          background: #fff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 22px;
          position: relative;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .cf-step-num {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 30px;
          font-weight: 900;
          color: rgba(255, 23, 23, 0.12);
        }
        .cf-step-card h4 {
          font-size: 15px;
          font-weight: 850;
          color: #09090b;
          margin: 0 0 6px;
        }
        .cf-step-card p {
          font-size: 13px;
          color: #475569;
          line-height: 1.45;
          margin: 0;
        }

        /* Framework list */
        .cf-framework-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 800px;
          margin: 20px auto 0;
        }
        .cf-framework-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14.5px;
          color: #334155;
        }
        .cf-framework-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff1717;
          margin-top: 8px;
          flex-shrink: 0;
        }

        /* Mastery Grid */
        .cf-mastery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
          max-width: 800px;
          margin: 20px auto 44px;
        }
        .cf-mastery-card {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #1e293b;
          font-weight: 700;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          padding: 14px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -2px rgba(0,0,0,0.02);
        }

        /* Curriculum Container */
        .cf-curriculum-container {
          background: #fff;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          padding: 32px;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .cf-curriculum-container h3 {
          margin: 0 0 22px 0;
          font-size: 18.5px;
          font-weight: 900;
          color: #09090b;
          border-left: 4.5px solid #ff1717;
          padding-left: 12px;
        }
        .cf-phases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 16px;
        }
        .cf-phase-card {
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          padding: 18px;
        }
        .cf-phase-tag {
          display: inline-block;
          background: #ff1717;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          padding: 2.5px 7px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .cf-phase-card h4 {
          font-size: 14px;
          font-weight: 800;
          color: #09090b;
          margin: 0 0 6px;
        }
        .cf-phase-card p {
          font-size: 12px;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
        }

        /* Toolkit Wrapper */
        .cf-toolkit-wrapper {
          background: #fff;
          border: 2px dashed #ff1717;
          border-radius: 14px;
          padding: 34px;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 10px 25px -10px rgba(255, 23, 23, 0.05);
        }
        .cf-toolkit-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 12px;
          margin-top: 14px;
        }
        .cf-toolkit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #1e293b;
          font-weight: 700;
        }
        .cf-toolkit-bullet {
          color: #ff1717;
          font-weight: 900;
          font-size: 16px;
        }

        /* Targets grid */
        .cf-target-students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }
        .cf-target-student-card {
          background: #fff;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cf-target-bullet-badge {
          width: 30px;
          height: 30px;
          background: rgba(255, 23, 23, 0.08);
          border-radius: 50%;
          color: #ff1717;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 13.5px;
          flex-shrink: 0;
        }
        .cf-target-student-card p {
          margin: 0;
          font-size: 14px;
          color: #334155;
          font-weight: 700;
        }

        /* Comparison table */
        .cf-comparison-table-wrapper {
          max-width: 800px;
          margin: 0 auto;
          overflow-x: auto;
          background: #fff;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .cf-comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .cf-comparison-table th, .cf-comparison-table td {
          padding: 16px 22px;
          text-align: left;
          border-bottom: 1.5px solid #cbd5e1;
        }
        .cf-comparison-table th {
          background: #f8fafc;
          font-weight: 800;
          color: #09090b;
          font-size: 14px;
        }
        .th-traditional, .td-traditional {
          background: rgba(239, 68, 68, 0.02);
          color: #ef4444;
        }
        .th-donzen, .td-donzen {
          background: rgba(16, 185, 129, 0.02);
          color: #10b981;
          font-weight: 800;
        }

        /* Instructor */
        .cf-instructor-container {
          display: flex;
          gap: 40px;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
          text-align: left;
        }
        .cf-instructor-photo-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .cf-instructor-photo-box img {
          width: 180px;
          height: 220px;
          object-fit: cover;
          border-radius: 12px;
          border: 3px solid #cbd5e1;
        }
        .cf-instructor-title-badge {
          background: #ff1717;
          color: #fff;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 4px 12px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .cf-instructor-details {
          font-size: 14.5px;
          color: #475569;
        }
        .cf-instructor-intro-tag {
          font-size: 10.5px;
          font-weight: 800;
          color: #ff1717;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .cf-instructor-details h2 {
          font-size: 26px;
          font-weight: 900;
          color: #09090b;
          margin: 4px 0 12px 0;
        }
        .cf-instructor-quote {
          font-size: 16px;
          font-weight: 800;
          font-style: italic;
          color: #ff1717;
          border-left: 3.5px solid #ff1717;
          padding-left: 14px;
          margin: 18px 0;
          line-height: 1.5;
        }

        /* Pricing Box */
        .cf-pricing-offer-section {
          display: flex;
          justify-content: center;
          background: #fffdf5;
          margin: 0 -24px;
          padding: 80px 24px;
        }
        .cf-pricing-box {
          width: 100%;
          max-width: 580px;
          background: #ffffff;
          border: 3.5px solid #ff1717;
          border-radius: 16px;
          padding: 44px 34px;
          text-align: center;
          box-shadow: 0 20px 45px -15px rgba(255, 23, 23, 0.18);
          margin: 0 auto;
        }
        .cf-pricing-header-tag {
          display: inline-block;
          background: #ff1717;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          padding: 6px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .cf-pricing-box h2 {
          font-size: 24px;
          font-weight: 950;
          color: #09090b;
          margin: 0 0 8px;
        }
        .cf-pricing-subheader {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 24px;
          font-weight: 700;
        }
        .cf-pricing-features {
          text-align: left;
          background: #f8fafc;
          border-radius: 8px;
          padding: 22px;
          margin-bottom: 26px;
          font-size: 13.5px;
          font-weight: 700;
          color: #334155;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .cf-pricing-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 22px;
        }
        .cf-old-price-val {
          font-size: 21px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 800;
        }
        .cf-new-price-val {
          font-size: 42px;
          color: #ff1717;
          font-weight: 950;
        }
        .cf-enroll-cta {
          width: 100%;
          background: #ff1717;
          color: #fff;
          border: none;
          padding: 18px;
          font-size: 17px;
          font-weight: 900;
          border-radius: 8px;
          cursor: pointer;
          border-bottom: 4px solid #b91c1c;
          transition: background 0.2s;
        }
        .cf-enroll-cta:hover {
          background: #e01212;
        }
        .cf-enroll-desc-text {
          font-size: 11.5px;
          color: #64748b;
          margin: 10px 0 0;
          font-weight: 600;
        }
        .pulsing-cta-yellow {
          animation: cf-pulse-yellow 2.2s infinite;
        }
        @keyframes cf-pulse-yellow {
          0% { box-shadow: 0 0 0 0 rgba(255, 23, 23, 0.4); }
          70% { box-shadow: 0 0 0 14px rgba(255, 23, 23, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 23, 23, 0); }
        }

        /* FAQ accordion */
        .cf-faq-accordion {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cf-faq-block {
          background: #fff;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.01);
        }
        .cf-faq-toggle {
          width: 100%;
          background: none;
          border: none;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          color: #09090b;
          font-size: 15px;
          font-weight: 800;
          text-align: left;
        }
        .cf-faq-arrow-icon {
          font-size: 10px;
          color: #94a3b8;
          transition: transform 0.2s;
        }
        .cf-faq-answer-content {
          padding: 0 24px 20px;
          border-top: 1px solid #f1f5f9;
          font-size: 14px;
          color: #475569;
          line-height: 1.55;
        }

        /* Closing CTA */
        .cf-closing-cta {
          text-align: center;
          padding: 80px 20px;
        }
        .cf-closing-cta h2 {
          font-size: 26px;
          font-weight: 950;
          color: #09090b;
          margin: 0 0 12px;
        }
        .cf-closing-desc {
          font-size: 15.5px;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          font-weight: 600;
        }

        /* Footer & Disclaimers */
        .cf-footer-section {
          border-top: 1px solid #cbd5e1;
          padding: 44px 0 30px;
          text-align: center;
          font-size: 12.5px;
          color: #64748b;
          font-weight: 600;
          background: #f8fafc;
          margin: 0 -24px;
          padding-left: 24px;
          padding-right: 24px;
        }
        .cf-footer-section p {
          margin: 0 0 8px;
        }
        .cf-footer-links-row {
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        .cf-footer-links-row span {
          cursor: pointer;
          transition: color 0.15s;
        }
        .cf-footer-links-row span:hover {
          color: #ff1717;
        }
        .cf-ad-disclaimer {
          max-width: 800px;
          margin: 30px auto 0;
          border-top: 1px solid #e2e8f0;
          padding-top: 24px;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }
        .cf-ad-disclaimer p {
          margin-bottom: 12px;
        }

        /* Animations */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive changes */
        @media (max-width: 768px) {
          .cf-instructor-container {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
          .cf-instructor-photo-box img {
            width: 150px;
            height: 180px;
          }
          .cf-pricing-features {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </div>
  )
}
