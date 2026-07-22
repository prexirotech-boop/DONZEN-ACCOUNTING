import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const { user, profile, loading } = useAuth()

  if (user && !loading) {
    const isAdmin = user?.app_metadata?.role === 'admin' || profile?.role === 'admin'
    if (isAdmin) {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/dashboard" />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoadingMsg('Authenticating...')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({ 
      email: email.trim().toLowerCase(), 
      password 
    })

    if (error) {
      setErrorMsg(error.message === 'Invalid login credentials' 
        ? 'Invalid email or password. If you do not have an account yet, please click "Sign Up" below to create one.' 
        : error.message)
      setLoadingMsg('')
    } else {
      try {
        const { data: { user: loggedInUser } } = await supabase.auth.getUser()
        if (loggedInUser) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('role, id')
            .eq('id', loggedInUser.id)
            .maybeSingle()

          if (prof?.role === 'admin' || loggedInUser.app_metadata?.role === 'admin') {
            navigate('/admin')
            return
          }

          // Enrollment recovery for paid orders
          if (prof?.id) {
            const { data: paidOrders } = await supabase
              .from('orders')
              .select('product_id, products(id, type)')
              .eq('customer_email', loggedInUser.email.toLowerCase())
              .eq('status', 'paid')

            if (paidOrders && paidOrders.length > 0) {
              for (const order of paidOrders) {
                if (order.products?.type === 'course' && order.product_id) {
                  const { data: existingEnr } = await supabase
                    .from('enrollments')
                    .select('id')
                    .eq('user_id', prof.id)
                    .eq('course_id', order.product_id)
                    .maybeSingle()

                  if (!existingEnr) {
                    await supabase.from('enrollments').insert({
                      user_id: prof.id,
                      course_id: order.product_id,
                      progress: []
                    })
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Post-login recovery error:', err)
      }
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        
        <div className="auth-header">
          <Link to="/" className="auth-brand-logo">
            <div style={{ background: '#101010', padding: '12px 24px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', border: '1px solid #ff1717' }}>
              <img src="/logo.png" alt="Donzen Accounting Hub" style={{ height: '38px', width: 'auto' }} />
            </div>
          </Link>
          <h2 style={{ marginTop: '16px' }}>Welcome back</h2>
          <p>Sign in to your Donzen Accounting Hub account.</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="auth-group">
              <div className="auth-password-header">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                    padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="auth-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={!!loadingMsg} className="auth-submit">
              {loadingMsg || 'Sign In'}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" style={{ color: '#ff1717', fontWeight: 700 }}>Sign Up</Link>
        </div>
      </div>

      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F7F3F5;
          font-family: var(--font);
          padding: 24px;
        }
        .auth-container {
          width: 100%;
          max-width: 420px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-brand-logo {
          display: inline-flex; align-items: center; justify-content: center;
          text-decoration: none; margin-bottom: 12px;
        }
        .auth-header h2 {
          font-size: 26px; font-weight: 800; color: #101010; margin: 0 0 8px; letter-spacing: -0.5px;
        }
        .auth-header p {
          font-size: 15px; color: #71717a; margin: 0;
        }

        .auth-card {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 14px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-group label {
          font-size: 14px; font-weight: 700; color: #101010;
        }

        .auth-input {
          width: 100%; padding: 12px 16px; font-size: 15px;
          border: 1px solid #d4d4d8; border-radius: 8px;
          background: #ffffff; color: #101010; font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          outline: none; border-color: #ff1717; box-shadow: 0 0 0 3px rgba(255, 23, 23, 0.15);
        }
        .auth-input::placeholder { color: #a1a1aa; }

        .auth-password-header {
          display: flex; justify-content: space-between; align-items: center;
        }
        .auth-forgot-link {
          font-size: 13px; font-weight: 600; color: #ff1717; text-decoration: none;
        }
        .auth-forgot-link:hover { text-decoration: underline; }

        .auth-submit {
          background: #ff1717; color: #ffffff; font-weight: 800; font-size: 15px;
          padding: 14px; border: none; border-radius: 8px; cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
          margin-top: 8px;
        }
        .auth-submit:hover:not(:disabled) { background: #d91414; }
        .auth-submit:active:not(:disabled) { transform: scale(0.98); }
        .auth-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .auth-error {
          display: flex; align-items: flex-start; gap: 8px;
          background: #fef2f2; color: #b91c1c; padding: 12px; border-radius: 8px; font-size: 14px;
          border: 1px solid #fecaca; line-height: 1.4;
        }
        .auth-error svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; }

        .auth-footer {
          margin-top: 28px; text-align: center; font-size: 14px; color: #71717a;
        }
        .auth-footer a {
          color: #ff1717; font-weight: 700; text-decoration: none;
        }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
