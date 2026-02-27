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

export default function RefundPage({ onBack }) {
    return (
        <div style={layout}>
            <button onClick={onBack} className="btn-ghost" style={{ color: 'var(--g700)', marginBottom: 20 }}>← Back to Home</button>
            <h1 style={headings}>Refund Policy</h1>

            <p style={{ marginBottom: 16 }}>At The N50K Blueprint, your success is our primary goal. We strongly believe in the value of the information provided within our guide.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>1. Digital Product Delivery</h3>
            <p style={{ marginBottom: 16 }}>Due to the nature of digital products, once a purchase is successfully processed and the download access has been granted, the product is considered "used".</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>2. Our Satisfaction Guarantee</h3>
            <p style={{ marginBottom: 16 }}>We offer a 30-day satisfaction guarantee on the purchase of The N50K Blueprint under specific conditions. To be eligible for a refund, you must be able to demonstrate that you have implemented the actionable steps outlined in at least one of the 20 business ideas but experienced absolutely no results or progress.</p>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>3. Requesting a Refund</h3>
            <p style={{ marginBottom: 16 }}>If you feel you meet the criteria for a refund, please contact us at <strong>support@n50kblueprint.ng</strong> within 30 days of your original purchase. In your email, please include:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Your receipt or reference number.</li>
                <li>The email address used for purchase.</li>
                <li>A brief explanation and proof of the steps you actively took from the blueprint.</li>
            </ul>

            <h3 style={{ marginTop: 24, marginBottom: 12, fontWeight: 700 }}>4. Processing Time</h3>
            <p style={{ marginBottom: 16 }}>Refund requests are typically reviewed and processed within 5-7 business days. Once approved, the funds will be fully reversed via our payment processor, Paystack.</p>
        </div>
    );
}
