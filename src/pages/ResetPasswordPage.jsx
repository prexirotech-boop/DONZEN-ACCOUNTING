import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    }
    setLoading(false)
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
          <h2 style={{ marginTop: '16px' }}>Update Password</h2>
          <p>Enter your new password for your Donzen account.</p>
        </div>

        <div className="auth-card">
          {error && (
            <div className="auth-error" style={{ marginBottom: 20 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div style={{ background: '#f0fdf4', color: '#15803d', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: '14px', display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #bbf7d0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="auth-form">
            <div className="auth-group">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="At least 6 characters"
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
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Remember your password? <Link to="/login" style={{ color: '#ff1717', fontWeight: 700 }}>Sign In</Link>
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
