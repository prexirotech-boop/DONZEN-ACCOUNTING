import React from 'react'
import { Link } from 'react-router-dom'

export default function ServicesPage() {
  const services = [
    {
      num: '01',
      title: 'Bookkeeping & Accounting Services for Small Business',
      desc: 'At Donzen Accounting Hub, we understand that managing the finances of a business can be a complex and time-consuming task. That’s why we offer comprehensive, accurate, and reliable bookkeeping and accounting services to help businesses like yours stay on top of their financial records and make informed decisions.',
      features: [
        'Routine Business Accounting Transactions Entry',
        'Inventory Accounting & Management (up to 350 stock items)',
        'Fixed Assets Maintenance & Admin Expenses Tracking',
        'Staff Payroll Management & PAYE Computation',
        'Account Receivables & Payables (up to 1,000 invoices/receipts)',
        'Tax Computation: CIT, WHT, VAT, PAYE',
        '24/7 Access to Real-Time Financial Reports on any device',
        'Bank & Account Reconciliations with 30-min Advisory'
      ]
    },
    {
      num: '02',
      title: 'Donzen Accounting Experience Program',
      desc: 'Donzen Accounting Experience Program is a 30-Day Online Accounting Training and Certification Academy, where you learn lifetime accounting skills needed in any workplace, and ultimately gain hands-on practical experience that you can apply immediately in your professional career or business.',
      features: [
        'Hands-on practical recordkeeping skills',
        'QuickBooks & Microsoft Excel real-world training',
        'Inventory accounting & management workflows',
        'Financial report generation & analysis',
        'No expensive software setup required — learn step by step',
        'Batch enrollment with dedicated mentor guidance'
      ]
    },
    {
      num: '03',
      title: 'Accounting Tools & Resources to Help You',
      desc: 'Our tools are designed with ease-of-use in mind and are intuitive to navigate, even for those without a background in accounting. Whether you are a small business owner, a financial manager for a growing company, or a freelancer looking for a better way to manage your finances, our accounting tools and resources are the solution you’ve been searching for.',
      features: [
        'Track income and expenses in real-time',
        'Create and manage budgets and financial forecasts',
        'Generate and analyze financial statements effortlessly',
        'Streamline processes and automate repetitive tasks',
        'Stay compliant with tax laws and regulations',
        'Collaborate with multiple teams, departments and stakeholders'
      ]
    },
    {
      num: '04',
      title: 'Accounting Systems & Procedures for SMEs',
      desc: 'Efficiency and accuracy are crucial for any business, and that is why we offer customized accounting procedures and systems that streamline financial processes and reduce the risk of errors.',
      features: [
        'Internal control setup to block financial loopholes',
        'Standard Operating Procedures (SOPs) for finance teams',
        'Cost-effective solutions tailored to your SME scale',
        'Timely delivery of audited and year-end statements',
        'Peace of mind knowing experts handle your financial architecture'
      ]
    },
    {
      num: '05',
      title: 'Donzen Accounting Templates for Small Business',
      desc: 'We are here to help you feel confident about record-keeping, accounting, and financial reports. We know that you have a lot to deal with, and we want to make sure your business is getting the most out of its accounting complexity and finding the best way to manage your finances.',
      features: [
        'Profit and Loss Statements Template for businesses with no accountant',
        'Vendors / Suppliers Management DIY Template',
        'Customers / Clients Management DIY Template',
        'Chart of Accounts (COA) setup guide',
        'Petty cash tracking and aging analysis templates'
      ]
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
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <span style={{ color: '#ff1717', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
            Our Professional Solutions
          </span>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)', fontWeight: 900, marginTop: '12px', marginBottom: '16px', color: '#FFFFFF' }}>
            Comprehensive Bookkeeping & Financial Services
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '650px', margin: '0 auto' }}>
            We are your choice partner with the best experience in providing exceptional and relatable bookkeeping solutions you need to succeed.
          </p>
        </div>
      </section>

      {/* ─── SERVICES LIST ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F7F3F5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {services.map((svc) => (
            <div key={svc.num} style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              borderLeft: '5px solid #ff1717',
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '36px',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ff1717' }}>{svc.num}.</span>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#101010', margin: '8px 0 16px' }}>
                  {svc.title}
                </h2>
                <p style={{ color: '#3F3F46', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
                  {svc.desc}
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Link to="/resources" style={{
                    background: '#ff1717',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.92rem'
                  }}>
                    View Plans & Pricing
                  </Link>
                  <Link to="/contact" style={{
                    background: '#101010',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.92rem'
                  }}>
                    Request Service
                  </Link>
                </div>
              </div>

              <div style={{
                background: '#F7F3F5',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #E4E4E7'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#101010', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                  Key Service Highlights:
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                  {svc.features.map((feat, idx) => (
                    <li key={idx} style={{ fontSize: '0.9rem', color: '#27272A', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5 }}>
                      <span style={{ color: '#ff1717', fontWeight: 800 }}>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ─── BOTTOM CTA ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #101010 0%, #18181B 100%)',
        color: '#FFFFFF',
        padding: '70px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 750, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '16px', color: '#FFFFFF' }}>
            Need Custom Accounting Advice?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
            Get in touch with our team of expert accountants today to discuss your business accounting requirements.
          </p>
          <Link to="/contact" style={{
            background: '#ff1717',
            color: '#FFFFFF',
            padding: '16px 36px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Contact Us Now
          </Link>
        </div>
      </section>

    </div>
  )
}
