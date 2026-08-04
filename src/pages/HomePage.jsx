import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

// --- Hooks ---
function useReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isVisible];
}

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useReveal();
  return (
    <div 
      ref={ref} 
      className={`hp-reveal-base ${isVisible ? 'hp-reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Counter = ({ target, prefix = '', suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useReveal();

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime = null;
    let animationFrameId = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, target, duration]);

  return <span ref={ref} className="hp-counter">{prefix}{count}{suffix}</span>;
};

// --- Custom SVGs & Icons (Consistent design, no emojis, no stock photos) ---
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const IconArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const IconBookkeeping = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
);
const IconTax = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const IconFileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const IconGraduationCap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
);
const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ff1717" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const IconChevronDown = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const IconLaptop = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line><line x1="12" y1="17" x2="12" y2="20"></line></svg>
);
const IconLineChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
);
const IconPlay = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

// --- Components ---
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="hp-faq-item">
      <button className="hp-faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <IconChevronDown className={`hp-faq-icon ${isOpen ? 'hp-faq-icon-open' : ''}`} />
      </button>
      <div className={`hp-faq-answer ${isOpen ? 'hp-faq-answer-open' : ''}`}>
        <div className="hp-faq-answer-inner">{answer}</div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { formatPrice } = useCurrency();
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  
  // Lead Generation form state
  const [leadEmail, setLeadEmail] = useState('');
  const [leadResource, setLeadResource] = useState('Free Excel Accounting Template');
  const [leadSuccess, setLeadSuccess] = useState(false);

  const heroImages = [
    '/slideshow_1.jpg',
    '/slideshow_2.jpg',
    '/slideshow_3.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;

    // Save lead to local storage (or hit Supabase)
    const existingLeads = JSON.parse(localStorage.getItem('donzen_leads') || '[]');
    existingLeads.push({ email: leadEmail, resource: leadResource, timestamp: new Date().toISOString() });
    localStorage.setItem('donzen_leads', JSON.stringify(existingLeads));
    
    setLeadSuccess(true);
    setLeadEmail('');
  };

  return (
    <div className="hp-wrapper">
      {/* 1. HERO SECTION (Become Job-Ready & Center Aligned) */}
      <section className="hp-hero">
        <div className="hp-hero-bg">
          {heroImages.map((src, idx) => (
            <img 
              key={src} 
              src={src} 
              alt="Donzen Accounting Workplace Slideshow" 
              className={`hp-hero-img ${idx === currentHeroIdx ? 'active' : ''}`} 
              onError={(e) => {
                e.target.src = `/slideshow_${idx + 1}.png`;
              }}
            />
          ))}
          <div className="hp-hero-overlay"></div>
        </div>
        
        <div className="hp-container hp-hero-content">
          <Reveal delay={150}>
            <h1 className="hp-hero-title">
              Become Job-Ready. <br />
              <span className="hp-text-accent">Build Real Workplace Accounting Skills</span> That Employers Need.
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="hp-hero-subtitle">
              Learn bookkeeping, financial reporting, inventory accounting, Excel, Sage, QuickBooks and cloud accounting by working on real business scenarios, not classroom theory.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="hp-hero-ctas">
              <a href="#pathways" className="hp-btn hp-btn-primary hp-btn-large">
                Start Learning
                <IconArrowRight />
              </a>
              <button onClick={() => setShowDemoModal(true)} className="hp-btn hp-btn-secondary hp-btn-large">
                <IconPlay />
                Watch Free Demo
              </button>
            </div>
          </Reveal>
        </div>

        {/* Beautiful curve bottom divider shape */}
        <div className="hp-section-divider">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* 2. STATS BAR (Overlapping modern floating card layout) */}
      <div className="hp-stats-bar-wrapper">
        <div className="hp-container">
          <section className="hp-stats-bar">
            <div className="hp-stats-grid">
              <div className="hp-stat-item">
                <Counter target={500} suffix="+" />
                <span className="hp-stat-label">Professionals Trained</span>
              </div>
              <div className="hp-stat-item">
                <Counter target={50} suffix="+" />
                <span className="hp-stat-label">Industries Served</span>
              </div>
              <div className="hp-stat-item">
                <Counter target={10} suffix="+" />
                <span className="hp-stat-label">Years Experience</span>
              </div>
              <div className="hp-stat-item">
                <Counter target={95} suffix="%" />
                <span className="hp-stat-label">Student Satisfaction</span>
              </div>
              <div className="hp-stat-item font-highlight">
                <Counter target={1500} suffix="+" />
                <span className="hp-stat-label">Hours of Practical Training</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 3. THREE PATHWAYS SECTION (Coursera/HubSpot Academy select style) */}
      <section id="pathways" className="hp-section hp-bg-light hp-curved-section">
        <div className="hp-container">
          <div className="hp-section-header">
            <Reveal>
              <h2 className="hp-section-title">Designed for Your Core Accounting Journey</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="hp-section-desc">Donzen operates at the intersection of business, training, and tools. Select the pathway that matches your goals.</p>
            </Reveal>
          </div>
          
          <div className="hp-pathways-grid">
            {/* Pathway 1: For Businesses */}
            <Reveal className="hp-pathway-card-wrapper" delay={100}>
              <div className="hp-pathway-card">
                <div className="hp-pathway-badge">BUSINESS SERVICES</div>
                <div className="hp-pathway-icon-box">
                  <IconBriefcase />
                </div>
                <h3>For Businesses</h3>
                <p className="hp-pathway-intro">Get clear financial visibility and professional systems implemented by expert virtual accountants.</p>
                <ul className="hp-pathway-list">
                  <li><IconCheck /> Complete Virtual Bookkeeping</li>
                  <li><IconCheck /> Automated Payroll &amp; Paylips</li>
                  <li><IconCheck /> FIRS / State Tax Compliance</li>
                  <li><IconCheck /> Monthly P&amp;L &amp; Balance Sheets</li>
                  <li><IconCheck /> Inventory &amp; Asset Management</li>
                </ul>
                <Link to="/services" className="hp-pathway-link">
                  Explore Services
                  <IconArrowRight />
                </Link>
              </div>
            </Reveal>

            {/* Pathway 2: For Professionals */}
            <Reveal className="hp-pathway-card-wrapper" delay={200}>
              <div className="hp-pathway-card popular">
                <div className="hp-pathway-badge popular-badge">RECOMMENDED FOR CAREERS</div>
                <div className="hp-pathway-icon-box">
                  <IconGraduationCap />
                </div>
                <h3>For Professionals</h3>
                <p className="hp-pathway-intro">Gain structural, real-world accounting skills that boost employability and workplace confidence.</p>
                <ul className="hp-pathway-list">
                  <li><IconCheck /> Accounting Experience Programme</li>
                  <li><IconCheck /> Specialized Career Acceleration</li>
                  <li><IconCheck /> Professional Certifications</li>
                  <li><IconCheck /> Practical Cloud Software Training</li>
                  <li><IconCheck /> Remote Internships &amp; Placements</li>
                </ul>
                <Link to="/resources" className="hp-pathway-link">
                  Browse Curriculum
                  <IconArrowRight />
                </Link>
              </div>
            </Reveal>

            {/* Pathway 3: For Entrepreneurs */}
            <Reveal className="hp-pathway-card-wrapper" delay={300}>
              <div className="hp-pathway-card">
                <div className="hp-pathway-badge">TOOLS &amp; ASSETS</div>
                <div className="hp-pathway-icon-box">
                  <IconFileText />
                </div>
                <h3>For Entrepreneurs</h3>
                <p className="hp-pathway-intro">Run your business with confidence using plug-and-play dashboards, templates, and systems.</p>
                <ul className="hp-pathway-list">
                  <li><IconCheck /> DIY Cloud Accounting Systems</li>
                  <li><IconCheck /> Excel Bookkeeping Dashboards</li>
                  <li><IconCheck /> Cash Flow forecasting tools</li>
                  <li><IconCheck /> Ready-made Invoice &amp; PO templates</li>
                  <li><IconCheck /> Chart of Accounts templates</li>
                </ul>
                <Link to="/products" className="hp-pathway-link">
                  Download Tools
                  <IconArrowRight />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. WHY DONZEN (Outcome-focused value prop) */}
      <section className="hp-section hp-why-section">
        <div className="hp-container hp-why-split">
          <div className="hp-why-content-col">
            <Reveal delay={100}>
              <h2 className="hp-why-title">Focusing on Real Career &amp; Business Outcomes</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="hp-why-intro-text">Generic adjectives like {"'"}reliable{"'"} or {"'"}professional{"'"} don{"'"}t describe impact. Here is how Donzen translates effort into real workplace success:</p>
            </Reveal>
            
            <div className="hp-outcomes-list">
              <Reveal delay={100} className="hp-outcome-item">
                <div className="hp-outcome-num">01</div>
                <div>
                  <h4>We help graduates become highly employable</h4>
                  <p>Our simulation program skips theoretical textbooks and introduces you straight to standard invoices, VAT filings, and bank sheets used in corporate offices.</p>
                </div>
              </Reveal>
              <Reveal delay={200} className="hp-outcome-item">
                <div className="hp-outcome-num">02</div>
                <div>
                  <h4>We help business owners understand their numbers</h4>
                  <p>No complex jargon. We provide clean financial dashboards so you instantly know your real profit, expenses, and cash runway at a glance.</p>
                </div>
              </Reveal>
              <Reveal delay={300} className="hp-outcome-item">
                <div className="hp-outcome-num">03</div>
                <div>
                  <h4>We help accountants gain workplace confidence</h4>
                  <p>Transition from bookkeeping theory to handling corporate inventory, receivables ledger, and monthly advisory without feeling lost.</p>
                </div>
              </Reveal>
              <Reveal delay={400} className="hp-outcome-item">
                <div className="hp-outcome-num">04</div>
                <div>
                  <h4>We help SMEs build reliable accounting systems</h4>
                  <p>Skip accounting software mess. We install, map, configure, and train your staff to run Sage, QuickBooks, or custom spreadsheets successfully.</p>
                </div>
              </Reveal>
            </div>
          </div>
          
          <Reveal className="hp-why-image-col" delay={200}>
            <div className="hp-image-frame-why">
              <img src="/advisory-team.jpg" alt="Donzen Accounting Advisory Team" className="hp-why-img" />
              <div className="hp-image-glow-under"></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. WORKPLACE EXPERIENCE SHOWCASE (Simulation showcase) */}
      <section className="hp-section hp-bg-light hp-curved-section">
        <div className="hp-container">
          <div className="hp-section-header hp-text-left">
            <Reveal delay={100}>
              <h2 className="hp-section-title hp-text-left">Experience Real Workplace Simulation</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="hp-section-desc hp-text-left">Instead of classroom theory, our students and clients learn and execute directly within real cloud-based business configurations.</p>
            </Reveal>
          </div>

          <div className="hp-workplace-grid">
            {[
              { icon: <IconLaptop />, title: 'QuickBooks Online Setup', desc: 'Real corporate chart of accounts, bank feed configuration, customer invoice templates mapping.' },
              { icon: <IconLaptop />, title: 'Sage Accounting Systems', desc: 'Configuring multi-currency ledgers, inventory categories management, and payroll modules.' },
              { icon: <IconFileText />, title: 'Bank Reconciliation Statements', desc: 'Matching actual bank logs, reconciling discrepancies, and handling deposits in transit.' },
              { icon: <IconLineChart />, title: 'Financial Statements Analysis', desc: 'Drafting Profit & Loss (P&L), Balance Sheets, and Statement of Cash Flows.' },
              { icon: <IconUsers />, title: 'Corporate Payroll Management', desc: 'Calculating basic pay, housing, transport allowances, tax (PAYE), pension and deductions.' },
              { icon: <IconShield />, title: 'Inventory & Vendor Ledger', desc: 'FIFO inventory valuation, reorder alerts setup, accounts payable aging tables creation.' },
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 100} className="hp-workplace-card-wrapper">
                <div className="hp-workplace-card">
                  <div className="hp-workplace-icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEARNING JOURNEY TIMELINE */}
      <section className="hp-section">
        <div className="hp-container">
          <div className="hp-section-header">
            <Reveal delay={100}>
              <h2 className="hp-section-title">Your Workplace Learning Journey</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="hp-section-desc">A structured curriculum designed to take you from basic accounting principles to workplace-ready execution in 4 weeks.</p>
            </Reveal>
          </div>

          <div className="hp-timeline-wrapper">
            <div className="hp-timeline-line"></div>
            {[
              { week: 'Week 1', title: 'Accounting Foundations', desc: 'Double-entry bookkeeping, mapping accounts, identifying real business receipts and vendor invoices.' },
              { week: 'Week 2', title: 'Business Transactions & Tools', desc: 'Drafting transactions in QuickBooks & Excel, inventory counts tracking, and setting up vendor schedules.' },
              { week: 'Week 3', title: 'Financial Reporting', desc: 'Reconciling multiple bank statements, building trial balances, generating corporate P&L and balance sheets.' },
              { week: 'Week 4', title: 'Workplace Simulation Project', desc: 'Run the complete financial operations of a simulated Nigerian SME for a full fiscal month.' },
              { week: 'Outcome', title: 'Donzen Bookkeeping Certificate', desc: 'Graduate with a verified certification plus admission to the Donzen Alumni Career Network.' }
            ].map((step, idx) => (
              <Reveal key={idx} delay={idx * 150} className={`hp-timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <div className="hp-timeline-badge">{step.week}</div>
                <div className="hp-timeline-card">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SERVICES OVERVIEW */}
      <section className="hp-section hp-bg-light hp-curved-section">
        <div className="hp-container">
          <div className="hp-section-header">
            <Reveal delay={100}>
              <h2 className="hp-section-title">Corporate Accounting Services</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="hp-section-desc">Outsource your accounting operations to our experienced team. No overheads, no delays.</p>
            </Reveal>
          </div>

          <div className="hp-services-grid">
            {[
              { icon: <IconBookkeeping />, title: 'Bookkeeping & Records', desc: 'Accurate logging of sales, expenses, petty cash, and daily business transactions.' },
              { icon: <IconUsers />, title: 'Staff Payroll Services', desc: 'Generate payslips, calculate PAYE, pensions, NHF, and manage monthly disbursement.' },
              { icon: <IconTax />, title: 'Tax Support & Returns', desc: 'Filing CIT, WHT, VAT, and PAYE with state and federal tax boards seamlessly.' },
              { icon: <IconLineChart />, title: 'Financial Reporting', desc: 'Monthly, quarterly, and annual audited financial statements for directors & banks.' },
              { icon: <IconLaptop />, title: 'Software Implementations', desc: 'QuickBooks, Sage, or custom-designed spreadsheets set up by certified partners.' },
              { icon: <IconShield />, title: 'Internal Controls Audit', desc: 'Reviewing receipts pipelines, cash collection points, and plugging leakage pathways.' },
            ].map((svc, idx) => (
              <Reveal key={idx} delay={idx * 100} className="hp-service-card-wrapper">
                <div className="hp-service-card">
                  <div className="hp-service-icon">{svc.icon}</div>
                  <h4>{svc.title}</h4>
                  <p>{svc.desc}</p>
                  <Link to="/services" className="hp-service-link">Learn more</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ACCOUNTING EXPERIENCE PROGRAMME HIGHLIGHT */}
      <section className="hp-section hp-bootcamp-highlight">
        <div className="hp-container hp-bootcamp-split">
          <Reveal className="hp-bootcamp-image-col">
            <div className="hp-image-frame-bootcamp">
              <img src="/bootcamp_vision.jpg" alt="Donzen Academy training graduates" className="hp-bootcamp-img" />
              <div className="hp-badge-bootcamp">BOOTCAMP PROGRAMME</div>
            </div>
          </Reveal>
          
          <div className="hp-bootcamp-content-col">
            <Reveal delay={100}>
              <h2 className="hp-bootcamp-title">The Donzen Accounting Experience Programme</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="hp-bootcamp-desc">
                Our flagship 4-week practical program. Designed specifically for young graduates, job seekers, and business owners looking to master real bookkeeping and accounting systems.
              </p>
            </Reveal>
            <ul className="hp-bootcamp-highlights">
              <li><IconCheck /> Master Excel bookkeeping + QuickBooks setup</li>
              <li><IconCheck /> Work with real invoices, cash statements, and tax sheets</li>
              <li><IconCheck /> Gain confidence to manage company accounts independently</li>
              <li><IconCheck /> Network and remote placement support upon graduation</li>
            </ul>
            <Reveal delay={300}>
              <div className="hp-bootcamp-actions">
                <Link to="/resources" className="hp-btn hp-btn-primary">Learn More &amp; Register</Link>
                <Link to="/faq" className="hp-btn hp-btn-outline">Ask Questions</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 9. WHY EMPLOYERS HIRE OUR STUDENTS */}
      <section className="hp-section hp-bg-light hp-curved-section">
        <div className="hp-container hp-skills-container">
          <div className="hp-section-header">
            <Reveal delay={100}>
              <h2 className="hp-section-title">Why Employers Hire Our Graduates</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="hp-section-desc">Our students are trained on practical, day-one skills. Here is the verified skill set our graduates bring to businesses:</p>
            </Reveal>
          </div>

          <div className="hp-skills-checklist-grid">
            {[
              'Advanced Microsoft Excel (VLOOKUP, Pivot Tables)',
              'QuickBooks Online & Desktop Setup',
              'Sage One cloud accounting implementation',
              'Inventory tracking & FIFO valuation',
              'Monthly bank statements reconciliation',
              'Corporate P&L & balance sheet preparation',
              'PAYE, pension, and payroll computations',
              'VAT & WHT computation & tax returns filing',
              'Aged receivables & payables tracking',
              'Real-world business case simulations completed'
            ].map((skill, idx) => (
              <Reveal key={idx} delay={idx * 50} className="hp-skill-check-wrapper">
                <div className="hp-skill-check-item">
                  <div className="hp-skill-check-icon"><IconCheck /></div>
                  <span>{skill}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONVERSION FUNNEL (Email Capture for Freebies) */}
      <section className="hp-section hp-lead-section">
        <div className="hp-container">
          <div className="hp-lead-card">
            <div className="hp-lead-grid">
              <div className="hp-lead-info">
                <h3>Download Our Free Accounting Resources</h3>
                <p>Equip yourself or your business with standard checklists and templates. Enter your email to receive it directly in your inbox.</p>
                <div className="hp-lead-features">
                  <div className="hp-lead-feat-item"><IconCheck /> 100% Free downloads</div>
                  <div className="hp-lead-feat-item"><IconCheck /> PDF &amp; Excel sheets formats</div>
                  <div className="hp-lead-feat-item"><IconCheck /> Corporate standards templates</div>
                </div>
              </div>
              <div className="hp-lead-form-box">
                {leadSuccess ? (
                  <div className="hp-lead-success-msg">
                    <h4>📥 Your Download Link is Ready!</h4>
                    <p>We have also sent your selected resource to your email. Click below to download directly:</p>
                    <a 
                      href="/downloads/donzen-toolkit.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hp-btn hp-btn-primary hp-btn-block"
                      style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
                    >
                      Download {leadResource}
                    </a>
                    <button onClick={() => setLeadSuccess(false)} className="hp-lead-reset-btn">Download another resource</button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="hp-lead-form">
                    <div className="hp-form-group">
                      <label htmlFor="lead-resource">Select Resource</label>
                      <select 
                        id="lead-resource" 
                        value={leadResource} 
                        onChange={e => setLeadResource(e.target.value)}
                        className="hp-form-select"
                      >
                        <option value="Free Excel Accounting Template">Free Excel Accounting Template</option>
                        <option value="Free Chart of Accounts PDF">Free Chart of Accounts PDF</option>
                        <option value="Free Bookkeeping Checklist">Free Bookkeeping Checklist</option>
                        <option value="Free Cash Flow Spreadsheet">Free Cash Flow Spreadsheet</option>
                        <option value="Free Accounting Career Guide">Free Accounting Career Guide</option>
                      </select>
                    </div>
                    <div className="hp-form-group">
                      <label htmlFor="lead-email">Your Email Address</label>
                      <input 
                        id="lead-email" 
                        type="email" 
                        placeholder="e.g. name@company.com" 
                        value={leadEmail}
                        onChange={e => setLeadEmail(e.target.value)}
                        className="hp-form-input"
                        required
                      />
                    </div>
                    <button type="submit" className="hp-btn hp-btn-primary hp-btn-block" style={{ height: '48px' }}>
                      Get Free Download
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS & SUCCESS STORIES (Styled light and modern) */}
      <section className="hp-section hp-bg-light hp-curved-section">
        <div className="hp-container">
          <div className="hp-section-header">
            <Reveal delay={100}>
              <h2 className="hp-section-title">What Our Alumni &amp; Clients Say</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="hp-section-desc">Read stories of career transitions and accounting processes automated by Donzen.</p>
            </Reveal>
          </div>

          <div className="hp-testimonials-grid">
            {[
              {
                img: '/testimonial_1.png',
                name: 'Adeola K.',
                role: 'Founder, OVE Naturals',
                text: 'Donzen sorted out our messy bookkeeping. Before them, we did not know our actual margin on items. Now, we have a clear, automated dashboard showing cost offsets, inventory levels, and profitability.'
              },
              {
                img: '/testimonial_2.png',
                name: 'Chinedu M.',
                role: 'CEO, ChiTech Solutions',
                text: 'Reconciliation used to take days. Setting up QuickBooks with Donzen has given us 24/7 visibility into receivables and payables. Highly recommend their corporate setup.'
              },
              {
                img: '/testimonial_3.png',
                name: 'Bukola F.',
                role: 'Director, BukoFinance',
                text: 'The 4-week Accounting Experience Programme completely transformed my career trajectory. I went from theoretical accounting equations to actually running company spreadsheets and payroll. Truly job-ready.'
              }
            ].map((t, idx) => (
              <Reveal key={idx} delay={idx * 150} className="hp-testimonial-card-wrapper">
                <div className="hp-testimonial-card">
                  <div className="hp-stars">
                    <IconStar />
                    <IconStar />
                    <IconStar />
                    <IconStar />
                    <IconStar />
                  </div>
                  <p className="hp-testimonial-text">"{t.text}"</p>
                  <div className="hp-testimonial-author">
                    <img 
                      src={t.img} 
                      alt={t.name} 
                      className="hp-author-thumb" 
                      onError={(e) => {
                        e.target.src = '/avatar.png';
                      }}
                    />
                    <div>
                      <h4 className="hp-author-name">{t.name}</h4>
                      <p className="hp-author-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 12. MEET THE FOUNDER (Samuel Onainor story with custom image) */}
      <section className="hp-section hp-founder-section">
        <div className="hp-container hp-founder-split">
          <div className="hp-founder-content-col">
            <Reveal delay={100}>
              <h2 className="hp-founder-title">A Message From Samuel Onainor</h2>
            </Reveal>
            <Reveal delay={200}>
              <div className="hp-founder-letter">
                <p>
                  Hello, I am <strong>Samuel Onainor</strong>, founder of <strong>Donzen Accounting Hub</strong>. 
                </p>
                <p>
                  Over the past decade, I noticed a major gap in the financial sector: universities teach accounting theory, but corporate offices require practical, real-world spreadsheet and software execution. Graduates were leaving classrooms without knowing how to reconcile a bank log or draft a VAT ledger.
                </p>
                <p>
                  Similarly, growing businesses struggle to manage cash flow simply because they lack clean, structured accounting systems configured for the Nigerian tax environment.
                </p>
                <p>
                  I created Donzen to be <strong>Nigeria{"'"}s Workplace Accounting Experience Platform</strong> — a digital headquarters that builds verified, employable skills for graduates while providing growing businesses with virtual accounting and bookkeeping services that drive real growth.
                </p>
                <p>
                  Whether you are looking to become job-ready or seeking to automate your business finances, my team and I are dedicated to partnering with you on your journey.
                </p>
              </div>
            </Reveal>
          </div>
          
          <Reveal className="hp-founder-image-col" delay={200}>
            <div className="hp-image-frame-founder">
              <img src="/donzen-man.jpeg" alt="Samuel Onainor - Founder of Donzen Accounting Hub" className="hp-founder-img" />
              <div className="hp-founder-signature-box">
                <h4>Samuel Onainor</h4>
                <p>Founder &amp; Lead Consultant</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="hp-section hp-bg-light hp-curved-section">
        <div className="hp-container hp-faq-container">
          <div className="hp-section-header">
            <Reveal>
              <h2 className="hp-section-title">Frequently Asked Questions</h2>
            </Reveal>
          </div>
          <Reveal>
            <div className="hp-faq-list">
              <FaqItem question="What is the Donzen Accounting Experience Programme?" answer="It is a 4-week practical training bootcamp where students work on real-world business case simulations, master advanced Excel models, QuickBooks setups, Sage structures, payroll modules, and local tax filings to become corporate ready." />
              <FaqItem question="Do you work with businesses outside Lagos?" answer="Yes, we are a remote-first platform. We successfully manage accounting, bookkeeping, and consulting operations for SMEs across all 36 states of Nigeria using secure cloud technology." />
              <FaqItem question="What accounting software does Donzen support?" answer="We are certified experts and setup partners for QuickBooks Online, Sage Business Cloud, and Xero. We also design custom Excel bookkeeping dashboards for smaller teams." />
              <FaqItem question="How does the remote internship work?" answer="Upon graduation from our Experience Programme, selected students get placement options in our virtual bookkeeping division or partner SME companies to handle real financial operations under senior supervision." />
              <FaqItem question="How do I get custom pricing for accounting services?" answer="You can book a free advisory consultation directly. Our consultants will evaluate your transaction volume, inventory complexity, and payroll details to design a tailored package." />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 14. BOTTOM CTA (HubSpot-like friendly gradient style) */}
      <section className="hp-bottom-cta">
        <Reveal>
          <div className="hp-bottom-cta-inner">
            <h2>Ready to Take Control of Your Finances?</h2>
            <p>
              Whether you are a startup founder, a job-seeking graduate, or a growing SME — we are here to give you accounting experience, clarity, and peace of mind.
            </p>
            <div className="hp-bottom-btns">
              <Link to="/contact" className="hp-cta-btn hp-btn-red">
                Get a Free Consultation
                <IconArrowRight />
              </Link>
              <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noopener noreferrer" className="hp-cta-btn hp-btn-glass">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 15. WATCH FREE DEMO MODAL */}
      {showDemoModal && (
        <div className="hp-modal-overlay" onClick={() => setShowDemoModal(false)}>
          <div className="hp-modal-box" onClick={e => e.stopPropagation()}>
            <button className="hp-modal-close" onClick={() => setShowDemoModal(false)}>
              <IconClose />
            </button>
            <div className="hp-modal-header">
              <h3>Watch Donzen Platform Demo</h3>
              <p>Get a quick walk-through of the curriculum, simulated business scenarios, and how the virtual internship works.</p>
            </div>
            <div className="hp-modal-video-placeholder">
              <div className="hp-video-overlay-play">
                <IconPlay />
                <span>Demo Video Coming Soon</span>
              </div>
            </div>
            <div className="hp-modal-footer">
              <p>Ready to speak with a program consultant right away?</p>
              <Link to="/contact" onClick={() => setShowDemoModal(false)} className="hp-btn hp-btn-primary">
                Book a Free consultation
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- Styles --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        /* --- SCOPED CSS --- */
        .hp-wrapper {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          background-color: #ffffff;
          overflow-x: hidden;
        }
        
        .hp-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hp-section {
          padding: 7rem 0;
          position: relative;
        }
        
        .hp-bg-light { background-color: #f8fafc; }
        .hp-text-accent { color: #ff1717; }
        .hp-text-left { text-align: center !important; }

        /* Typography */
        .hp-section-title {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          text-align: center;
          margin-bottom: 1.25rem;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        .hp-section-desc {
          font-size: 1.15rem;
          color: #475569;
          text-align: center;
          max-width: 750px;
          margin: 0 auto 3.5rem;
          line-height: 1.6;
        }

        /* Buttons */
        .hp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
          border: 2px solid transparent;
          font-family: inherit;
        }
        .hp-btn-primary {
          background-color: #ff1717;
          color: #ffffff !important;
        }
        .hp-btn-primary:hover {
          background-color: #d11111;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 23, 23, 0.2);
        }
        .hp-btn-secondary {
          background-color: rgba(255, 255, 255, 0.15);
          color: #ffffff !important;
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.25);
        }
        .hp-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        .hp-btn-outline {
          background-color: transparent;
          border-color: #e2e8f0;
          color: #1e293b;
        }
        .hp-btn-outline:hover {
          border-color: #0f172a;
          background-color: #f8fafc;
        }
        .hp-btn-block {
          width: 100%;
        }
        .hp-btn-large {
          padding: 1rem 2rem;
          font-size: 1.05rem;
          border-radius: 12px;
        }

        /* Reveal Animation Base */
        .hp-reveal-base {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hp-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* 1. Hero Section */
        .hp-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 10rem 0 12rem;
          background: #0f172a;
          overflow: hidden;
        }
        .hp-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .hp-hero-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
          filter: brightness(0.35);
        }
        .hp-hero-img.active {
          opacity: 1;
        }
        .hp-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.96) 100%);
        }
        .hp-hero-content {
          position: relative;
          z-index: 1;
          max-width: 850px;
          margin: 0 auto;
          text-align: center;
        }
        .hp-hero-title {
          font-size: clamp(2.2rem, 4.8vw, 3.8rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 2rem;
          letter-spacing: -0.04em;
        }
        .hp-hero-subtitle {
          font-size: clamp(1.1rem, 1.8vw, 1.3rem);
          color: #e2e8f0;
          margin: 0 auto 3.5rem;
          line-height: 1.6;
          font-weight: 400;
          max-width: 750px;
        }
        .hp-hero-ctas {
          display: flex;
          gap: 1.2rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hp-section-divider {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }
        .hp-section-divider svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 80px;
        }

        /* 2. Stats Bar */
        .hp-stats-bar-wrapper {
          position: relative;
          z-index: 20;
          margin-top: -80px;
        }
        .hp-stats-bar {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
          border: 1px solid #f1f5f9;
        }
        .hp-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
          text-align: center;
        }
        .hp-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hp-counter {
          font-size: clamp(1.8rem, 3vw, 2.75rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }
        .hp-stat-item.font-highlight .hp-counter {
          color: #ff1717;
        }
        .hp-stat-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* 3. Pathways Section */
        .hp-pathways-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-top: 2rem;
        }
        .hp-pathway-card-wrapper {
          display: flex;
        }
        .hp-pathway-card {
          background: #ffffff;
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          box-shadow: 0 4px 30px rgba(15, 23, 42, 0.015);
          border: 1px solid #e2e8f0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .hp-pathway-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
          border-color: rgba(255, 23, 23, 0.2);
        }
        .hp-pathway-card.popular {
          border-color: #ff1717;
          box-shadow: 0 10px 30px rgba(255, 23, 23, 0.05);
        }
        .hp-pathway-card.popular::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: #ff1717;
        }
        .hp-pathway-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .hp-pathway-badge.popular-badge {
          color: #ff1717;
        }
        .hp-pathway-icon-box {
          width: 52px;
          height: 52px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff1717;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }
        .hp-pathway-card.popular .hp-pathway-icon-box {
          background: rgba(255, 23, 23, 0.05);
        }
        .hp-pathway-card h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 1rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .hp-pathway-intro {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .hp-pathway-list {
          list-style: none;
          padding: 0;
          margin: 0 0 3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hp-pathway-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
        }
        .hp-pathway-list li svg {
          color: #ff1717;
          flex-shrink: 0;
        }
        .hp-pathway-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #ff1717;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .hp-pathway-link:hover svg {
          transform: translateX(4px);
        }

        /* Friendly Curved Sections */
        .hp-curved-section {
          border-radius: 40px;
          margin: 2rem 0;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.01);
        }

        /* 4. Why Section (Outcome-focused) */
        .hp-why-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .hp-why-title {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          line-height: 1.2;
          margin-top: 0;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          color: #0f172a;
        }
        .hp-why-intro-text {
          font-size: 1.15rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 3rem;
        }
        .hp-outcomes-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .hp-outcome-item {
          display: flex;
          gap: 1.5rem;
        }
        .hp-outcome-num {
          font-size: 1.1rem;
          font-weight: 800;
          color: #ff1717;
          background: rgba(255, 23, 23, 0.05);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(255, 23, 23, 0.15);
        }
        .hp-outcome-item h4 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          color: #0f172a;
        }
        .hp-outcome-item p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }
        .hp-image-frame-why {
          position: relative;
        }
        .hp-why-img {
          width: 100%;
          height: auto;
          border-radius: 2rem;
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.06);
          z-index: 1;
          position: relative;
        }
        .hp-image-glow-under {
          position: absolute;
          top: -20px;
          right: -20px;
          bottom: 20px;
          left: 20px;
          background: radial-gradient(circle, rgba(255, 23, 23, 0.05) 0%, transparent 70%);
          filter: blur(20px);
          z-index: 0;
        }

        /* 5. Workplace Experience Showcase (Light, Modern) */
        .hp-workplace-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-top: 2rem;
        }
        .hp-workplace-card-wrapper {
          display: flex;
        }
        .hp-workplace-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 2.5rem 2rem;
          border-radius: 1.5rem;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.01);
        }
        .hp-workplace-card:hover {
          border-color: #ff1717;
          box-shadow: 0 15px 30px rgba(15, 23, 42, 0.04);
          transform: translateY(-4px);
        }
        .hp-workplace-icon {
          color: #ff1717;
          margin-bottom: 1.5rem;
        }
        .hp-workplace-card h4 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 1rem;
          color: #0f172a;
        }
        .hp-workplace-card p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* 6. Learning Journey Timeline */
        .hp-timeline-wrapper {
          position: relative;
          max-width: 900px;
          margin: 4rem auto 0;
          padding: 2rem 0;
        }
        .hp-timeline-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 3px;
          background: #e2e8f0;
          transform: translateX(-50%);
        }
        .hp-timeline-item {
          display: flex;
          justify-content: flex-end;
          padding-right: 50%;
          position: relative;
          margin-bottom: 3rem;
        }
        .hp-timeline-item:last-child {
          margin-bottom: 0;
        }
        .hp-timeline-item.right {
          justify-content: flex-start;
          padding-right: 0;
          padding-left: 50%;
        }
        .hp-timeline-badge {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #ff1717;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 50px;
          z-index: 2;
          box-shadow: 0 0 0 6px #ffffff;
          text-transform: uppercase;
        }
        .hp-timeline-card {
          width: 85%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 2rem;
          border-radius: 1.25rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
          margin-right: 2rem;
        }
        .hp-timeline-item.right .hp-timeline-card {
          margin-right: 0;
          margin-left: 2rem;
        }
        .hp-timeline-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
          color: #0f172a;
        }
        .hp-timeline-card p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* 7. Services Overview */
        .hp-services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .hp-service-card-wrapper {
          display: flex;
        }
        .hp-service-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 2.5rem 2rem;
          border-radius: 1.25rem;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        .hp-service-card:hover {
          border-color: #ff1717;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
          transform: translateY(-4px);
        }
        .hp-service-icon {
          color: #ff1717;
          margin-bottom: 1.5rem;
        }
        .hp-service-card h4 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0 0 1rem;
          color: #0f172a;
        }
        .hp-service-card p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 2rem;
        }
        .hp-service-link {
          margin-top: auto;
          color: #ff1717;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
        }

        /* 8. Bootcamp Highlight Box */
        .hp-bootcamp-highlight {
          background: #f8fafc;
          padding: 7rem 0;
          border-radius: 40px;
        }
        .hp-bootcamp-split {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 5rem;
          align-items: center;
        }
        .hp-image-frame-bootcamp {
          position: relative;
        }
        .hp-bootcamp-img {
          width: 100%;
          height: auto;
          border-radius: 2rem;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }
        .hp-badge-bootcamp {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: #0f172a;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 8px 18px;
          border-radius: 50px;
          letter-spacing: 0.05em;
        }
        .hp-bootcamp-title {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-top: 0;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: #0f172a;
        }
        .hp-bootcamp-desc {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .hp-bootcamp-highlights {
          list-style: none;
          padding: 0;
          margin: 0 0 3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hp-bootcamp-highlights li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }
        .hp-bootcamp-highlights li svg {
          color: #ff1717;
          flex-shrink: 0;
        }
        .hp-bootcamp-actions {
          display: flex;
          gap: 1.5rem;
        }

        /* 9. Employability checklist section */
        .hp-skills-container {
          max-width: 1000px;
        }
        .hp-skills-checklist-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .hp-skill-check-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
        }
        .hp-skill-check-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,23,23,0.05);
          color: #ff1717;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hp-skill-check-item span {
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }

        /* 10. Lead Generation/Conversion Funnel Box */
        .hp-lead-section {
          padding: 5rem 0;
          background-color: #ffffff;
        }
        .hp-lead-card {
          background: #0f172a;
          border-radius: 2rem;
          padding: 4rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
        }
        .hp-lead-card::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .hp-lead-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hp-lead-info h3 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 0;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .hp-lead-info p {
          font-size: 1.1rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .hp-lead-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hp-lead-feat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
        }
        .hp-lead-feat-item svg {
          color: #ff1717;
        }
        .hp-lead-form-box {
          background: #ffffff;
          padding: 3rem 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .hp-lead-success-msg {
          text-align: center;
          padding: 1rem 0;
        }
        .hp-lead-success-msg h4 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 0.75rem;
        }
        .hp-lead-success-msg p {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 2rem;
        }
        .hp-lead-reset-btn {
          background: none;
          border: none;
          color: #64748b;
          text-decoration: underline;
          font-size: 0.85rem;
          margin-top: 1.5rem;
          cursor: pointer;
        }
        .hp-lead-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .hp-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .hp-form-group label {
          font-size: 0.85rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .hp-form-select, .hp-form-input {
          height: 48px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 0 1rem;
          font-family: inherit;
          font-size: 0.95rem;
          color: #0f172a;
          outline: none;
          background: #ffffff;
        }
        .hp-form-select:focus, .hp-form-input:focus {
          border-color: #ff1717;
          box-shadow: 0 0 0 3px rgba(255,23,23,0.08);
        }

        /* 11. Testimonials Section (Light friendly styling) */
        .hp-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-top: 2rem;
        }
        .hp-testimonial-card-wrapper {
          display: flex;
        }
        .hp-testimonial-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 2.5rem 2rem;
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .hp-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 1.5rem;
        }
        .hp-testimonial-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #475569;
          font-style: italic;
          margin: 0 0 2rem;
        }
        .hp-testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: auto;
        }
        .hp-author-thumb {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        .hp-author-name {
          font-size: 0.95rem;
          font-weight: 800;
          margin: 0 0 2px;
          color: #0f172a;
        }
        .hp-author-role {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
        }

        /* 12. Meet The Founder Section */
        .hp-founder-section {
          background: #ffffff;
          padding: 6rem 0;
        }
        .hp-founder-split {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 6rem;
          align-items: center;
        }
        .hp-founder-title {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-top: 0;
          margin-bottom: 2rem;
          color: #0f172a;
        }
        .hp-founder-letter {
          color: #475569;
          font-size: 1.05rem;
          line-height: 1.7;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .hp-founder-letter strong {
          color: #0f172a;
        }
        .hp-image-frame-founder {
          position: relative;
        }
        .hp-founder-img {
          width: 100%;
          height: auto;
          border-radius: 2rem;
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.05);
          position: relative;
          z-index: 1;
        }
        .hp-founder-signature-box {
          position: absolute;
          bottom: -20px;
          left: 30px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          border-radius: 1rem;
          padding: 1.5rem 2rem;
          z-index: 2;
        }
        .hp-founder-signature-box h4 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 4px;
        }
        .hp-founder-signature-box p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          font-weight: 600;
        }

        /* 13. FAQ Accordion styles */
        .hp-faq-container {
          max-width: 800px;
        }
        .hp-faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hp-faq-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: border-color 0.25s ease;
        }
        .hp-faq-item:hover {
          border-color: #ff1717;
        }
        .hp-faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: none;
          border: none;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }
        .hp-faq-icon {
          transition: transform 0.3s ease;
          color: #64748b;
        }
        .hp-faq-icon-open {
          transform: rotate(180deg);
        }
        .hp-faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hp-faq-answer-open {
          max-height: 500px;
        }
        .hp-faq-answer-inner {
          padding: 0 1.5rem 1.5rem;
          color: #64748b;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* 14. Bottom CTA (HubSpot Academy friendly light gradient style) */
        .hp-bottom-cta {
          padding: 100px 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #fff1f2 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #e2e8f0;
          border-radius: 40px 40px 0 0;
        }
        .hp-bottom-cta::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,23,23,0.03), transparent 70%);
          bottom: -300px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .hp-bottom-cta-inner {
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .hp-bottom-cta h2 {
          font-size: clamp(1.8rem, 4vw, 2.75rem);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1.5rem;
          letter-spacing: -0.04em;
        }
        .hp-bottom-cta p {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.7;
          margin: 0 0 3rem;
        }
        .hp-bottom-btns {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .hp-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 1rem 2.25rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          border: none;
        }
        .hp-btn-red {
          background: #ff1717;
          color: #fff;
        }
        .hp-btn-red:hover {
          background: #d91414;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,23,23,0.25);
        }
        .hp-btn-glass {
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #cbd5e1;
        }
        .hp-btn-glass:hover {
          background: #f8fafc;
          border-color: #0f172a;
          transform: translateY(-2px);
        }

        /* 15. Watch Free Demo Modal */
        .hp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .hp-modal-box {
          background: #ffffff;
          width: 100%;
          max-width: 650px;
          border-radius: 1.5rem;
          padding: 2.5rem;
          position: relative;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
          border: 1px solid #f1f5f9;
        }
        .hp-modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hp-modal-close:hover {
          background: #ff1717;
          color: #ffffff;
          border-color: #ff1717;
        }
        .hp-modal-header h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-top: 0;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
          color: #0f172a;
        }
        .hp-modal-header p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 2rem;
        }
        .hp-modal-video-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: #0f172a;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          border: 1px solid #cbd5e1;
        }
        .hp-video-overlay-play {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #ffffff;
        }
        .hp-video-overlay-play svg {
          width: 60px;
          height: 60px;
          background: #ff1717;
          padding: 16px;
          border-radius: 50%;
          box-shadow: 0 8px 24px rgba(255, 23, 23, 0.4);
        }
        .hp-video-overlay-play span {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .hp-modal-footer {
          margin-top: 2rem;
          text-align: center;
        }
        .hp-modal-footer p {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 1rem;
        }

        /* --- RESPONSIVE DESIGN --- */
        @media (max-width: 1024px) {
          .hp-pathways-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-why-split { grid-template-columns: 1fr; gap: 3rem; }
          .hp-workplace-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-services-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-bootcamp-split { grid-template-columns: 1fr; gap: 3rem; }
          .hp-skills-checklist-grid { grid-template-columns: 1fr; }
          .hp-lead-grid { grid-template-columns: 1fr; gap: 3rem; }
          .hp-testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-founder-split { grid-template-columns: 1fr; gap: 3rem; }
        }

        @media (max-width: 768px) {
          .hp-hero { padding: 6rem 0; min-height: 85vh; }
          .hp-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-pathways-grid { grid-template-columns: 1fr; }
          .hp-workplace-grid { grid-template-columns: 1fr; }
          .hp-services-grid { grid-template-columns: 1fr; }
          .hp-testimonials-grid { grid-template-columns: 1fr; }
          .hp-timeline-line { left: 16px; }
          .hp-timeline-item { padding-right: 0; padding-left: 40px; justify-content: flex-start; }
          .hp-timeline-item.right { padding-left: 40px; }
          .hp-timeline-badge { left: 16px; top: 20px; }
          .hp-timeline-card { width: 100%; margin-left: 0 !important; }
        }

        @media (max-width: 480px) {
          .hp-stats-grid { grid-template-columns: 1fr; }
          .hp-hero-ctas { flex-direction: column; }
          .hp-bootcamp-actions { flex-direction: column; }
        }
      ` }} />
    </div>
  );
}
