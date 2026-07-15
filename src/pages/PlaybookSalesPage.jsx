import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PlaybookSalesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [activeNotification, setActiveNotification] = useState(null)

  // Target roles for dynamic fading/typing text in the proof banner
  const targetRoles = ['freelancers', 'consultants', 'designers', 'developers', 'copywriters', 'service providers']
  const [currentRoleIdx, setCurrentRoleIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIdx((prev) => (prev + 1) % targetRoles.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Evergreen countdown timer (2 hours)
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('playbook_timer')
    if (saved) {
      const remaining = parseInt(saved) - Date.now()
      if (remaining > 0) return Math.floor(remaining / 1000)
    }
    const expiry = Date.now() + 2 * 60 * 60 * 1000
    localStorage.setItem('playbook_timer', expiry.toString())
    return 2 * 60 * 60
  })

  useEffect(() => {
    if (timeLeft <= 0) {
      const expiry = Date.now() + 2 * 60 * 60 * 1000
      localStorage.setItem('playbook_timer', expiry.toString())
      setTimeLeft(2 * 60 * 60)
      return
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Load product data dynamically from Supabase database
  useEffect(() => {
    async function loadProduct() {
      try {
        let { data } = await supabase
          .from('products')
          .select('*')
          .eq('sales_page_path', '/the-pricing-and-negotiation-playbook')
          .maybeSingle()

        if (!data) {
          const res = await supabase
            .from('products')
            .select('*')
            .eq('slug', 'the-pricing-and-negotiation-playbook')
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

  // Listen to window scroll to show or hide sticky mobile bar
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 500
      if (window.scrollY > heroHeight) {
        setShowStickyBar(true)
      } else {
        setShowStickyBar(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live Sales Notification Popup Logic
  useEffect(() => {
    const names = [
      'Tobi from Lagos', 'Chidi from Port Harcourt', 'Halima from Abuja', 
      'Emeka from Enugu', 'Aminat from Ibadan', 'Kelechi from Lagos',
      'Toyin from Akure', 'Jude from Asaba', 'Nkechi from Owerri', 
      'Segun from Abeokuta', 'Fatima from Kaduna', 'Ogechi from Umuahia',
      'Yusuf from Kano', 'Ifeoma from Awka', 'Ibrahim from Lokoja',
      'Damilola from Lagos', 'Chioma from Akwa Ibom', 'Kunle from Jos'
    ]
    const products = [
      'purchased the Playbook', 'downloaded the Pricing Scripts',
      'purchased the Playbook + Bonuses', 'unlocked the Value Proposal Vault'
    ]
    const times = [
      '2 mins ago', '5 mins ago', '12 mins ago', '15 mins ago',
      '1 min ago', '7 mins ago', '10 mins ago', '20 mins ago'
    ]

    const triggerNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)]
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      const randomTime = times[Math.floor(Math.random() * times.length)]
      
      setActiveNotification({
        name: randomName,
        action: randomProduct,
        time: randomTime
      })

      const hideTimer = setTimeout(() => {
        setActiveNotification(null)
      }, 5000)

      return () => clearTimeout(hideTimer)
    }

    const initialTimer = setTimeout(() => {
      setActiveNotification({
        name: 'Tobi',
        action: 'purchased the Playbook + Bonuses',
        time: 'Just now'
      })
      const hideTimer = setTimeout(() => {
        setActiveNotification(null)
      }, 5000)
      return () => clearTimeout(hideTimer)
    }, 4000)

    const interval = setInterval(triggerNotification, 18000)

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimer)
    }
  }, [])

  const price = product?.price || 9999
  const oldPrice = product?.old_price || 25000
  const savings = Math.max(0, oldPrice - price)
  const formattedPrice = `₦${price.toLocaleString()}`
  const formattedOldPrice = `₦${oldPrice.toLocaleString()}`

  const handleCheckoutRedirect = (e) => {
    if (e) e.preventDefault()
    if (product) {
      navigate(`/checkout?product=${product.slug}`)
    } else {
      navigate(`/checkout?product=the-pricing-and-negotiation-playbook`)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="playbook-page-root" style={{ backgroundColor: '#FBF8F2', color: '#262220', fontSize: '17px', lineHeight: 1.65 }}>
      {/* Page specific inline CSS stylings with forced font overrides to override global.css */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --dark: #171512; --dark2: #1B2E29; --dark3: #12100D;
          --cream: #FBF8F2; --paper: #F1EDDF; --paper2: #EFEAD9;
          --gold: #B8862F; --gold-light: #D8B463; --gold-deep: #8C6420;
          --teal: #1F5148; --teal-deep: #143932; --teal-pale: #CFE3DD;
          --rust: #9A3B2C; --rust-pale: #F1D9D2;
          --ink: #262220; --ink-soft: #4A4438; --hair: #DCD2BC;
          --maxw: 1120px;
        }
        * { box-sizing: border-box; }
        
        /* Font Family overrides to force correct custom typography matching the replicated design */
        .playbook-page-root, 
        .playbook-page-root p, 
        .playbook-page-root li, 
        .playbook-page-root .sub, 
        .playbook-page-root .lead, 
        .playbook-page-root .pull, 
        .playbook-page-root .role, 
        .playbook-page-root .rdesc, 
        .playbook-page-root .fa p {
          font-family: 'Lora', serif !important;
          touch-action: manipulation !important;
        }
        .playbook-page-root h1, 
        .playbook-page-root h2, 
        .playbook-page-root h3, 
        .playbook-page-root h4, 
        .playbook-page-root h5, 
        .playbook-page-root h6, 
        .playbook-page-root .disp, 
        .playbook-page-root .eyebrow, 
        .playbook-page-root .btn, 
        .playbook-page-root .navlinks, 
        .playbook-page-root .nav-cta, 
        .playbook-page-root .logo, 
        .playbook-page-root .chnum, 
        .playbook-page-root .tname, 
        .playbook-page-root .trole, 
        .playbook-page-root .rtitle, 
        .playbook-page-root .rsub, 
        .playbook-page-root .rval, 
        .playbook-page-root .rtorig, 
        .playbook-page-root .rtval, 
        .playbook-page-root .rtlabel, 
        .playbook-page-root .rfoot, 
        .playbook-page-root .fq, 
        .playbook-page-root .urgency, 
        .playbook-page-root .stickybar, 
        .playbook-page-root .gbadge, 
        .playbook-page-root button, 
        .playbook-page-root select, 
        .playbook-page-root input, 
        .playbook-page-root label {
          font-family: 'Poppins', sans-serif !important;
        }

        /* Hover scale animation on all images except book covers which use rotation animation */
        .playbook-page-root img:not(.rotate-anim) {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .playbook-page-root img:not(.rotate-anim):hover {
          transform: scale(1.03) !important;
        }

        /* Gentle rotate animation for book covers */
        @keyframes gentleTilt {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes gentleTiltReverse {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-1.5deg); }
          100% { transform: rotate(0deg); }
        }
        .rotate-anim-upright {
          animation: gentleTilt 8s ease-in-out infinite;
          transition: transform 0.3s ease !important;
        }
        .rotate-anim-upright:hover {
          transform: scale(1.03) rotate(2deg) !important;
        }
        .rotate-anim-flat {
          animation: gentleTiltReverse 9s ease-in-out infinite;
          transition: transform 0.3s ease !important;
        }
        .rotate-anim-flat:hover {
          transform: scale(1.03) rotate(-2deg) !important;
        }

        .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 28px; }
        .eyebrow { font-size: 12.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold-deep); }
        .eyebrow.on-dark { color: var(--gold-light); }
        .section { padding: 90px 0; }
        .section.tight { padding: 70px 0; }
        h2.h-lg { font-size: 38px; font-weight: 700; line-height: 1.18; color: var(--dark); margin: 14px 0 20px; }
        @media(max-width:640px) { h2.h-lg { font-size: 28px; } }
        p.lead { font-size: 19px; color: var(--ink-soft); }
        .center { text-align: center; }
        .btn {
          display: inline-flex; align-items: center; gap: 10px; font-weight: 700;
          font-size: 16px; letter-spacing: 0.2px; padding: 18px 34px; border-radius: 8px; text-decoration: none;
          border: none; cursor: pointer; transition: transform .15s ease, box-shadow .15s ease;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: var(--gold); color: #1A1611; box-shadow: 0 10px 26px rgba(184,134,47,0.35); }
        .btn-primary:hover { background: var(--gold-light); }
        .btn-primary .arrow { transition: transform .15s ease; }
        .btn-primary:hover .arrow { transform: translateX(3px); }
        .btn-ghost { background: transparent; border: 1.5px solid rgba(244,239,228,0.4); color: var(--cream); }
        .microtrust { font-size: 12.5px; color: var(--ink-soft); margin-top: 14px; display: flex; gap: 8px; align-items: center; justify-content: center; }

        /* ---------- NAV ---------- */
        header.nav {
          position: sticky; top: 0; z-index: 50; background: rgba(251,248,242,0.92); backdrop-filter: blur(6px);
          border-bottom: 1px solid var(--hair);
        }
        .navrow { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; max-width: var(--maxw); margin: 0 auto; }
        .logo { font-weight: 800; font-size: 15px; letter-spacing: 0.5px; color: var(--dark); }
        .logo span { color: var(--gold-deep); }
        .navlinks { display: flex; gap: 28px; font-size: 13.5px; font-weight: 600; color: var(--ink-soft); }
        .navlinks a { text-decoration: none; }
        .navlinks a:hover { color: var(--gold-deep); }
        .nav-cta { font-weight: 700; font-size: 13px; background: var(--dark); color: var(--cream); padding: 10px 20px; border-radius: 7px; text-decoration: none; white-space: nowrap; }
        @media(max-width:780px) { .navlinks { display: none; } }

        /* ---------- HERO ---------- */
        .hero { background: linear-gradient(155deg, var(--dark3) 0%, var(--dark2) 100%); color: var(--cream); position: relative; overflow: hidden; }
        .hero .wrap { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; padding-top: 76px; padding-bottom: 76px; }
        @media(max-width:900px) { .hero .wrap { grid-template-columns: 1fr; padding-top: 52px; padding-bottom: 52px; } }
        .hero h1 { font-size: 46px; font-weight: 800; line-height: 1.12; margin: 16px 0 20px; color: var(--cream); }
        .hero h1 em { font-style: normal; color: var(--gold-light); }
        @media(max-width:640px) { .hero h1 { font-size: 32px; } }
        .hero .sub { font-size: 18px; color: #D8CBAE; max-width: 520px; margin-bottom: 30px; line-height: 1.6; }
        .hero-ctarow { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }

        /* ---------- HOOK ---------- */
        .hook { padding: 80px 0 40px; }
        .hook .wrap { max-width: 700px; }
        .hook p { font-size: 19px; color: var(--ink-soft); margin-bottom: 18px; }
        .hook p.strong { color: var(--dark); font-weight: 500; }

        /* ---------- AGITATION ---------- */
        .agitate { background: var(--teal-deep); color: var(--teal-pale); }
        .agitate .wrap { max-width: 720px; }
        .agitate p { font-size: 18.5px; margin-bottom: 18px; color: #DCEAE5; }
        .agitate .pull { font-weight: 600; font-size: 23px; color: var(--cream); line-height: 1.4; border-left: 3px solid var(--gold-light); padding-left: 22px; margin: 32px 0; }

        /* ---------- PROBLEM ---------- */
        .problem .wrap { max-width: 720px; }
        .problem p { color: var(--ink-soft); margin-bottom: 16px; font-size: 18px; }

        /* ---------- SOLUTION ---------- */
        .solution { background: var(--paper); }
        .solution .wrap { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 60px; align-items: center; }
        @media(max-width:860px) { .solution .wrap { grid-template-columns: 1fr; gap: 36px; } }
        .bookmock { perspective: 1400px; display: flex; justify-content: center; }
        .solution h2 { margin-top: 10px; }
        .solution ul { padding-left: 0; list-style: none; margin-top: 22px; }
        .solution li { display: flex; gap: 12px; margin-bottom: 14px; font-size: 16px; color: var(--ink-soft); }
        .solution li .ic { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: var(--teal); color: #fff; font-size: 12px; display: flex; align-items: center; justify-content: center; margin-top: 2px; font-weight: 700; }

        /* ---------- WHO FOR ---------- */
        .whofor .wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; }
        @media(max-width:760px) { .whofor .wrap { grid-template-columns: 1fr; } }
        .whocard { background: var(--cream); border: 1.5px solid var(--hair); border-radius: 12px; padding: 32px 30px; }
        .whocard.yes { border-color: var(--teal); }
        .whocard.no { border-color: var(--rust); }
        .whocard h3 { font-size: 18px; margin: 0 0 16px; display: flex; align-items: center; gap: 10px; }
        .whocard h3 .tag { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; flex-shrink: 0; }
        .whocard.yes h3 .tag { background: var(--teal); }
        .whocard.no h3 .tag { background: var(--rust); }
        .whocard p { font-size: 15.5px; color: var(--ink-soft); margin: 0 0 10px; }

        /* ---------- WHAT'S INSIDE ---------- */
        .inside { background: var(--dark3); color: var(--cream); }
        .inside .headwrap { max-width: 640px; margin: 0 auto 50px; text-align: center; }
        .inside .sub { color: #B7AC92; font-size: 17px; }
        .chgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; background: rgba(244,239,228,0.12); border-radius: 14px; overflow: hidden; }
        @media(max-width:760px) { .chgrid { grid-template-columns: 1fr; } }
        .chitem { background: var(--dark3); padding: 26px 28px; display: flex; gap: 18px; }
        .chnum { font-weight: 800; font-size: 26px; color: var(--gold-light); opacity: 0.55; flex-shrink: 0; width: 36px; }
        .chitem h4 { font-size: 15.5px; margin: 0 0 6px; color: var(--cream); }
        .chitem p { font-size: 13.5px; color: #A79C82; margin: 0; line-height: 1.55; }

        /* ---------- AUTHOR ---------- */
        .author { padding: 90px 0; background: var(--cream); }
        .author .wrap { display: grid; grid-template-columns: 200px 1fr; gap: 40px; align-items: start; }
        @media(max-width:640px) { .author .wrap { grid-template-columns: 1fr; text-align: center; } .author .wrap .avatar { margin: 0 auto; } }
        .avatar { width: 170px; height: 170px; border-radius: 50%; background: linear-gradient(155deg,var(--teal) 0%, var(--teal-deep) 100%); display: flex; align-items: center; justify-content: center; font-size: 52px; color: var(--gold-light); flex-shrink: 0; }
        .author h3 { font-size: 22px; margin: 0 0 4px; color: var(--dark); }
        .author .role { font-size: 13px; color: var(--gold-deep); font-weight: 700; margin-bottom: 16px; }
        .author p { color: var(--ink-soft); font-size: 16px; margin-bottom: 14px; }

        /* ---------- SOCIAL PROOF ---------- */
        .proof { background: var(--paper2); }
        .proof .headwrap { max-width: 600px; margin: 0 auto 46px; text-align: center; }
        .tgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media(max-width:820px) { .tgrid { grid-template-columns: 1fr; } }
        .tcard { background: var(--cream); border-radius: 12px; padding: 26px 24px; border: 1px solid var(--hair); }
        .tcard .stars { color: var(--gold); font-size: 14px; margin-bottom: 12px; letter-spacing: 2px; }
        .tcard p { font-size: 14.5px; color: var(--ink-soft); font-style: italic; margin-bottom: 16px; }
        .tcard .tname { font-size: 12.5px; font-weight: 700; color: var(--dark); }
        .tcard .trole { font-size: 11px; color: #8A8272; }

        /* ---------- OFFER (receipt style) ---------- */
        .offer { background: linear-gradient(155deg, var(--dark3) 0%, var(--dark2) 100%); color: var(--cream); }
        .offer .headwrap { max-width: 600px; margin: 0 auto 46px; text-align: center; }
        .receipt { max-width: 460px; margin: 0 auto; background: var(--cream); color: var(--ink); border-radius: 4px; padding: 38px 34px 34px; position: relative; box-shadow: 0 40px 80px rgba(0,0,0,0.45); }
        .receipt:before, .receipt:after { content: ''; position: absolute; left: 0; right: 0; height: 14px; background:
            linear-gradient(135deg, transparent 50%, var(--cream) 50%) 0 0 / 16px 16px repeat-x; }
        .receipt:before { top: -13px; transform: rotate(180deg); }
        .receipt:after { bottom: -13px; }
        .receipt .rtitle { font-weight: 800; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; text-align: center; color: var(--dark); margin-bottom: 4px; }
        .receipt .rsub { text-align: center; font-size: 11px; color: #9A917C; margin-bottom: 20px; letter-spacing: 0.5px; }
        .rline { display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px dashed var(--hair); font-size: 14.5px; }
        .rline .rname { color: var(--ink); font-weight: 500; }
        .rline .rdesc { display: block; font-size: 12px; color: #9A917C; font-style: italic; margin-top: 2px; }
        .rline .rval { font-weight: 600; color: var(--ink-soft); white-space: nowrap; }
        .rline.strike .rval { text-decoration: line-through; color: #B0A78F; }
        .rtotal { display: flex; justify-content: space-between; align-items: baseline; padding-top: 18px; margin-top: 6px; }
        .rtotal .rtlabel { font-weight: 700; font-size: 14px; color: var(--dark); }
        .rtotal .rtval { font-weight: 800; font-size: 32px; color: var(--gold-deep); }
        .rtotal .rtorig { font-size: 14px; color: #B0A78F; text-decoration: line-through; margin-right: 8px; }
        .receipt .rbtn { display: block; text-align: center; margin-top: 22px; }
        .receipt .rbtn .btn { width: 100%; justify-content: center; }
        .receipt .rfoot { text-align: center; font-size: 11px; color: #9A917C; margin-top: 14px; }

        /* ---------- PLAYBOOK GUARANTEE (Isolated to prevent global.css blue border override) ---------- */
        .playbook-guarantee { background: transparent !important; border: none !important; border-radius: 0 !important; padding: 70px 0 !important; }
        .playbook-guarantee .wrap { display: flex; gap: 40px; align-items: center; max-width: 800px; margin: 0 auto; background: transparent !important; }
        @media(max-width:640px) { .playbook-guarantee .wrap { flex-direction: column; text-align: center; gap: 20px; } }
        .gbadge { width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--gold); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold-deep); text-align: center; font-size: 13px; line-height: 1.2; padding: 10px; }
        .playbook-guarantee h3 { margin: 0 0 10px; font-size: 21px; color: var(--dark); }
        .playbook-guarantee p { color: var(--ink-soft); font-size: 15.5px; margin: 0; }

        /* ---------- URGENCY ---------- */
        .urgency { background: var(--rust); color: #FBEDE8; text-align: center; padding: 18px 20px; font-weight: 600; font-size: 14.5px; }
        .urgency b { color: #fff; }

        /* ---------- FAQ ---------- */
        .faq .wrap { max-width: 760px; }
        .fitem { border-bottom: 1px solid var(--hair); }
        .fq { width: 100%; text-align: left; background: none; border: none; padding: 22px 0; font-weight: 600; font-size: 16px; color: var(--dark); display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 20px; }
        .fq .plus { font-size: 20px; color: var(--gold-deep); transition: transform .2s ease; flex-shrink: 0; }
        .fitem.open .fq .plus { transform: rotate(45deg); }
        .fa { max-height: 0; overflow: hidden; transition: max-height .25s ease; }
        .fa p { padding-bottom: 22px; margin: 0; color: var(--ink-soft); font-size: 15.5px; }
        .fitem.open .fa { max-height: 300px; }

        /* ---------- FINAL CTA ---------- */
        .final { background: linear-gradient(155deg, var(--dark3) 0%, var(--dark2) 100%); color: var(--cream); text-align: center; }
        .final .wrap { max-width: 640px; }
        .final h2 { font-size: 32px; color: var(--cream); margin-bottom: 16px; }
        .final p { color: #D8CBAE; font-size: 17px; margin-bottom: 30px; }

        /* ---------- FOOTER / PS ---------- */
        .ps { background: var(--paper); }
        .ps .wrap { max-width: 700px; }
        .ps p { font-size: 14.5px; color: var(--ink-soft); margin-bottom: 12px; }
        .ps b { color: var(--dark); }
        footer { background: var(--dark3); color: #8A8272; text-align: center; padding: 36px 20px; font-size: 12.5px; }
        footer a { color: var(--gold-light); text-decoration: none; }

        /* ---------- STICKY MOBILE BAR ---------- */
        .stickybar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 60; background: var(--dark3); border-top: 1px solid rgba(244,239,228,0.15); padding: 12px 18px; display: none; align-items: center; justify-content: space-between; gap: 14px; transform: translateY(100%); transition: transform .3s ease; }
        .stickybar.show { transform: translateY(0); }
        .stickybar .sprice { color: var(--cream); font-size: 14px; }
        .stickybar .sprice b { color: var(--gold-light); font-size: 17px; }
        .stickybar .btn { padding: 12px 22px; font-size: 14px; }
        @media(max-width:780px) { .stickybar { display: flex; } }

        /* ---------- CUSTOM CREAM & BROWN VERIFIED SALES TOAST ---------- */
        .wb-sales-toast {
          position: fixed;
          bottom: 84px; /* so it stays above the mobile sticky cta bar */
          left: 24px;
          background: #FBF8F2 !important; /* cream color used for page background */
          border: 1px solid #DCD2BC !important; /* light brown/hair border lines */
          border-radius: 12px !important;
          padding: 16px 20px !important;
          box-shadow: 0 15px 30px rgba(74, 68, 56, 0.15) !important;
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          z-index: 10000 !important;
          max-width: 380px !important;
          backdrop-filter: blur(8px) !important;
          animation: toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-family: 'Inter', sans-serif !important; /* same font as webinar sales notification */
        }
        .toast-border-accent {
          width: 4px !important;
          height: 42px !important;
          background: #B8862F !important; /* gold/brown accent line */
          border-radius: 4px !important;
          flex-shrink: 0 !important;
        }
        .toast-content {
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
          font-family: 'Inter', sans-serif !important; /* same font as webinar sales notification */
          flex: 1 !important;
        }
        .toast-title {
          margin: 0 !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.8px !important;
          color: #8C6420 !important; /* dark brown */
          font-family: 'Inter', sans-serif !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .toast-body {
          margin: 0 !important;
          font-size: 12.5px !important;
          color: #4A4438 !important; /* soft dark brown */
          font-weight: 500 !important;
          line-height: 1.45 !important;
          font-family: 'Inter', sans-serif !important;
        }
        .toast-body strong {
          color: #8C6420 !important; /* dark brown color for username and product */
          font-weight: 700 !important;
          font-family: 'Inter', sans-serif !important;
        }
        .toast-course-image {
          width: 45px !important;
          height: 45px !important;
          border-radius: 6px !important;
          object-fit: cover !important;
          flex-shrink: 0 !important;
          align-self: center !important;
          border: 1px solid #DCD2BC !important; /* light brown border line */
        }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />

      {/* TOP COUNTDOWN TIMER BAR FOR EVERGREEN FOMO */}
      <div style={{ background: 'var(--rust)', color: '#fff', textAlign: 'center', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
        🔥 Special Launch Price Ends In: <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px', marginLeft: '6px' }}>{formatTime(timeLeft)}</span>
      </div>

      {/* LOCAL HEADER (No global website header is loaded) */}
      <header className="nav">
        <div className="navrow">
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Amplified Skills" style={{ height: '36px', width: 'auto', filter: 'brightness(0.1)' }} />
          </div>
          <nav className="navlinks">
            <a href="#inside">What's Inside</a>
            <a href="#reviews">Reviews</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#offer" className="nav-cta">Get The Playbook</a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div>
            <div className="eyebrow on-dark">FOR FREELANCERS, CONSULTANTS &amp; SERVICE PROVIDERS</div>
            <h1>Your price isn't the problem.<br />Your <em>pitch</em> is.</h1>
            <p className="sub" style={{ marginBottom: '20px' }}>The Pricing &amp; Negotiation Playbook shows you exactly why clients say "too expensive" — and gives you the scripts, frameworks, and mindset shifts to stop hearing it.</p>
            
            {/* Social stats badges under the subheader */}
            <div style={{ display: 'flex', gap: '24px', margin: '24px 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold-light)' }}>1,847+</div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#A79C82', marginTop: '2px' }}>Copies Sold</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold-light)' }}>4.9/5</div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#A79C82', marginTop: '2px' }}>Average Rating</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold-light)' }}>100%</div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#A79C82', marginTop: '2px' }}>Satisfaction Rate</div>
              </div>
            </div>

            <div className="hero-ctarow">
              <button onClick={handleCheckoutRedirect} className="btn btn-primary">
                Get The Playbook Now — {formattedPrice} <span className="arrow">→</span>
              </button>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#A79C82', marginTop: '8px', width: '100%' }}>
                ⚡ Instant PDF · Lifetime Access
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/playbook_cover_upright.png" alt="The Pricing &amp; Negotiation Playbook 3D Cover Mockup" className="rotate-anim rotate-anim-upright" style={{ width: '100%', maxWidth: '340px', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.45))' }} />
          </div>
        </div>
      </section>

      {/* Premium overlapping avatars stack banner using exact N50K blueprint seeds, center on mobile, introducing section background color */}
      <div style={{ background: 'var(--paper)', padding: '20px 0', borderBottom: '1px solid var(--hair)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {[
              { seed: 'Chioma', bg: '5c3d2e' },
              { seed: 'Emeka', bg: '3e2723' },
              { seed: 'Aisha', bg: '4a2c0a' },
              { seed: 'Fatima', bg: '3b1f0e' },
              { seed: 'Bello', bg: '2e1503' },
              { seed: 'Ngozi', bg: '4a2c0a' }
            ].map(({ seed, bg }, i) => (
              <span key={i} style={{ 
                padding: 0, 
                overflow: 'hidden', 
                background: 'none', 
                width: '34px', 
                height: '34px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '50%',
                border: '2px solid var(--paper)',
                marginLeft: i === 0 ? '0' : '-10px',
                zIndex: 10 - i
              }}>
                <img
                  src={`/avatars/${seed.toLowerCase()}.png`}
                  alt={seed}
                  width={34}
                  height={34}
                  style={{ borderRadius: '50%', display: 'block', objectFit: 'cover' }}
                  onError={e => { 
                    e.currentTarget.style.display = 'none'; 
                    e.currentTarget.parentElement.style.backgroundColor = `#${bg}`; 
                    e.currentTarget.parentElement.textContent = seed[0]; 
                    e.currentTarget.parentElement.style.color = '#fff';
                    e.currentTarget.parentElement.style.fontWeight = 'bold';
                  }}
                />
              </span>
            ))}
          </div>
          <div style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 500, width: 'auto' }}>
            <span style={{ color: 'var(--gold-deep)', fontWeight: 700 }}>1,847+ {targetRoles[currentRoleIdx]}</span> already commanding their worth with the Playbook
          </div>
        </div>
      </div>

      {/* HOOK */}
      <section className="hook">
        <div className="wrap">
          <p className="strong">You send the quote. It's fair. You know your work is good. You've done the math — maybe you even priced it a little lower than you wanted to, just to be safe.</p>
          <p>Then it comes back. "This is a bit too expensive for us right now."</p>
          <p>Or worse — nothing comes back at all. The lead just goes quiet. No negotiation. Just silence where a client used to be.</p>
          <p className="strong">If that's happened more than once this year, I want you to hear this before you read another word: it was never really about the price.</p>
        </div>
      </section>

      {/* AGITATION */}
      <section className="section agitate">
        <div className="wrap">
          <div className="eyebrow on-dark" style={{ color: '#8FCFBB' }}>WHAT "TOO EXPENSIVE" ACTUALLY COSTS YOU</div>
          <p style={{ marginTop: '16px' }}>It's not just the one project. It's the version of you that starts flinching before you even send the next quote. The one who rounds down instead of up. Who adds "but we can discuss it" before anyone's even objected.</p>
          <p>Meanwhile, someone in your exact field — doing work that isn't obviously better than yours — is quoting double what you quote. And getting a yes.</p>
          <div className="pull">That gap isn't talent. It isn't luck. It's a handful of specific things happening in the conversation before the price is even said out loud.</div>
          <p>You can keep guessing your way through that conversation every time a new lead comes in. Or you can learn exactly what's happening in it, and start controlling it.</p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section problem">
        <div className="wrap">
          <div className="eyebrow">THE REAL PROBLEM</div>
          <h2 className="h-lg">It was never a pricing problem. It's a proof problem.</h2>
          <p>Most freelancers try to fix "too expensive" by getting cheaper. Some try to fix it by getting more confident, like confidence alone is the missing ingredient.</p>
          <p>Neither works — because "too expensive" was never a verdict on your number. It's a verdict on the story the client had in their head before you gave them a price to compare it to.</p>
          <p>If nobody showed them what the problem is actually costing them, your number will always look bigger than the problem. This isn't a personality flaw. It's a structure problem — and structure problems have structural fixes.</p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="section solution" id="inside-preview">
        <div className="wrap">
          <div className="bookmock">
            <img src="/playbook_cover_flat.png" alt="The Pricing &amp; Negotiation Playbook Ebook Cover" className="rotate-anim rotate-anim-flat" style={{ width: '100%', maxWidth: '320px', borderRadius: '4px', boxShadow: '0 40px 70px rgba(23,21,18,0.35), 0 10px 20px rgba(23,21,18,0.2)' }} />
          </div>
          <div>
            <div className="eyebrow">INTRODUCING</div>
            <h2 className="h-lg">The Pricing &amp; Negotiation Playbook</h2>
            <p className="lead">A working playbook — not a pep talk. The psychology behind price objections, the call structure that handles them before they form, and the exact scripts you can copy into your next email today.</p>
            <ul>
              <li><span className="ic">✓</span> Why clients say "too expensive" — and what they actually mean by it</li>
              <li><span className="ic">✓</span> How to price by value instead of by the hour</li>
              <li><span className="ic">✓</span> A discovery call framework built to prevent the objection</li>
              <li><span className="ic">✓</span> Negotiation tactics that protect your rate under pressure</li>
              <li><span className="ic">✓</span> A full vault of ready-to-use scripts and email templates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHO FOR */}
      <section className="section whofor">
        <div className="wrap">
          <div className="whocard yes">
            <h3><span className="tag">✓</span> This is for you if…</h3>
            <p>You're a freelancer, consultant, coach, designer, developer, or service provider who has underpriced a project out of fear of hearing no.</p>
            <p>You've discounted just to keep a deal alive, and felt smaller for doing it.</p>
            <p>You know your work is good — but you're tired of watching cheaper competitors win the client anyway.</p>
          </div>
          <div className="whocard no">
            <h3><span className="tag">✕</span> This isn't for you if…</h3>
            <p>You're looking for a way to manipulate people into paying more than your work is worth. That's not what's in here.</p>
            <p>You want a magic script with no willingness to actually change how you run your sales conversations.</p>
            <p>You're not currently selling any kind of service to clients.</p>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section inside" id="inside">
        <div className="wrap">
          <div className="headwrap">
            <div className="eyebrow on-dark">ELEVEN CHAPTERS. ZERO FILLER.</div>
            <h2 className="h-lg" style={{ color: 'var(--cream)' }}>What's Inside</h2>
            <p className="sub">Every chapter builds on the last — from the psychology of price to a 7-day plan to put it all to work.</p>
          </div>
          <div className="chgrid">
            <div className="chitem"><div className="chnum">01</div><div><h4>The Psychology of Price</h4><p>Why people don't buy what things cost — they buy what they believe things are worth.</p></div></div>
            <div className="chitem"><div className="chnum">02</div><div><h4>Value-Based Pricing</h4><p>The three-part formula for finding your real number, and why hourly rates cap your income.</p></div></div>
            <div className="chitem"><div className="chnum">03</div><div><h4>Position Before You Price</h4><p>How to become the obvious choice — so clients stop shopping you against the lowest bidder.</p></div></div>
            <div className="chitem"><div className="chnum">04</div><div><h4>Decoding "Too Expensive"</h4><p>The five real meanings behind the objection, and how to respond to each one.</p></div></div>
            <div className="chitem"><div className="chnum">05</div><div><h4>The Discovery Call Framework</h4><p>A five-step structure that gets the objection handled before it ever forms.</p></div></div>
            <div className="chitem"><div className="chnum">06</div><div><h4>Negotiation Tactics</h4><p>How to hold your price under pressure — without losing the client or your margin.</p></div></div>
            <div className="chitem"><div className="chnum">07</div><div><h4>Packaging &amp; Tiering</h4><p>Good, better, best — and why the middle option does most of the selling for you.</p></div></div>
            <div className="chitem"><div className="chnum">08</div><div><h4>Raising Your Prices</h4><p>The script for increasing your rate on existing clients without the dreaded conversation.</p></div></div>
            <div className="chitem"><div className="chnum">09</div><div><h4>Ten Pricing Mistakes</h4><p>The quiet habits costing you income — and the fix for each one.</p></div></div>
            <div className="chitem"><div className="chnum">10</div><div><h4>Scripts &amp; Templates Vault</h4><p>Copy-paste discovery questions, objection responses, and price-increase emails.</p></div></div>
            <div className="chitem" style={{ gridColumn: '1 / -1' }}><div className="chnum">11</div><div><h4>The 7-Day Pricing Reset</h4><p>A day-by-day action plan to put the whole book to work this week.</p></div></div>
          </div>
        </div>
      </section>

      {/* AUTHOR */}
      <section className="section author">
        <div className="wrap">
          <img src="/my_bp.jpeg" alt="Nnanta Precious" className="avatar" style={{ width: '170px', height: '170px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div className="eyebrow">WHO'S TEACHING THIS</div>
            <h3>Nnanta Precious</h3>
            <div className="role">FOUNDER, AMPLIFIED SKILLS</div>
            <p>I've spent years running my own web design agency and coaching freelancers and coaching freelancers business owners across the world — and if there's one conversation I've watched derail more good freelancers than any other single thing, it's the pricing conversation.</p>
            <p>Not because they weren't skilled. Because nobody ever taught them what's actually happening in a client's head between "here's my price" and "that's too expensive." I built this playbook because I got tired of watching talented people undercharge, over-explain, and quietly resent clients who were only ever responding to a pitch that hadn't done its job yet.</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TESTIMONIALS */}
      <section className="section proof" id="reviews">
        <div className="wrap">
          <div className="headwrap" style={{ textAlign: 'center', marginBottom: '46px' }}>
            <div className="eyebrow">READER RESULTS</div>
            <h2 className="h-lg">What happens when the pitch changes</h2>
          </div>
          <div className="tgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="tcard" style={{ background: 'var(--cream)', borderRadius: '12px', padding: '26px 24px', border: '1px solid var(--hair)' }}>
              <div className="stars" style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '12px', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: '16px' }}>
                "I was quoting ₦150k for web design projects. After reading the Value Anchoring chapter, I quoted ₦450k to my next lead. I got a YES without them even flinching. Best money I ever spent!"
              </p>
              <div className="tname" style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--dark)' }}>Tobi A.</div>
              <div className="trole" style={{ fontSize: '11px', color: '#8A8272' }}>Web Designer, Lagos</div>
            </div>

            <div className="tcard" style={{ background: 'var(--cream)', borderRadius: '12px', padding: '26px 24px', border: '1px solid var(--hair)' }}>
              <div className="stars" style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '12px', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: '16px' }}>
                "The objection scripts are absolute gold. A client asked for a 30% discount last week. I used the script on Chapter 4, and they signed the full price proposal within 10 minutes."
              </p>
              <div className="tname" style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--dark)' }}>Chidi K.</div>
              <div className="trole" style={{ fontSize: '11px', color: '#8A8272' }}>Brand Consultant, Port Harcourt</div>
            </div>

            <div className="tcard" style={{ background: 'var(--cream)', borderRadius: '12px', padding: '26px 24px', border: '1px solid var(--hair)' }}>
              <div className="stars" style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '12px', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: '16px' }}>
                "I've read a lot of business books, but this is the first one that tells you exactly what to say. No fluff, just direct templates that work."
              </p>
              <div className="tname" style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--dark)' }}>Halima S.</div>
              <div className="trole" style={{ fontSize: '11px', color: '#8A8272' }}>Content Strategy, Abuja</div>
            </div>

            <div className="tcard" style={{ background: 'var(--cream)', borderRadius: '12px', padding: '26px 24px', border: '1px solid var(--hair)' }}>
              <div className="stars" style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '12px', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: '16px' }}>
                "Before the playbook, I was pricing by the hour and capped my income. Changing to value packaging allowed me to close a ₦1.2m project last week."
              </p>
              <div className="tname" style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--dark)' }}>Emeka O.</div>
              <div className="trole" style={{ fontSize: '11px', color: '#8A8272' }}>Software Developer, Enugu</div>
            </div>

            <div className="tcard" style={{ background: 'var(--cream)', borderRadius: '12px', padding: '26px 24px', border: '1px solid var(--hair)' }}>
              <div className="stars" style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '12px', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: '16px' }}>
                "The Discovery Call Framework completely changed how I qualify leads. I no longer waste hours writing proposals for clients who can't afford me."
              </p>
              <div className="tname" style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--dark)' }}>Aminat Y.</div>
              <div className="trole" style={{ fontSize: '11px', color: '#8A8272' }}>Copywriter, Ibadan</div>
            </div>

            <div className="tcard" style={{ background: 'var(--cream)', borderRadius: '12px', padding: '26px 24px', border: '1px solid var(--hair)' }}>
              <div className="stars" style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '12px', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', fontStyle: 'italic', marginBottom: '16px' }}>
                "The three-tier proposal structure is a game changer. I presented three options to a local tech company, and they immediately upgraded to the middle option."
              </p>
              <div className="tname" style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--dark)' }}>Kelechi J.</div>
              <div className="trole" style={{ fontSize: '11px', color: '#8A8272' }}>UI/UX Designer, Lagos</div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CHOICE IS SIMPLE / NOT TAKING ACTION SECTION */}
      <section className="section" style={{ background: 'var(--dark3)', color: 'var(--cream)', borderTop: '1px solid var(--hair)' }}>
        <div className="wrap" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <div className="eyebrow on-dark">THE DECISION</div>
          <h2 className="h-lg" style={{ color: 'var(--cream)', marginTop: '14px' }}>The Choice Is Simple</h2>
          <p style={{ fontSize: '19px', color: '#D8CBAE', marginBottom: '32px' }}>
            The Real Cost of NOT Taking Action
          </p>
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(244,239,228,0.1)', padding: '32px' }}>
            <p style={{ marginBottom: '20px' }}>
              You can close this page and keep running your business the way you've been doing it. 
            </p>
            <p style={{ marginBottom: '20px' }}>
              But that means the next time a client tells you your price is <b>"too expensive,"</b> you'll react the same way. You'll either discount your rate and work for less than you're worth, or you'll watch the client walk away in silence.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Every single proposal you send without anchoring your value is leaving money on the table. If you lose just one project this month because of a bad pitch, that's already costing you 10x or 50x the price of this playbook.
            </p>
            <p style={{ fontWeight: 600, color: 'var(--gold-light)', margin: 0 }}>
              The choice is yours: keep guessing, or learn the exact system to command your worth.
            </p>
          </div>
          <div style={{ marginTop: '40px' }}>
            <button onClick={handleCheckoutRedirect} className="btn btn-primary">
              Get The Playbook Now — {formattedPrice} <span className="arrow">→</span>
            </button>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#A79C82', marginTop: '8px' }}>
              ⚡ Instant PDF · Lifetime Access
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section className="section offer" id="offer">
        <div className="wrap">
          <div className="headwrap" style={{ textAlign: 'center', marginBottom: '46px' }}>
            <div className="eyebrow on-dark">THE OFFER</div>
            <h2 className="h-lg" style={{ color: 'var(--cream)' }}>Everything you get today</h2>
          </div>
          <div className="receipt">
            <div className="rtitle">Amplified Skills</div>
            <div className="rsub">ORDER SUMMARY</div>
            
            <div className="rline">
              <div className="rname">
                The Pricing &amp; Negotiation Playbook
                <span className="rdesc">Full ebook · 11 chapters · scripts &amp; templates vault</span>
              </div>
              <span className="rval">{formattedPrice}</span>
            </div>

            {product?.bonus_ebook_urls && product.bonus_ebook_urls.length > 0 ? (
              <div className="rline">
                <div>
                  <span className="rname">Included Bonuses</span>
                  <span className="rdesc">{product.bonus_ebook_urls.map(b => b.name).join(', ')}</span>
                </div>
                <span className="rval" style={{ color: '#10b981' }}>FREE</span>
              </div>
            ) : (
              <>
                <div className="rline">
                  <div className="rname">
                    Bonus: Pricing Cheat Sheet
                    <span className="rdesc">One-page framework summary for your next call</span>
                  </div>
                  <span className="rval" style={{ color: '#10b981' }}>FREE</span>
                </div>
                <div className="rline">
                  <div className="rname">
                    Bonus: Fill-In Quote Template
                    <span className="rdesc">Built around the value-based pricing formula</span>
                  </div>
                  <span className="rval" style={{ color: '#10b981' }}>FREE</span>
                </div>
              </>
            )}

            <div className="rtotal">
              <div className="rtlabel">Total Due Today</div>
              <div>
                {product?.old_price && product.old_price > price && (
                  <span className="rtorig" style={{ marginRight: '8px', textDecoration: 'line-through', color: '#B0A78F' }}>
                    {formattedOldPrice}
                  </span>
                )}
                <span className="rtval" style={{ fontWeight: 800, fontSize: '32px', color: 'var(--gold-deep)' }}>{formattedPrice}</span>
              </div>
            </div>

            <div className="rbtn">
              {/* Removed the price from this button as the price is already clearly shown in the card total above */}
              <button onClick={handleCheckoutRedirect} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Get Instant Access <span className="arrow">→</span>
              </button>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink-soft)', marginTop: '8px', width: '100%', textAlign: 'center' }}>
                ⚡ Instant PDF · Lifetime Access
              </div>
            </div>
            
            <div className="rfoot">🔒 Secure checkout · Instant digital delivery</div>
          </div>
        </div>
      </section>

      {/* GUARANTEE - Renamed to playbook-guarantee wrapper to prevent global style conflict and blue border */}
      <section className="section tight playbook-guarantee" style={{ background: 'transparent' }}>
        <div className="wrap">
          <div className="gbadge">
            <div style={{ fontWeight: 800, letterSpacing: '1px' }}>INSTANT</div>
            <div style={{ fontWeight: 800, letterSpacing: '1px', fontSize: '11px' }}>PDF</div>
          </div>
          <div>
            <h3>Read it. Use one script on your next quote.</h3>
            <p>Since this is an instantly downloadable digital product, all sales are final. However, the value inside is built to deliver immediate returns. Read it, copy just one script for your next client proposal, and watch it pay for itself instantly. You get lifetime access to all files and future updates.</p>
          </div>
        </div>
      </section>

      {/* URGENCY - Show only if compare price exists */}
      {product?.old_price && product.old_price > price && (
        <div className="urgency">Launch price ends soon — after that, price returns to <b>{formattedOldPrice}</b>.</div>
      )}

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="wrap">
          <div className="eyebrow">QUESTIONS</div>
          <h2 className="h-lg">Before you go</h2>
          
          <div className="fitem" style={{ borderTop: '1px solid var(--hair)' }}>
            <button className="fq" onClick={() => toggleFaq(0)}>
              <span>I've bought pricing guides before and nothing changed. Why would this be different?</span>
              <span className="plus" style={{ transform: openFaq === 0 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 0 ? '300px' : '0' }}>
              <p>Most pricing content stops at "know your worth." This one gives you the actual conversation structure and word-for-word scripts to use on your next call — not just a mindset shift, but something you can act on today.</p>
            </div>
          </div>

          <div className="fitem">
            <button className="fq" onClick={() => toggleFaq(1)}>
              <span>I'm not a web designer — does this still apply to me?</span>
              <span className="plus" style={{ transform: openFaq === 1 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 1 ? '300px' : '0' }}>
              <p>Yes. The frameworks are built around the psychology of pricing and negotiation, not any one industry. Examples span design, copywriting, consulting, and social media management, and the principles apply to any service you sell one-to-one.</p>
            </div>
          </div>

          <div className="fitem">
            <button className="fq" onClick={() => toggleFaq(2)}>
              <span>I'm just starting out. Is this too advanced for me?</span>
              <span className="plus" style={{ transform: openFaq === 2 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 2 ? '300px' : '0' }}>
              <p>This is arguably more useful early — the pricing habits you build in your first year are the hardest to break later. Better to build the right ones from the start.</p>
            </div>
          </div>

          <div className="fitem">
            <button className="fq" onClick={() => toggleFaq(3)}>
              <span>What format is it, and how long is it?</span>
              <span className="plus" style={{ transform: openFaq === 3 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 3 ? '300px' : '0' }}>
              <p>A digital ebook, professionally designed, ready to read in under an hour and reference for years. No fluff, no filler chapters.</p>
            </div>
          </div>

          <div className="fitem">
            <button className="fq" onClick={() => toggleFaq(4)}>
              <span>Is there a refund policy?</span>
              <span className="plus" style={{ transform: openFaq === 4 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 4 ? '300px' : '0' }}>
              <p>Because this is an instantly downloadable digital eBook, all sales are final. However, if you have any questions or need help applying the concepts, you can always reach out to our support team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section final">
        <div className="wrap">
          <h2>You already do good work.</h2>
          <p>The only thing standing between you and being paid properly for it is a handful of conversations you haven't been taught how to run yet. This book is that training.</p>
          <button onClick={handleCheckoutRedirect} className="btn btn-primary">
            Get The Pricing &amp; Negotiation Playbook — {formattedPrice} <span className="arrow">→</span>
          </button>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#A79C82', marginTop: '8px' }}>
            ⚡ Instant PDF · Lifetime Access
          </div>
          {/* Removed the extra duplicate microtrust line containing price here as requested */}
        </div>
      </section>

      {/* PS */}
      <section className="section tight ps">
        <div className="wrap">
          <p><b>P.S.</b> Every day you don't fix this pricing conversation is another quote that might come back with "too expensive" attached to it — and another client you were actually the right fit for, gone.</p>
          <p><b>P.S.2</b> Since this is an instantly downloadable digital product, all sales are final. The only real risk is continuing to underprice your work and leaving money on the table.</p>
        </div>
      </section>

      {/* FOOTER with Meta and Google Ads disclaimers */}
      <footer>
        <div>
          <p>&copy; {new Date().getFullYear()} Amplified Skills · Nnanta Precious</p>
          <div style={{ marginTop: '24px', fontSize: '11px', color: '#6A6252', lineHeight: '1.5', maxWidth: '800px', margin: '24px auto 0', padding: '0 20px', textAlign: 'center' }}>
            <p>Disclaimer: This site is not a part of the Meta website, Facebook Inc., Google LLC, or Alphabet Inc. Additionally, this site is NOT endorsed by Meta, Facebook, Google, or Alphabet in any way. Facebook and Google are trademarks of their respective owners.</p>
            <p style={{ marginTop: '8px' }}>Any financial representations or earnings referenced here are illustrative of potential outcomes and should not be considered guarantees of actual performance. Succeeding as a service provider depends on individual effort, skill, market factors, and economic conditions.</p>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BAR */}
      <div className={`stickybar ${showStickyBar ? 'show' : ''}`}>
        <div className="sprice">Get the Playbook<br /><b>{formattedPrice}</b></div>
        <button onClick={handleCheckoutRedirect} className="btn btn-primary">Get Access — {formattedPrice} →</button>
      </div>

      {/* Live Sales Notification Widget matching WebinarPage style exactly in cream/brown custom colors */}
      {activeNotification && (
        <div className="wb-sales-toast">
          <div className="toast-border-accent"></div>
          <img 
            src="/playbook_cover_flat.png" 
            alt="The Pricing &amp; Negotiation Playbook" 
            className="toast-course-image"
          />
          <div className="toast-content">
            <p className="toast-title">
              <span>VERIFIED PAYMENT</span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: 'var(--gold-deep)', textTransform: 'lowercase', opacity: 0.8 }}>{activeNotification.time}</span>
            </p>
            <p className="toast-body">
              <strong>{activeNotification.name}</strong> just purchased <strong>The Pricing &amp; Negotiation Playbook</strong>!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
