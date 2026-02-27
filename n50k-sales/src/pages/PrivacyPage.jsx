import React from 'react';

const layout = {
    minHeight: '100vh',
    padding: '60px 20px',
    background: 'var(--w)',
    maxWidth: 800,
    margin: '0 auto',
};

const headings = {
    marginBottom: '24px',
    color: 'var(--g900)',
    fontWeight: '900',
};

export default function PrivacyPage({ onBack }) {
    return (
        <div style={layout}>
            <button onClick={onBack} className="btn-ghost" style={{ color: 'var(--g700)', marginBottom: 20 }}>← Back to Home</button>
            <h1 style={headings}>Privacy Policy</h1>
            <p style={{ marginBottom: 16 }}>Last updated: {new Date().getFullYear()}</p>

            <p style={{ marginBottom: 16 }}>This Privacy Policy document contains types of information that is collected and recorded by The N50K Blueprint and how we use it.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>1. Information We Collect</h3>
            <p style={{ marginBottom: 16 }}>When you purchase The N50K Blueprint, we require minimal personal information, specifically: your full name, email address, and phone number, which are collected purely for the purpose of order processing, product delivery to your email, and customer support.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>2. How We Use Your Information</h3>
            <p style={{ marginBottom: 16 }}>We only use your data to:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Deliver the digital product access link to your email.</li>
                <li>Identify your purchase if you ever lose your download link and need support.</li>
                <li>Send important product updates and promotional materials (you can opt-out anytime).</li>
            </ul>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>3. Data Sharing</h3>
            <p style={{ marginBottom: 16 }}>We do not sell, rent, or lease your personal information to any third parties. Your payment information is securely processed via Paystack. We do not store or process your card or banking details on our own servers.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>4. Facebook Disclaimer</h3>
            <p style={{ marginBottom: 16 }}>This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>5. Cookies</h3>
            <p style={{ marginBottom: 16 }}>Our website may use basic operational cookies to track affiliate referrals or user sessions, ensuring you receive the best possible experience when navigating our page.</p>

        </div>
    );
}
