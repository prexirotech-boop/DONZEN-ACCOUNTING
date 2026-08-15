import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'amplified_ref'
const DEFAULT_DURATION_DAYS = 30

export function useAffiliate() {
  const [referralCode, setReferralCode] = useState(() => {
    // Synchronously initialize from localStorage so it's available immediately
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
      return parsed.code
    } catch {
      return null
    }
  })
  const [affiliateConfig, setAffiliateConfig] = useState(null)

  useEffect(() => {
    // Load affiliate config from DB
    loadConfig()
    // Check URL for ref param (e.g. first visit with ?ref=CODE)
    const params = new URLSearchParams(window.location.search)
    const refCode = params.get('ref')
    if (refCode) {
      storeReferral(refCode)
      setReferralCode(refCode)
    }
  }, [])

  async function loadConfig() {
    try {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'affiliate_config')
        .maybeSingle()
      if (data?.value) setAffiliateConfig(data.value)
    } catch(e) {
      // ignore
    }
  }

  const storeReferral = useCallback((code) => {
    const days = DEFAULT_DURATION_DAYS
    const expiry = Date.now() + (days * 24 * 60 * 60 * 1000)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ code, expiry }))
    setReferralCode(code)
  }, [])

  function getStoredReferral() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
      return parsed.code
    } catch(e) {
      return null
    }
  }

  function getReferralCode() {
    return referralCode
  }

  function clearReferralCode() {
    localStorage.removeItem(STORAGE_KEY)
    setReferralCode(null)
  }

  const recordClick = useCallback(async (affiliateCode, landingPage) => {
    try {
      // Prevent overcounting by deduplicating clicks within the current session
      const sessKey = `tracked_click_${affiliateCode}`
      if (sessionStorage.getItem(sessKey)) {
        return false // Already tracked in this session/tab
      }
      sessionStorage.setItem(sessKey, '1')

      const { data, error } = await supabase.rpc('track_affiliate_click', {
        p_affiliate_code: affiliateCode,
        p_landing_page: landingPage || window.location.href,
        p_user_agent: navigator.userAgent
      })
      if (error) throw error
      return data
    } catch(e) {
      console.warn('[useAffiliate] recordClick error:', e)
      return false
    }
  }, [])

  return { referralCode, getReferralCode, clearReferralCode, storeReferral, recordClick, affiliateConfig }
}
