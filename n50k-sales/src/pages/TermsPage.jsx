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

export default function TermsPage({ onBack }) {
    return (
        <div style={layout}>
            <button onClick={onBack} className="btn-ghost" style={{ color: 'var(--g700)', marginBottom: 20 }}>← Back to Home</button>
            <h1 style={headings}>Terms and Conditions</h1>
            <p style={{ marginBottom: 16 }}>Last updated: {new Date().getFullYear()}</p>

            <p style={{ marginBottom: 16 }}>Welcome to The N50K Blueprint ("the Site" or "Service"). These Terms and Conditions govern your use of the website and the purchase of any digital products, guides, or materials.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>1. Acceptance of Terms</h3>
            <p style={{ marginBottom: 16 }}>By accessing this website, we assume you accept these terms and conditions. Do not continue to use The N50K Blueprint if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>2. Digital Products</h3>
            <p style={{ marginBottom: 16 }}>Any products available for purchase on this website are digital products. Upon successful payment, an automated email containing the download link will be dispatched to the email address provided during checkout.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>3. Earnings Disclaimer</h3>
            <p style={{ marginBottom: 16 }}>The N50K Blueprint explicitly does not guarantee that you will make any specific amount of money. The examples and case studies provided in the material are for educational purposes. Your business results will depend entirely on your own effort, market conditions, and personal execution.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>4. Copyright & Intellectual Property</h3>
            <p style={{ marginBottom: 16 }}>All the content is protected by international copyright laws. You are acquiring a single license for personal use. You may not distribute, reproduce, or resell any part of the materials provided without our explicit written consent.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>5. Limitation of Liability</h3>
            <p style={{ marginBottom: 16 }}>In no event shall The N50K Blueprint, nor any of its authors or representatives, be held liable for any damages arising out of or in any way connected with your use of this website or guide.</p>
        </div>
    );
}
