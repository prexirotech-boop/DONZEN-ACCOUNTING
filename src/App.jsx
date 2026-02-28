import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SalesPage from './pages/SalesPage'
import PaymentPage from './pages/PaymentPage'
import ThankYouPage from './pages/ThankYouPage'

// Legal Pages
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import ContactPage from './pages/ContactPage'

// Components
import Footer from './components/Footer'

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Toast container — lives outside routes so it persists */}
      <div id="toast-root" />

      <Routes>
        <Route path="/" element={<SalesPage />} />
        <Route path="/checkout" element={<PaymentPage />} />
        <Route path="/success" element={<ThankYouPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Fallback to home */}
        <Route path="*" element={<SalesPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}
