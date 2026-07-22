import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()
  const { user, profile, loading } = useAuth()

  if (user && !loading) {
    const isAdmin = user?.app_metadata?.role === 'admin' || profile?.role === 'admin'
    if (isAdmin) {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/dashboard" />
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoadingMsg('Creating account...')
    setErrorMsg('')
    setSuccessMsg('')

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      setLoadingMsg('')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      setLoadingMsg('')
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        if (data?.session) {
          navigate('/dashboard')
        } else {
          setSuccessMsg('Registration successful! Please check your email for a verification link or log in if auto-confirmed.')
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.')
    } finally {
      setLoadingMsg('')
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
          <h2 style={{ marginTop: '16px' }}>Create your account</h2>
          <p>Get started with Donzen Accounting Hub today.</p>
        </div>

        <div className="auth-card">
          {successMsg ? (
            <div className="auth-success-state">
              <div className="auth-success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Check your email</h3>
              <p>{successMsg}</p>
              <Link to="/login" className="auth-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 16 }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="John Doe"
                />
              </div>

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
                <label htmlFor="password">Password</label>
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

              <div className="auth-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(p => !p)}
                    tabIndex={-1}
                    style={{
                      position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                      padding: 0, display: 'flex', alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
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
                {loadingMsg || 'Sign Up'}
              </button>
            </form>
          )}
        </div>

        <div className="auth-footer">
          Already have an account? <Link to="/login" style={{ color: '#ff1717', fontWeight: 700 }}>Sign In</Link>
        </div>
      </div>

      <style>{`
        .auth-layout {
          min-height: 100vh;
          background-color: #F7F3F5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: var(--font);
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

        .auth-success-state {
          text-align: center;
          padding: 16px 0;
        }
        .auth-success-icon {
          width: 56px; height: 56px; background: #dcfce7; color: #16a34a; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;
        }
        .auth-success-icon svg { width: 28px; height: 28px; }
        .auth-success-state h3 { font-size: 18px; font-weight: 800; color: #101010; margin: 0 0 8px; }
        .auth-success-state p { font-size: 14px; color: #71717a; margin: 0; line-height: 1.5; }

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
