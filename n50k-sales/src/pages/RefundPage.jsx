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

export default function RefundPage() {
    const navigate = useNavigate();
    return (
        <div style={layout}>
            <button onClick={() => navigate('/')} className="btn-ghost" style={{ color: 'var(--g700)', marginBottom: 20 }}>← Back to Home</button>
            <h1 style={headings}>Refund Policy</h1>

            <p style={{ marginBottom: 16 }}>At The N50K Blueprint, we are committed to providing you with the highest quality information and strategies to build your business in Nigeria.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>1. No Refund Policy</h3>
            <p style={{ marginBottom: 16 }}>Due to the nature of digital products, all sales of The N50K Blueprint are final. Once the purchase is complete and the download link has been delivered to your email, the product is considered "used".</p>
            <p style={{ marginBottom: 16 }}><strong>We do not offer refunds, returns, or exchanges for any reason.</strong> This is because digital files cannot be "returned" in the same way a physical product can.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>2. Delivery Guarantee</h3>
            <p style={{ marginBottom: 16 }}>While we do not offer refunds, we do guarantee delivery. If you have any trouble accessing your file after purchase, or if you did not receive your download link, please contact us immediately.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>3. Support</h3>
            <p style={{ marginBottom: 16 }}>If you have any questions about the content of the guide or need assistance with your order, please reach out to us at <strong>nprecious.official@gmail.com</strong>. We are here to help you succeed.</p>
        </div>
    );
}
