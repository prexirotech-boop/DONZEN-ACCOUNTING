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

// --- Icons ---
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const IconArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff1717" stroke="#ff1717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const IconChevronDown = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
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

  return (
    <div className="hp-wrapper">
      {/* 1. HERO */}
      <section className="hp-hero">
        <div className="hp-hero-bg">
          <img src="/images/home-hero.jpg" alt="Donzen Accounting Hub Office" className="hp-hero-img" />
          <div className="hp-hero-overlay"></div>
        </div>
        <div className="hp-container hp-hero-content">
          <Reveal>
            <h1 className="hp-hero-title">
              Expert Bookkeeping &amp; Tax Compliance For <span className="hp-text-accent">Growing Businesses</span>
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="hp-hero-subtitle">
              We provide remote-first accounting solutions, DIY templates, and expert advisory to help Nigerian businesses thrive financially.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="hp-hero-ctas">
              <Link to="/contact" className="hp-btn hp-btn-primary">Book Free Consultation</Link>
              <Link to="/services" className="hp-btn hp-btn-secondary">Explore Services</Link>
            </div>
          </Reveal>
          
          <Reveal delay={400}>
            <div className="hp-hero-stats">
              <div className="hp-stat-item">
                <div className="hp-stat-number"><Counter target={500} suffix="+" /></div>
                <div className="hp-stat-label">Businesses Served</div>
              </div>
              <div className="hp-stat-item">
                <div className="hp-stat-number"><Counter target={98} suffix="%" /></div>
                <div className="hp-stat-label">Client Satisfaction</div>
              </div>
              <div className="hp-stat-item">
                <div className="hp-stat-number"><Counter target={6} suffix="+" /></div>
                <div className="hp-stat-label">Years Experience</div>
              </div>
              <div className="hp-stat-item">
                <div className="hp-stat-number"><Counter target={36} /></div>
                <div className="hp-stat-label">States Covered</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="hp-trust-bar">
        <div className="hp-container">
          <div className="hp-trust-grid">
            <div className="hp-trust-item"><IconShield /> FIRS Compliant</div>
            <div className="hp-trust-item"><IconCheck /> QuickBooks Certified Partner</div>
            <div className="hp-trust-item"><IconUsers /> Remote-First Firm</div>
            <div className="hp-trust-item"><IconBriefcase /> CAC Registered</div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES OVERVIEW */}
      <section className="hp-section hp-bg-light">
        <div className="hp-container">
          <div className="hp-section-header">
            <Reveal>
              <h2 className="hp-section-title">Comprehensive Financial Solutions</h2>
              <p className="hp-section-desc">Tailored accounting and tax services to streamline your operations and ensure compliance.</p>
            </Reveal>
          </div>
          
          <div className="hp-services-grid">
            {[
              { title: "Bookkeeping & Accounting", desc: "Accurate daily transaction recording, bank reconciliation, and financial reporting.", icon: <IconBookkeeping /> },
              { title: "Done-For-You Accounting", desc: "Complete outsourced financial management for businesses that want a hands-off approach.", icon: <IconCheck /> },
              { title: "Tax Advisory & Compliance", desc: "Strategic tax planning and timely filing to ensure full compliance with FIRS regulations.", icon: <IconTax /> },
              { title: "Business Incorporation", desc: "Seamless CAC registration and post-incorporation services for new and existing businesses.", icon: <IconBriefcase /> },
              { title: "DIY Accounting Templates", desc: "Easy-to-use spreadsheet templates designed for small businesses to manage finances independently.", icon: <IconFileText /> },
              { title: "Accounting Experience Programme", desc: "Practical bootcamp training for aspiring accountants to gain real-world industry skills.", icon: <IconGraduationCap /> }
            ].map((service, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="hp-card hp-service-card">
                  <div className="hp-service-icon">{service.icon}</div>
                  <h3 className="hp-service-title">{service.title}</h3>
                  <p className="hp-service-desc">{service.desc}</p>
                  <Link to="/services" className="hp-service-link">Learn more <IconArrowRight /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="hp-section">
        <div className="hp-container">
          <div className="hp-why-split">
            <Reveal className="hp-why-image-col">
              <img src="/images/home-why.jpg" alt="Our Advisory Team" className="hp-why-img" />
              <div className="hp-why-image-accent"></div>
            </Reveal>
            <div className="hp-why-content-col">
              <Reveal>
                <h2 className="hp-section-title hp-text-left">Why Businesses Trust Donzen</h2>
                <p className="hp-section-desc hp-text-left">We go beyond mere number crunching. We provide strategic insights to help you grow.</p>
                <ul className="hp-why-list">
                  <li>
                    <div className="hp-why-list-icon"><IconCheck /></div>
                    <div>
                      <h4 className="hp-why-list-title">Industry Expertise</h4>
                      <p className="hp-why-list-desc">Deep understanding of the Nigerian business landscape and tax regulations.</p>
                    </div>
                  </li>
                  <li>
                    <div className="hp-why-list-icon"><IconUsers /></div>
                    <div>
                      <h4 className="hp-why-list-title">Remote-First &amp; Reliable</h4>
                      <p className="hp-why-list-desc">Seamless communication and document management no matter where you are located.</p>
                    </div>
                  </li>
                  <li>
                    <div className="hp-why-list-icon"><IconShield /></div>
                    <div>
                      <h4 className="hp-why-list-title">Transparent Pricing</h4>
                      <p className="hp-why-list-desc">Clear, upfront service packages with no hidden fees or unexpected charges.</p>
                    </div>
                  </li>
                  <li>
                    <div className="hp-why-list-icon"><IconBriefcase /></div>
                    <div>
                      <h4 className="hp-why-list-title">Dedicated Account Managers</h4>
                      <p className="hp-why-list-desc">A single point of contact who understands your business inside and out.</p>
                    </div>
                  </li>
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="hp-section hp-bg-dark">
        <div className="hp-container">
          <div className="hp-section-header hp-text-white">
            <Reveal>
              <h2 className="hp-section-title">Client Success Stories</h2>
              <p className="hp-section-desc">Hear what our clients have to say about working with Donzen Accounting Hub.</p>
            </Reveal>
          </div>
          
          <div className="hp-testimonials-wrapper">
            <div className="hp-testimonials-grid">
              {[
                { name: "Adeola K.", role: "Founder, OVE Naturals", quote: "Donzen transformed our financial tracking. Their team is exceptionally responsive and professional. Highly recommended for any growing business.", img: "/testimonial_1.png" },
                { name: "Chinedu M.", role: "CEO, ChiTech Solutions", quote: "Since partnering with Donzen, our tax compliance issues are a thing of the past. Their proactive approach has saved us both time and money.", img: "/testimonial_2.png" },
                { name: "Bukola F.", role: "Director, BukoFinance", quote: "The DIY templates provided by Donzen gave us the clarity we needed before we were ready for full outsourced accounting. Brilliant service.", img: "/testimonial_3.png" }
              ].map((test, idx) => (
                <Reveal key={idx} delay={idx * 150} className="hp-testimonial-card-wrapper">
                  <div className="hp-card hp-testimonial-card">
                    <div className="hp-stars">
                      <IconStar /><IconStar /><IconStar /><IconStar /><IconStar />
                    </div>
                    <p className="hp-testimonial-quote">"{test.quote}"</p>
                    <div className="hp-testimonial-author">
                      <img src={test.img} alt={test.name} className="hp-testimonial-img" />
                      <div>
                        <h4 className="hp-testimonial-name">{test.name}</h4>
                        <p className="hp-testimonial-role">{test.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING PREVIEW */}
      <section className="hp-section hp-bg-light">
        <div className="hp-container">
          <div className="hp-section-header">
            <Reveal>
              <h2 className="hp-section-title">Transparent Accounting Packages</h2>
              <p className="hp-section-desc">Choose the perfect plan to support your business operations and growth.</p>
            </Reveal>
          </div>
          
          <div className="hp-pricing-grid">
            {[
              { name: "Starter", price: 35000, desc: "Perfect for sole proprietors and new businesses.", features: ["Monthly Bank Reconciliation", "Income & Expense Tracking", "Basic Financial Reports"], isPopular: false },
              { name: "Growth", price: 75000, desc: "Ideal for growing SMEs needing robust tracking.", features: ["Bi-weekly Reconciliation", "Payroll Processing", "Tax Compliance (VAT/PAYE)", "Management Accounts"], isPopular: true },
              { name: "Enterprise", price: 150000, desc: "Comprehensive solutions for established companies.", features: ["Weekly Bank Reconciliation", "Dedicated Account Manager", "Strategic Tax Advisory", "Audit Preparation"], isPopular: false }
            ].map((plan, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className={`hp-card hp-pricing-card ${plan.isPopular ? 'hp-pricing-popular' : ''}`}>
                  {plan.isPopular && <div className="hp-pricing-badge">Most Popular</div>}
                  <h3 className="hp-pricing-name">{plan.name}</h3>
                  <p className="hp-pricing-desc">{plan.desc}</p>
                  <div className="hp-pricing-amount">
                    <span className="hp-price-val">{formatPrice(plan.price)}</span>
                    <span className="hp-price-period">/mo</span>
                  </div>
                  <ul className="hp-pricing-features">
                    {plan.features.map((feat, i) => (
                      <li key={i}><IconCheck /> {feat}</li>
                    ))}
                  </ul>
                  <Link to="/resources" className={`hp-btn hp-btn-block ${plan.isPopular ? 'hp-btn-primary' : 'hp-btn-outline'}`}>
                    View Details
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="hp-section">
        <div className="hp-container hp-faq-container">
          <div className="hp-section-header">
            <Reveal>
              <h2 className="hp-section-title">Frequently Asked Questions</h2>
            </Reveal>
          </div>
          <Reveal>
            <div className="hp-faq-list">
              <FaqItem question="What services does Donzen offer?" answer="We offer comprehensive bookkeeping, tax advisory and compliance, business incorporation with the CAC, accounting DIY templates, and practical accounting training bootcamps." />
              <FaqItem question="Do you work with businesses outside Lagos?" answer="Yes! We are a remote-first accounting firm and successfully partner with businesses across all 36 states of Nigeria." />
              <FaqItem question="What accounting software do you use?" answer="We are certified partners with QuickBooks Online, but we also work proficiently with Xero, Sage, and other standard accounting ERP systems based on client needs." />
              <FaqItem question="How long does onboarding take?" answer="Our onboarding process is streamlined. Once the initial consultation is complete and the agreement is signed, we typically have your account setup and ready within 3 to 5 business days." />
              <FaqItem question="Can I switch plans later?" answer="Absolutely. As your business grows, your accounting needs will change. You can upgrade or adjust your service package at the beginning of any billing cycle." />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. BOTTOM CTA */}
      <section className="hp-cta-section">
        <div className="hp-container">
          <Reveal>
            <div className="hp-cta-box">
              <h2 className="hp-cta-title">Ready to Take Control of Your Business Finances?</h2>
              <p className="hp-cta-desc">Schedule a free consultation today to discuss your business needs and discover how our expertise can drive your growth.</p>
              <div className="hp-cta-actions">
                <Link to="/contact" className="hp-btn hp-btn-primary hp-btn-large">Book a Consultation</Link>
                <a href="https://wa.me/message/XUEP2CGZ4FM6E1" target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-secondary hp-btn-large">Chat on WhatsApp</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* --- SCOPED CSS --- */
        .hp-wrapper {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #09090b;
          background-color: #ffffff;
          overflow-x: hidden;
        }
        
        .hp-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hp-section {
          padding: 5rem 0;
        }
        
        .hp-bg-light { background-color: #f8fafc; }
        .hp-bg-dark { background-color: #09090b; }
        .hp-text-white * { color: #ffffff !important; }
        .hp-text-accent { color: #ff1717; }
        .hp-text-left { text-align: left !important; }

        /* Typography */
        .hp-section-title {
          font-size: 2.25rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          color: #09090b;
        }
        .hp-section-desc {
          font-size: 1.125rem;
          color: #64748b;
          text-align: center;
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        /* Buttons */
        .hp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }
        .hp-btn-primary {
          background-color: #ff1717;
          color: #ffffff !important;
        }
        .hp-btn-primary:hover {
          background-color: #d11111;
        }
        .hp-btn-secondary {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff !important;
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .hp-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .hp-btn-outline {
          background-color: transparent;
          border-color: #e2e8f0;
          color: #09090b;
        }
        .hp-btn-outline:hover {
          border-color: #09090b;
        }
        .hp-btn-block {
          width: 100%;
        }
        .hp-btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        /* Reveal Animation */
        .hp-reveal-base {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hp-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Cards */
        .hp-card {
          background: #ffffff;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border: 1px solid #f1f5f9;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hp-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* 1. Hero */
        .hp-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 6rem 0;
        }
        .hp-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hp-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(9, 9, 11, 0.9) 0%, rgba(9, 9, 11, 0.7) 100%);
        }
        .hp-hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .hp-hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .hp-hero-subtitle {
          font-size: 1.25rem;
          color: #cbd5e1;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .hp-hero-ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
        }
        .hp-hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .hp-stat-item {
          color: #ffffff;
        }
        .hp-stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ff1717;
          margin-bottom: 0.5rem;
        }
        .hp-stat-label {
          font-size: 0.875rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* 2. Trust Bar */
        .hp-trust-bar {
          background-color: #1e293b;
          padding: 1.5rem 0;
          border-bottom: 1px solid #334155;
        }
        .hp-trust-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .hp-trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.9375rem;
        }

        /* 3. Services Overview */
        .hp-services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .hp-service-icon {
          color: #ff1717;
          margin-bottom: 1.5rem;
        }
        .hp-service-icon svg {
          width: 32px;
          height: 32px;
        }
        .hp-service-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #09090b;
        }
        .hp-service-desc {
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-size: 0.9375rem;
        }
        .hp-service-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #ff1717;
          font-weight: 600;
          text-decoration: none;
          font-size: 0.9375rem;
        }
        .hp-service-link:hover { text-decoration: underline; }
        .hp-service-link svg { width: 16px; height: 16px; }

        /* 4. Why Choose Us */
        .hp-why-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hp-why-image-col {
          position: relative;
        }
        .hp-why-img {
          width: 100%;
          border-radius: 1rem;
          object-fit: cover;
          aspect-ratio: 4/5;
          position: relative;
          z-index: 2;
        }
        .hp-why-image-accent {
          position: absolute;
          top: -1rem;
          left: -1rem;
          width: 100%;
          height: 100%;
          border: 2px solid #ff1717;
          border-radius: 1rem;
          z-index: 1;
        }
        .hp-why-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .hp-why-list li {
          display: flex;
          gap: 1rem;
        }
        .hp-why-list-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: #fef2f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff1717;
        }
        .hp-why-list-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #09090b;
        }
        .hp-why-list-desc {
          color: #64748b;
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        /* 5. Testimonials */
        .hp-testimonials-wrapper {
          overflow-x: auto;
          padding-bottom: 1rem;
          scrollbar-width: none;
        }
        .hp-testimonials-wrapper::-webkit-scrollbar { display: none; }
        .hp-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          min-width: 100%;
        }
        .hp-testimonial-card {
          background-color: #18181b;
          border-color: #27272a;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .hp-stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
        }
        .hp-testimonial-quote {
          font-size: 1rem;
          line-height: 1.6;
          color: #e4e4e7;
          margin-bottom: 2rem;
          flex-grow: 1;
        }
        .hp-testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .hp-testimonial-img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }
        .hp-testimonial-name {
          font-weight: 600;
          color: #ffffff;
          font-size: 1rem;
          margin: 0;
        }
        .hp-testimonial-role {
          color: #a1a1aa;
          font-size: 0.875rem;
          margin: 0;
        }

        /* 6. Pricing */
        .hp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          align-items: center;
        }
        .hp-pricing-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .hp-pricing-popular {
          border-color: #ff1717;
          box-shadow: 0 10px 25px -5px rgba(255, 23, 23, 0.1);
          transform: scale(1.05);
        }
        .hp-pricing-popular:hover { transform: scale(1.05) translateY(-5px); }
        .hp-pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff1717;
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .hp-pricing-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .hp-pricing-desc {
          color: #64748b;
          font-size: 0.9375rem;
          margin-bottom: 2rem;
        }
        .hp-pricing-amount {
          margin-bottom: 2rem;
          display: flex;
          align-items: baseline;
        }
        .hp-price-val {
          font-size: 2.5rem;
          font-weight: 800;
          color: #09090b;
        }
        .hp-price-period {
          color: #64748b;
          margin-left: 0.25rem;
        }
        .hp-pricing-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          flex-grow: 1;
        }
        .hp-pricing-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #334155;
          font-size: 0.9375rem;
        }
        .hp-pricing-features li svg {
          color: #ff1717;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
        }

        /* 7. FAQ */
        .hp-faq-container {
          max-width: 800px;
        }
        .hp-faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hp-faq-item {
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: #ffffff;
          overflow: hidden;
        }
        .hp-faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: none;
          border: none;
          font-size: 1.125rem;
          font-weight: 600;
          color: #09090b;
          cursor: pointer;
          text-align: left;
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
          transition: max-height 0.3s ease;
        }
        .hp-faq-answer-open {
          max-height: 500px; /* arbitrary large value */
        }
        .hp-faq-answer-inner {
          padding: 0 1.5rem 1.5rem;
          color: #64748b;
          line-height: 1.6;
        }

        /* 8. Bottom CTA */
        .hp-cta-section {
          padding: 6rem 0;
          background-color: #09090b;
          background-image: radial-gradient(circle at center, #1f1f23 0%, #09090b 100%);
        }
        .hp-cta-box {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .hp-cta-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }
        .hp-cta-desc {
          font-size: 1.25rem;
          color: #a1a1aa;
          margin-bottom: 2.5rem;
        }
        .hp-cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        /* --- RESPONSIVE DESIGN --- */
        @media (max-width: 1024px) {
          .hp-hero-title { font-size: 3rem; }
          .hp-services-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-why-split { gap: 2rem; }
          .hp-pricing-grid { grid-template-columns: repeat(3, 1fr); }
          .hp-pricing-popular { transform: none; }
          .hp-pricing-popular:hover { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
          .hp-hero-title { font-size: 2.25rem; }
          .hp-hero-subtitle { font-size: 1.125rem; }
          .hp-hero-ctas { flex-direction: column; }
          .hp-hero-stats { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .hp-trust-grid { justify-content: center; }
          .hp-services-grid { grid-template-columns: 1fr; }
          .hp-why-split { grid-template-columns: 1fr; }
          .hp-pricing-grid { grid-template-columns: 1fr; }
          .hp-testimonials-grid { 
            grid-template-columns: repeat(3, 300px); 
            gap: 1rem;
          }
          .hp-cta-title { font-size: 2rem; }
          .hp-cta-actions { flex-direction: column; }
        }

        @media (max-width: 480px) {
          .hp-hero-stats { grid-template-columns: 1fr; }
          .hp-hero { padding: 4rem 0; }
        }
      ` }} />
    </div>
  );
}
