import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PricingPage from './pages/PricingPage'
import ProductsPage from './pages/ProductsPage'
import EbookSalesPage from './pages/EbookSalesPage'
import PlaybookSalesPage from './pages/PlaybookSalesPage'
import SalesPage from './pages/SalesPage'
import PaymentPage from './pages/PaymentPage'
import ThankYouPage from './pages/ThankYouPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import LandingPage from './pages/LandingPage'
import WebinarPage from './pages/WebinarPage'

// Legal Pages
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import ContactPage from './pages/ContactPage'

// Components
import Footer from './components/Footer'
import Header from './components/Header'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SetPasswordPage from './pages/SetPasswordPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LMSDashboard from './pages/LMSDashboard'
import LMSCourse from './pages/LMSCourse'
import AccountPage from './pages/AccountPage'
import AdminDashboard from './pages/AdminDashboard'
import FAQPage from './pages/FAQPage'
import WhatsAppWidget from './components/WhatsAppWidget'

import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { trackEvent } from './lib/analytics'
import { getPages } from './lib/pagesScanner'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const location = useLocation()
  
  // Track PageView on location changes for Facebook Pixel & DB Analytics
  useEffect(() => {
    trackEvent('page_view')
  }, [location])

  const hideHeaderFooter = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/course/') ||
    location.pathname.startsWith('/account') ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password' ||
    location.pathname === '/setup-account'

  // Always show WhatsApp widget on public pages and checkout
  const showWhatsApp = !location.pathname.startsWith('/admin')

  const isDashboard = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/course/') ||
    location.pathname.startsWith('/account')

  return (
    <div className={isDashboard ? 'dashboard-layout-root' : 'public-layout-root'}>
      <ScrollToTop />
      {!hideHeaderFooter && <Header />}
      
      {/* Toast container */}
      <div id="toast-root" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/resources" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        
        <Route path="/products" element={<PricingPage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/checkout" element={<PaymentPage />} />
        <Route path="/success" element={<ThankYouPage />} />
        <Route path="/setup-account" element={<SetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<LMSDashboard />} />
        <Route path="/course/:courseId" element={<LMSCourse />} />
        <Route path="/course/:courseId/:lessonId" element={<LMSCourse />} />
        <Route path="/account" element={<LMSDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />

        {/* Dynamic / Auto-registered user created pages */}
        {getPages().map(page => {
          const staticPaths = [
            '/', '/services', '/pricing', '/resources', '/about', '/checkout', '/success',
            '/setup-account', '/login', '/register', '/forgot-password', '/reset-password',
            '/dashboard', '/course/:courseId', '/account', '/admin/*', '/terms', '/privacy',
            '/refund', '/contact', '/faq'
          ]
          if (staticPaths.includes(page.path)) return null;
          return <Route key={page.path} path={page.path} element={<page.component />} />
        })}

        {/* Fallback to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
      {showWhatsApp && <WhatsAppWidget />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  )
}
