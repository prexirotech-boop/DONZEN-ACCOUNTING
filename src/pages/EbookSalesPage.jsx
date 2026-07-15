import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToasts } from '../hooks/useToasts'

export default function EbookSalesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [showStickyBar, setShowStickyBar] = useState(false)

  const { addToast } = useToasts()

  useEffect(() => {
    async function loadProduct() {
      try {
        // Try loading product configured for eBook route first
        let { data } = await supabase
          .from('products')
          .select('*')
          .eq('sales_page_path', '/ebook')
          .maybeSingle()

        if (!data) {
          // Fallback to latest published ebook product
          const res = await supabase
            .from('products')
            .select('*')
            .eq('type', 'ebook')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(1)
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

  const price = product?.price || 2500
  const oldPrice = product?.old_price || 9000
  const savings = Math.max(0, oldPrice - price)
  const formattedPrice = `₦${price.toLocaleString()}`
  const formattedOldPrice = `₦${oldPrice.toLocaleString()}`
  const discountPercentage = oldPrice > 0 ? Math.round((savings / oldPrice) * 100) : 0

  const handleCheckoutRedirect = () => {
    if (product) {
      navigate(`/checkout?product=${product.slug}`)
    } else {
      navigate(`/checkout?product=ebook`)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div style={{ backgroundColor: '#FBF8F2', color: '#262220', fontFamily: "'Lora', serif", fontSize: '17px', lineHeight: 1.65 }}>
      {/* Dynamic Style Tags */}
      <style dangerouslySetInnerHTML={{ __html: `
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
        h1, h2, h3, h4, .disp { font-family: 'Poppins', sans-serif; }
        .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 28px; }
        .eyebrow { font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold-deep); }
        .eyebrow.on-dark { color: var(--gold-light); }
        .section { padding: 90px 0; }
        .section.tight { padding: 70px 0; }
        h2.h-lg { font-size: 38px; font-weight: 700; line-height: 1.18; color: var(--dark); margin: 14px 0 20px; }
        @media(max-width:640px) { h2.h-lg { font-size: 28px; } }
        p.lead { font-size: 19px; color: var(--ink-soft); }
        .center { text-align: center; }
        .btn {
          display: inline-flex; align-items: center; gap: 10px; font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 16px; letter-spacing: 0.2px; padding: 18px 34px; border-radius: 8px; text-decoration: none;
          border: none; cursor: pointer; transition: transform .15s ease, box-shadow .15s ease;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: var(--gold); color: #1A1611; box-shadow: 0 10px 26px rgba(184,134,47,0.35); }
        .btn-primary:hover { background: var(--gold-light); }
        .btn-primary .arrow { transition: transform .15s ease; }
        .btn-primary:hover .arrow { transform: translateX(3px); }
        .btn-ghost { background: transparent; border: 1.5px solid rgba(244,239,228,0.4); color: var(--cream); }
        .microtrust { font-family: 'Poppins', sans-serif; font-size: 12.5px; color: var(--ink-soft); margin-top: 14px; display: flex; gap: 8px; align-items: center; justify-content: center; }

        /* ---------- NAV ---------- */
        header.nav {
          position: sticky; top: 0; z-index: 50; background: rgba(251,248,242,0.92); backdrop-filter: blur(6px);
          border-bottom: 1px solid var(--hair);
        }
        .navrow { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; max-width: var(--maxw); margin: 0 auto; }
        .logo { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 0.5px; color: var(--dark); }
        .logo span { color: var(--gold-deep); }
        .navlinks { display: flex; gap: 28px; font-family: 'Poppins', sans-serif; font-size: 13.5px; font-weight: 600; color: var(--ink-soft); }
        .navlinks a { text-decoration: none; }
        .navlinks a:hover { color: var(--gold-deep); }
        .nav-cta { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 13px; background: var(--dark); color: var(--cream); padding: 10px 20px; border-radius: 7px; text-decoration: none; white-space: nowrap; }
        @media(max-width:780px) { .navlinks { display: none; } }

        /* ---------- HERO ---------- */
        .hero { background: linear-gradient(155deg, var(--dark3) 0%, var(--dark2) 100%); color: var(--cream); position: relative; overflow: hidden; }
        .hero .wrap { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; padding-top: 76px; padding-bottom: 76px; }
        @media(max-width:900px) { .hero .wrap { grid-template-columns: 1fr; padding-top: 52px; padding-bottom: 52px; } }
        .hero h1 { font-size: 46px; font-weight: 800; line-height: 1.12; margin: 16px 0 20px; color: var(--cream); }
        .hero h1 em { font-style: normal; color: var(--gold-light); }
        @media(max-width:640px) { .hero h1 { font-size: 32px; } }
        .hero .sub { font-family: 'Lora', serif; font-size: 18px; color: #D8CBAE; max-width: 520px; margin-bottom: 30px; line-height: 1.6; }
        .hero-ctarow { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }

        /* invoice mock cards */
        .quotes { position: relative; height: 430px; }
        .qcard { position: absolute; width: 290px; background: var(--cream); color: var(--ink); border-radius: 10px; padding: 22px 22px 26px; box-shadow: 0 30px 60px rgba(0,0,0,0.45); font-family: 'Poppins', sans-serif; }
        .qcard .qhead { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #9A917C; border-bottom: 1px dashed var(--hair); padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .qcard .qname { font-size: 13.5px; font-weight: 700; color: var(--dark); margin-bottom: 2px; }
        .qcard .qservice { font-size: 11.5px; color: #7A7261; font-family: 'Lora', serif; font-style: italic; margin-bottom: 16px; }
        .qcard .qline { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ink-soft); padding: 5px 0; border-bottom: 1px dotted #E4DBC5; }
        .qcard .qtotal { display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; color: var(--dark); margin-top: 12px; padding-top: 10px; border-top: 1.5px solid var(--dark); }
        .qcard.declined { top: 0; left: 0; transform: rotate(-6deg); z-index: 1; }
        .qcard.accepted { bottom: 0; right: 0; transform: rotate(4deg); z-index: 2; }
        .stamp { position: absolute; font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 16px; letter-spacing: 1.5px; padding: 7px 14px; border-radius: 6px; border: 2.5px solid; opacity: 0.94; text-transform: uppercase; }
        .stamp.no { color: var(--rust); border-color: var(--rust); transform: rotate(-11deg); top: 64px; right: 18px; background: rgba(154,59,44,0.06); }
        .stamp.yes { color: var(--teal); border-color: var(--teal); transform: rotate(8deg); bottom: 70px; left: 20px; background: rgba(31,81,72,0.06); }
        @media(max-width:900px) { .quotes { height: 400px; max-width: 420px; margin: 0 auto; } .qcard { width: 250px; } }
        @media(max-width:480px) { .quotes { transform: scale(0.86); height: 360px; } }

        /* ---------- HOOK ---------- */
        .hook { padding: 80px 0 40px; }
        .hook .wrap { max-width: 700px; }
        .hook p { font-size: 19px; color: var(--ink-soft); margin-bottom: 18px; }
        .hook p.strong { color: var(--dark); font-weight: 500; }

        /* ---------- AGITATION ---------- */
        .agitate { background: var(--teal-deep); color: var(--teal-pale); }
        .agitate .wrap { max-width: 720px; }
        .agitate p { font-size: 18.5px; margin-bottom: 18px; color: #DCEAE5; }
        .agitate .pull { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 23px; color: var(--cream); line-height: 1.4; border-left: 3px solid var(--gold-light); padding-left: 22px; margin: 32px 0; }

        /* ---------- PROBLEM ---------- */
        .problem .wrap { max-width: 720px; }
        .problem p { color: var(--ink-soft); margin-bottom: 16px; font-size: 18px; }

        /* ---------- SOLUTION ---------- */
        .solution { background: var(--paper); }
        .solution .wrap { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 60px; align-items: center; }
        @media(max-width:860px) { .solution .wrap { grid-template-columns: 1fr; gap: 36px; } }
        .bookmock { perspective: 1400px; display: flex; justify-content: center; }
        .bookmock img { width: 100%; max-width: 320px; border-radius: 4px; box-shadow: 0 40px 70px rgba(23,21,18,0.35), 0 10px 20px rgba(23,21,18,0.2); transform: rotateY(-18deg) rotateX(2deg); transition: transform .4s ease; }
        .bookmock:hover img { transform: rotateY(-8deg) rotateX(1deg); }
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
        .chnum { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 26px; color: var(--gold-light); opacity: 0.55; flex-shrink: 0; width: 36px; }
        .chitem h4 { font-size: 15.5px; margin: 0 0 6px; color: var(--cream); }
        .chitem p { font-size: 13.5px; color: #A79C82; margin: 0; line-height: 1.55; }

        /* ---------- AUTHOR ---------- */
        .author { padding: 90px 0; background: var(--cream); }
        .author .wrap { display: grid; grid-template-columns: 200px 1fr; gap: 40px; align-items: start; }
        @media(max-width:640px) { .author .wrap { grid-template-columns: 1fr; text-align: center; } .author .wrap .avatar { margin: 0 auto; } }
        .avatar { width: 170px; height: 170px; border-radius: 50%; background: linear-gradient(155deg,var(--teal) 0%, var(--teal-deep) 100%); display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 52px; color: var(--gold-light); flex-shrink: 0; }
        .author h3 { font-size: 22px; margin: 0 0 4px; color: var(--dark); }
        .author .role { font-family: 'Poppins', sans-serif; font-size: 13px; color: var(--gold-deep); font-weight: 700; margin-bottom: 16px; }
        .author p { color: var(--ink-soft); font-size: 16px; margin-bottom: 14px; }

        /* ---------- SOCIAL PROOF ---------- */
        .proof { background: var(--paper2); }
        .proof .headwrap { max-width: 600px; margin: 0 auto 46px; text-align: center; }
        .tgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media(max-width:820px) { .tgrid { grid-template-columns: 1fr; } }
        .tcard { background: var(--cream); border-radius: 12px; padding: 26px 24px; border: 1px solid var(--hair); }
        .tcard .stars { color: var(--gold); font-size: 14px; margin-bottom: 12px; letter-spacing: 2px; }
        .tcard p { font-size: 14.5px; color: var(--ink-soft); font-style: italic; margin-bottom: 16px; }
        .tcard .tname { font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700; color: var(--dark); }
        .tcard .trole { font-family: 'Poppins', sans-serif; font-size: 11px; color: #8A8272; }

        /* ---------- OFFER (receipt style) ---------- */
        .offer { background: linear-gradient(155deg, var(--dark3) 0%, var(--dark2) 100%); color: var(--cream); }
        .offer .headwrap { max-width: 600px; margin: 0 auto 46px; text-align: center; }
        .receipt { max-width: 460px; margin: 0 auto; background: var(--cream); color: var(--ink); border-radius: 4px; padding: 38px 34px 34px; position: relative; box-shadow: 0 40px 80px rgba(0,0,0,0.45); }
        .receipt:before, .receipt:after { content: ''; position: absolute; left: 0; right: 0; height: 14px; background:
            linear-gradient(135deg, transparent 50%, var(--cream) 50%) 0 0 / 16px 16px repeat-x; }
        .receipt:before { top: -13px; transform: rotate(180deg); }
        .receipt:after { bottom: -13px; }
        .receipt .rtitle { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; text-align: center; color: var(--dark); margin-bottom: 4px; }
        .receipt .rsub { text-align: center; font-family: 'Poppins', sans-serif; font-size: 11px; color: #9A917C; margin-bottom: 20px; letter-spacing: 0.5px; }
        .rline { display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px dashed var(--hair); font-size: 14.5px; }
        .rline .rname { color: var(--ink); font-weight: 500; }
        .rline .rdesc { display: block; font-size: 12px; color: #9A917C; font-family: 'Lora', serif; font-style: italic; margin-top: 2px; }
        .rline .rval { font-family: 'Poppins', sans-serif; font-weight: 600; color: var(--ink-soft); white-space: nowrap; }
        .rline.strike .rval { text-decoration: line-through; color: #B0A78F; }
        .rtotal { display: flex; justify-content: space-between; align-items: baseline; padding-top: 18px; margin-top: 6px; }
        .rtotal .rtlabel { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14px; color: var(--dark); }
        .rtotal .rtval { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 32px; color: var(--gold-deep); }
        .rtotal .rtorig { font-size: 14px; color: #B0A78F; text-decoration: line-through; margin-right: 8px; font-family: 'Poppins', sans-serif; }
        .receipt .rbtn { display: block; text-align: center; margin-top: 22px; }
        .receipt .rbtn .btn { width: 100%; justify-content: center; }
        .receipt .rfoot { text-align: center; font-size: 11px; color: #9A917C; margin-top: 14px; font-family: 'Poppins', sans-serif; }

        /* ---------- GUARANTEE ---------- */
        .guarantee .wrap { display: flex; gap: 30px; align-items: center; max-width: 780px; }
        @media(max-width:640px) { .guarantee .wrap { flex-direction: column; text-align: center; } }
        .gbadge { width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Poppins', sans-serif; font-weight: 800; color: var(--gold-deep); text-align: center; font-size: 13px; line-height: 1.3; padding: 10px; }
        .guarantee h3 { margin: 0 0 10px; font-size: 21px; color: var(--dark); }
        .guarantee p { color: var(--ink-soft); font-size: 15.5px; margin: 0; }

        /* ---------- URGENCY ---------- */
        .urgency { background: var(--rust); color: #FBEDE8; text-align: center; padding: 18px 20px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14.5px; }
        .urgency b { color: #fff; }

        /* ---------- FAQ ---------- */
        .faq .wrap { max-width: 760px; }
        .fitem { border-bottom: 1px solid var(--hair); }
        .fq { width: 100%; text-align: left; background: none; border: none; padding: 22px 0; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 16px; color: var(--dark); display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 20px; }
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
        footer { background: var(--dark3); color: #8A8272; text-align: center; padding: 36px 20px; font-family: 'Poppins', sans-serif; font-size: 12.5px; }
        footer a { color: var(--gold-light); text-decoration: none; }

        /* ---------- STICKY MOBILE BAR ---------- */
        .stickybar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 60; background: var(--dark3); border-top: 1px solid rgba(244,239,228,0.15); padding: 12px 18px; display: none; align-items: center; justify-content: space-between; gap: 14px; transform: translateY(100%); transition: transform .3s ease; }
        .stickybar.show { transform: translateY(0); }
        .stickybar .sprice { font-family: 'Poppins', sans-serif; color: var(--cream); font-size: 14px; }
        .stickybar .sprice b { color: var(--gold-light); font-size: 17px; }
        .stickybar .btn { padding: 12px 22px; font-size: 14px; }
        @media(max-width:780px) { .stickybar { display: flex; } }
      ` }} />

      <header className="nav">
        <div className="navrow">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            AMPLIFIED <span>SKILLS</span>
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
            <p className="sub">The Pricing &amp; Negotiation Playbook shows you exactly why clients say "too expensive" — and gives you the scripts, frameworks, and mindset shifts to stop hearing it.</p>
            <div className="hero-ctarow">
              <a href="#offer" className="btn btn-primary">Get The Playbook Now <span className="arrow">→</span></a>
              <div className="microtrust">⚡ Instant download &nbsp;·&nbsp; 📖 Read tonight &nbsp;·&nbsp; ✅ Use on your next quote</div>
            </div>
          </div>
          <div className="quotes">
            <div className="qcard declined">
              <div className="qhead"><span>QUOTE #0214</span><span>DESIGNER A</span></div>
              <div className="qname">5-Page Business Website</div>
              <div className="qservice">"the package is ₦250,000"</div>
              <div className="qline"><span>Design + Build</span><span>₦180,000</span></div>
              <div className="qline"><span>Revisions</span><span>₦70,000</span></div>
              <div className="qtotal"><span>Total</span><span>₦250,000</span></div>
              <div className="stamp no">Too Expensive</div>
            </div>
            <div className="qcard accepted">
              <div className="qhead"><span>QUOTE #0215</span><span>DESIGNER B</span></div>
              <div className="qname">5-Page Business Website</div>
              <div className="qservice">"here's what changes for your business"</div>
              <div className="qline"><span>Strategy + Build</span><span>₦420,000</span></div>
              <div className="qline"><span>Launch Support</span><span>₦180,000</span></div>
              <div className="qtotal"><span>Total</span><span>₦600,000</span></div>
              <div className="stamp yes">Paid — 50% Deposit</div>
            </div>
          </div>
        </div>
      </section>

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
            <img src={product?.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'} alt="The Pricing &amp; Negotiation Playbook" />
          </div>
          <div>
            <div className="eyebrow">THE PLAYBOOK SOLUTION</div>
            <h2 className="h-lg">The Pricing &amp; Negotiation Playbook</h2>
            <p className="lead">Stop guessing your value. Control the narrative and command your worth with battle-tested frameworks.</p>
            <ul>
              <li><span className="ic">✓</span> <span><b>The Value Anchor Template:</b> How to show the cost of the problem before you pitch the solution.</span></li>
              <li><span className="ic">✓</span> <span><b>Objection Scripts:</b> Word-for-word copy you can copy/paste when clients say "too expensive" or "what's your discount?".</span></li>
              <li><span className="ic">✓</span> <span><b>Premium Tiering Framework:</b> How to present 3 options so the client chooses you, not the cheaper alternative.</span></li>
              <li><span className="ic">✓</span> <span><b>Retainer Conversion Guide:</b> Convert one-time projects into monthly recurring support contracts.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHO FOR */}
      <section className="section whofor">
        <div className="wrap">
          <div className="whocard yes">
            <h3><span className="tag">✓</span> Who This Playbook Is For</h3>
            <p>• Freelance designers, developers, copywriters, and marketers tired of getting lowballed.</p>
            <p>• Consultants and service providers who want to switch from hourly rates to value pricing.</p>
            <p>• Creative professionals ready to stop writing quotes that lead to ghosting.</p>
          </div>
          <div className="whocard no">
            <h3><span className="tag">✗</span> Who This Is NOT For</h3>
            <p>• Anyone looking for generic motivational quotes instead of concrete action steps.</p>
            <p>• People expecting client relationships to magically fix themselves without changing their pitch.</p>
            <p>• Freelancers who want to compete solely on being the cheapest option on Fiverr/Upwork.</p>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section inside" id="inside">
        <div className="wrap">
          <div className="headwrap">
            <div className="eyebrow on-dark">THE OUTLINE</div>
            <h2 style={{ fontSize: '32px', margin: '14px 0' }}>What you'll learn inside the Playbook</h2>
            <p className="sub">5 actionable, no-fluff chapters written to be read tonight and used on your very next quote.</p>
          </div>
          <div className="chgrid">
            <div className="chitem">
              <div className="chnum">01</div>
              <div>
                <h4>The "Too Expensive" Myth</h4>
                <p>Why clients say "too expensive" even when they have the budget — and how to diagnose the real objection instantly.</p>
              </div>
            </div>
            <div className="chitem">
              <div className="chnum">02</div>
              <div>
                <h4>Framing &amp; Value Anchoring</h4>
                <p>How to align your pricing to the client's business goals so your price looks tiny compared to the value they get.</p>
              </div>
            </div>
            <div className="chitem">
              <div className="chnum">03</div>
              <div>
                <h4>The Three-Tier Pricing Model</h4>
                <p>Structure your proposal so the client's decision shifts from "should we hire them?" to "how should we work with them?".</p>
              </div>
            </div>
            <div className="chitem">
              <div className="chnum">04</div>
              <div>
                <h4>Objection Scripts &amp; Rebuttals</h4>
                <p>Exact scripts to handle requests for discounts, competitive comparisons, and "we don't have the budget right now" lines.</p>
              </div>
            </div>
            <div className="chitem">
              <div className="chnum">05</div>
              <div>
                <h4>Closing the Deal</h4>
                <p>The step-by-step proposal walkthrough and follow-up sequences that get the deposit paid without awkward back-and-forth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUTHOR */}
      <section className="author">
        <div className="wrap">
          <div className="avatar">AS</div>
          <div>
            <div className="eyebrow">THE MENTOR</div>
            <h3>Amplified Skills Team</h3>
            <div className="role">Freelance Strategy &amp; Business Mentorship</div>
            <p>At Amplified Skills, we help digital creators, freelancers, and builders transition from low-paying gigs to high-value global consulting opportunities.</p>
            <p>This playbook is built on real proposals, closing techniques, and negotiation struggles faced by our team and students in the local and global freelance market.</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section proof" id="reviews">
        <div className="wrap">
          <div className="headwrap">
            <div className="eyebrow">FEEDBACK</div>
            <h2 style={{ fontSize: '32px', margin: '14px 0' }}>What other service providers say</h2>
          </div>
          <div className="tgrid">
            <div className="tcard">
              <div className="stars">★★★★★</div>
              <p>"I was quoting ₦150k for websites. After reading the Value Anchoring chapter, I quoted ₦450k to my next lead. I got a YES without them even flinching. Best money I ever spent!"</p>
              <div className="tname">Tobi A.</div>
              <div className="trole">Web Developer, Lagos</div>
            </div>
            <div className="tcard">
              <div className="stars">★★★★★</div>
              <p>"The objection scripts are absolute gold. A client asked for a 30% discount last week. I used the script on Chapter 4, and they signed the full price proposal within 10 minutes."</p>
              <div className="tname">Chidi K.</div>
              <div className="trole">Brand Designer, Port Harcourt</div>
            </div>
            <div className="tcard">
              <div className="stars">★★★★★</div>
              <p>"I've read a lot of business books, but this is the first one that tells you exactly what to say. No fluff, just direct templates that work."</p>
              <div className="tname">Halima S.</div>
              <div className="trole">Social Media Consultant, Abuja</div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section className="section offer" id="offer">
        <div className="wrap">
          <div className="headwrap">
            <div className="eyebrow on-dark">THE PLAYBOOK</div>
            <h2 style={{ fontSize: '36px', margin: '14px 0' }}>Secure your copy today</h2>
          </div>
          <div className="receipt">
            <div className="rtitle">INVOICE &amp; RECEIPT</div>
            <div className="rsub">AMPLIFIED SKILLS DIGITAL STORE</div>
            
            <div className="rline">
              <div>
                <span className="rname">The Pricing &amp; Negotiation Playbook</span>
                <span className="rdesc">Digital PDF Guide &amp; Script Bank</span>
              </div>
              <span className="rval">{formattedPrice}</span>
            </div>

            {product?.bonus_ebook_urls && product.bonus_ebook_urls.length > 0 && (
              <div className="rline">
                <div>
                  <span className="rname">Included Bonuses</span>
                  <span className="rdesc">{product.bonus_ebook_urls.map(b => b.name).join(', ')}</span>
                </div>
                <span className="rval" style={{ color: '#10b981' }}>FREE</span>
              </div>
            )}

            <div className="rtotal">
              <span className="rtlabel">TOTAL</span>
              <div>
                {oldPrice > price && <span className="rtorig">{formattedOldPrice}</span>}
                <span className="rtval">{formattedPrice}</span>
              </div>
            </div>

            <div className="rbtn">
              <button onClick={handleCheckoutRedirect} className="btn btn-primary">
                Instant Download <span className="arrow">→</span>
              </button>
            </div>
            
            <div className="rfoot">⚡ Secure payment via Paystack &middot; Access files instantly</div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="section guarantee">
        <div className="wrap">
          <div className="gbadge">100%<br />RISK FREE</div>
          <div>
            <h3>Our 100% Satisfaction Guarantee</h3>
            <p>Read the playbook, try the scripts, and test the templates on your next lead. If you don't feel it gives you the confidence and framework to charge at least 10x what you paid for it, send us a WhatsApp message or email within 14 days and we will refund you in full. No questions asked.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="wrap">
          <div className="center" style={{ marginBottom: '40px' }}>
            <div className="eyebrow">QUESTIONS</div>
            <h2 className="h-lg">Frequently Asked Questions</h2>
          </div>
          
          <div className="fitem" style={{ borderTop: '1px solid var(--hair)' }}>
            <button className="fq" onClick={() => toggleFaq(0)}>
              <span>How do I receive the playbook?</span>
              <span className="plus" style={{ transform: openFaq === 0 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 0 ? '300px' : '0' }}>
              <p>Immediately after payment is confirmed (via Paystack or manually verified transfer), you will get an email with your download link, and you can also download it directly from your eBook Downloads dashboard.</p>
            </div>
          </div>

          <div className="fitem">
            <button className="fq" onClick={() => toggleFaq(1)}>
              <span>Can I pay via Bank Transfer?</span>
              <span className="plus" style={{ transform: openFaq === 1 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 1 ? '300px' : '0' }}>
              <p>Yes, click the download button, choose "Manual Bank Transfer" on the checkout page, make the transfer to the displayed account, and upload your receipt. Our admin team will approve it and activate access in your dashboard.</p>
            </div>
          </div>

          <div className="fitem">
            <button className="fq" onClick={() => toggleFaq(2)}>
              <span>Is this guide specific to Nigeria?</span>
              <span className="plus" style={{ transform: openFaq === 2 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 2 ? '300px' : '0' }}>
              <p>While the pricing examples mention Naira, the core human psychology, proposal structure, and negotiation scripts work globally for any client in US Dollars, Pounds, Euros, or local currencies.</p>
            </div>
          </div>

          <div className="fitem">
            <button className="fq" onClick={() => toggleFaq(3)}>
              <span>Do I have lifetime access?</span>
              <span className="plus" style={{ transform: openFaq === 3 ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            <div className="fa" style={{ maxHeight: openFaq === 3 ? '300px' : '0' }}>
              <p>Yes, you buy once and get lifetime access. If we update the playbook with new scripts or frameworks in the future, you will receive the updated PDF file free of charge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section final">
        <div className="wrap">
          <h2>Stop losing money to silent clients.</h2>
          <p>Get instant access to the scripts and proposal secrets that close premium contracts today.</p>
          <a href="#offer" className="btn btn-primary">Grab Your Copy Now <span className="arrow">→</span></a>
        </div>
      </section>

      {/* PS */}
      <section className="section tight ps">
        <div className="wrap">
          <p><b>P.S.</b> If you scroll to the bottom, here is the short summary: we are offering the battle-tested <b>Pricing &amp; Negotiation Playbook</b>, outlining exactly how to frame your value so clients accept your quotes without negotiating you down.</p>
          <p>It's completely risk-free. If you don't like it, we'll give you a full refund within 14 days. Click the button above to secure your copy.</p>
        </div>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} Amplified Skills. All rights reserved.</p>
      </footer>

      {/* STICKY MOBILE BAR */}
      <div className={`stickybar ${showStickyBar ? 'show' : ''}`}>
        <div className="sprice">Price: <b>{formattedPrice}</b></div>
        <button onClick={handleCheckoutRedirect} className="btn btn-primary">Get The Playbook</button>
      </div>
    </div>
  )
}
