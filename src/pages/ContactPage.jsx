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

import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
    const navigate = useNavigate();
    return (
        <div style={layout}>
            <button onClick={() => navigate('/')} className="btn-ghost" style={{ color: 'var(--g700)', marginBottom: 20 }}>← Back to Home</button>
            <h1 style={headings}>Contact Us</h1>

            <p style={{ marginBottom: 16 }}>We are committed to providing top-notch support to our readers and future entrepreneurs. If you have any questions, encounter any issues downloading the material, or just need guidance, please don't hesitate to reach out to us.</p>

            <div style={{ background: 'var(--g50)', padding: 24, borderRadius: 'var(--r-lg)', border: '1px solid var(--n200)', marginTop: 24, marginBottom: 32 }}>
                <h3 style={{ fontWeight: 800, color: 'var(--g800)', marginBottom: 16, fontSize: '1.2rem' }}>Our Support Channels</h3>

                <p style={{ fontWeight: 700, marginBottom: 6, color: 'var(--n700)' }}>Email Support:</p>
                <p style={{ marginBottom: 16, color: 'var(--g700)', fontSize: '1.1rem', fontWeight: 600 }}>nprecious.official@gmail.com</p>

                <p style={{ fontWeight: 700, marginBottom: 6, color: 'var(--n700)' }}>Business Hours:</p>
                <p style={{ marginBottom: 0 }}>Monday – Friday: 9:00 AM – 5:00 PM (WAT)</p>
            </div>

            <p style={{ marginBottom: 16 }}><strong>Note:</strong> We aim to reply to all queries within 24 hours. If your issue is regarding a lost download link, please ensure you email us from the exact address you used during checkout for faster verification.</p>
        </div>
    );
}
