import React from 'react'
import { Link } from 'react-router-dom'

export default function PricingPage() {
  const mainPlans = [
    {
      title: 'Donzen Accounting Services - Do It Yourself (DIY) Remote',
      price: '₦80,000',
      period: '/ Monthly',
      subnote: '₦130,000 In The First Month and ₦80,000 Monthly In The Subsequent Months',
      badge: 'Popular Choice',
      features: [
        'Easily Manage Day-To-Day Bookkeeping',
        'Enter Routine Business Accounting Transactions',
        'Inventory Accounting & Management (Manage up to 350 stock items)',
        'Fixed Assets Maintenance',
        'Petty Cash & Admin Expenses',
        'Staff Payroll Management & PAYE Computation',
        'Account Receivables & Payables Management (Process up to 1,000 supplier invoices and customer receipts)',
        'Tax Computation: CIT, WHT, VAT, PAYE',
        '24/7 Access to Real-time Financial Reports on any device and anywhere in the world',
        'Bank & Account Reconciliations',
        'Premium Financial Advisory & Review of Reports - 30 minutes',
        'Track all business expenses and income'
      ],
      ctaText: 'Start Today',
      link: '/checkout?plan=diy'
    },
    {
      title: 'Donzen Accounting Services - Done For You',
      price: '₦120,000',
      period: '/ Monthly',
      subnote: 'Full-Service Hands-Off Accounting & Monthly Financial Reporting',
      badge: 'Comprehensive',
      features: [
        'Easily Manage Day-To-Day Bookkeeping',
        'Enter Routine Business Accounting Transactions',
        'Inventory Accounting & Management (Manage up to 350 stock items)',
        'Fixed Assets Maintenance',
        'Petty Cash & Admin Expenses',
        'Staff Payroll Management & PAYE Computation',
        'Account Receivables & Payables Management (Process up to 1,000 supplier invoices and customer receipts)',
        'Tax Computation: CIT, WHT, VAT, PAYE',
        '24/7 Access to Real-Time Financial Reports on any device and anywhere in the world',
        'Bank & Account Reconciliations',
        'Premium Financial Advisory & Review of Reports - 30 minutes',
        'Track all business expenses and income'
      ],
      ctaText: 'Start Today',
      link: '/checkout?plan=done-for-you'
    },
    {
      title: 'Premium Business Consulting Services',
      price: 'Custom',
      period: '/ Stand-Alone',
      subnote: 'Tailored Corporate Advisory & SME Business Setup',
      badge: 'Bespoke',
      features: [
        'Online Courses & Digital Accounting Bootcamps',
        'Accounting Software Setup (QuickBooks, Excel & Cloud Apps)',
        'Donzen Accounting Toolkit',
        'Tax Consulting & Corporate Tax Strategy',
        'Audited Financial Reports & Audit Support',
        'Year-End Financial Statements Preparation',
        'Website Development for Financial & SME Businesses',
        'Incorporation of Businesses with CAC: Business Name, Limited Liability Company, & NGO',
        'Individual, Staff & Corporate Training',
        'Premium Financial Advisory'
      ],
      ctaText: 'Contact Us',
      link: '/contact'
    }
  ]

  const templates = [
    {
      title: 'Profit and Loss Statements for Business With No Accountant - DIY Template',
      price: '₦55,000',
      period: '/ Offline',
      desc: 'Generate professional monthly profit and loss statements and see profitability at a glance without hiring a full-time accountant.',
      features: [
        'Classify all transactions correctly into charts of account (COA)',
        'Easily manage day-to-day bookkeeping',
        'Enter routine business accounting transactions',
        'Organize and manage your recordkeeping',
        'Track all petty cash & admin expenses',
        'Petty cash management and tracking',
        'Bank & account reconciliations',
        'Track all your business expenses and sales',
        'Generate professional monthly profit and loss statements',
        'See profitability of the business'
      ],
      cta: 'Get Template Now'
    },
    {
      title: 'Vendors / Suppliers Management - DIY Template',
      price: '₦40,000',
      period: '/ Offline',
      desc: 'Need help with tracking your accounts payable, managing vendors database, payables reconciliation, and aging analysis at a go?',
      features: [
        'Accounts payable tracking & database',
        'Vendor database management',
        'Payables reconciliation',
        'Aging analysis reports at a click',
        'Automated payment tracking'
      ],
      cta: 'Get Template Now'
    },
    {
      title: 'Customers / Clients Management - DIY Template',
      price: '₦40,000',
      period: '/ Stand-Alone',
      desc: 'Need help with tracking your accounts receivable, managing customers database, receivables reconciliation, and aging analysis at a go?',
      features: [
        'Accounts receivable & customer database',
        'Client invoicing & statement generation',
        'Receivables reconciliation',
        'Aging analysis for unpaid invoices',
        'Automated overdue payment alerts'
      ],
      cta: 'Get Template Now'
    }
  ]

  return (
    <div style={{ background: '#FFFFFF', color: '#101010', fontFamily: 'var(--font)', minHeight: '100vh' }}>
      
      {/* ─── BANNER ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #101010 0%, #18181B 100%)',
        color: '#FFFFFF',
        padding: '90px 24px 70px',
        textAlign: 'center',
        borderBottom: '3px solid #ff1717'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
            Plans & Pricing
          </span>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)', fontWeight: 900, marginTop: '12px', marginBottom: '16px', color: '#FFFFFF' }}>
            Pricing & Resources
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '780px', margin: '0 auto' }}>
            We offer a variety of plans to suit your needs and budget. Our plans are designed to give you complete business accounting experience and access to the features and resources you need to grow and succeed. All of our plans include top-notch client services and support. Take a look at our plans below and find the one that’s right for you. If you have any questions, don’t hesitate to reach out to us. We’re here to help you every step of the way in doing business from a balanced perspective.
          </p>
          <div style={{ marginTop: '20px', fontWeight: 700, color: '#ff1717', fontSize: '1rem' }}>
            More Than Just Bookkeeping. P.S. Choose the right plan that best suits your business.
          </div>
        </div>
      </section>

      {/* ─── MAIN SERVICE PLANS ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F7F3F5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#101010' }}>
              Monthly Accounting & Bookkeeping Plans
            </h2>
            <p style={{ color: '#71717A', fontSize: '1rem', marginTop: '8px' }}>
              Select a monthly service plan tailored to your business operations.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '30px'
          }}>
            {mainPlans.map((plan, idx) => (
              <div key={idx} style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '36px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: idx === 0 ? '2px solid #ff1717' : '1px solid #E4E4E7',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                {plan.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-14px',
                    right: '24px',
                    background: idx === 0 ? '#ff1717' : '#101010',
                    color: '#FFFFFF',
                    padding: '4px 14px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#101010', marginBottom: '16px', minHeight: '52px' }}>
                    {plan.title}
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ff1717' }}>{plan.price}</span>
                    <span style={{ fontSize: '0.95rem', color: '#71717A', fontWeight: 600 }}> {plan.period}</span>
                    <div style={{ fontSize: '0.82rem', color: '#3F3F46', marginTop: '6px', fontWeight: 600, minHeight: '36px' }}>
                      {plan.subnote}
                    </div>
                  </div>

                  <hr style={{ border: 0, borderTop: '1px solid #E4E4E7', margin: '20px 0' }} />

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', marginBottom: '28px' }}>
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} style={{ fontSize: '0.88rem', color: '#3F3F46', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5 }}>
                        <span style={{ color: '#ff1717', fontWeight: 800 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={plan.link} style={{
                  background: idx === 0 ? '#ff1717' : '#101010',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  padding: '14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: idx === 0 ? '0 6px 20px rgba(255,23,23,0.3)' : 'none'
                }}>
                  {plan.ctaText}
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── DIY TEMPLATES & TOOLKITS SECTION ───────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
              Custom Financial Tools
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '8px', color: '#101010' }}>
              Donzen Accounting DIY Templates
            </h2>
            <p style={{ color: '#71717A', fontSize: '1rem', marginTop: '8px' }}>
              Ready-to-use custom Excel templates to manage recordkeeping, receivables, and payables offline.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {templates.map((tmpl, idx) => (
              <div key={idx} style={{
                background: '#F7F3F5',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #E4E4E7',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#101010', marginBottom: '12px' }}>
                    {tmpl.title}
                  </h3>
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#101010' }}>{tmpl.price}</span>
                    <span style={{ fontSize: '0.85rem', color: '#71717A' }}> {tmpl.period}</span>
                  </div>
                  <p style={{ color: '#3F3F46', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {tmpl.desc}
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', marginBottom: '24px' }}>
                    {tmpl.features.map((f, fidx) => (
                      <li key={fidx} style={{ fontSize: '0.85rem', color: '#27272A', display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#ff1717' }}>•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/contact" style={{
                  background: '#ff1717',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}>
                  {tmpl.cta} ➔
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── WHY DONZEN TOOLS SECTION ───────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F7F3F5', borderTop: '1px solid #E4E4E7' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
            borderLeft: '6px solid #ff1717'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#101010', marginBottom: '16px' }}>
              Need Donzen Accounting Tool for small businesses with no accountants?
            </h2>
            
            <p style={{ color: '#3F3F46', fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
              As a small business owner, you know how important it is to keep track of your finances. We understand that hiring an accountant and purchasing expensive accounting software can be costly, and learning accounting on your own can be overwhelming. That’s where our DIY accounting tools and resources come in.
            </p>
            <p style={{ color: '#3F3F46', fontSize: '1rem', lineHeight: 1.8, marginBottom: '24px' }}>
              Donzen Accounting tools and resources provide business owners and financial managers with the tools they need to effectively manage their finances, stay organized and informed, and make strategic decisions. Our tools are designed to save you time and hassle while providing you with accurate, up-to-date financial information.
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#101010', marginBottom: '16px' }}>
              With our custom tools, you’ll have the power to:
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {[
                'Track income and expenses in real-time',
                'Create and manage budgets and financial forecasts',
                'Generate and analyze financial reports',
                'Streamline financial processes and automate repetitive tasks',
                'Stay compliant with tax laws and regulations',
                'Easily share financial data with your team and advisors',
                'Collaborate with multiple teams, departments and stakeholders',
                'Access financial information anytime, anywhere with 24/7 access'
              ].map((benefit, idx) => (
                <div key={idx} style={{
                  background: '#F7F3F5',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  color: '#101010',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ color: '#ff1717', fontWeight: 800 }}>✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <p style={{ color: '#3F3F46', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '24px' }}>
              Whether you are a small business owner, a financial manager for a growing company, or a freelancer looking for a better way to manage your finances, our accounting tools and resources are the solution you’ve been searching for. With the tools, you will have the power to take control of your finances and grow your business. Our custom-built accounting tools are designed specifically for small business owners like you, with easy-to-use tools that make it simple to manage your financials. From invoice processing and expense tracking to tax preparation and financial reporting, we’ve got you covered.
            </p>

            <div style={{ textAlign: 'center' }}>
              <Link to="/contact" style={{
                background: '#ff1717',
                color: '#FFFFFF',
                padding: '16px 36px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 8px 24px rgba(255,23,23,0.3)'
              }}>
                Get Started With Donzen Tools
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}
