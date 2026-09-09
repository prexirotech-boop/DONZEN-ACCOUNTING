import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// ─── Intersection Observer Hook ───────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el) } },
      { threshold: 0.15, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 800 }) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const start = prev.current
    const end = value
    prev.current = end
    if (start === end) return
    const startTime = performance.now()
    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, duration])
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>
}

// ─── Commission tiers data ────────────────────────────────────────────────────
const TIERS = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    name: 'Bronze',
    range: '0 – 5 sales',
    rate: 20,
    color: '#a05c34',
    gradient: 'linear-gradient(135deg, #a05c34 0%, #7c4a28 100%)',
    border: 'rgba(160, 92, 52, 0.5)',
    glow: 'rgba(160, 92, 52, 0.2)',
    bg: 'rgba(160, 92, 52, 0.08)',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    name: 'Silver',
    range: '6 – 20 sales',
    rate: 25,
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
    border: 'rgba(148, 163, 184, 0.5)',
    glow: 'rgba(148, 163, 184, 0.2)',
    bg: 'rgba(148, 163, 184, 0.08)',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7"/><path d="M14 14.66V17c0 .55.45 1 1 1h2"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    name: 'Gold',
    range: '21 – 50 sales',
    rate: 30,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    border: 'rgba(245, 158, 11, 0.5)',
    glow: 'rgba(245, 158, 11, 0.2)',
    bg: 'rgba(245, 158, 11, 0.08)',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>,
    name: 'Platinum',
    range: '50+ sales',
    rate: 35,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    border: 'rgba(139, 92, 246, 0.5)',
    glow: 'rgba(139, 92, 246, 0.25)',
    bg: 'rgba(139, 92, 246, 0.08)',
  },
]

const AVG_PRICE = 15000

function getTier(sales) {
  if (sales <= 5) return TIERS[0]
  if (sales <= 20) return TIERS[1]
  if (sales <= 50) return TIERS[2]
  return TIERS[3]
}

const FAQS = [
  {
    q: 'When do I get paid?',
    a: 'Payouts are processed monthly, on the 1st of every month. You need a minimum balance of ₦5,000 to trigger a payout. Earnings below this roll over to the next month.',
  },
  {
    q: 'How long is the cookie duration?',
    a: 'Our affiliate cookies last 30 days. That means if someone clicks your link today and purchases anytime within 30 days, you earn the commission — no matter how many times they visit.',
  },
  {
    q: 'What products can I promote?',
    a: 'You can promote every published product on Donzen Accounting Hub — all courses, templates, and bookkeeping services. New resources are added regularly, giving you fresh content to promote.',
  },
  {
    q: 'Is there a limit on how much I can earn?',
    a: 'Absolutely not! There is zero cap on your earnings. The more you share, the more you earn. Our top affiliates earn six figures monthly promoting our products to their audiences.',
  },
  {
    q: 'How do I get my affiliate link?',
    a: 'Simply create a free account on Donzen Accounting Hub. Your personal affiliate link is generated automatically and available instantly in your dashboard under the "Affiliate" tab.',
  },
  {
    q: 'Can I track my referrals in real time?',
    a: 'Yes! Your affiliate dashboard gives you real-time visibility into clicks, conversions, and earnings. You can see exactly which promotions are working best.',
  },
]

const BENEFITS = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: 'Real-Time Dashboard',
    desc: 'Track clicks, conversions, and earnings live with your personal affiliate dashboard.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    title: '30-Day Cookie',
    desc: 'Earn commission on any purchase made within 30 days of your referral click.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    title: 'Monthly Payouts',
    desc: 'Get paid every month directly to your bank account. No delays, no excuses.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    title: 'No Minimum to Join',
    desc: 'Sign up for free and start earning immediately. Zero upfront cost required.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: 'Instant Access',
    desc: 'Get your unique affiliate link the moment you create your account. No approval wait.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Dedicated Support',
    desc: 'Our affiliate team is available to help you maximise your earnings and strategy.',
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AffiliatePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [copied, setCopied] = useState(false)
  const [salesCount, setSalesCount] = useState(10)
  const [openFaq, setOpenFaq] = useState(null)
  const [affiliateCount, setAffiliateCount] = useState(1200)
  const [hoveredTier, setHoveredTier] = useState(null)
  const [hoveredBenefit, setHoveredBenefit] = useState(null)

  const affiliateLink = profile?.affiliate_code
    ? `${window.location.origin}/?ref=${profile.affiliate_code}`
    : null

  async function handleCopyLink() {
    if (affiliateLink) {
      await navigator.clipboard.writeText(affiliateLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .not('affiliate_code', 'is', null)
      .then(({ count }) => {
        if (count && count > 0) setAffiliateCount(count)
      })
  }, [])

  const currentTier = getTier(salesCount)
  const monthlyEarnings = Math.round(salesCount * AVG_PRICE * (currentTier.rate / 100))

  const [heroRef, heroInView] = useInView()
  const [howRef, howInView] = useInView()
  const [tierRef, tierInView] = useInView()
  const [calcRef, calcInView] = useInView()
  const [benefitsRef, benefitsInView] = useInView()
  const [faqRef, faqInView] = useInView()
  const [ctaRef, ctaInView] = useInView()

  const fadeIn = (inView, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
  })

  const font = { fontFamily: 'var(--font, Inter, sans-serif)' }

  return (
    <div style={{ ...font, background: '#09090f', color: '#e2e8f0', overflowX: 'hidden' }}>

      {/* Global keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,0.9); }
          50%       { opacity: 0.5; box-shadow: 0 0 3px rgba(34,197,94,0.4); }
        }
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.03); }
        }
        input[type=range] { -webkit-appearance: none; appearance: none; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #8b5cf6;
          box-shadow: 0 0 14px rgba(139,92,246,0.7);
          cursor: pointer;
          border: 3px solid #fff;
          margin-top: -9px;
        }
        input[type=range]::-webkit-slider-runnable-track {
          height: 6px; border-radius: 3px;
          background: linear-gradient(to right, #8b5cf6, #6d28d9);
        }
        input[type=range]::-moz-range-thumb {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #8b5cf6;
          box-shadow: 0 0 14px rgba(139,92,246,0.7);
          cursor: pointer;
          border: 3px solid #fff;
        }
        .aff-how-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .aff-how-card:hover { transform: translateY(-8px) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.18) !important; }
        .aff-tier-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
        .aff-tier-card:hover { transform: translateY(-8px) scale(1.025) !important; }
        .aff-benefit-card { transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease; }
        .aff-benefit-card:hover { transform: translateY(-4px); }
        .aff-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: #fff; padding: 14px 36px; border-radius: 14px;
          font-weight: 700; font-size: 15px; text-decoration: none;
          border: none; cursor: pointer;
          box-shadow: 0 4px 24px rgba(139,92,246,0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
          font-family: var(--font, Inter, sans-serif);
        }
        .aff-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(139,92,246,0.6); filter: brightness(1.1); }
        .aff-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.07);
          color: #e2e8f0; padding: 14px 28px; border-radius: 14px;
          font-weight: 600; font-size: 15px; text-decoration: none;
          border: 1px solid rgba(255,255,255,0.14);
          transition: background 0.25s ease, transform 0.25s ease;
          font-family: var(--font, Inter, sans-serif);
        }
        .aff-btn-ghost:hover { background: rgba(255,255,255,0.14); transform: translateY(-3px); }
        .aff-faq-item { transition: border-color 0.3s ease; }
        .aff-faq-item[data-open="true"] { border-color: rgba(139,92,246,0.4) !important; }
        .aff-copy-btn {
          padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer;
          font-weight: 700; font-size: 13px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-family: var(--font, Inter, sans-serif);
          white-space: nowrap; flex-shrink: 0;
        }
        .aff-copy-btn:hover { transform: scale(1.04); }
      `}</style>

      {/* ════════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(150deg, #0f0c29 0%, #302b63 55%, #24243e 100%)',
          overflow: 'hidden',
          padding: '120px 24px 100px',
        }}
      >
        {/* Orbs */}
        <div style={{
          position: 'absolute', top: '-18%', left: '-12%',
          width: '650px', height: '650px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
          animation: 'float-orb 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-22%', right: '-12%',
          width: '750px', height: '750px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
          filter: 'blur(65px)', pointerEvents: 'none',
          animation: 'float-orb 10s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '45%', left: '45%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%)',
          filter: 'blur(55px)', pointerEvents: 'none',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', margin: '0 auto', ...fadeIn(heroInView) }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: '100px', padding: '7px 20px',
            fontSize: '13px', fontWeight: 700, color: '#c4b5fd',
            marginBottom: '30px', letterSpacing: '0.4px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Donzen Accounting Hub Affiliate Program</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 4.5rem)',
            fontWeight: 900, lineHeight: 1.08, marginBottom: '22px',
            background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Earn Money<br />Sharing Resources
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#94a3b8',
            lineHeight: 1.75, marginBottom: '32px',
            maxWidth: '560px', margin: '0 auto 32px',
          }}>
            Join the Donzen Accounting Hub Affiliate Program and earn up to{' '}
            <strong style={{ color: '#c4b5fd', fontWeight: 800 }}>35% commission</strong> on every
            sale you refer. No experience needed, no upfront cost — just share and earn.
          </p>

          {/* Live stat */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px', padding: '9px 22px',
            fontSize: '13px', color: '#94a3b8', marginBottom: '40px',
          }}>
            <span style={{
              width: '9px', height: '9px', borderRadius: '50%',
              background: '#22c55e', flexShrink: 0,
              animation: 'pulse-dot 2s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(34,197,94,0.9)',
            }} />
            Join <strong style={{ color: '#e2e8f0', margin: '0 5px' }}>{affiliateCount.toLocaleString()}+</strong> affiliates already earning
          </div>

          {/* Conditional CTAs */}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              {affiliateLink && (
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(139,92,246,0.35)',
                  borderRadius: '18px', padding: '22px 26px',
                  maxWidth: '560px', width: '100%', backdropFilter: 'blur(14px)',
                }}>
                  <p style={{
                    fontSize: '11px', fontWeight: 700, color: '#64748b',
                    letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span>Your Affiliate Link</span>
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      flex: 1, background: 'rgba(0,0,0,0.35)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '100px', padding: '11px 14px',
                      fontSize: '13px', color: '#c4b5fd', fontFamily: 'monospace',
                      minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {affiliateLink}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="aff-copy-btn"
                      style={{
                        background: copied
                          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                          : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        color: '#fff',
                        boxShadow: copied
                          ? '0 4px 16px rgba(34,197,94,0.4)'
                          : '0 4px 16px rgba(139,92,246,0.4)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {copied ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        'Copy Link'
                      )}
                    </button>
                  </div>
                </div>
              )}
              <Link to="/dashboard?tab=affiliate" className="aff-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>Start Earning Now</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="aff-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3 1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                <span>Create Free Account</span>
              </Link>
              <Link to="/login" className="aff-btn-ghost">
                Already have an account? Log in →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          2. HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: '#f8fafc' }}>
        <div ref={howRef} style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6d28d9', marginBottom: '12px', textAlign: 'center' }}>
            Simple Process
          </p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)', fontWeight: 800, color: '#1a1f36', textAlign: 'center', marginBottom: '14px', lineHeight: 1.2 }}>
            How It Works
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', textAlign: 'center', maxWidth: '500px', margin: '0 auto 64px', lineHeight: 1.75 }}>
            Three simple steps stand between you and your first commission check.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', position: 'relative' }}>
            {[
              { step: 1, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>, title: 'Get Your Unique Link', desc: 'Sign up for free and receive your personal affiliate link instantly. No approval process, no waiting — immediate access the moment you register.', bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
              { step: 2, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>, title: 'Share With Your Audience', desc: 'Share on WhatsApp, Instagram, Twitter, YouTube, your blog — anywhere. The more channels you use and the more consistently you share, the more you earn.', bg: 'linear-gradient(135deg, #6366f1, #4338ca)' },
              { step: 3, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: 'Earn 20–35% Commission', desc: 'Earn real money on every successful sale you refer within 30 days of your link click. Commissions grow as your referral count increases.', bg: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
            ].map((item, i) => (
              <div
                key={i}
                className="aff-how-card"
                style={{
                  background: '#fff',
                  borderRadius: '22px',
                  padding: '38px 30px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  textAlign: 'center',
                  position: 'relative',
                  ...fadeIn(howInView, i * 120),
                }}
              >
                {/* Step number bubble */}
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#8b5cf6', color: '#fff',
                  fontWeight: 800, fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(139,92,246,0.55)',
                }}>
                  {item.step}
                </div>
                {/* Icon */}
                <div style={{
                  width: '76px', height: '76px', borderRadius: '22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', margin: '0 auto 22px',
                  background: item.bg,
                  boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#1a1f36', marginBottom: '12px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.93rem', color: '#64748b', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          3. COMMISSION TIERS
      ════════════════════════════════════════════════════ */}
      <div style={{ padding: '100px 24px', background: '#09090f' }}>
        <div ref={tierRef} style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: '12px', textAlign: 'center' }}>
            Commission Structure
          </p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)', fontWeight: 800, color: '#f1f5f9', textAlign: 'center', marginBottom: '14px', lineHeight: 1.2 }}>
            Earn More As You Grow
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', textAlign: 'center', maxWidth: '500px', margin: '0 auto 64px', lineHeight: 1.75 }}>
            Your commission rate automatically upgrades as you refer more sales. Based on an average product price of ₦15,000.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '22px' }}>
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className="aff-tier-card"
                onMouseEnter={() => setHoveredTier(i)}
                onMouseLeave={() => setHoveredTier(null)}
                style={{
                  borderRadius: '22px', padding: '32px 26px',
                  textAlign: 'center',
                  border: `1px solid ${tier.border}`,
                  background: tier.bg,
                  boxShadow: hoveredTier === i ? `0 20px 60px ${tier.glow}` : `0 6px 28px ${tier.glow}`,
                  position: 'relative', overflow: 'hidden',
                  ...fadeIn(tierInView, i * 110),
                }}
              >
                <div style={{ color: tier.color, marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
                  {tier.icon}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: tier.color, marginBottom: '5px' }}>
                  {tier.name}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', opacity: 0.65, color: tier.color, marginBottom: '22px' }}>
                  {tier.range}
                </div>
                <div style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                  fontWeight: 900, color: '#f1f5f9',
                  lineHeight: 1, marginBottom: '6px',
                }}>
                  {tier.rate}%
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                  per referred sale
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px 14px',
                  fontSize: '13px', color: '#94a3b8',
                }}>
                  Earn <strong style={{ color: tier.color }}>₦{(15000 * tier.rate / 100).toLocaleString()}</strong> per avg. sale
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          4. EARNINGS CALCULATOR
      ════════════════════════════════════════════════════ */}
      <div style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #09090f 0%, #120d24 50%, #09090f 100%)' }}>
        <div ref={calcRef} style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', ...fadeIn(calcInView) }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: '12px' }}>
            Interactive Calculator
          </p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: '14px', lineHeight: 1.2 }}>
            Estimate Your Monthly Earnings
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 52px', lineHeight: 1.75 }}>
            Slide to see how much you could earn each month based on your referral volume.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '28px', padding: 'clamp(28px, 5vw, 56px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            {/* Slider */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 600 }}>Referrals Per Month:</span>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#8b5cf6' }}>{salesCount}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={salesCount}
                onChange={e => setSalesCount(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                <span>1 sale</span>
                <span>50 sales</span>
                <span>100+ sales</span>
              </div>
            </div>

            {/* Projected earnings display */}
            <div style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.22)',
              borderRadius: '20px', padding: '28px 24px',
              marginBottom: '28px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Estimated Monthly Earnings
              </div>
              <div style={{ fontSize: 'clamp(2.6rem, 6vw, 3.8rem)', fontWeight: 900, color: '#f1f5f9', lineHeight: 1.1, marginBottom: '6px' }}>
                ₦{monthlyEarnings.toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px' }}>
                At {currentTier.rate}% commission × ₦{AVG_PRICE.toLocaleString()} avg price × {salesCount} sales
              </div>

              {/* Tier badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                borderRadius: '100px', padding: '9px 22px',
                background: currentTier.bg,
                border: `1px solid ${currentTier.border}`,
                color: currentTier.color, fontSize: '14px', fontWeight: 700,
              }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>{currentTier.icon}</span>
                {currentTier.name} Tier — {currentTier.rate}% Commission
              </div>

              {/* Annual projection */}
              <div style={{
                marginTop: '26px', padding: '18px 20px',
                background: 'rgba(0,0,0,0.22)', borderRadius: '14px',
                fontSize: '14px', color: '#64748b', lineHeight: 1.75,
                display: 'flex', alignItems: 'flex-start', gap: 10
              }}>
                <div style={{ color: '#eab308', marginTop: 2, flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zM9 21h6"/></svg>
                </div>
                <div>
                  That's{' '}
                  <strong style={{ color: '#e2e8f0', fontSize: '1.05em' }}>
                    ₦{(monthlyEarnings * 12).toLocaleString()}
                  </strong>{' '}
                  per year —{' '}
                  {monthlyEarnings >= 200000
                    ? 'enough to replace a full-time salary!'
                    : monthlyEarnings >= 80000
                    ? 'enough to cover rent and living expenses!'
                    : monthlyEarnings >= 30000
                    ? 'a solid passive side income stream!'
                    : 'a great start — scale up and earn more!'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          5. WHY JOIN US — BENEFITS
      ════════════════════════════════════════════════════ */}
      <div style={{ padding: '100px 24px', background: '#09090f' }}>
        <div ref={benefitsRef} style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: '12px', textAlign: 'center' }}>
            Why Choose Us
          </p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)', fontWeight: 800, color: '#f1f5f9', textAlign: 'center', marginBottom: '14px', lineHeight: 1.2 }}>
            Everything You Need to Succeed
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', textAlign: 'center', maxWidth: '500px', margin: '0 auto 64px', lineHeight: 1.75 }}>
            We give you the tools, tracking, and support to maximise your earnings from day one.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="aff-benefit-card"
                onMouseEnter={() => setHoveredBenefit(i)}
                onMouseLeave={() => setHoveredBenefit(null)}
                style={{
                  display: 'flex', gap: '18px', alignItems: 'flex-start',
                  background: hoveredBenefit === i ? 'rgba(139,92,246,0.07)' : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${hoveredBenefit === i ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '18px', padding: '26px',
                  ...fadeIn(benefitsInView, i * 80),
                }}
              >
                <div style={{
                  width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(99,102,241,0.12))',
                  border: '1px solid rgba(139,92,246,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '7px' }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: '0.89rem', color: '#64748b', lineHeight: 1.65 }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          6. FAQ ACCORDION
      ════════════════════════════════════════════════════ */}
      <div style={{
        padding: '100px 24px',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div ref={faqRef} style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: '12px', textAlign: 'center' }}>
            Got Questions?
          </p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)', fontWeight: 800, color: '#f1f5f9', textAlign: 'center', marginBottom: '14px', lineHeight: 1.2 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', textAlign: 'center', maxWidth: '500px', margin: '0 auto 60px', lineHeight: 1.75 }}>
            Everything you need to know before you get started.
          </p>

          <div style={{ maxWidth: '740px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', ...fadeIn(faqInView) }}>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={i}
                  className="aff-faq-item"
                  data-open={isOpen.toString()}
                  style={{
                    background: isOpen ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isOpen ? 'rgba(139,92,246,0.38)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '16px', overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      padding: '22px 26px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: '18px', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'var(--font, Inter, sans-serif)',
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.45, flex: 1 }}>
                      {faq.q}
                    </span>
                    <span style={{
                      width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
                      background: isOpen ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease, background 0.2s ease',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 26px 22px',
                      fontSize: '0.94rem', color: '#64748b', lineHeight: 1.75,
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: '18px',
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          7. BOTTOM CTA BANNER
      ════════════════════════════════════════════════════ */}
      <div
        ref={ctaRef}
        style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(150deg, #1e1344 0%, #2d1b69 50%, #1a1044 100%)',
          borderTop: '1px solid rgba(139,92,246,0.22)',
          padding: '110px 24px',
          textAlign: 'center',
        }}
      >
        {/* Background orb */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, ...fadeIn(ctaInView) }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '14px' }}>
            Start Today — It's Free
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: '18px', lineHeight: 1.15 }}>
            Ready to Start Earning?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', maxWidth: '480px', margin: '0 auto 44px', lineHeight: 1.75 }}>
            Join thousands of Nigerians already earning passive income by sharing
            premium skills content. Your affiliate link is waiting.
          </p>

          {/* CTAs */}
          {user ? (
            <Link to="/dashboard?tab=affiliate" className="aff-btn-primary" style={{ fontSize: '17px', padding: '17px 48px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span>Go to My Affiliate Dashboard</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="aff-btn-primary" style={{ fontSize: '17px', padding: '17px 44px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3 1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                <span>Create Free Account</span>
              </Link>
              <Link to="/login" className="aff-btn-ghost" style={{ fontSize: '15px', padding: '17px 30px' }}>
                Log In to Dashboard
              </Link>
            </div>
          )}

          {/* Trust signals */}
          <div style={{
            display: 'flex', gap: '36px', justifyContent: 'center',
            flexWrap: 'wrap', marginTop: '44px',
          }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: 'No upfront cost' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, text: 'Instant link access' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, text: 'Real-time tracking' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, text: 'Monthly payouts' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <span style={{ display: 'inline-flex', color: '#8b5cf6' }}>{item.icon}</span><span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
