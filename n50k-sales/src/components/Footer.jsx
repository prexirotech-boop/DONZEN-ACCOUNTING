import React from 'react';

export default function Footer({ onNav }) {
    return (
        <footer className="footer" style={{ padding: '40px 20px', textAlign: 'center', fontSize: '.78rem', color: 'var(--n500)', background: 'var(--k)', borderTop: '1px solid rgba(255,255,255,.05)' }}>
            <div className="wrap-w">
                <p style={{ marginBottom: 12 }}>© {new Date().getFullYear()} The N50K Blueprint · All Rights Reserved</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: 20 }}>
                    <button onClick={() => { window.scrollTo(0, 0); onNav('terms') }} className="btn-ghost" style={{ padding: 0 }}>Terms and Conditions</button>
                    <span style={{ color: 'rgba(255,255,255,.2)' }}>|</span>
                    <button onClick={() => { window.scrollTo(0, 0); onNav('privacy') }} className="btn-ghost" style={{ padding: 0 }}>Privacy Policy</button>
                    <span style={{ color: 'rgba(255,255,255,.2)' }}>|</span>
                    <button onClick={() => { window.scrollTo(0, 0); onNav('refund') }} className="btn-ghost" style={{ padding: 0 }}>Refund Policy</button>
                    <span style={{ color: 'rgba(255,255,255,.2)' }}>|</span>
                    <button onClick={() => { window.scrollTo(0, 0); onNav('contact') }} className="btn-ghost" style={{ padding: 0 }}>Contact Us</button>
                </div>

                <p style={{ color: 'rgba(255,255,255,.35)', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
                    This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
                </p>
                <p style={{ color: 'rgba(255,255,255,.35)', maxWidth: 700, margin: '10px auto 0', lineHeight: 1.6 }}>
                    Payment processed securely by Paystack. This is a digital product — download delivered instantly after payment.
                </p>
            </div>
        </footer>
    );
}
