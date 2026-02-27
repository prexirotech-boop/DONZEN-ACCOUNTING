import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="footer" style={{ padding: '60px 20px', textAlign: 'center', fontSize: '.78rem', color: 'rgba(255,255,255,0.6)', background: '#051b11', borderTop: '1px solid rgba(255,255,255,.05)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <p style={{ marginBottom: 16, color: '#6EE7A0', fontWeight: '800', letterSpacing: '1px' }}>THE N50K BLUEPRINT</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: 30 }}>
                    <Link to="/" onClick={scrollToTop} style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>Home</Link>
                    <span style={{ color: 'rgba(255,255,255,.1)' }}>|</span>
                    <Link to="/terms" onClick={scrollToTop} style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>Terms</Link>
                    <span style={{ color: 'rgba(255,255,255,.1)' }}>|</span>
                    <Link to="/privacy" onClick={scrollToTop} style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>Privacy Policy</Link>
                    <span style={{ color: 'rgba(255,255,255,.1)' }}>|</span>
                    <Link to="/refund" onClick={scrollToTop} style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>Refund Policy</Link>
                    <span style={{ color: 'rgba(255,255,255,.1)' }}>|</span>
                    <Link to="/contact" onClick={scrollToTop} style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>Contact Us</Link>
                </div>

                <p style={{ color: 'rgba(255,255,255,.3)', margin: '0 auto 16px', lineHeight: 1.6, maxWidth: 650 }}>
                    This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
                </p>

                <p style={{ color: 'rgba(255,255,255,.3)', margin: '0 auto', lineHeight: 1.6, maxWidth: 650 }}>
                    Payment processed securely by Paystack. This is a digital product — download delivered instantly after payment. {new Date().getFullYear()} © The N50K Blueprint.
                </p>
            </div>
        </footer >
    );
}
