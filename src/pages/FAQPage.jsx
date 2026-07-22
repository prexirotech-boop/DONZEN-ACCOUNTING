import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqList = [
    {
      question: "About Donzen Accounting Services?",
      answer: "We strongly encourage small business owners looking for expert bookkeeping and accounting services to look no further. Contact us today to see how we can help you achieve financial success."
    },
    {
      question: "How Do I Access My Account?",
      answer: "After a complete payment, a confirmation email with details of your business account will be created and sent to you within 48 hours. These services are accessible from anywhere you have access to internet with your devices i.e Desktop, Laptops or Smart Mobile Phones, however, we strongly advise the use of a computer."
    },
    {
      question: "How long do I have access to my business records and reports online?",
      answer: "After enrolling, you have unlimited access to your business account for as long as you like – across any and all devices you own provided that you have made monthly payment in advance. The account starts now and never ends! You decide when you start and when you stop or cancel anytime."
    },
    {
      question: "How can I make Payment?",
      answer: (
        <div>
          <p style={{ margin: '0 0 12px' }}>You can proceed to check out and complete your purchase online. Also, you can pay using direct bank transfer into:</p>
          <div style={{
            background: 'rgba(255,23,23,0.06)',
            border: '1px solid rgba(255,23,23,0.2)',
            borderRadius: '10px',
            padding: '16px',
            fontWeight: 600,
            color: '#101010'
          }}>
            <div style={{ color: '#ff1717', fontWeight: 800, marginBottom: '4px' }}>Bank Transfer Account Details:</div>
            <div>Account Name: <strong>Donzen Accounting Hub</strong></div>
            <div>Account No: <strong style={{ color: '#ff1717', fontSize: '1.1rem', letterSpacing: '1px' }}>1211575347</strong></div>
            <div>Bank: <strong>Zenith Bank</strong></div>
          </div>
        </div>
      )
    },
    {
      question: "What if I am unhappy with the services and don't get what I was expecting?",
      answer: "We would never want you to be unhappy because we invest a ton of time making sure that we fix your recordkeeping, business accounting, and financial reports that you can rely on for making informed business decisions. The financial advisory knowledge you can apply immediately is worth more. If you are unsatisfied with your purchase or have a change of mind, contact us immediately to reach a common ground and resolve our interests."
    },
    {
      question: "Can I get financial advisory services for free?",
      answer: "Check our plans and pricing, then choose a plan that gives you access to free advisory services and resources that you are comfortable with accordingly."
    }
  ]

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3F5', color: '#101010', fontFamily: 'var(--font)', padding: '80px 20px 90px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{ 
            background: 'rgba(255, 23, 23, 0.1)', 
            color: '#ff1717', 
            padding: '6px 18px', 
            borderRadius: 50, 
            fontSize: 13, 
            fontWeight: 800, 
            letterSpacing: '1.5px', 
            textTransform: 'uppercase', 
            display: 'inline-block',
            marginBottom: 16
          }}>
            Explore The Latest Updates On Our Services
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#101010', margin: '0 0 16px', lineHeight: 1.2 }}>
            Frequently Asked <span style={{ color: '#ff1717' }}>Questions</span>
          </h1>
          <p style={{ fontSize: 16, color: '#71717A', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Learn more about Donzen Virtual Bookkeeping & Accounting Services, client account access, payments, and advisory.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 60 }}>
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  border: isOpen ? '1.5px solid #ff1717' : '1px solid #E4E4E7',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isOpen ? '0 8px 24px rgba(255, 23, 23, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#101010',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    gap: 16
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{
                    color: isOpen ? '#ff1717' : '#71717A',
                    fontSize: 22,
                    fontWeight: '700',
                    transition: 'transform 0.25s ease',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                    display: 'inline-block',
                    lineHeight: 1
                  }}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 22px',
                    color: '#3F3F46',
                    fontSize: 15,
                    lineHeight: 1.7,
                    borderTop: '1px solid #F4F4F5',
                    paddingTop: 16
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div style={{ 
          background: 'linear-gradient(135deg, #101010 0%, #18181B 100%)', 
          borderRadius: 18, 
          padding: '44px 32px', 
          textAlign: 'center',
          color: '#FFFFFF',
          boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
          borderBottom: '3px solid #ff1717'
        }}>
          <h3 style={{ fontSize: 22, color: '#ffffff', fontWeight: 900, margin: '0 0 10px' }}>Still Have Questions?</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, margin: '0 0 24px', lineHeight: 1.6, maxWidth: 540, marginInline: 'auto' }}>
            Our team is ready and waiting to help online and on the phone. Reach out directly for personalized guidance.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/contact" 
              style={{ 
                background: '#ff1717', 
                color: '#ffffff', 
                padding: '14px 32px', 
                borderRadius: 8, 
                fontWeight: 800, 
                fontSize: 15, 
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(255,23,23,0.3)'
              }}
            >
              Contact Our Team
            </Link>
            <a 
              href="https://wa.me/message/XUEP2CGZ4FM6E1" 
              target="_blank" 
              rel="noreferrer"
              style={{ 
                background: '#22c55e', 
                color: '#ffffff', 
                padding: '14px 28px', 
                borderRadius: 8, 
                fontWeight: 800, 
                fontSize: 15, 
                textDecoration: 'none'
              }}
            >
              WhatsApp Support 💬
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
