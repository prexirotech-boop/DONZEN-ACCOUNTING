import { useState, useEffect } from 'react'

export function useCountdown() {
  const getDeadline = () => {
    const stored = localStorage.getItem('n50k_dl')
    if (stored) return parseInt(stored, 10)
    const dl = Date.now() + 24 * 60 * 60 * 1000
    localStorage.setItem('n50k_dl', dl)
    return dl
  }

  const [deadline] = useState(getDeadline)
  const [rem, setRem] = useState(() => Math.max(0, deadline - Date.now()))

  useEffect(() => {
    const t = setInterval(() => setRem(Math.max(0, deadline - Date.now())), 1000)
    return () => clearInterval(t)
  }, [deadline])

  const pad = n => String(n).padStart(2, '0')
  return {
    h: pad(Math.floor(rem / 3_600_000)),
    m: pad(Math.floor((rem % 3_600_000) / 60_000)),
    s: pad(Math.floor((rem % 60_000) / 1_000)),
  }
}
