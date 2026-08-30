import { useState, useEffect } from 'react'

/**
 * BatchCountdown Component
 * 
 * Provides an accurate, real-time countdown timer for batch-enrolled courses.
 * 
 * @param {string|Date} targetDate - The scheduled batch release date & time
 * @param {function} onComplete - Callback triggered when countdown hits zero
 * @param {string} variant - 'card' (compact for dashboard cards) | 'hero' (large for locked screens) | 'inline' (minimal text)
 * @param {string} label - Optional header/label text (e.g., "Batch Starts In:")
 */
export default function BatchCountdown({ targetDate, onComplete, variant = 'card', label = 'Batch Starts In:' }) {
  const calculateTimeLeft = () => {
    if (!targetDate) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
    
    const difference = new Date(targetDate).getTime() - new Date().getTime()
    
    if (difference <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
    }

    return {
      total: difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)

      if (remaining.isComplete) {
        clearInterval(timer)
        if (onComplete) onComplete()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (timeLeft.isComplete) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 13, fontWeight: 700 }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }}></span>
        <span>Batch is Now Live!</span>
      </div>
    )
  }

  const pad = (n) => String(n).padStart(2, '0')

  // Hero / Large variant (used for locked course access screen & product detail pages)
  if (variant === 'hero') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {label && (
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff1717' }}>
            {label}
          </span>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <div style={heroBoxStyle}>
            <span style={heroNumStyle}>{pad(timeLeft.days)}</span>
            <span style={heroLabelStyle}>Days</span>
          </div>
          <div style={heroBoxStyle}>
            <span style={heroNumStyle}>{pad(timeLeft.hours)}</span>
            <span style={heroLabelStyle}>Hours</span>
          </div>
          <div style={heroBoxStyle}>
            <span style={heroNumStyle}>{pad(timeLeft.minutes)}</span>
            <span style={heroLabelStyle}>Mins</span>
          </div>
          <div style={heroBoxStyle}>
            <span style={heroNumStyle}>{pad(timeLeft.seconds)}</span>
            <span style={heroLabelStyle}>Secs</span>
          </div>
        </div>
      </div>
    )
  }

  // Inline variant (used for minimal badges or table cells)
  if (variant === 'inline') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontWeight: 700, color: '#d97706' }}>
        <span>{timeLeft.days}d</span>:
        <span>{pad(timeLeft.hours)}h</span>:
        <span>{pad(timeLeft.minutes)}m</span>:
        <span>{pad(timeLeft.seconds)}s</span>
      </span>
    )
  }

  // Card variant (default for dashboard course cards)
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '1px solid #fde68a',
      borderRadius: 6,
      padding: '8px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#92400e' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {label}
        </span>
        <span style={{ fontSize: 10, background: '#f59e0b', color: '#fff', padding: '1px 6px', borderRadius: 4 }}>
          Scheduled
        </span>
      </div>

      <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
        <div style={cardUnitStyle}>
          <span style={cardNumStyle}>{pad(timeLeft.days)}</span>
          <span style={cardLabelStyle}>d</span>
        </div>
        <div style={cardUnitStyle}>
          <span style={cardNumStyle}>{pad(timeLeft.hours)}</span>
          <span style={cardLabelStyle}>h</span>
        </div>
        <div style={cardUnitStyle}>
          <span style={cardNumStyle}>{pad(timeLeft.minutes)}</span>
          <span style={cardLabelStyle}>m</span>
        </div>
        <div style={cardUnitStyle}>
          <span style={cardNumStyle}>{pad(timeLeft.seconds)}</span>
          <span style={cardLabelStyle}>s</span>
        </div>
      </div>
    </div>
  )
}

const heroBoxStyle = {
  background: '#121214',
  border: '1px solid #27272a',
  borderRadius: 8,
  padding: '14px 18px',
  minWidth: 70,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
}

const heroNumStyle = {
  fontSize: 28,
  fontWeight: 800,
  color: '#fff',
  fontFamily: 'monospace',
  lineHeight: 1
}

const heroLabelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: '#a1a1aa',
  textTransform: 'uppercase',
  marginTop: 6
}

const cardUnitStyle = {
  background: '#fff',
  border: '1px solid #fde68a',
  borderRadius: 4,
  padding: '4px 6px',
  flex: 1,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2
}

const cardNumStyle = {
  fontSize: 13,
  fontWeight: 800,
  color: '#b45309',
  fontFamily: 'monospace'
}

const cardLabelStyle = {
  fontSize: 10,
  fontWeight: 600,
  color: '#78350f'
}
