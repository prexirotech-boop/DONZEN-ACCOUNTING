import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (!error && data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    try {
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      if (updatedUser) {
        setUser(updatedUser)
        await fetchProfile(updatedUser.id)
      }
    } catch (err) {
      console.error('Error refreshing profile:', err)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, logout }}>
      {loading ? (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#101010', color: '#fff',
          fontFamily: "var(--font)", zIndex: 9999
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Ambient glow behind logo */}
            <div style={{ position: 'absolute', width: 160, height: 160, background: 'radial-gradient(circle, rgba(255,23,23,0.3) 0%, rgba(255,23,23,0) 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(24px)', animation: 'ambient-glow 3s ease-in-out infinite' }} />
            
            {/* Logo */}
            <img src="/logo.png" alt="Donzen Accounting Hub" style={{ height: 56, width: 'auto', maxWidth: 240, objectFit: 'contain', marginBottom: 32, animation: 'logo-pulse 2.2s ease-in-out infinite' }} />
            
            {/* Premium Circular Glowing Spinner */}
            <div className="premium-spinner" />
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            .premium-spinner {
              width: 32px;
              height: 32px;
              border: 3px solid rgba(255, 255, 255, 0.1);
              border-top-color: #ff1717;
              border-right-color: #ff4d4d;
              border-radius: 50%;
              animation: spin-loader 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            @keyframes spin-loader {
              to { transform: rotate(360deg); }
            }
            @keyframes logo-pulse {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.04); opacity: 1; filter: drop-shadow(0 0 12px rgba(255,23,23,0.4)); }
            }
            @keyframes ambient-glow {
              0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.7; }
              50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
            }
          `}} />
        </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
