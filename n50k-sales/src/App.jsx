import { useState } from 'react'
import SalesPage from './pages/SalesPage'
import PaymentPage from './pages/PaymentPage'
import ThankYouPage from './pages/ThankYouPage'

export default function App() {
  const [page, setPage] = useState('sales')
  const [customer, setCustomer] = useState(null)

  const goPayment  = ()    => setPage('payment')
  const goSuccess  = data  => { setCustomer(data); setPage('thankyou') }
  const goBack     = ()    => setPage('sales')

  return (
    <>
      {/* Toast container — lives outside pages so it persists */}
      <div id="toast-root" />

      {page === 'sales'    && <SalesPage   onCheckout={goPayment} />}
      {page === 'payment'  && <PaymentPage onSuccess={goSuccess}  onBack={goBack} />}
      {page === 'thankyou' && <ThankYouPage customer={customer} />}
    </>
  )
}
