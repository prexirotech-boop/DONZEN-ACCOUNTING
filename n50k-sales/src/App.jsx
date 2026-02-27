import { useState } from 'react'
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

export default function App() {
  const [page, setPage] = useState('sales')
  const [customer, setCustomer] = useState(null)

  const goPayment = () => setPage('payment')
  const goSuccess = data => { setCustomer(data); setPage('thankyou') }
  const goBack = () => setPage('sales')
  const goNav = (p) => setPage(p)

  return (
    <>
      {/* Toast container — lives outside pages so it persists */}
      <div id="toast-root" />

      {page === 'sales' && <SalesPage onCheckout={goPayment} />}
      {page === 'payment' && <PaymentPage onSuccess={goSuccess} onBack={goBack} />}
      {page === 'thankyou' && <ThankYouPage customer={customer} />}

      {page === 'terms' && <TermsPage onBack={goBack} />}
      {page === 'privacy' && <PrivacyPage onBack={goBack} />}
      {page === 'refund' && <RefundPage onBack={goBack} />}
      {page === 'contact' && <ContactPage onBack={goBack} />}

      <Footer onNav={goNav} />
    </>
  )
}
