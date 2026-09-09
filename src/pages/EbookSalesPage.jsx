import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Countdown from '../components/Countdown'
import FaqItem from '../components/FaqItem'
import ProgressBar from '../components/ProgressBar'
import BookCover from '../components/BookCover'
import { useReveal } from '../hooks/useReveal'
import { useToasts } from '../hooks/useToasts'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'

const CHAPTERS = [
  { n: '01', title: "The Nigerian Entrepreneur's Mindset", desc: "7 mindset shifts that separate businesses that survive from those that don't. Start here." },
  { n: '02', title: 'Before You Start — 5 Non-Negotiables', desc: "The exact foundations every business must have before you spend your first naira." },
  { n: '03', title: '20 Businesses You Can Start With ₦50,000', desc: "Each idea includes startup cost, monthly income potential, suppliers, and step-by-step launch plan." },
  { n: '04', title: 'CAC Business Registration — Step by Step', desc: "How to officially register your business online with exact fees. No consultant needed." },
  { n: '05', title: 'Funding Your Business', desc: "CBN loans, Tony Elumelu grant, BOI, state government grants, and cooperative savings — all detailed." },
  { n: '06', title: 'Marketing on Zero Budget', desc: "Complete WhatsApp, Instagram & Facebook strategy that actually works for Nigerian small businesses." },
  { n: '07', title: 'Managing Money Like a Business Owner', desc: "The 50/30/20 rule, pricing formula, cash book system, and financial habits that build real wealth." },
  { n: '08', title: 'Real Nigerian Success Stories', desc: "6 Nigerians who built real businesses from exactly your starting point — names, cities, strategies." },
  { n: '09', title: 'Scaling from ₦50K to Millions', desc: "The exact roadmap from launch → ₦100K/month → ₦1M → enterprise-level business." },
  { n: '10', title: 'The Digital Economy Chapter', desc: "Freelancing, affiliate marketing, YouTube monetisation, dropshipping, virtual assistance — all Nigerian-specific." },
  { n: '11', title: 'Building Your Brand Identity', desc: "Logo, colours, packaging, social voice — how to look established with zero budget." },
  { n: '12', title: 'Customer Service That Builds Loyalty', desc: "The exact system that turns one-time buyers into lifetime ambassadors who refer others." },
  { n: '13', title: 'Legal Basics Every Nigerian Entrepreneur Needs', desc: "Contracts, IP, taxes, consumer protection — simplified and actionable." },
  { n: '14', title: 'Writing Your First Business Plan', desc: "A 7-section template you can fill in yourself and use immediately to access funding." },
  { n: '15', title: 'Understanding the Nigerian Market in 2026', desc: "10 emerging opportunities most Nigerians are sleeping on right now." },
]

const TESTIMONIALS = [
  { name: 'Chioma A.', role: 'Food Business Owner, Lagos', text: "I read this in one sitting. The food business chapter alone helped me set up my WhatsApp menu and get my first 3 customers in 5 days. I never thought it would be this simple." },
  { name: 'Emeka O.', role: 'Mini Importer, Onitsha', text: "The mini importation chapter is worth 10x the price. I followed the freight agent steps exactly and placed my first order in 3 days. Already doubled my investment in the first week." },
  { name: 'Fatima I.', role: 'Digital Skills Trainer, Kaduna', text: "I was an NYSC corper with ₦33K/month. The teaching business chapter changed my life. I now earn passive income from courses I recorded in my hostel room." },
  { name: 'Bello T.', role: 'Cleaning Business Owner, Kano', text: "The marketing chapter alone is worth a full course fee. I got my first cleaning contract from Instagram 2 weeks after reading this. Just follow the steps — it works." },
]

const FAQS = [
  ["Is this really just ₦2,500? What's the catch?",
    "Yes — ₦2,500 is the real price, and there is no catch. This is a launch price to get the guide into as many hands as possible. The price will increase. There are no hidden fees, no subscriptions, no upsells. You pay once and get everything listed."],
  ["I have no business experience. Will this still work for me?",
    "Absolutely — this guide was written specifically for beginners. Every chapter assumes you're starting from zero knowledge. The language is plain, the steps are numbered, and even if you've never run a business in your life, you'll know exactly what to do after reading."],
  ["What format is the guide? How do I receive it?",
    "The N50K Blueprint is a PDF (digital e-book). After payment, you receive an instant download link by email. Read it on your phone, tablet, or laptop. No app required. No waiting."],
  ["What if these businesses don't work in my state?",
    "The 20 businesses were specifically selected for the Nigerian market — not just Lagos or Abuja. They include ideas that work across Nigerian cities, towns, and semi-rural areas. The guide also shows you how to adapt each idea to your specific environment."],
  ["I've bought guides before that didn't help. How is this different?",
    "Most guides give you inspiration without information. The N50K Blueprint gives you both — but more importantly, the actual steps. Every business includes startup costs, income estimates, suppliers, marketing plans, and real examples of Nigerians who did it. This is an action guide, not a motivation book."],
  ["What payment methods are accepted?",
    "Payment is processed through Paystack — Nigeria's most trusted payment platform. You can pay with your debit card (Naira or Dollar), bank transfer, USSD, or mobile money. All transactions are fully secured and encrypted."],
  ["What happens if I have a problem accessing the guide?",
    "We're here to help. If you have any issue receiving or opening your Blueprint after payment, email us and we'll resolve it within 24 hours. Every purchase is tied to your email and we can always resend your download link. Our goal is to make sure you get into the guide and start building — we won't leave you hanging."],
  ["Will I get updates when the guide is revised?",
    "Yes. Once you purchase, you have lifetime access. Any time the N50K Blueprint is updated, you receive the new version at no extra cost. Your one-time payment covers everything, forever."],
  ["Is this guide only for young people or can anyone use it?",
    "This guide works for anyone who wants to build a business in Nigeria — NYSC corpers, graduates, civil servants, stay-at-home parents, market traders, people with side income looking to grow, and complete beginners of any age."],
]

export default function EbookSalesPage() {
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('product')
  const [product, setProduct] = useState(null)
  
  useReveal()
  useToasts()

  useEffect(() => {
    async function loadProduct() {
      try {
        let { data } = await supabase
          .from('products')
          .select('*')
          .eq('sales_page_path', '/ebook')
          .maybeSingle()

        if (!data) {
          const res = await supabase
            .from('products')
            .select('*')
            .eq('slug', 'freelance-web-design-blueprint')
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

  const price = product?.price || 2500
  const oldPrice = product?.old_price || 9000
  const savings = Math.max(0, oldPrice - price)
  const formattedPrice = formatPrice(price)
  const formattedOldPrice = formatPrice(oldPrice)
  const formattedSavings = formatPrice(savings)
  const discountPercentage = oldPrice > 0 ? Math.round((savings / oldPrice) * 100) : 0

  const go = () => { 
    const target = productId ? `/checkout?product=${productId}` : (product ? `/checkout?product=${product.id}` : '/checkout?product=ebook')
    navigate(target)
    window.scrollTo({ top: 0, behavior: 'smooth' }) 
  }

  return (
    <>
      {/* ── URGENCY BAR ─────────────────────────────────────────── */}
      <div className="urg-bar">
        ⏰ Special Launch Price Ending Soon — Save <span>{formattedSavings}</span> Today Only!
      </div>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(168deg, #052817 0%, #0D3B2E 45%, #10493A 100%)',
        color: '#fff', overflow: 'hidden', position: 'relative',
      }} className="pattern-bg">

        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 64 }}>
          {/* Eyebrow */}
          <p style={{
            textAlign: 'center', fontSize: '.78rem', fontWeight: 700, color: 'var(--gold)',
            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <span style={{ flex: 1, maxWidth: 44, height: 1, background: 'var(--gold)', opacity: .4 }} />
            For Every Nigerian Ready to Build
            <span style={{ flex: 1, maxWidth: 44, height: 1, background: 'var(--gold)', opacity: .4 }} />
          </p>

          {/* Headline */}
          <h1 className="display t-center" style={{ marginBottom: 22 }}>
            Turn <span className="t-gold">₦50,000</span> Into<br />
            a Real Business That<br />
            <em style={{ fontStyle: 'normal', color: 'var(--g400)' }}>Pays You Every Month</em>
          </h1>

          <p className="body-lg t-center" style={{ color: 'rgba(255,255,255,.76)', maxWidth: 560, margin: '0 auto 36px' }}>
            The complete step-by-step guide with <strong style={{ color: 'var(--gold)' }}>20 proven Nigerian businesses</strong> you can start right now — no connections, no big capital, no experience required.
          </p>

          {/* Book visual */}
          <div style={{ marginBottom: 36 }}>
            <BookCover />
          </div>

          {/* Social proof */}
          <div className="proof-bar" style={{ marginBottom: 28 }}>
            <div className="proof-avatars">
              {[
                { seed: 'Chioma', bg: '5c3d2e' },
                { seed: 'Emeka', bg: '3e2723' },
                { seed: 'Aisha', bg: '4a2c0a' },
                { seed: 'Fatima', bg: '3b1f0e' },
                { seed: 'Bello', bg: '2e1503' },
                { seed: 'Ngozi', bg: '4a2c0a' },
              ].map(({ seed, bg }, i) => (
                <span key={i} style={{ padding: 0, overflow: 'hidden', background: 'none', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={`/avatars/${seed.toLowerCase()}.png`}
                    alt={seed}
                    width={34}
                    height={34}
                    style={{ borderRadius: '50%', display: 'block', objectFit: 'cover' }}
                    onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.style.background = `#${bg}`; e.currentTarget.parentElement.textContent = seed[0]; }}
                  />
                </span>
              ))}
            </div>
            <p className="proof-text"><strong>1,847+ Nigerians</strong> already building their businesses</p>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <button className="btn-cta" onClick={go}>
              <span>
                YES! I Want My Blueprint — {formattedPrice}
                <span className="sub">Instant Digital Download · Permanent Access</span>
              </span>
              <span className="arrow">→</span>
            </button>
            <p style={{ fontSize: '.77rem', color: 'rgba(255,255,255,.4)', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>Secure Payment via Paystack · Instant Delivery</span>
            </p>
          </div>

          {/* Timer */}
          <div style={{ marginTop: 36 }}>
            <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'rgba(255,255,255,.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>Offer expires in</span>
            </p>
            <Countdown />
          </div>
        </div>
      </section>

      {/* ── LOGO BAR ────────────────────────────────────────────── */}
      <section className="section-sm" style={{ borderBottom: '1px solid var(--n200)' }}>
        <div className="wrap">
          <p style={{ textAlign: 'center', fontSize: '.72rem', fontWeight: 700, color: 'var(--n400)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 }}>
            Entrepreneurs Building Across Nigeria
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Enugu', 'Ibadan'].map(c => (
              <span key={c} style={{ fontSize: '.84rem', fontWeight: 700, color: 'var(--n600)', letterSpacing: '0.3px' }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-red">Sound Familiar?</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              You're Working Hard.<br />But <span className="t-red">Nothing Is Changing.</span>
            </h2>
            <p className="sec-sub">If any of these hit close to home, this guide was written specifically for you:</p>
          </div>

          <div className="reveal" style={{ transitionDelay: '.1s' }}>
            {[
              <><strong>You have money in your account</strong> but zero idea what business to use it for — so it just sits there shrinking.</>,
              <><strong>You've been job hunting for months</strong> — the silence is deafening and the frustration is building.</>,
              <><strong>You see people around you building something real</strong> and quietly wonder: why not me? What do they know that I don't?</>,
              <><strong>You've tried things before</strong> — someone sold you a dream that didn't deliver, and now you're cautious about everything.</>,
              <><strong>You earn a salary</strong> but it vanishes before month-end, leaving nothing to invest in your own future.</>,
              <><strong>You want to start a business</strong> but feel completely stuck — confused about which one, where to begin, what to do first.</>,
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 0', borderBottom: i < 5 ? '1px solid var(--n100)' : 'none' }}>
                <div style={{ width: 38, height: 38, minWidth: 38, borderRadius: '50%', background: 'var(--red-l)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.88rem', fontWeight: 800 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '.95rem', color: 'var(--n700)', lineHeight: 1.65 }}>{text}</p>
              </div>
            ))}
          </div>

          <div className="reveal hi-box" style={{ marginTop: 28, transitionDelay: '.2s' }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--g800)', lineHeight: 1.65 }}>
              "The problem isn't that you lack talent, drive, or potential. The problem is <em>nobody ever gave you the right information</em> about how to start and build a real business with what you already have."
            </p>
            <p style={{ fontSize: '.84rem', color: 'var(--g700)', marginTop: 10, fontWeight: 600 }}>— Nnanta Precious, Author of The N50K Blueprint</p>
          </div>
        </div>
      </section>

      {/* ── THE SOLUTION ────────────────────────────────────────── */}
      <section className="section section-dark pattern-bg">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-white">The Solution</span>
            <h2 className="h2 t-white" style={{ marginTop: 10 }}>
              Introducing: <span className="t-gold">The N50K Blueprint</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.72)', maxWidth: 520, margin: '12px auto 0', lineHeight: 1.72 }}>
              A complete, no-fluff, action-first guide to starting a profitable business in Nigeria with N50,000 or less — built specifically for your situation, your city, your budget.
            </p>
          </div>

          <div className="reveal grid-3" style={{ transitionDelay: '.1s' }}>
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, label: '20 Real Business Ideas', desc: 'Proven, working right now in Nigeria' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>, label: 'Step-by-Step Plans', desc: 'What to do Day 1, Week 1, Month 1' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>, label: 'Zero-Budget Marketing', desc: 'WhatsApp & Instagram strategies that work' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: 'Funding Sources', desc: 'CBN, grants, TEF, cooperatives — listed' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, label: 'Money Management', desc: 'Financial system that keeps businesses alive' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7"/><path d="M14 14.66V17c0 .55.45 1 1 1h2"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>, label: 'Success Stories', desc: '6 real Nigerians who built from nothing' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.07)', borderRadius: 'var(--r-lg)', padding: '20px 16px', border: '1px solid rgba(255,255,255,.1)', textAlign: 'center', transition: 'background .25s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
              >
                <div style={{ color: '#4ade80', marginBottom: 10, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '.9rem', marginBottom: 5 }}>{item.label}</div>
                <div style={{ color: 'rgba(255,255,255,.52)', fontSize: '.8rem', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ───────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-green">Full Chapter Breakdown</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              Here's Exactly What's Inside<br />Your <span className="t-green">55-Page Blueprint</span>
            </h2>
            <p className="sec-sub">Every chapter is actionable. No filler. No fluff. Just the information you need to build.</p>
          </div>

          <div className="reveal" style={{ transitionDelay: '.1s', background: 'var(--n50)', borderRadius: 'var(--r-xl)', padding: '8px 20px' }}>
            {CHAPTERS.map((ch, i) => (
              <div key={i} className="ch-item">
                <div className="ch-num">{ch.n}</div>
                <div>
                  <div className="ch-title">{ch.title}</div>
                  <div className="ch-desc">{ch.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal t-center" style={{ marginTop: 32, transitionDelay: '.15s' }}>
            <button className="btn-cta" onClick={go} style={{ margin: '0 auto' }}>
              <span>Get All 15 Chapters Now — {formattedPrice}<span className="sub">Instant PDF · Lifetime Access</span></span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── BONUSES ─────────────────────────────────────────────── */}
      <section className="section section-gray">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-gold">FREE Bonuses — Today Only</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              You Also Get These <span className="t-red">FREE</span><br />When You Order Right Now
            </h2>
            <p className="sec-sub">These bonuses disappear when the timer expires. They are only available at this launch price.</p>
          </div>

          <div className="reveal grid-2" style={{ transitionDelay: '.1s' }}>
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, title: 'Supplier Directory', val: '₦1,500', desc: 'Every major market in Lagos, Abuja, Kano, and Enugu — categorised by product type. Find wholesale suppliers for any of the 20 business ideas instantly.' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: 'Social Media Caption Pack', val: '₦1,200', desc: '30 ready-to-copy captions for Instagram, Facebook & WhatsApp. Plug in your product name and post immediately. No writing required.' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: 'Free Tools Directory', val: '₦800', desc: '14 free tools every Nigerian entrepreneur needs — from invoicing to design to payment collection. All free, all explained, all Nigerian-compatible.' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff1717" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: '100-Day N100K Action Plan', val: '₦2,000', desc: 'A day-by-day breakdown of exactly what to do in your first 100 days to reach your first ₦100,000 in sales — regardless of which business you pick.' },
            ].map((b, i) => (
              <div key={i} className="card card-accent">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--g50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{b.icon}</div>
                  <span style={{ background: 'var(--gold-l)', color: 'var(--gold-d)', fontWeight: 800, fontSize: '.74rem', padding: '4px 10px', borderRadius: 50 }}>{b.val} VALUE</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: '.96rem', marginBottom: 6 }}>{b.title}</p>
                <p style={{ fontSize: '.87rem', color: 'var(--n500)', lineHeight: 1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Value stack */}
          <div className="reveal" style={{ marginTop: 24, background: 'var(--g900)', borderRadius: 'var(--r-xl)', padding: '28px 24px', textAlign: 'center', transitionDelay: '.15s' }}>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.88rem', marginBottom: 6 }}>Total Real Value of Everything You Get</p>
            <p style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--n500)', textDecoration: 'line-through', lineHeight: 1 }}>{formattedOldPrice}</p>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.82rem', marginTop: 6, marginBottom: 4 }}>Your Price Today</p>
            <p style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1 }}>{formattedPrice}</p>
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.8rem', marginTop: 8 }}>You save {formattedSavings} — {discountPercentage}% off</p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-green">Real Results</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              What Nigerians Are Saying<br />After Reading The Blueprint
            </h2>
          </div>

          <div className="reveal grid-2" style={{ transitionDelay: '.1s' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi">
                <div className="stars">★★★★★</div>
                <p className="testi-quote">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-av">{t.name[0]}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="reveal" style={{ marginTop: 28, background: 'var(--g900)', borderRadius: 'var(--r-xl)', padding: '24px 20px', transitionDelay: '.15s' }}>
            <div className="stat-row">
              {[['1,847+', 'Copies Sold'], ['4.9/5', 'Average Rating'], ['100%', 'Satisfaction Rate']].map(([n, l]) => (
                <div key={l} className="stat-unit">
                  <div className="stat-num">{n}</div>
                  <div className="stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTHOR ──────────────────────────────────────────────── */}
      <section className="section section-green">
        <div className="wrap">
          <div className="reveal">
            <span className="badge badge-green">About the Author</span>
            <div style={{ marginTop: 20, background: '#fff', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--sh)', border: '1.5px solid var(--n100)' }}>
              <img src="/avatar.png" alt="Nnanta Precious" style={{ width: 86, height: 86, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <p style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.15rem', marginBottom: 3 }}>Nnanta Precious</p>
              <p style={{ textAlign: 'center', fontSize: '.84rem', color: 'var(--g700)', fontWeight: 600, marginBottom: 18 }}>Nigerian Entrepreneur & Business Strategist</p>
              <p style={{ fontSize: '.93rem', color: 'var(--n600)', lineHeight: 1.78, marginBottom: 14 }}>
                Nnanta Precious is a Nigerian entrepreneur, business educator, and strategist who has spent years studying, testing, and documenting exactly what works in the Nigerian small business ecosystem.
              </p>
              <p style={{ fontSize: '.93rem', color: 'var(--n600)', lineHeight: 1.78 }}>
                After watching thousands of talented Nigerians fail — not from lack of ability but from lack of the right information — he created The N50K Blueprint. The guide is built on a single belief:{' '}
                <strong style={{ color: 'var(--g800)' }}>Intelligence, determination, and the right information are more powerful than money, connections, or credentials.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEE ───────────────────────────────────────────── */}
      {/* ── GUARANTEE ───────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="reveal">
            <div className="guarantee">
              <div className="guarantee-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff1717' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="guarantee-title">Your Access Is Locked In — Permanently</div>
              <p className="guarantee-text">
                The moment you complete your payment, your copy of the N50K Blueprint is secured to your email address — permanently. You'll always have access to the guide and every future update at no extra charge. Your investment is locked in at today's lowest price, forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ──────────────────────────────────────────── */}
      <section className="section section-dark pattern-bg">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-white">The Choice Is Simple</span>
            <h2 className="h2 t-white" style={{ marginTop: 10 }}>
              The Real Cost of <span className="t-gold">NOT</span> Taking Action
            </h2>
          </div>

          <div className="reveal grid-2" style={{ transitionDelay: '.1s', gap: 16 }}>
            <div style={{ background: 'rgba(220,38,38,.1)', border: '1.5px solid rgba(220,38,38,.25)', borderRadius: 'var(--r-lg)', padding: 22 }}>
              <p style={{ fontWeight: 800, color: '#FCA5A5', marginBottom: 14, fontSize: '.92rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span>Without the Blueprint</span>
              </p>
              <ul className="list-x">
                {['Keep guessing which business to start', 'Waste months (years) figuring it out alone', 'Watch others build while you stay stuck', 'Lose money on the wrong decisions', 'Miss available funding and grants', 'Stay dependent on one income forever'].map((item, i) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,.62)', fontSize: '.88rem' }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: 'rgba(60,179,113,.1)', border: '1.5px solid rgba(60,179,113,.25)', borderRadius: 'var(--r-lg)', padding: 22 }}>
              <p style={{ fontWeight: 800, color: '#6EE7A0', marginBottom: 14, fontSize: '.92rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                <span>With the Blueprint</span>
              </p>
              <ul className="list-check white">
                {['Know exactly which business fits you in 1 hour', 'Start with a clear plan — every step mapped out', 'Build something real in your first 30 days', 'Avoid expensive mistakes with proven strategies', 'Apply for grants and loans you didn\'t know existed', 'Create income that doesn\'t depend on any employer'].map((item, i) => (
                  <li key={i} style={{ fontSize: '.88rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING BOX ─────────────────────────────────────────── */}
      <section className="section" id="buy">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Limited Time Offer</span>
            </span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              Get Your Blueprint Before<br />The Price Goes Up
            </h2>
            <p className="sec-sub">This is the lowest this guide will ever be priced. The price increases the moment the timer hits zero.</p>
            <div style={{ marginTop: 20 }}><Countdown /></div>
          </div>

          <div className="reveal" style={{ transitionDelay: '.12s' }}>
            <div className="pricing-box">
              <div className="pricing-inner">
                {/* Tags */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                  <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    <span>Complete 55-Page Guide</span>
                  </span>
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <span>Instant Download</span>
                  </span>
                  <span className="badge badge-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    <span>Lifetime Updates</span>
                  </span>
                </div>

                {/* Pricing */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div className="price-was">Regular Price: {formattedOldPrice}</div>
                  <div className="price-now">{formatPrice(price)}</div>
                  <div className="price-save" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                    <span>YOU SAVE {formattedSavings} TODAY</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 20 }}>
                  <ProgressBar pct={73} />
                </div>

                {/* What you get */}
                <div style={{ background: 'var(--g50)', borderRadius: 'var(--r-lg)', padding: '16px 20px', marginBottom: 22 }}>
                  <p style={{ fontWeight: 700, fontSize: '.85rem', color: 'var(--g800)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Everything Included:</span>
                  </p>
                  <ul className="list-check">
                    {[
                      'The N50K Blueprint — Complete 55-Page Guide',
                      '20 Business Ideas with Step-by-Step Plans',
                      'Supplier Directory (Every major Nigerian market)',
                      '30 Ready-to-Post Social Media Captions',
                      '100-Day ₦100K Action Plan',
                      '14 Free Business Tools Directory',
                      'Lifetime Access — All Future Updates FREE',
                    ].map((item, i) => <li key={i} style={{ fontSize: '.88rem' }}>{item}</li>)}
                  </ul>
                </div>

                {/* CTA */}
                <button className="btn-cta" onClick={go} style={{ maxWidth: '100%', fontSize: '1.1rem', padding: '22px 28px' }}>
                  <span>
                    Yes! Get My Blueprint Now — {formattedPrice}
                    <span className="sub">Secure Paystack · Instant Lifetime Access</span>
                  </span>
                  <span className="arrow">→</span>
                </button>

                {/* Trust */}
                <div style={{ marginTop: 16 }}>
                  <div className="trust-bar">
                    <span className="trust-item"><span className="trust-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>Paystack Secured</span>
                    <span className="trust-item"><span className="trust-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>Instant Delivery</span>
                    <span className="trust-item"><span className="trust-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>Permanent Access</span>
                    <span className="trust-item"><span className="trust-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>Works on Phone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="section section-gray">
        <div className="wrap">
          <div className="reveal sec-head">
            <span className="badge badge-green">FAQ</span>
            <h2 className="h2" style={{ marginTop: 10 }}>Questions? We Have Answers.</h2>
            <p className="sec-sub">Every concern you might have — answered honestly.</p>
          </div>
          <div className="reveal" style={{ transitionDelay: '.1s' }}>
            {FAQS.map(([q, a], i) => <FaqItem key={i} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="section section-dark pattern-bg" style={{ background: 'linear-gradient(168deg, #052817 0%, #0F4A36 100%)' }}>
        <div className="wrap t-center">
          <div className="reveal">
            <div style={{ color: '#eab308', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h2 className="h2 t-white" style={{ marginBottom: 14 }}>
              Nigeria Belongs to Those<br />Who <span className="t-gold">Dare to Build.</span>
            </h2>
            <p className="body-lg" style={{ color: 'rgba(255,255,255,.72)', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.75 }}>
              Right now, thousands of Nigerians are reading this same page. Some will close the tab and go back to hoping things change on their own. A few will click the button below.{' '}
              <strong style={{ color: '#fff' }}>Those few will build something real.</strong>{' '}
              The only question is: which group are you in?
            </p>
            <Countdown />
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <button className="btn-cta" onClick={go} style={{ fontSize: '1.12rem' }}>
                <span>
                  Get My N50K Blueprint — {formattedPrice}
                  <span className="sub">Instant Download · Lifetime Access · Secure Payment</span>
                </span>
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
